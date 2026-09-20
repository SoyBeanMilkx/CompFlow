/** Host API tests against a temporary DSH_HOME. */
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const home = mkdtempSync(join(tmpdir(), 'dsh-session-comps-'))
process.env.DSH_HOME = home

const { apply } = await import('../lib/index.js')

let route
apply({
  webServer: {
    register(candidate) {
      route = candidate
      return () => {}
    },
  },
  effect(callback) { void callback() },
  logger: { info() {}, warn() {} },
})

async function call(method, path, body) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))]
  const request = {
    method,
    url: path,
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk
    },
  }
  let status
  let payload = ''
  const response = {
    writeHead(code) { status = code },
    end(text) { payload = text ?? '' },
  }
  await route.handler(request, response)
  return { status, body: payload === '' ? null : JSON.parse(payload) }
}

let failures = 0
function check(label, condition) {
  if (condition) {
    console.log(`  ok   ${label}`)
    return
  }
  failures++
  console.log(`  FAIL ${label}`)
}

console.log('dsh-session-comps host self-test')

async function succeed(label, body) {
  const result = await call('POST', '/dsh-session-comps/api/mutate', {
    ...body,
    expectedRevision: revision,
  })
  check(label, result.body.ok === true)
  revision = result.body.value?.revision ?? revision
  return result.body.value
}

async function reject(label, body, code) {
  const result = await call('POST', '/dsh-session-comps/api/mutate', {
    ...body,
    expectedRevision: revision,
  })
  check(label, result.body.ok === false && result.body.error.code === code)
  return result.body.error
}

const initial = await call('GET', '/dsh-session-comps/api/state')
check('empty document reads back', initial.status === 200 && initial.body.value.comps.length === 0)
let revision = initial.body.value.revision
check('initial revision is 0', revision === 0)

const missingRevision = await call('POST', '/dsh-session-comps/api/mutate', {
  op: 'create', workspaceId: 'ws-1', title: 'without revision',
})
check('mutations require an explicit revision', missingRevision.body.error.code === 'bad-request')

const primitiveBody = await call('POST', '/dsh-session-comps/api/mutate', 'not-an-object')
check('primitive mutation bodies are rejected cleanly', primitiveBody.body.error.code === 'bad-request')

const created = await succeed('create returns ok', {
  op: 'create', workspaceId: 'ws-1', title: '登录重构',
})
check('create bumped the revision', revision === 1)
check('create stored the title', created.comps[0].title === '登录重构')
const compId = created.comps[0].id

await reject('duplicate composition names are refused in one workspace', {
  op: 'create', workspaceId: 'ws-1', title: '  登录重构  ',
}, 'duplicate-title')

const stale = await call('POST', '/dsh-session-comps/api/mutate', {
  op: 'create', workspaceId: 'ws-1', title: 'stale write', expectedRevision: 0,
})
check('stale revision is rejected', stale.body.ok === false && stale.body.error.code === 'revision-conflict')
check('conflict reports the live revision', stale.body.error.revision === revision)
check('a rejected mutation does not bump the revision', revision === 1)

const assigned = await succeed('assign attached two sessions',
  { op: 'assign', workspaceId: 'ws-1', compId, sessionIds: ['s-1', 's-2'] })
check('assign stored both sessions', assigned.comps[0].sessionIds.length === 2)

await reject('assign requires an explicit workspace scope',
  { op: 'assign', compId, sessionIds: ['s-1'] }, 'bad-request')

const deduplicated = await succeed('assign deduplicates its input',
  { op: 'assign', workspaceId: 'ws-1', compId, sessionIds: ['s-1', 's-1'] })
check('a session is only stored once in a composition',
  deduplicated.comps[0].sessionIds.filter(id => id === 's-1').length === 1)

const moved = await succeed('detach leaves one session',
  { op: 'assign', workspaceId: 'ws-1', compId: null, sessionIds: ['s-2'] })
check('detach kept the right session', moved.comps[0].sessionIds.length === 1 && moved.comps[0].sessionIds[0] === 's-1')

const renamed = await succeed('rename trims the title',
  { op: 'rename', compId, title: '  登录重构 v2  ' })
check('rename applied the trimmed title', renamed.comps[0].title === '登录重构 v2')

const collapsed = await succeed('collapse persists',
  { op: 'setCollapsed', compId, collapsed: true })
check('collapse stored true', collapsed.comps[0].collapsed === true)

await reject('unknown op is a bad-request', { op: 'nonsense' }, 'bad-request')
await reject('unknown comp is comp-not-found',
  { op: 'rename', compId: 'nope', title: 'x' }, 'comp-not-found')

const reread = await call('GET', '/dsh-session-comps/api/state')
check('document survived a re-read from disk', reread.body.value.comps[0].title === '登录重构 v2')
check('revision persisted', reread.body.value.revision === revision)

const deleting = await succeed('beginDeleteTree detaches the comp durably', { op: 'beginDeleteTree', compId })
check('document is empty while delete is pending', deleting.comps.length === 0 && deleting.deletions.length === 1)
const deleted = await succeed('finishDeleteTree clears the durable deletion task', {
  op: 'finishDeleteTree', deletionId: deleting.deletions[0].id,
})
check('document is empty after delete', deleted.comps.length === 0 && deleted.deletions.length === 0)

