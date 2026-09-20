/** Durable composition metadata and HTTP API for DSH. */
import { randomUUID } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const name = 'session-comps'

export const inject = ['webServer']

const ROUTE_PREFIX = '/dsh-session-comps/api'
const MAX_BODY_BYTES = 256 * 1024
const DOC_VERSION = 2
const EMPTY_DOC = Object.freeze({ version: DOC_VERSION, revision: 0, comps: [], deletions: [] })

function documentError(message) {
  throw new Error(`dsh-session-comps: invalid composition document: ${message}`)
}

function normalizedText(value, field) {
  if (typeof value !== 'string' || value.trim() === '') documentError(`${field} must be a non-empty string`)
  return value.trim()
}

function normalizeDocument(parsed) {
  if (parsed === null || typeof parsed !== 'object' || !Array.isArray(parsed.comps)) {
    documentError('root.comps must be an array')
  }
  const sourceVersion = parsed.version ?? 1
  if (!Number.isInteger(sourceVersion) || sourceVersion < 1 || sourceVersion > DOC_VERSION) {
    documentError(`unsupported version ${JSON.stringify(sourceVersion)}`)
  }
  if (!Number.isInteger(parsed.revision ?? 0) || (parsed.revision ?? 0) < 0) {
    documentError('root.revision must be a non-negative integer')
  }
  let changed = sourceVersion !== DOC_VERSION || !Array.isArray(parsed.deletions)
  const ids = new Set()
  const comps = parsed.comps.map((raw, index) => {
    if (raw === null || typeof raw !== 'object') documentError(`comps[${index}] must be an object`)
    const id = normalizedText(raw.id, `comps[${index}].id`)
    if (ids.has(id)) documentError(`duplicate composition id ${JSON.stringify(id)}`)
    ids.add(id)
    const workspaceId = normalizedText(raw.workspaceId, `comps[${index}].workspaceId`)
    const title = normalizedText(raw.title, `comps[${index}].title`)
    const parentCompId = raw.parentCompId ?? null
    if (parentCompId !== null && (typeof parentCompId !== 'string' || parentCompId === '')) {
      documentError(`comps[${index}].parentCompId must be null or a non-empty string`)
    }
    if (!Array.isArray(raw.sessionIds) || raw.sessionIds.some(value => typeof value !== 'string' || value === '')) {
      documentError(`comps[${index}].sessionIds must be an array of non-empty strings`)
    }
    const sessionIds = [...new Set(raw.sessionIds)]
    const collapsed = raw.collapsed === true
    if (title !== raw.title || sessionIds.length !== raw.sessionIds.length || collapsed !== raw.collapsed) changed = true
    return { id, workspaceId, parentCompId, title, sessionIds, collapsed }
  })

  const byId = new Map(comps.map(comp => [comp.id, comp]))
  for (const comp of comps) {
    if (comp.parentCompId === null) continue
    const parent = byId.get(comp.parentCompId)
    if (parent === undefined) documentError(`composition ${JSON.stringify(comp.id)} has a missing parent`)
    if (parent.workspaceId !== comp.workspaceId) documentError(`composition ${JSON.stringify(comp.id)} crosses workspaces`)
    if (wouldCycle(comps, comp.id, comp.parentCompId)) documentError(`composition ${JSON.stringify(comp.id)} is in a parent cycle`)
  }

  // Version 1 allowed ambiguous names and duplicate ownership. Migration keeps
  // the first occurrence stable and repairs later occurrences deterministically.
  const titleKeys = new Map()
  const ownedSessions = new Map()
  for (const comp of comps) {
    const titles = titleKeys.get(comp.workspaceId) ?? new Set()
    titleKeys.set(comp.workspaceId, titles)
    const base = comp.title
    let suffix = 2
    while (titles.has(titleKey(comp.title))) comp.title = `${base} ${suffix++}`
    if (comp.title !== base) changed = true
    titles.add(titleKey(comp.title))

    const owned = ownedSessions.get(comp.workspaceId) ?? new Set()
    ownedSessions.set(comp.workspaceId, owned)
    const unique = comp.sessionIds.filter(sessionId => {
      if (owned.has(sessionId)) return false
      owned.add(sessionId)
      return true
    })
    if (unique.length !== comp.sessionIds.length) changed = true
    comp.sessionIds = unique
  }

  const deletionIds = new Set()
  const deletingCompIds = new Set()
  const deletions = (Array.isArray(parsed.deletions) ? parsed.deletions : []).map((raw, index) => {
    if (raw === null || typeof raw !== 'object') documentError(`deletions[${index}] must be an object`)
    const id = normalizedText(raw.id, `deletions[${index}].id`)
    if (deletionIds.has(id)) documentError(`duplicate deletion id ${JSON.stringify(id)}`)
    deletionIds.add(id)
    const workspaceId = normalizedText(raw.workspaceId, `deletions[${index}].workspaceId`)
    const rootCompId = normalizedText(raw.rootCompId, `deletions[${index}].rootCompId`)
    const title = normalizedText(raw.title, `deletions[${index}].title`)
    if (!Array.isArray(raw.compIds) || raw.compIds.some(value => typeof value !== 'string' || value === '')) {
      documentError(`deletions[${index}].compIds must be an array of non-empty strings`)
    }
    if (!Array.isArray(raw.sessionIds) || raw.sessionIds.some(value => typeof value !== 'string' || value === '')) {
      documentError(`deletions[${index}].sessionIds must be an array of non-empty strings`)
    }
    const compIds = [...new Set(raw.compIds)]
    const sessionIds = [...new Set(raw.sessionIds)]
    if (!compIds.includes(rootCompId)) documentError(`deletions[${index}] does not contain its root composition`)
    for (const compId of compIds) {
      if (ids.has(compId)) documentError(`composition ${JSON.stringify(compId)} is both active and deleting`)
      if (deletingCompIds.has(compId)) documentError(`composition ${JSON.stringify(compId)} occurs in multiple deletion tasks`)
      deletingCompIds.add(compId)
    }
    const createdAt = Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now()
    if (compIds.length !== raw.compIds.length || sessionIds.length !== raw.sessionIds.length || createdAt !== raw.createdAt) changed = true
    return { id, workspaceId, rootCompId, title, compIds, sessionIds, createdAt }
  })
  return {
    changed,
    doc: { version: DOC_VERSION, revision: parsed.revision ?? 0, comps, deletions },
  }
}

