function CompBrowser(props) {
  ensureStyles()
  const t = React.useCallback((key, values) => {
    const translated = typeof props.t === 'function' ? props.t(key, values) : undefined
    const base = translated === undefined || translated === key ? (zh[key] ?? key) : translated
    return interpolate(base, values)
  }, [props.t])
  const useWorkspaces = typeof props.useWorkspaces === 'function' ? props.useWorkspaces : useEmptyFeed
  const useSessions = typeof props.useSessions === 'function' ? props.useSessions : useEmptyFeed
  const workspaceState = useWorkspaces(selectAll)
  const sessionState = useSessions(selectAll)
  const { phase, doc, error, mutate, runAction, reportError, clearError } = useCompositions(t)
  const [expandedWorkspaces, setExpandedWorkspaces] = React.useState({})
  const [expandedComps, setExpandedComps] = React.useState({})
  const [query, setQuery] = React.useState('')
  const [searchExpanded, setSearchExpanded] = React.useState(false)
  const [results, setResults] = React.useState(null)
  const searchInputRef = React.useRef(null)
  const [drag, setDrag] = React.useState(null)
  const useViewStore = typeof props.useStore === 'function' ? props.useStore : useEmptyViewStore
  const unreadSessionIds = useViewStore(state => state.unreadSessionIds ?? [])
  const unread = React.useMemo(() => new Set(unreadSessionIds), [unreadSessionIds])
  const [renameTarget, setRenameTarget] = React.useState(null)
  const [renameBusy, setRenameBusy] = React.useState(false)
  const [renameError, setRenameError] = React.useState(null)
  const [deleteTarget, setDeleteTarget] = React.useState(null)
  const [deleteBusy, setDeleteBusy] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState(null)
  const [deletionFailures, setDeletionFailures] = React.useState({})
  const [deletionRetry, setDeletionRetry] = React.useState(0)
  const activeDeletions = React.useRef(new Set())
  const comps = doc?.comps ?? []
  const deletions = doc?.deletions ?? []
  const compositionIndex = React.useMemo(() => {
    const children = new Map()
    const claimed = new Map()
    for (const comp of comps) {
      let byParent = children.get(comp.workspaceId)
      if (byParent === undefined) { byParent = new Map(); children.set(comp.workspaceId, byParent) }
      const siblings = byParent.get(comp.parentCompId ?? null) ?? []
      siblings.push(comp); byParent.set(comp.parentCompId ?? null, siblings)
      let workspaceClaims = claimed.get(comp.workspaceId)
      if (workspaceClaims === undefined) { workspaceClaims = new Set(); claimed.set(comp.workspaceId, workspaceClaims) }
      for (const sessionId of comp.sessionIds) workspaceClaims.add(sessionId)
    }
    return { children, claimed }
  }, [comps])
  const childComps = (workspaceId, parentCompId) => compositionIndex.children.get(workspaceId)?.get(parentCompId) ?? []
  const workspaces = Array.isArray(workspaceState?.items) ? workspaceState.items : []
  const byId = sessionState?.byId ?? {}
  const allIds = Array.isArray(sessionState?.ids) ? sessionState.ids : []
  const sessionsReady = sessionState?.phase === 'ready'
  const current = sessionState?.current
  const archived = React.useMemo(() => new Set(
    Array.isArray(workspaceState?.archivedSessionIds) ? workspaceState.archivedSessionIds : [],
  ), [workspaceState?.archivedSessionIds])
  const visible = React.useCallback(id => {
    const session = byId[id]
    return session !== undefined && sessionVisible(session, current, archived)
  }, [byId, current, archived])

  React.useEffect(() => {
    const normalized = query.trim()
    if (normalized === '') { setResults(null); return undefined }
    if (typeof props.searchSessions !== 'function') { setResults([]); return undefined }
    const controller = new AbortController()
    const timer = setTimeout(() => {
      props.searchSessions(normalized, controller.signal)
        .then(value => { setResults(Array.isArray(value) ? value : value?.items ?? []) })
        .catch(() => { if (!controller.signal.aborted) setResults([]) })
    }, SEARCH_DEBOUNCE_MS)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, props.searchSessions])

  const pendingSessionIds = React.useMemo(() => new Set(deletions.flatMap(task => task.sessionIds)), [deletions])
  const openSession = sessionId => {
    props.actions?.markSessionRead?.(sessionId)
    if (typeof props.openSession === 'function') props.openSession(sessionId)
  }
  const createCompFromSession = async (workspaceId, sessionId, parentCompId) => {
    try {
      const before = new Set(comps.map(comp => comp.id))
      const title = nextCompositionTitle(comps, workspaceId, t)
      const next = await mutate({ op: 'createFromSession', workspaceId, sessionId, title, parentCompId })
      const created = next.comps.find(comp => !before.has(comp.id))
      if (created !== undefined) {
        setExpandedComps(previous => ({ ...previous, [created.id]: true }))
        setRenameError(null); setRenameTarget({ kind: 'comp', id: created.id, title: created.title })
      }
    } catch (reason) { reportError(reason) }
  }
  const assign = async (workspaceId, sessionId, compId) => {
    try { await mutate({ op: 'assign', workspaceId, compId, sessionIds: [sessionId] }) }
    catch (reason) { reportError(reason) }
  }
  const moveDrag = async (workspaceId, parentCompId) => {
    const moving = drag
    setDrag(null)
    if (moving === null || moving.workspaceId !== workspaceId) return
    try {
      if (moving.type === 'session') await mutate({ op: 'assign', workspaceId, compId: parentCompId, sessionIds: [moving.id] })
      else await mutate({ op: 'moveComp', compId: moving.id, parentCompId })
    } catch (reason) { reportError(reason) }
  }
  const createEmptyComp = async (workspaceId, parentCompId) => {
    try {
      const before = new Set(comps.map(comp => comp.id))
      const title = nextCompositionTitle(comps, workspaceId, t)
      const next = await mutate({ op: 'create', workspaceId, parentCompId, title })
      const created = next.comps.find(comp => !before.has(comp.id))
      if (created !== undefined) {
        setExpandedComps(previous => ({ ...previous, [created.id]: true }))
        setRenameError(null); setRenameTarget({ kind: 'comp', id: created.id, title: created.title })
      }
    } catch (reason) { reportError(reason) }
  }
  const dissolveComp = async compId => {
    try { await mutate({ op: 'dissolveComp', compId }) }
    catch (reason) { reportError(reason) }
  }
  const confirmRename = async title => {
    if (renameTarget === null) return
    setRenameBusy(true); setRenameError(null)
    try {
      if (renameTarget.kind === 'comp') await mutate({ op: 'rename', compId: renameTarget.id, title })
      else if (renameTarget.kind === 'session') {
        if (typeof props.renameSession !== 'function') throw new Error('renameSession is unavailable')
        await props.renameSession(renameTarget.id, title)
      } else if (renameTarget.kind === 'workspace') {
        if (typeof props.renameWorkspace !== 'function') throw new Error('renameWorkspace is unavailable')
        await props.renameWorkspace(renameTarget.id, title)
      }
      setRenameTarget(null)
    } catch (reason) { setRenameError(reason instanceof Error ? reason.message : String(reason)) }
    finally { setRenameBusy(false) }
  }
  const confirmDelete = async () => {
    if (deleteTarget === null) return
    setDeleteBusy(true); setDeleteError(null)
    try {
      if (deleteTarget.kind === 'session') {
        if (typeof props.deleteSession !== 'function') throw new Error('deleteSession is unavailable')
        // Detach first: if the irreversible delete fails, the Session remains
        // visible at workspace root instead of leaving stale composition data.
        await mutate({ op: 'assign', workspaceId: deleteTarget.workspaceId, compId: null, sessionIds: [deleteTarget.id] })
        await props.deleteSession(deleteTarget.id)
      } else if (deleteTarget.kind === 'comp') {
        await mutate({ op: 'beginDeleteTree', compId: deleteTarget.id })
      } else {
        if (typeof props.deleteWorkspace !== 'function') throw new Error('deleteWorkspace is unavailable')
        await props.deleteWorkspace(deleteTarget.id)
      }
      setDeleteTarget(null)
    } catch (reason) { setDeleteError(reason instanceof Error ? reason.message : String(reason)) }
    finally { setDeleteBusy(false) }
  }
  const forkSession = async (sessionId, ownerCompId, workspaceId) => {
    if (typeof props.forkSession !== 'function') return
    try {
      const childId = await props.forkSession(sessionId)
      if (ownerCompId !== null && typeof childId === 'string') {
        await mutate({ op: 'assign', workspaceId, compId: ownerCompId, sessionIds: [childId] })
      }
    } catch (reason) { reportError(reason) }
  }
  const archiveSession = sessionId => {
    if (typeof props.archiveSession === 'function') {
      void runAction(() => props.archiveSession(sessionId)).catch(() => {})
    }
  }
  const markUnread = (sessionId, value) => {
    if (value) props.actions?.markSessionUnread?.(sessionId)
    else props.actions?.markSessionRead?.(sessionId)
  }

  React.useEffect(() => {
    if (!sessionsReady) return
    for (const task of deletions) {
      if (activeDeletions.current.has(task.id) || deletionFailures[task.id] !== undefined) continue
      activeDeletions.current.add(task.id)
      void (async () => {
        try {
          if (typeof props.deleteSession !== 'function') throw new Error('deleteSession is unavailable')
          const failures = []
          for (const sessionId of task.sessionIds) {
            if (byId[sessionId] === undefined) continue
            try { await props.deleteSession(sessionId) } catch (reason) { failures.push(reason) }
          }
          if (failures.length > 0) throw failures[0]
          await mutate({ op: 'finishDeleteTree', deletionId: task.id })
          setDeletionFailures(previous => {
            const next = { ...previous }; delete next[task.id]; return next
          })
        } catch (reason) {
          reportError(reason)
          setDeletionFailures(previous => ({ ...previous, [task.id]: reason instanceof Error ? reason.message : String(reason) }))
        } finally { activeDeletions.current.delete(task.id) }
      })()
    }
  }, [byId, deletionFailures, deletionRetry, deletions, mutate, props.deleteSession, reportError, sessionsReady])

  const retryDeletions = () => {
    setDeletionFailures({})
    setDeletionRetry(value => value + 1)
  }

  const toggleComp = async (comp, expanded) => {
    const nextExpanded = !expanded
    setExpandedComps(previous => ({ ...previous, [comp.id]: nextExpanded }))
    try { await mutate({ op: 'setCollapsed', compId: comp.id, collapsed: !nextExpanded }) }
    catch (reason) {
      setExpandedComps(previous => ({ ...previous, [comp.id]: expanded }))
      reportError(reason)
    }
  }
  const renderSession = (workspaceId, ownerCompId, id, depth) => {
    const session = byId[id]
    if (session === undefined) return null
    return h('div', { key: id, style: { paddingLeft: `${Math.max(0, depth - 1) * INDENT}px` } },
      h(SessionRow, {
        session, workspaceId, ownerCompId, destinationComps: childComps(workspaceId, ownerCompId),
        isCurrent: id === current, unread: unread.has(id), t,
        onOpen: openSession,
        onRename: (sessionId, title) => { setRenameError(null); setRenameTarget({ kind: 'session', id: sessionId, title }) },
        onFork: (sessionId, compId) => { void forkSession(sessionId, compId, workspaceId) },
        onUnread: markUnread, onArchive: archiveSession,
        onDelete: (sessionId, title, targetWorkspaceId) => {
          setDeleteError(null); setDeleteTarget({ kind: 'session', id: sessionId, title, workspaceId: targetWorkspaceId })
        },
        onCreateComp: (sessionId, parentCompId) => { void createCompFromSession(workspaceId, sessionId, parentCompId) },
        onAssign: (sessionId, compId) => { void assign(workspaceId, sessionId, compId) },
        onDragStart: setDrag, onDragEnd: () => { setDrag(null) },
      }),
    )
  }
  const renderContainer = (workspaceId, parentCompId, depth, sessionIds) => {
    const nodes = []
    const children = childComps(workspaceId, parentCompId)
    for (const comp of children) {
      const nested = childComps(workspaceId, comp.id)
      const directSessions = comp.sessionIds.filter(visible)
      const expanded = expandedComps[comp.id] ?? comp.collapsed !== true
      nodes.push(h(CompositionRow, {
        key: comp.id, comp, depth, expanded, count: nested.length + directSessions.length, drag, t,
        onToggle: () => { void toggleComp(comp, expanded) },
        onRename: target => { setRenameError(null); setRenameTarget({ kind: 'comp', id: target.id, title: target.title }) },
        onCreateChild: target => { void createEmptyComp(workspaceId, target.id) },
        onDissolve: target => { void dissolveComp(target.id) },
        onDelete: target => { setDeleteError(null); setDeleteTarget({ kind: 'comp', id: target.id, title: target.title }) },
        onDrop: targetId => { void moveDrag(workspaceId, targetId) },
        onDragStart: setDrag, onDragEnd: () => { setDrag(null) },
      }, renderContainer(workspaceId, comp.id, depth + 1, directSessions)))
    }
    for (const id of sessionIds) {
      const row = renderSession(workspaceId, parentCompId, id, depth)
      if (row !== null) nodes.push(row)
    }
    return nodes
  }

  const deleteCounts = deleteTarget?.kind === 'comp' ? (() => {
    const tree = subtree(comps, deleteTarget.id)
    return { comps: tree.nodes.length, sessions: tree.sessionIds.length }
  })() : { comps: 0, sessions: 0 }
  const searchActive = query.trim() !== ''
  const wide = props.wide !== false
  const openSearch = () => {
    setSearchExpanded(true)
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => { searchInputRef.current?.focus() })
  }
  return h('div', { className: `dsc-root${wide ? '' : ' dsc-rail'}${searchExpanded ? ' dsc-searching' : ''}` },
    h('div', { className: 'dsc-header' },
      wide && h('span', { className: 'dsc-section-label' }, t('workspaces')),
      wide && h('div', { className: 'dsc-search-slot' },
        h('div', { className: 'dsc-search', onClick: openSearch },
          h(Tooltip, { label: t('search'), side: 'bottom', disabled: searchExpanded },
            h('button', { type: 'button', className: 'dsc-search-button', 'aria-label': t('search'),
              'aria-expanded': searchExpanded, onClick: openSearch,
            }, h(IconSearchOutline16, { size: searchExpanded ? 11 : 14 }))),
          h('input', { ref: searchInputRef, className: 'dsc-search-input', type: 'text', value: query,
            placeholder: t('search'), 'aria-label': t('search'), tabIndex: searchExpanded ? 0 : -1,
            onChange: event => { setQuery(event.target.value) },
            onKeyDown: event => {
              if (event.key !== 'Escape') return
              setQuery(''); setSearchExpanded(false)
            },
          }),
          searchExpanded && h('button', { type: 'button', className: 'dsc-clear-button', 'aria-label': t('close'),
            onClick: event => { event.stopPropagation(); setQuery(''); setSearchExpanded(false) },
          }, h(IconCloseFill14, {})),
        ),
      ),
      h('div', { className: 'dsc-header-actions' },
        !wide && h(Tooltip, { label: t('search'), side: 'right' },
          h('button', { type: 'button', className: 'dsc-search-button', 'aria-label': t('search'),
            onClick: () => { if (typeof props.expandSidebar === 'function') props.expandSidebar() },
          }, h(IconSearchOutline16, { size: 18 }))),
        h(Tooltip, { label: t('addWorkspace'), side: wide ? 'bottom' : 'right' },
          h('button', { type: 'button', className: 'dsc-header-button', 'aria-label': t('addWorkspace'),
            onClick: () => { if (typeof props.addWorkspace === 'function') void props.addWorkspace() },
          }, h(IconProjectAddOutline16, { size: wide ? 16 : 18 }))),
      ),
    ),
    wide && error !== null && h('button', { type: 'button', onClick: clearError, className: 'dsc-error' }, error),
    wide && deletions.length > 0 && h('button', {
      type: 'button', className: 'dsc-recovery', 'data-failed': Object.keys(deletionFailures).length > 0 ? 'true' : 'false',
      disabled: Object.keys(deletionFailures).length === 0,
      onClick: retryDeletions,
    }, t(Object.keys(deletionFailures).length > 0 ? 'deletionFailed' : 'deletionPending', { n: deletions.length })),
    wide && h('div', { className: 'dsc-list-area' },
      h('div', { className: 'dsc-tree', role: 'tree' },
      phase === 'loading' && h('div', { className: 'dsc-status' }, t('loading')),
      searchActive && h('div', null,
        (results ?? []).map(result => {
          const id = result.sessionId ?? result.id
          const session = byId[id]
          return h('button', { key: id, type: 'button', className: 'dsc-search-result', onClick: () => { openSession(id) } },
            h('span', { className: 'dsc-title' }, session === undefined ? String(id) : sessionTitle(session, t)))
        }),
        results !== null && results.length === 0 && h('div', { className: 'dsc-empty' }, t('searchEmpty')),
      ),
      !searchActive && workspaces.map(workspace => {
        const workspaceId = workspace.workspaceId
        const claimed = compositionIndex.claimed.get(workspaceId) ?? new Set()
        const loose = (workspace.sessionIds ?? []).filter(id => !claimed.has(id) && !pendingSessionIds.has(id) && visible(id))
        const roots = childComps(workspaceId, null)
        const expanded = expandedWorkspaces[workspaceId] !== false
        const active = expanded && (workspace.sessionIds ?? []).includes(current)
        return h('section', { key: workspaceId, className: 'dsc-section' },
          h(WorkspaceRow, {
            workspace, expanded, active, t,
            onToggle: () => { setExpandedWorkspaces(previous => ({ ...previous, [workspaceId]: previous[workspaceId] === false })) },
            onStartSession: () => { if (typeof props.startSession === 'function') void props.startSession(workspaceId) },
            onRename: target => {
              setRenameError(null)
              setRenameTarget({ kind: 'workspace', id: target.workspaceId, title: target.title })
            },
            onDelete: target => {
              setDeleteError(null)
              setDeleteTarget({ kind: 'workspace', id: target.workspaceId, title: target.title })
            },
          }),
          expanded && h('div', { role: 'group', className: 'dsc-tree-group' },
            renderContainer(workspaceId, null, 1, []),
            drag !== null && drag.workspaceId === workspaceId && drag.ownerCompId !== null && h('div', {
              className: 'dsc-drop-root',
              onDragOver: event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' },
              onDrop: event => { event.preventDefault(); event.stopPropagation(); void moveDrag(workspaceId, null) },
            }, t('dropToMoveOut')),
            loose.map(id => renderSession(workspaceId, null, id, 1)),
            roots.length === 0 && loose.length === 0 && h('div', { style: { height: '4px' } }),
          ),
        )
      }),
      !searchActive && (() => {
        const accounted = new Set(workspaces.flatMap(workspace => workspace.sessionIds ?? []))
        const stray = allIds.filter(id => !accounted.has(id) && !pendingSessionIds.has(id) && visible(id))
        if (stray.length === 0) return null
        const key = '__ungrouped__'
        const expanded = expandedWorkspaces[key] !== false
        return h('section', { key, className: 'dsc-section' },
          h('div', { className: 'dsc-row dsc-workspace-row', role: 'treeitem', 'aria-expanded': expanded,
            onClick: () => { setExpandedWorkspaces(previous => ({ ...previous, [key]: previous[key] === false })) },
          },
            h('span', { className: 'dsc-slot dsc-folder' }, h(expanded ? IconFolderOpen16 : IconFolderClose16, {})),
            h('span', { className: 'dsc-slot dsc-chevron' }, h(IconTriangleRightFill14, {
              className: `dsc-arrow${expanded ? ' dsc-arrow-open' : ''}`,
            })),
            h('span', { className: 'dsc-title' }, t('ungrouped')),
          ),
          expanded && stray.map(id => renderSession('__none__', null, id, 1)),
        )
      })(),
      ),
      h('span', { className: 'dsc-fade', 'aria-hidden': true }),
    ),
    h(TextRenameModal, {
      target: renameTarget, busy: renameBusy, error: renameError, t,
      onClose: () => { if (!renameBusy) setRenameTarget(null) }, onConfirm: title => { void confirmRename(title) },
    }),
    h(DeleteModal, {
      target: deleteTarget, kind: deleteTarget?.kind ?? 'session', busy: deleteBusy, error: deleteError,
      counts: deleteCounts, t, onClose: () => { if (!deleteBusy) setDeleteTarget(null) }, onConfirm: () => { void confirmDelete() },
    }),
  )
}
