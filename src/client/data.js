async function rpc(route, body) {
  const response = await fetch(`${API}${route}`, body === undefined ? { method: 'GET' } : {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => null)
  if (payload?.ok !== true) {
    const detail = payload?.error ?? {}
    const error = new Error(detail.message ?? detail.code ?? `request failed (${response.status})`)
    error.code = detail.code
    throw error
  }
  return payload.value
}

function createWorkspaceViewStore() {
  return defineStore({
    init: () => ({
      groupBy: 'workspace', orderBy: 'updated', groupExpansion: {},
      sessionOrderByAccount: {}, sessionUpdatedAtByAccount: {}, unreadSessionIds: [],
    }),
    // Match DSH's native workspace browser so unread state survives switching
    // between the stock sidebar and this replacement.
    persist: 'dsh.workspace.view.v5',
    actions: {
      markSessionUnread: (draft, sessionId) => {
        const unread = draft.unreadSessionIds ?? (draft.unreadSessionIds = [])
        if (!unread.includes(sessionId)) unread.push(sessionId)
      },
      markSessionRead: (draft, sessionId) => {
        draft.unreadSessionIds = (draft.unreadSessionIds ?? []).filter(id => id !== sessionId)
      },
    },
  })
}

const useEmptyViewStore = selector => selector({ unreadSessionIds: [] })

function useCompositions(t) {
  const [state, setState] = React.useState({ phase: 'loading', doc: null, error: null })
  const docRef = React.useRef(null)
  const mutationQueue = React.useRef(Promise.resolve())
  const install = React.useCallback((doc) => {
    docRef.current = doc
    setState({ phase: 'ready', doc, error: null })
    return doc
  }, [])
  const reload = React.useCallback(async () => {
    try { return install(await rpc('/state')) } catch (error) {
      setState({ phase: 'error', doc: null, error: error instanceof Error ? error.message : String(error) })
      throw error
    }
  }, [install])
  React.useEffect(() => { void reload().catch(() => {}) }, [reload])
  const normalizeError = React.useCallback(error => error?.code === 'duplicate-title'
    ? Object.assign(new Error(t('duplicateCompName')), {
        code: error.code,
      }) : error, [t])
  const reportError = React.useCallback(error => {
    if (error?.reported === true) return error
    const normalized = normalizeError(error)
    const reason = normalized instanceof Error ? normalized : new Error(String(normalized))
    reason.reported = true
    setState(previous => ({ ...previous, error: reason instanceof Error ? reason.message : String(reason) }))
    return reason
  }, [normalizeError])
  const mutate = React.useCallback(body => {
    const execute = async () => {
      let current = docRef.current
      if (current === null) throw new Error('composition state is not ready')
      try {
        return install(await rpc('/mutate', { ...body, expectedRevision: current.revision }))
      } catch (error) {
        if (error?.code === 'revision-conflict') {
          current = await reload()
          try { return install(await rpc('/mutate', { ...body, expectedRevision: current.revision })) }
          catch (retryError) { throw reportError(retryError) }
        }
        throw reportError(error)
      }
    }
    const queued = mutationQueue.current.then(execute, execute)
    mutationQueue.current = queued.catch(() => {})
    return queued
  }, [install, reload, reportError])
  const runAction = React.useCallback(async action => {
    try { return await action() } catch (error) {
      const reason = reportError(error)
      throw reason
    }
  }, [reportError])
  const clearError = React.useCallback(() => { setState(previous => ({ ...previous, error: null })) }, [])
  return { ...state, mutate, runAction, reportError, clearError }
}

const selectAll = state => state
function useEmptyFeed() { return undefined }
function sessionTitle(session, t) {
  if (session.blank === true) return t('newSession')
  return session.displayTitle ?? session.title ?? session.id
}
function sessionVisible(session, current, archived) {
  return session.origin !== 'subagent' && !archived.has(session.id) && (!session.blank || session.id === current)
}
function nextCompositionTitle(comps, workspaceId, t) {
  const titles = new Set(comps
    .filter(comp => comp.workspaceId === workspaceId)
    .map(comp => comp.title.trim().normalize('NFKC').toLowerCase()))
  let number = 1
  while (titles.has(t('defaultCompName', { n: number }).normalize('NFKC').toLowerCase())) number += 1
  return t('defaultCompName', { n: number })
}
function subtree(comps, rootId) {
  const ids = new Set([rootId])
  let changed = true
  while (changed) {
    changed = false
    for (const comp of comps) if (!ids.has(comp.id) && ids.has(comp.parentCompId)) {
      ids.add(comp.id); changed = true
    }
  }
  const nodes = comps.filter(comp => ids.has(comp.id))
  return { ids, nodes, sessionIds: [...new Set(nodes.flatMap(comp => comp.sessionIds))] }
}
