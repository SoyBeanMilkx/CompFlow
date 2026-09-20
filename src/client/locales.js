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
