window.__ModuleLoader__.load({
	id: "dsh-session-comps",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		const CLIENT_CSS = ".dsc-root{--dsc-edge:var(--dsh-sidebar-inline-padding,12px);--dsc-scrollbar:8px;box-sizing:border-box;min-height:0;padding-right:var(--dsc-edge);color:var(--dsw-alias-label-primary);flex:1;display:flex;flex-direction:column;font-size:14px}\n.dsc-root.dsc-rail{padding-right:0}\n.dsc-header{box-sizing:border-box;height:36px;color:var(--dsw-alias-label-tertiary);border-radius:12px;flex:none;display:flex;justify-content:flex-end;align-items:center;gap:4px;margin:2px -4px 4px 0;padding-left:4px;overflow:hidden}\n.dsc-section-label{white-space:nowrap;min-width:0;max-width:45%;flex:none;line-height:20px;overflow:hidden;transition:max-width .18s var(--ds-ease-in-out),opacity .12s var(--ds-ease-in-out),transform .18s var(--ds-ease-in-out)}\n.dsc-searching .dsc-section-label{opacity:0;visibility:hidden;max-width:0;margin-right:-4px;transform:translateX(-4px)}\n.dsc-search-slot{box-sizing:border-box;min-width:0;max-width:28px;flex:1;display:flex;align-items:center;margin-left:auto;transition:max-width .18s var(--ds-ease-in-out)}\n.dsc-searching .dsc-search-slot{max-width:100%}\n.dsc-search{box-sizing:border-box;cursor:text;width:100%;height:28px;color:var(--dsw-alias-label-secondary);background:transparent;border:0;border-radius:50%;display:flex;align-items:center;overflow:hidden;transition:width .18s var(--ds-ease-in-out),border-color .18s var(--ds-ease-in-out),border-radius .18s var(--ds-ease-in-out)}\n.dsc-searching .dsc-search{border:.5px solid var(--dsw-alias-border-l4);width:calc(100% + 4px);height:30px;color:var(--dsw-alias-label-caption);border-radius:10px;margin-inline:-2px;padding-right:4px}\n.dsc-search-button,.dsc-header-button{appearance:none;cursor:pointer;width:28px;height:28px;color:inherit;background:transparent;border:0;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;padding:0}\n.dsc-header-button{color:var(--dsw-alias-label-secondary)}\n.dsc-search-button:hover,.dsc-header-button:hover,.dsc-clear-button:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.dsc-search-input{opacity:0;pointer-events:none;width:0;min-width:0;color:var(--dsw-alias-label-primary);background:transparent;border:0;outline:0;flex:1;font-size:13px;line-height:18px;transition:opacity .12s var(--ds-ease-in-out)}\n.dsc-searching .dsc-search-input{opacity:1;pointer-events:auto;margin-left:-2px}\n.dsc-search-input::placeholder{color:var(--dsw-alias-label-tertiary)}\n.dsc-clear-button{appearance:none;cursor:pointer;width:24px;height:24px;color:var(--dsw-alias-label-secondary);background:transparent;border:0;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;padding:0}\n.dsc-header-actions{opacity:1;visibility:visible;max-width:60px;flex:none;display:flex;align-items:center;gap:4px;overflow:hidden;transition:max-width .18s var(--ds-ease-in-out),opacity .12s var(--ds-ease-in-out),transform .18s var(--ds-ease-in-out)}\n.dsc-searching .dsc-header-actions{opacity:0;visibility:hidden;pointer-events:none;max-width:0;transform:translateX(4px)}\n.dsc-rail .dsc-header{justify-content:flex-start;gap:0;margin:0 0 12px;padding:0}\n.dsc-rail .dsc-header-actions{max-width:none;display:flex;flex-direction:column;gap:12px}\n.dsc-rail .dsc-header-button,.dsc-rail .dsc-search-button{width:36px;height:36px;color:var(--dsw-alias-label-primary)}\n.dsc-list-area{min-height:0;margin-left:-4px;margin-right:calc(-1 * var(--dsc-edge));padding-left:4px;flex:1;display:flex;flex-direction:column;overflow:visible;position:relative}\n.dsc-tree{min-height:0;margin-left:-4px;margin-right:2px;padding:0 calc(var(--dsc-edge) - var(--dsc-scrollbar) - 2px) 16px 4px;scrollbar-gutter:stable;flex:1;overflow-y:auto;position:relative}\n.dsc-section{position:relative}.dsc-section+.dsc-section{margin-top:4px}.dsc-section>*+*{margin-top:2px}.dsc-tree-group>*+*{margin-top:2px}\n.dsc-row{box-sizing:border-box;cursor:pointer;user-select:none;color:var(--dsw-alias-label-primary);border-radius:8px;display:flex;align-items:center;padding:0 8px}\n.dsc-row:hover,.dsc-row[data-selected=\"true\"],.dsc-row[data-menu-open=\"true\"]{background:var(--dsw-alias-interactive-bg-hover)}\n.dsc-workspace-row,.dsc-comp-row{height:34px;gap:6px}.dsc-session-row{height:32px;gap:0;animation:dsc-row-in .15s var(--ds-ease-in-out)}\n.dsc-slot{width:16px;height:20px;color:var(--dsw-alias-label-tertiary);flex:none;display:inline-flex;align-items:center;justify-content:center}\n.dsc-title{min-width:0;flex:1;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;font-size:14px;line-height:20px}\n.dsc-session-row .dsc-title{margin:0 6px 0 4px}.dsc-title-unread{font-weight:600}\n.dsc-folder-active,.dsc-comp-folder{color:var(--dsw-alias-state-business-primary)}\n.dsc-chevron{display:none;color:var(--dsw-alias-label-caption)}\n.dsc-workspace-row:hover .dsc-chevron,.dsc-comp-row:hover .dsc-chevron{display:inline-flex}\n.dsc-workspace-row:hover .dsc-folder,.dsc-comp-row:hover .dsc-folder{display:none}\n.dsc-arrow{transition:transform .15s var(--ds-ease-in-out)}.dsc-arrow-open{transform:rotate(90deg)}\n.dsc-time,.dsc-count{color:var(--dsw-alias-label-tertiary);flex:none;font-size:12px;line-height:20px}\n.dsc-count{font-variant-numeric:tabular-nums;min-width:12px;text-align:right}\n.dsc-row-actions{flex:none;display:none;align-items:center;gap:12px}\n.dsc-row:hover .dsc-row-actions,.dsc-row[data-menu-open=\"true\"] .dsc-row-actions{display:inline-flex}\n.dsc-session-row:hover .dsc-time,.dsc-session-row[data-menu-open=\"true\"] .dsc-time,.dsc-comp-row:hover .dsc-count,.dsc-comp-row[data-menu-open=\"true\"] .dsc-count{display:none}\n.dsc-icon-button{appearance:none;cursor:pointer;width:16px;height:16px;color:var(--dsw-alias-label-tertiary);background:transparent;border:0;border-radius:4px;flex:none;display:inline-flex;align-items:center;justify-content:center;padding:0}\n.dsc-icon-button:hover{color:var(--dsw-alias-label-primary)}\n.dsc-comp{margin-bottom:0}.dsc-comp-children{margin-top:3px}.dsc-comp-children>*+*{margin-top:4px}.dsc-comp-row{transition:background-color .12s var(--ds-ease-in-out),box-shadow .12s var(--ds-ease-in-out)}\n.dsc-comp-row[data-drop-active=\"true\"]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 10%,transparent);box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary)}\n.dsc-drop-root{box-sizing:border-box;height:28px;margin:4px 8px 4px 22px;color:var(--dsw-alias-state-business-primary);border:1px dashed color-mix(in srgb,var(--dsw-alias-state-business-primary) 55%,transparent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 5%,transparent)}\n.dsc-status,.dsc-error,.dsc-empty{padding:10px 12px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.dsc-error{appearance:none;width:100%;text-align:left;color:var(--dsw-alias-state-error-primary);background:transparent;border:0;cursor:pointer}.dsc-empty{padding:16px 12px;font-size:13px}\n.dsc-recovery{box-sizing:border-box;margin:0 4px 6px;padding:7px 9px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);border:0;border-radius:8px;font-size:12px;line-height:18px}.dsc-recovery[data-failed=\"true\"]{cursor:pointer;color:var(--dsw-alias-state-error-primary)}\n.dsc-search-result{box-sizing:border-box;cursor:pointer;text-align:left;width:100%;min-height:36px;color:var(--dsw-alias-label-primary);background:transparent;border:0;border-radius:8px;display:flex;align-items:center;padding:4px 8px;font-size:14px}.dsc-search-result:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.dsc-fade{position:absolute;pointer-events:none;height:24px;left:0;right:var(--dsc-edge);bottom:0;background:linear-gradient(to bottom,transparent,var(--dsw-specific-sidebar-fill))}\n.dsc-rename-input{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l4);width:100%;height:44px;color:var(--dsw-alias-label-primary);background:transparent;border-radius:22px;outline:0;padding:7px 14px;font-size:14px;line-height:22px}.dsc-rename-input:focus{border-color:var(--dsw-alias-state-business-primary)}\n.dsc-modal-error{color:var(--dsw-alias-state-error-primary);margin-top:8px;font-size:12px;line-height:18px}\n.dsc-submenu-break{display:block}\nbutton:has(>span>.dsc-submenu-break){position:relative;margin-top:9px}\nbutton:has(>span>.dsc-submenu-break)::before{content:\"\";position:absolute;top:-5px;left:2px;right:2px;height:.5px;background:var(--dsw-alias-border-l1);pointer-events:none}\n@keyframes dsc-row-in{from{opacity:0}}\n@media (prefers-reduced-motion:reduce){.dsc-session-row,.dsc-arrow,.dsc-section-label,.dsc-search-slot,.dsc-search-input,.dsc-header-actions{animation:none;transition:none}}"

		const React = require('react')
		const { defineStore } = require('@deepseek-ai/dsh-client-store')
		const {
		  Button, Menu, Modal, StateDot, Tooltip,
		  IconArchiveOutline20, IconBranchOutline16, IconCloseFill14,
		  IconEditOutline16, IconEllipsisOutline16, IconFolderClose16,
		  IconFolderOpen16, IconPlusOutline16,
		  IconProjectAddOutline16, IconSearchOutline16, IconTrashOutline16,
		  IconTriangleRightFill14,
		} = require('@deepseek-ai/dsh-client-ui-primitives')

		const h = React.createElement
		const NS = 'sessionComps'
		const PACKAGE_NAME = 'dsh-session-comps'
		const API = '/dsh-session-comps/api'
		const INDENT = 14
		const SEARCH_DEBOUNCE_MS = 250

		const STYLE_ID = 'dsh-session-comps/native-sidebar'

		function ensureStyles() {
		  if (typeof document === 'undefined' || document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return
		  const tag = document.createElement('style')
		  tag.dataset.plugin = PACKAGE_NAME
		  tag.dataset.pluginCss = STYLE_ID
		  tag.textContent = CLIENT_CSS
		  document.head.appendChild(tag)
		}

		const zh = {
		  workspaces: '工作区', newSession: '新会话', addWorkspace: '添加工作区',
		  search: '搜索会话', searchEmpty: '没有匹配的会话', loading: '加载中…', ungrouped: '未分组',
		  rename: '重命名', fork: '分叉会话', markUnread: '标为未读', markRead: '标为已读',
		  openInFinder: '在 Finder 中打开', renameWorkspace: '重命名工作区', deleteWorkspace: '删除工作区',
		  deleteWorkspaceDesc: '将把“{name}”从工作区列表中移除。文件夹与会话记录会保留，其会话将显示在“未分组”下。',
		  deleteWorkspacePending: '正在删除工作区…',
		  archive: '归档会话', addToComp: '加入合成', createComp: '新建合成', defaultCompName: '新建合成{n}',
		  newSubComp: '新建子合成', moveOutOfComp: '移出当前合成', dissolveComp: '解散合成',
		  deleteSession: '删除会话',
		  deleteSessionDesc: '将永久删除“{name}”的会话记录与执行轨迹。工作区文件会保留。此操作无法撤销。',
		  deleteSessionPending: '正在删除会话…', deleteComp: '删除合成',
		  deleteCompDesc: '将永久删除“{name}”、其中的 {comps} 个合成和 {sessions} 个会话。工作区文件会保留。此操作无法撤销。',
		  deleteCompPending: '正在删除合成和会话…', renameComp: '重命名合成', renameSession: '重命名会话',
		  duplicateCompName: '同一工作区中的合成名称不能重复。',
		  deletionPending: '正在完成 {n} 个合成的删除…', deletionFailed: '删除未完成，点击重试',
		  name: '名称', cancel: '取消', confirm: '确定', close: '关闭',
		  dropToMoveOut: '拖到这里移出合成', noComps: '还没有合成',
		  timeNow: '刚刚', timeMinutes: '{n}分钟', timeHours: '{n}小时', timeDays: '{n}天',
		}
		const en = {
		  workspaces: 'Workspaces', newSession: 'New session', addWorkspace: 'Add workspace',
		  search: 'Search sessions', searchEmpty: 'No matching sessions', loading: 'Loading…', ungrouped: 'Ungrouped',
		  rename: 'Rename', fork: 'Fork session', markUnread: 'Mark unread', markRead: 'Mark read', archive: 'Archive session',
		  openInFinder: 'Open in Finder', renameWorkspace: 'Rename workspace', deleteWorkspace: 'Delete workspace',
		  deleteWorkspaceDesc: 'This removes “{name}” from the workspace list. The folder and session logs will be kept. Its sessions will appear under Ungrouped.',
		  deleteWorkspacePending: 'Deleting workspace…',
		  addToComp: 'Add to composition', createComp: 'New composition', defaultCompName: 'New composition {n}',
		  newSubComp: 'New nested composition', moveOutOfComp: 'Move out of current composition', dissolveComp: 'Dissolve composition',
		  deleteSession: 'Delete session',
		  deleteSessionDesc: 'This permanently deletes the conversation history and execution trace for “{name}”. Workspace files are kept. This cannot be undone.',
		  deleteSessionPending: 'Deleting session…', deleteComp: 'Delete composition',
		  deleteCompDesc: 'This permanently deletes “{name}”, its {comps} compositions, and {sessions} sessions. Workspace files are kept. This cannot be undone.',
		  deleteCompPending: 'Deleting composition and sessions…', renameComp: 'Rename composition', renameSession: 'Rename session',
		  duplicateCompName: 'Composition names must be unique within a workspace.',
		  deletionPending: 'Finishing {n} composition deletion(s)…', deletionFailed: 'Deletion is incomplete. Click to retry.',
		  name: 'Name', cancel: 'Cancel', confirm: 'Confirm', close: 'Close',
		  dropToMoveOut: 'Drop here to move out of composition', noComps: 'No compositions yet',
		  timeNow: 'now', timeMinutes: '{n}min', timeHours: '{n}hr', timeDays: '{n}d',
		}

		function interpolate(template, values) {
		  return Object.entries(values ?? {}).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template)
		}

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

		function SessionState({ session }) {
		  if (session.running === true) return h(StateDot, { state: 'ongoing' })
		  if (session.pendingInteraction !== undefined) return h(StateDot, { state: 'warning' })
		  if (session.completed === true) return h(StateDot, { state: 'done' })
		  return null
		}

		function IconComposition16({ size = 16, className }) {
		  return h('svg', {
		    width: size, height: size, viewBox: '0 0 16 16', fill: 'none', className,
		    'data-icon': 'composition', 'aria-hidden': true,
		  },
		    h('path', {
		      d: 'M8 2.25 13.25 5 8 7.75 2.75 5 8 2.25Z', stroke: 'currentColor', strokeWidth: '1.2',
		      strokeLinecap: 'round', strokeLinejoin: 'round',
		    }),
		    h('path', {
		      d: 'm2.75 8 5.25 2.75L13.25 8M2.75 10.75 8 13.5l5.25-2.75', stroke: 'currentColor', strokeWidth: '1.2',
		      strokeLinecap: 'round', strokeLinejoin: 'round',
		    }),
		  )
		}
		function relativeTimeLabel(updatedAt, t) {
		  const elapsed = Math.max(0, Date.now() - Number(updatedAt ?? Date.now()))
		  if (elapsed < 60_000) return t('timeNow')
		  if (elapsed < 3_600_000) return t('timeMinutes', { n: Math.floor(elapsed / 60_000) })
		  if (elapsed < 86_400_000) return t('timeHours', { n: Math.floor(elapsed / 3_600_000) })
		  return t('timeDays', { n: Math.floor(elapsed / 86_400_000) })
		}

		function WorkspaceRow({ workspace, expanded, active, t, onToggle, onStartSession, onRename, onDelete }) {
		  const [menuOpen, setMenuOpen] = React.useState(false)
		  const canOpenInFinder = typeof window !== 'undefined'
		    && typeof window.dshDesktop?.openInFinder === 'function'
		    && typeof workspace.path === 'string'
		  const items = [
		    ...(canOpenInFinder ? [{ id: 'open-in-finder', label: t('openInFinder'), icon: h(IconFolderOpen16, {}) }] : []),
		    { id: 'rename', label: t('rename'), icon: h(IconEditOutline16, {}) },
		    { id: 'delete', label: t('deleteWorkspace'), icon: h(IconTrashOutline16, {}), danger: true },
		  ]
		  return h('div', {
		    'data-workspace-id': workspace.workspaceId,
		    className: 'dsc-row dsc-workspace-row', role: 'treeitem', 'aria-expanded': expanded,
		    'data-menu-open': menuOpen ? 'true' : 'false', onClick: onToggle,
		  },
		    h('span', { className: `dsc-slot dsc-folder${active ? ' dsc-folder-active' : ''}` },
		      h(expanded ? IconFolderOpen16 : IconFolderClose16, { size: 16 })),
		    h('span', { className: 'dsc-slot dsc-chevron' }, h(IconTriangleRightFill14, {
		      className: `dsc-arrow${expanded ? ' dsc-arrow-open' : ''}`,
		    })),
		    h('span', { className: 'dsc-title', title: workspace.title }, workspace.title),
		    h('span', { className: 'dsc-row-actions' },
		      h(Menu, {
		        open: menuOpen, onClose: () => { setMenuOpen(false) }, items,
		        onSelect: id => {
		          setMenuOpen(false)
		          if (id === 'open-in-finder') {
		            void window.dshDesktop.openInFinder(workspace.path).catch(reason => {
		              console.warn('open in Finder rejected:', reason)
		            })
		          } else if (id === 'rename') onRename(workspace)
		          else if (id === 'delete') onDelete(workspace)
		        },
		        portal: true, closeOnPointerLeave: true,
		        anchor: h('button', {
		          type: 'button', className: 'dsc-icon-button', 'data-workspace-menu-button': 'true',
		          'aria-label': workspace.title,
		          onClick: event => { event.stopPropagation(); setMenuOpen(open => !open) },
		        }, h(IconEllipsisOutline16, {})),
		      }),
		      h('button', { type: 'button', className: 'dsc-icon-button', 'aria-label': t('newSession'),
		        onClick: event => { event.stopPropagation(); onStartSession() },
		      }, h(IconPlusOutline16, {})),
		    ),
		  )
		}

		function SessionRow(props) {
		  const {
		    session, workspaceId, ownerCompId, destinationComps, isCurrent, unread, t,
		    onOpen, onRename, onFork, onUnread, onArchive, onDelete, onCreateComp, onAssign, onDragStart, onDragEnd,
		  } = props
		  const [menuOpen, setMenuOpen] = React.useState(false)
		  const title = sessionTitle(session, t)
		  const submenu = [
		    { id: 'comp:new', label: t('createComp'), icon: h(IconPlusOutline16, { size: 16 }) },
		    ...(ownerCompId === null ? [] : [{
		      id: 'comp:root', label: t('moveOutOfComp'), icon: h(IconFolderOpen16, { size: 16 }),
		    }]),
		    ...destinationComps.map((comp, index) => ({
		      id: `comp:${comp.id}`, label: comp.title,
		      icon: h(IconComposition16, { size: 16, className: index === 0 ? 'dsc-submenu-break' : undefined }),
		    })),
		  ]
		  const items = [
		    { id: 'rename', label: t('rename'), icon: h(IconEditOutline16, {}) },
		    { id: 'fork', label: t('fork'), icon: h(IconBranchOutline16, {}) },
		    { id: unread ? 'read' : 'unread', label: t(unread ? 'markRead' : 'markUnread'), icon: h('span', { style: {
		      width: '8px', height: '8px', border: '1.5px solid currentColor', borderRadius: '50%', boxSizing: 'border-box',
		    } }) },
		    { id: 'archive', label: t('archive'), icon: h(IconArchiveOutline20, { size: 16 }) },
		    ...(workspaceId === '__none__' ? [] : [{
		      id: 'add-to-comp', label: t('addToComp'), icon: h(IconComposition16, { size: 16 }), submenu,
		    }]),
		    { id: 'delete', label: t('deleteSession'), icon: h(IconTrashOutline16, {}), danger: true },
		  ]
		  const select = (id) => {
		    setMenuOpen(false)
		    if (id === 'rename') onRename(session.id, title)
		    else if (id === 'fork') onFork(session.id, ownerCompId)
		    else if (id === 'unread') onUnread(session.id, true)
		    else if (id === 'read') onUnread(session.id, false)
		    else if (id === 'archive') onArchive(session.id)
		    else if (id === 'delete') onDelete(session.id, title, workspaceId)
		    else if (id === 'comp:new') onCreateComp(session.id, ownerCompId)
		    else if (id === 'comp:root') onAssign(session.id, null)
		    else if (id.startsWith('comp:')) onAssign(session.id, id.slice(5))
		  }
		  return h('div', {
		    'data-session-id': session.id, role: 'treeitem', 'aria-selected': isCurrent, draggable: true,
		    className: 'dsc-row dsc-session-row', 'data-selected': isCurrent ? 'true' : 'false',
		    'data-menu-open': menuOpen ? 'true' : 'false',
		    onClick: () => { onOpen(session.id) },
		    onContextMenu: event => { event.preventDefault(); event.stopPropagation(); if (!session.blank) setMenuOpen(true) },
		    onDragStart: event => {
		      event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', session.id)
		      onDragStart({ type: 'session', id: session.id, workspaceId, ownerCompId })
		    },
		    onDragEnd,
		  },
		    h('span', { className: 'dsc-slot' }, h(SessionState, { session })),
		    h('span', { title, className: `dsc-title${unread ? ' dsc-title-unread' : ''}` }, title),
		    !session.blank && h('span', { className: 'dsc-time' }, relativeTimeLabel(session.updatedAt, t)),
		    !session.blank && h('span', { className: 'dsc-row-actions' }, h(Menu, {
		      open: menuOpen, onClose: () => { setMenuOpen(false) }, items, onSelect: select,
		      portal: true, closeOnPointerLeave: true,
		      anchor: h('button', { type: 'button', className: 'dsc-icon-button', 'aria-label': title,
		        onClick: event => { event.stopPropagation(); setMenuOpen(open => !open) },
		      }, h(IconEllipsisOutline16, {})),
		    })),
		  )
		}

		function CompositionRow(props) {
		  const {
		    comp, depth, expanded, count, drag, t,
		    onToggle, onRename, onCreateChild, onDissolve, onDelete, onDrop, onDragStart, onDragEnd, children,
		  } = props
		  const [menuOpen, setMenuOpen] = React.useState(false)
		  const [dropActive, setDropActive] = React.useState(false)
		  const items = [
		    { id: 'rename', label: t('rename'), icon: h(IconEditOutline16, {}) },
		    { id: 'new-child', label: t('newSubComp'), icon: h(IconPlusOutline16, {}) },
		    { id: 'dissolve', label: t('dissolveComp'), icon: h(IconFolderOpen16, {}) },
		    { id: 'delete', label: t('deleteComp'), icon: h(IconTrashOutline16, {}), danger: true },
		  ]
		  return h('div', { 'data-comp-id': comp.id, className: 'dsc-comp' },
		    h('div', {
		      role: 'treeitem', 'aria-expanded': expanded, draggable: true,
		      className: 'dsc-row dsc-comp-row', style: { paddingLeft: `${8 + depth * INDENT}px` },
		      'data-menu-open': menuOpen ? 'true' : 'false', 'data-drop-active': dropActive ? 'true' : 'false',
		      onClick: onToggle,
		      onContextMenu: event => { event.preventDefault(); event.stopPropagation(); setMenuOpen(true) },
		      onDragStart: event => {
		        event.stopPropagation(); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', comp.id)
		        onDragStart({ type: 'comp', id: comp.id, workspaceId: comp.workspaceId, ownerCompId: comp.parentCompId })
		      },
		      onDragEnd: () => { setDropActive(false); onDragEnd() },
		      onDragEnter: event => {
		        if (drag === null || drag.workspaceId !== comp.workspaceId || (drag.type === 'comp' && drag.id === comp.id)) return
		        event.preventDefault(); event.stopPropagation(); setDropActive(true)
		      },
		      onDragOver: event => {
		        if (drag === null || drag.workspaceId !== comp.workspaceId || (drag.type === 'comp' && drag.id === comp.id)) return
		        event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'move'
		      },
		      onDragLeave: event => { if (!event.currentTarget.contains(event.relatedTarget)) setDropActive(false) },
		      onDrop: event => { event.preventDefault(); event.stopPropagation(); setDropActive(false); onDrop(comp.id) },
		    },
		      h('span', { className: 'dsc-slot dsc-folder dsc-comp-folder' }, h(IconComposition16, {})),
		      h('span', { className: 'dsc-slot dsc-chevron' }, h(IconTriangleRightFill14, {
		        className: `dsc-arrow${expanded ? ' dsc-arrow-open' : ''}`,
		      })),
		      h('span', { className: 'dsc-title', title: comp.title }, comp.title),
		      h('span', { className: 'dsc-count', 'aria-label': String(count) }, String(count)),
		      h('span', { className: 'dsc-row-actions' }, h(Menu, {
		        open: menuOpen, onClose: () => { setMenuOpen(false) }, items,
		        onSelect: id => {
		          setMenuOpen(false)
		          if (id === 'rename') onRename(comp)
		          else if (id === 'new-child') onCreateChild(comp)
		          else if (id === 'dissolve') onDissolve(comp)
		          else if (id === 'delete') onDelete(comp)
		        },
		        portal: true, closeOnPointerLeave: true,
		        anchor: h('button', { type: 'button', className: 'dsc-icon-button', 'aria-label': comp.title,
		          onClick: event => { event.stopPropagation(); setMenuOpen(open => !open) },
		        }, h(IconEllipsisOutline16, {})),
		      })),
		    ),
		    expanded && h('div', { className: 'dsc-comp-children', role: 'group' }, children),
		  )
		}

		function TextRenameModal({ target, busy, error, t, onClose, onConfirm }) {
		  const [draft, setDraft] = React.useState(target?.title ?? '')
		  React.useEffect(() => { setDraft(target?.title ?? '') }, [target?.id, target?.title])
		  const trimmed = draft.trim()
		  return h(Modal, {
		    open: target !== null, onClose: busy ? () => {} : onClose, closeLabel: t('close'),
		    title: t(target?.kind === 'session' ? 'renameSession'
		      : target?.kind === 'workspace' ? 'renameWorkspace' : 'renameComp'),
		    footer: h(React.Fragment, null,
		      h(Button, { variant: 'outline', disabled: busy, onClick: onClose }, t('cancel')),
		      h(Button, { variant: 'primary', disabled: busy || trimmed === '', onClick: () => { onConfirm(trimmed) } }, t('confirm')),
		    ),
		  },
		    h('input', {
		      value: draft, autoFocus: true, disabled: busy, 'aria-label': t('name'),
		      className: 'dsc-rename-input',
		      onFocus: event => { event.target.select() }, onChange: event => { setDraft(event.target.value) },
		      onKeyDown: event => {
		        if (event.key === 'Enter' && !event.nativeEvent?.isComposing && trimmed !== '') { event.preventDefault(); onConfirm(trimmed) }
		      },
		    }),
		    error !== null && h('div', { role: 'alert', className: 'dsc-modal-error' }, error),
		  )
		}

		function DeleteModal({ target, kind, busy, error, counts, t, onClose, onConfirm }) {
		  const isComp = kind === 'comp'
		  const isWorkspace = kind === 'workspace'
		  const description = target === null ? undefined : t(isComp ? 'deleteCompDesc'
		    : isWorkspace ? 'deleteWorkspaceDesc' : 'deleteSessionDesc',
		  isComp ? { name: target.title, comps: counts.comps, sessions: counts.sessions } : { name: target.title })
		  return h(Modal, {
		    open: target !== null, onClose: busy ? () => {} : onClose, closeLabel: t('close'),
		    title: t(isComp ? 'deleteComp' : isWorkspace ? 'deleteWorkspace' : 'deleteSession'),
		    ...(description === undefined ? {} : { description }),
		    footer: h(React.Fragment, null,
		      h(Button, { variant: 'outline', disabled: busy, onClick: onClose }, t('cancel')),
		      h(Button, { variant: 'outline', disabled: busy, onClick: onConfirm,
		        style: { color: 'var(--dsw-alias-state-error-primary)' },
		      }, t(isComp ? 'deleteComp' : isWorkspace ? 'deleteWorkspace' : 'deleteSession')),
		    ),
		  },
		    busy && h('div', { role: 'status', style: { fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' } },
		      t(isComp ? 'deleteCompPending' : isWorkspace ? 'deleteWorkspacePending' : 'deleteSessionPending')),
		    error !== null && h('div', { role: 'alert', className: 'dsc-modal-error' }, error),
		  )
		}

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
		return module.exports;
	}
});
