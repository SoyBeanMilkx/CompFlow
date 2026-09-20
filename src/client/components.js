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