const workspace = 'ws-1'
const outer = await succeed('create a top-level composition',
  { op: 'create', workspaceId: workspace, parentCompId: null, title: '登录重构' })
const outerId = outer.comps[0].id
check('top-level composition has a null parent', outer.comps[0].parentCompId === null)
check('composition records its owning workspace', outer.comps[0].workspaceId === workspace)

const nested = await succeed('nest a composition inside another',
  { op: 'create', workspaceId: workspace, parentCompId: outerId, title: '接口层' })
const nestedId = nested.comps.find(c => c.title === '接口层').id
check('nested composition points at its parent',
  nested.comps.find(c => c.id === nestedId).parentCompId === outerId)
check('nested composition inherits the workspace',
  nested.comps.find(c => c.id === nestedId).workspaceId === workspace)

await reject('rename cannot duplicate a name elsewhere in the workspace',
  { op: 'rename', compId: nestedId, title: '登录重构' }, 'duplicate-title')

await reject('nesting across workspaces is refused',
  { op: 'create', workspaceId: 'ws-2', parentCompId: outerId, title: '越界' }, 'workspace-mismatch')

const inNested = await succeed('assign a session into the nested composition',
  { op: 'assign', workspaceId: workspace, compId: nestedId, sessionIds: ['s-1'] })
check('the nested composition holds the session',
  inNested.comps.find(c => c.id === nestedId).sessionIds.includes('s-1'))

await reject('assigning across workspaces is refused',
  { op: 'assign', workspaceId: 'ws-2', compId: nestedId, sessionIds: ['s-1'] }, 'workspace-mismatch')

await reject('moving a composition beneath its own descendant is refused',
  { op: 'moveComp', compId: outerId, parentCompId: nestedId }, 'cycle')

const dissolved = await succeed('dissolving removes only the selected composition', {
  op: 'dissolveComp', compId: outerId,
})
check('dissolving promotes direct child compositions to the workspace root',
  dissolved.comps.length === 1 && dissolved.comps[0].id === nestedId && dissolved.comps[0].parentCompId === null)
check('dissolving preserves sessions inside promoted child compositions',
  dissolved.comps[0].sessionIds.includes('s-1') && dissolved.deletions.length === 0)

const replacementParent = await succeed('create another parent composition', {
  op: 'create', workspaceId: workspace, parentCompId: null, title: '重组',
})
const replacementParentId = replacementParent.comps.find(c => c.title === '重组').id
await succeed('move the preserved child under its replacement parent', {
  op: 'moveComp', compId: nestedId, parentCompId: replacementParentId,
})
const afterDelete = await succeed('beginning parent deletion detaches its full subtree', {
  op: 'beginDeleteTree', compId: replacementParentId,
})
check('the child composition is queued with its parent', afterDelete.comps.length === 0
  && afterDelete.deletions[0].compIds.includes(nestedId)
  && afterDelete.deletions[0].sessionIds.includes('s-1'))
await succeed('finishing parent deletion clears its task', {
  op: 'finishDeleteTree', deletionId: afterDelete.deletions[0].id,
})

const createdFromSession = await succeed('createFromSession creates and assigns atomically', {
  op: 'createFromSession', workspaceId: workspace, parentCompId: null,
  sessionId: 's-9',
})
check('createFromSession uses the first numbered default title', createdFromSession.comps[0].title === '新建合成1')
check('createFromSession contains the source session', createdFromSession.comps[0].sessionIds[0] === 's-9')

const nextDefault = await succeed('numbered default titles advance without colliding', {
  op: 'create', workspaceId: workspace, parentCompId: null,
})
check('the next default title uses the next number', nextDefault.comps.some(comp => comp.title === '新建合成2'))

const noRoute = await call('GET', '/dsh-session-comps/api/unknown')
check('unknown route is 404', noRoute.status === 404)

const statePath = join(home, 'session-comps.json')
writeFileSync(statePath, JSON.stringify({
  version: 1,
  revision: 9,
  comps: [
    { id: 'legacy-a', workspaceId: 'ws-legacy', parentCompId: null, title: '重复', sessionIds: ['s-1'], collapsed: false },
    { id: 'legacy-b', workspaceId: 'ws-legacy', parentCompId: null, title: '重复', sessionIds: ['s-1', 's-2'] },
  ],
}))
const migrated = await call('GET', '/dsh-session-comps/api/state')
check('version 1 documents migrate to version 2', migrated.body.value.version === 2)
check('migration repairs duplicate titles', new Set(migrated.body.value.comps.map(comp => comp.title)).size === 2)
check('migration repairs duplicate Session ownership', migrated.body.value.comps[1].sessionIds.length === 1)
check('migration preserves a backup of the legacy file', existsSync(`${statePath}.v1.bak`))

writeFileSync(statePath, JSON.stringify({ version: 2, revision: 0, comps: [{ id: 'broken' }], deletions: [] }))
const invalid = await call('GET', '/dsh-session-comps/api/state')
check('invalid persisted documents are rejected instead of guessed at', invalid.status === 500 && invalid.body.error.code === 'internal')

rmSync(home, { recursive: true, force: true })
console.log(failures === 0 ? '\nall host checks passed' : `\n${failures} check(s) FAILED`)
process.exit(failures === 0 ? 0 : 1)
