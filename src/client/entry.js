class Boundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error !== null) return h('div', { style: {
      padding: '8px', color: 'var(--dsw-alias-state-error-primary)', fontSize: '12px', wordBreak: 'break-word',
    } }, `dsh-session-comps failed to render: ${String(this.state.error?.message ?? this.state.error)}`)
    return this.props.children
  }
}
function Region(props) { return h(Boundary, null, h(CompBrowser, props)) }

const inject = ['slots', 'locale', 'sessions', 'workspaces', 'remote', 'layout']
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'session-comps: dictionaries')
  ctx.slots.inject('sidebar.workspaces', () => ctx.slots.register({
    name: 'sidebar.workspaces', priority: -20, registrant: PACKAGE_NAME, locale: NS,
    store: createWorkspaceViewStore(),
    inject: () => ({
      openSession: sessionId => { ctx.sessions.open(sessionId); ctx.layout?.selectPanel?.(null) },
      startSession: async workspaceId => {
        const snapshot = ctx.workspaces.list.getSnapshot()
        const sessions = ctx.sessions.list.getSnapshot()
        const currentWorkspaceId = sessions.current === undefined ? undefined
          : snapshot.items.find(item => item.sessionIds.includes(sessions.current))?.workspaceId
        const target = workspaceId ?? currentWorkspaceId ?? snapshot.items[0]?.workspaceId
        if (target === undefined) { ctx.sessions.clear(); return undefined }
        const sessionId = await ctx.sessions.create({ workspaceId: target })
        ctx.sessions.open(sessionId); ctx.layout?.selectPanel?.(null)
        return sessionId
      },
      renameSession: async (sessionId, title) => {
        const session = ctx.sessions.binding(sessionId)?.session
        if (session === undefined) throw new Error(`unknown session "${sessionId}"`)
        const result = await session.rename(title)
        if (!result.ok) throw new Error(result.error.message)
      },
      forkSession: async sessionId => {
        const childId = await ctx.sessions.fork({ sessionId, increaseTitle: true })
        ctx.sessions.open(childId); ctx.layout?.selectPanel?.(null)
        return childId
      },
      deleteSession: sessionId => ctx.sessions.delete(sessionId),
      renameWorkspace: (workspaceId, title) => ctx.workspaces.rename(workspaceId, title),
      deleteWorkspace: workspaceId => ctx.workspaces.delete(workspaceId),
      archiveSession: async sessionId => {
        const result = await ctx.workspaces.archiveSession(sessionId)
        if (result?.ok === false) throw new Error(result.error.message)
      },
      searchSessions: async (query, signal) => {
        const result = await ctx.sessions.search(query, signal)
        if (!result.ok) throw new Error(result.error.message)
        return result.value
      },
      addWorkspace: async () => {
        const picked = await ctx.remote.directoryPicker.pick()
        if (!picked.ok) throw new Error(picked.error.message)
        if (picked.value === null || picked.value === undefined) return
        const result = await ctx.workspaces.create({ path: picked.value })
        if (result?.ok === false) throw new Error(result.error.message)
      },
    }),
  }, Region))
}

exports.apply = apply
exports.inject = inject