function documentPath() {
  const home = process.env.DSH_HOME
  if (home === undefined || home === '') {
    throw new Error('dsh-session-comps: DSH_HOME is not set; cannot locate the composition document')
  }
  return join(home, 'session-comps.json')
}

// Corrupt data is reported, never replaced with an empty document.
function loadDocument() {
  const path = documentPath()
  if (!existsSync(path)) return { ...EMPTY_DOC, comps: [], deletions: [] }
  const parsed = JSON.parse(readFileSync(path, 'utf8'))
  const normalized = normalizeDocument(parsed)
  if (normalized.changed) {
    const backup = `${path}.v${parsed.version ?? 1}.bak`
    if (!existsSync(backup)) copyFileSync(path, backup)
    saveDocument(normalized.doc)
  }
  return normalized.doc
}

// Temp + rename prevents an interrupted write from truncating the live file.
function saveDocument(doc) {
  const path = documentPath()
  mkdirSync(dirname(path), { recursive: true })
  const temp = `${path}.${process.pid}.tmp`
  writeFileSync(temp, `${JSON.stringify(doc, undefined, 2)}\n`)
  renameSync(temp, path)
}

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  response.end(body)
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('request body too large')
    chunks.push(chunk)
  }
  if (size === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const FAILURE = {
  revisionConflict: (revision) => ({ code: 'revision-conflict', revision }),
  notFound: (compId) => ({ code: 'comp-not-found', compId }),
  badRequest: (message) => ({ code: 'bad-request', message }),
  workspaceMismatch: (compId, workspaceId) => ({ code: 'workspace-mismatch', compId, workspaceId }),
  cycle: (compId, parentCompId) => ({ code: 'cycle', compId, parentCompId }),
  duplicateTitle: (workspaceId, title) => ({
    code: 'duplicate-title',
    workspaceId,
    title,
    message: `A composition named “${title}” already exists in this workspace`,
  }),
}

function titleKey(title) {
  return title.trim().normalize('NFKC').toLowerCase()
}

function titleExists(comps, workspaceId, title, excludingId = null) {
  const key = titleKey(title)
  return comps.some(comp => comp.workspaceId === workspaceId
    && comp.id !== excludingId
    && titleKey(comp.title) === key)
}

function nextDefaultTitle(comps, workspaceId) {
  let number = 1
  while (titleExists(comps, workspaceId, `新建合成${number}`)) number += 1
  return `新建合成${number}`
}

function wouldCycle(comps, compId, parentId) {
  let cursor = parentId
  const guard = new Set()
  while (cursor !== null && cursor !== undefined) {
    if (cursor === compId) return true
    if (guard.has(cursor)) return true
    guard.add(cursor)
    const parent = comps.find((candidate) => candidate.id === cursor)
    cursor = parent === undefined ? null : parent.parentCompId
  }
  return false
}

function mutate(doc, body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: FAILURE.badRequest('mutation body must be an object') }
  }
  const expected = body.expectedRevision
  if (!Number.isInteger(expected) || expected < 0) {
    return { ok: false, error: FAILURE.badRequest('mutation needs a non-negative expectedRevision') }
  }
  if (expected !== doc.revision) {
    return { ok: false, error: FAILURE.revisionConflict(doc.revision) }
  }
  const comps = doc.comps.map((comp) => ({ ...comp, sessionIds: [...comp.sessionIds] }))
  const deletions = doc.deletions.map(task => ({ ...task, compIds: [...task.compIds], sessionIds: [...task.sessionIds] }))
  const next = { version: DOC_VERSION, revision: doc.revision + 1, comps, deletions }

  switch (body.op) {
    case 'create': {
      if (typeof body.workspaceId !== 'string' || body.workspaceId === '') {
        return { ok: false, error: FAILURE.badRequest('create needs a workspaceId') }
      }
      const parentCompId = body.parentCompId ?? null
      if (parentCompId !== null) {
        const parent = next.comps.find((candidate) => candidate.id === parentCompId)
        if (parent === undefined) return { ok: false, error: FAILURE.notFound(parentCompId) }
        if (parent.workspaceId !== body.workspaceId) {
          return { ok: false, error: FAILURE.workspaceMismatch(parentCompId, body.workspaceId) }
        }
      }
      const title = typeof body.title === 'string' && body.title.trim() !== ''
        ? body.title.trim()
        : nextDefaultTitle(next.comps, body.workspaceId)
      if (titleExists(next.comps, body.workspaceId, title)) {
        return { ok: false, error: FAILURE.duplicateTitle(body.workspaceId, title) }
      }
      next.comps.push({
        id: randomUUID(),
        workspaceId: body.workspaceId,
        parentCompId,
        title,
        sessionIds: [],
        collapsed: false,
      })
      return { ok: true, value: next }
    }

    case 'rename': {
      const comp = next.comps.find((candidate) => candidate.id === body.compId)
      if (comp === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return { ok: false, error: FAILURE.badRequest('rename needs a non-empty title') }
      }
      const title = body.title.trim()
      if (titleExists(next.comps, comp.workspaceId, title, comp.id)) {
        return { ok: false, error: FAILURE.duplicateTitle(comp.workspaceId, title) }
      }
      comp.title = title
      return { ok: true, value: next }
    }

    case 'setCollapsed': {
      const comp = next.comps.find((candidate) => candidate.id === body.compId)
      if (comp === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
      comp.collapsed = body.collapsed === true
      return { ok: true, value: next }
    }

    case 'dissolveComp': {
      const comp = next.comps.find((candidate) => candidate.id === body.compId)
      if (comp === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
      next.comps = next.comps.filter(candidate => candidate.id !== comp.id)
      for (const child of next.comps) {
        if (child.parentCompId === comp.id) child.parentCompId = null
      }
      return { ok: true, value: next }
    }

    case 'beginDeleteTree': {
      // Metadata is detached before any irreversible Session deletion. The
      // durable task lets the browser resume after a crash or partial failure.
      const root = next.comps.find((candidate) => candidate.id === body.compId)
      if (root === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
      const removing = new Set([root.id])
      let changed = true
      while (changed) {
        changed = false
        for (const comp of next.comps) {
          if (!removing.has(comp.id) && removing.has(comp.parentCompId)) {
            removing.add(comp.id)
            changed = true
          }
        }
      }
      const nodes = next.comps.filter(comp => removing.has(comp.id))
      next.comps = next.comps.filter(comp => !removing.has(comp.id))
      next.deletions.push({
        id: randomUUID(),
        workspaceId: root.workspaceId,
        rootCompId: root.id,
        title: root.title,
        compIds: nodes.map(comp => comp.id),
        sessionIds: [...new Set(nodes.flatMap(comp => comp.sessionIds))],
        createdAt: Date.now(),
      })
      return { ok: true, value: next }
    }

    case 'finishDeleteTree': {
      if (typeof body.deletionId !== 'string' || body.deletionId === '') {
        return { ok: false, error: FAILURE.badRequest('finishDeleteTree needs a deletionId') }
      }
      next.deletions = next.deletions.filter(task => task.id !== body.deletionId)
      return { ok: true, value: next }
    }

    case 'createFromSession': {
      if (typeof body.workspaceId !== 'string' || body.workspaceId === '') {
        return { ok: false, error: FAILURE.badRequest('createFromSession needs a workspaceId') }
      }
      if (typeof body.sessionId !== 'string' || body.sessionId === '') {
        return { ok: false, error: FAILURE.badRequest('createFromSession needs a sessionId') }
      }
      const parentCompId = body.parentCompId ?? null
      if (parentCompId !== null) {
        const parent = next.comps.find((candidate) => candidate.id === parentCompId)
        if (parent === undefined) return { ok: false, error: FAILURE.notFound(parentCompId) }
        if (parent.workspaceId !== body.workspaceId) {
          return { ok: false, error: FAILURE.workspaceMismatch(parentCompId, body.workspaceId) }
        }
      }
      for (const comp of next.comps) {
        if (comp.workspaceId === body.workspaceId) {
          comp.sessionIds = comp.sessionIds.filter((id) => id !== body.sessionId)
        }
      }
      const title = typeof body.title === 'string' && body.title.trim() !== ''
        ? body.title.trim()
        : nextDefaultTitle(next.comps, body.workspaceId)
      if (titleExists(next.comps, body.workspaceId, title)) {
        return { ok: false, error: FAILURE.duplicateTitle(body.workspaceId, title) }
      }
      next.comps.push({
        id: randomUUID(),
        workspaceId: body.workspaceId,
        parentCompId,
        title,
        sessionIds: [body.sessionId],
        collapsed: false,
      })
      return { ok: true, value: next }
    }

    case 'moveComp': {
      const comp = next.comps.find((candidate) => candidate.id === body.compId)
      if (comp === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
      const parentCompId = body.parentCompId ?? null
      if (parentCompId !== null) {
        const parent = next.comps.find((candidate) => candidate.id === parentCompId)
        if (parent === undefined) return { ok: false, error: FAILURE.notFound(parentCompId) }
        if (parent.workspaceId !== comp.workspaceId) {
          return { ok: false, error: FAILURE.workspaceMismatch(parentCompId, comp.workspaceId) }
        }
      }
      if (wouldCycle(next.comps, comp.id, parentCompId)) {
        return { ok: false, error: FAILURE.cycle(comp.id, parentCompId) }
      }
      comp.parentCompId = parentCompId
      return { ok: true, value: next }
    }

    case 'assign': {
      if (typeof body.workspaceId !== 'string' || body.workspaceId === '') {
        return { ok: false, error: FAILURE.badRequest('assign needs a workspaceId') }
      }
      if (!Array.isArray(body.sessionIds)
        || body.sessionIds.some(sessionId => typeof sessionId !== 'string' || sessionId === '')) {
        return { ok: false, error: FAILURE.badRequest('assign needs string sessionIds') }
      }
      const target = body.compId === null ? undefined : next.comps.find((candidate) => candidate.id === body.compId)
      if (body.compId !== null) {
        if (target === undefined) return { ok: false, error: FAILURE.notFound(body.compId) }
        if (target.workspaceId !== body.workspaceId) {
          return { ok: false, error: FAILURE.workspaceMismatch(target.id, body.workspaceId) }
        }
      }
      const moving = new Set(body.sessionIds)
      for (const comp of next.comps) {
        if (comp.workspaceId !== body.workspaceId) continue
        comp.sessionIds = comp.sessionIds.filter((id) => !moving.has(id))
      }
      if (target !== undefined) target.sessionIds.push(...moving)
      return { ok: true, value: next }
    }

    default:
      return { ok: false, error: FAILURE.badRequest(`unknown op ${JSON.stringify(body.op)}`) }
  }
}

export function apply(ctx) {
  const dispose = ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: async (request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost')
      const route = url.pathname.slice(ROUTE_PREFIX.length)
      try {
        if (route === '/state' && request.method === 'GET') {
          sendJson(response, 200, { ok: true, value: loadDocument() })
          return
        }

        if (route === '/mutate' && request.method === 'POST') {
          const body = await readJsonBody(request)
          const result = mutate(loadDocument(), body)
          if (!result.ok) {
            sendJson(response, 200, result)
            return
          }
          saveDocument(result.value)
          sendJson(response, 200, result)
          return
        }

        sendJson(response, 404, { ok: false, error: { code: 'no-route', route } })
      } catch (error) {
        ctx.logger?.warn?.('session-comps route failed: %o', error)
        sendJson(response, 500, {
          ok: false,
          error: { code: 'internal', message: error instanceof Error ? error.message : String(error) },
        })
      }
    },
  })

  ctx.effect(() => dispose, 'session-comps: routes')
}
