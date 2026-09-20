/** Built-client contract and interaction tests. */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const appModules = '/Applications/DSH Desktop.app/Contents/Resources/app/node_modules'
const appRequire = createRequire(join(appModules, 'noop.js'))

const React = appRequire('react')
const { renderToStaticMarkup } = appRequire('react-dom/server')

let failures = 0
function check(label, condition) {
  if (condition) {
    console.log(`  ok   ${label}`)
    return
  }
  failures++
  console.log(`  FAIL ${label}`)
}

console.log('dsh-session-comps client contract test')

let loaded = null
const fakeWindow = {
  __ModuleLoader__: {
    load(definition) { loaded = definition },
  },
}
new Function('window', readFileSync(join(root, 'lib', 'client.js'), 'utf8'))(fakeWindow)

check('bundle calls __ModuleLoader__.load', loaded !== null)
check('bundle id is the package name', loaded?.id === 'dsh-session-comps')

const primitivesStub = {
  Button: ({ icon, children, ...rest }) => React.createElement('button', rest, icon ?? null, children ?? null),
  Menu: ({ anchor, open, items = [], onSelect = () => {} }) => React.createElement(React.Fragment, null,
    anchor,
    open ? React.createElement('div', { 'data-menu': 'open' }, items.map(item =>
      React.createElement('div', { key: item.id },
        React.createElement('button', {
          'data-menu-id': item.id, disabled: item.disabled,
          onClick: event => { event.stopPropagation(); onSelect(item.id) },
        }, item.label),
        (item.submenu ?? []).map(sub => React.createElement('button', {
          key: sub.id, 'data-submenu-id': sub.id, disabled: sub.disabled,
          onClick: event => { event.stopPropagation(); onSelect(sub.id) },
        }, sub.icon ?? null, sub.label)),
      ))) : null,
  ),
  Modal: ({ open, title, description, children, footer }) => open
    ? React.createElement('div', { role: 'dialog' }, title, description, children, footer)
    : null,
  Tooltip: ({ children }) => children,
  StateDot: ({ state, size }) => React.createElement('span', { 'data-state': state, 'data-size': size }),
  IconArchiveOutline20: () => React.createElement('svg', { 'data-icon': 'archive' }),
  IconBranchOutline16: () => React.createElement('svg', { 'data-icon': 'branch' }),
  IconCloseFill14: () => React.createElement('svg', { 'data-icon': 'close-fill' }),
  IconEditOutline16: () => React.createElement('svg', { 'data-icon': 'edit' }),
  IconEllipsisOutline16: () => React.createElement('svg', { 'data-icon': 'ellipsis' }),
  IconFolderOpen16: () => React.createElement('svg', { 'data-icon': 'folder-open' }),
  IconFolderClose16: () => React.createElement('svg', { 'data-icon': 'folder-closed' }),
  IconPlusOutline16: () => React.createElement('svg', { 'data-icon': 'plus' }),
  IconCloseOutline16: () => React.createElement('svg', { 'data-icon': 'close' }),
  IconNewChatOutline16: () => React.createElement('svg', { 'data-icon': 'new-chat' }),
  IconProjectAddOutline16: () => React.createElement('svg', { 'data-icon': 'project-add' }),
  IconSearchOutline16: () => React.createElement('svg', { 'data-icon': 'search' }),
  IconTrashOutline16: () => React.createElement('svg', { 'data-icon': 'trash' }),
  IconTriangleRightFill14: () => React.createElement('svg', { 'data-icon': 'triangle' }),
}
const moduleTable = {
  react: React,
  'react/jsx-runtime': appRequire('react/jsx-runtime'),
  '@deepseek-ai/dsh-client-store': { defineStore: specification => specification },
  '@deepseek-ai/dsh-client-ui-primitives': primitivesStub,
}
const exported = loaded.factory(name => {
  if (name in moduleTable) return moduleTable[name]
  throw new Error(`unexpected require(${JSON.stringify(name)})`)
})

check('factory exports apply()', typeof exported.apply === 'function')
check('factory exports an inject list', Array.isArray(exported.inject))
check('inject asks for slots', exported.inject?.includes('slots'))
check('inject asks for locale', exported.inject?.includes('locale'))

const registrations = []
const injectedNames = []
const locales = []
const ctx = {
  effect(callback) { void callback() },
  locale: { register(namespace, dicts) { locales.push({ namespace, dicts }); return () => {} } },
  slots: {
    inject(name, callback) { injectedNames.push(name); callback() },
    register(options, component) { registrations.push({ options, component }); return () => {} },
  },
}
exported.apply(ctx)

check('locale dictionary registered under one namespace', locales.length === 1)
check('dictionary carries zh and en', locales[0]?.dicts?.zh !== undefined && locales[0]?.dicts?.en !== undefined)
check('waits for the sidebar.workspaces declaration', injectedNames[0] === 'sidebar.workspaces')
check('registers exactly one slot', registrations.length === 1)

const { options, component } = registrations[0] ?? {}
check('registration targets sidebar.workspaces', options?.name === 'sidebar.workspaces')
check('registration is attributed to this package', options?.registrant === 'dsh-session-comps')
check('priority is -20 (below shipped 0 and categories -10)', options?.priority === -20)
check('priority ordering shadows both existing occupants', -20 < -10 && -10 < 0)
check('registration carries the locale namespace', options?.locale === locales[0]?.namespace)
check('registration carries a persisted workspace view store', options?.store?.persist === 'dsh.workspace.view.v5')

const loading = renderToStaticMarkup(React.createElement(component, { wide: true, t: key => key }))
check('renders without throwing', typeof loading === 'string' && loading.length > 0)
check('renders the section label', loading.includes('工作区'))
check('restores the add-workspace affordance', loading.includes('data-icon="project-add"'))
check('restores the search affordance', loading.includes('data-icon="search"'))
check('renders the loading line while the host read is in flight', loading.includes('加载中'))

const translated = renderToStaticMarkup(React.createElement(component, { wide: true, t: key => `T:${key}` }))
check('routes copy through the slot translate function', translated.includes('T:workspaces'))

const fallback = renderToStaticMarkup(React.createElement(component, { wide: true }))
check('falls back to the bundled dictionary without a translate fn', fallback.includes('工作区'))

const rail = renderToStaticMarkup(React.createElement(component, { wide: false, t: key => key }))
check('renders in rail state too', rail.length > 0)

const workspaceState = {
  items: [
    {
      workspaceId: 'ws-1', path: '/Users/tclx/tools/dsh_plugin', title: 'dsh_plugin',
      sessionIds: ['s-1', 's-2', 's-blank', 's-sub', 's-archived'],
      createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z',
    },
    {
      workspaceId: 'ws-2', path: '/Users/tclx/tools/other', title: 'other',
      sessionIds: ['s-3'], createdAt: '2026-09-02T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z',
    },
  ],
  archivedSessionIds: ['s-archived'],
  phase: 'ready',
}
const sessionState = {
  ids: ['s-1', 's-2', 's-blank', 's-sub', 's-archived', 's-stray'],
  byId: {
    's-1': { id: 's-1', displayTitle: '登录重构：梳理接口', running: true, blank: false, updatedAt: 3000 },
    's-2': { id: 's-2', displayTitle: '会话合成插件设计', completed: true, blank: false, updatedAt: 2000 },
    's-blank': { id: 's-blank', displayTitle: 'Blank', blank: true, updatedAt: 1000 },
    's-sub': { id: 's-sub', displayTitle: '子代理会话', origin: 'subagent', blank: false, updatedAt: 1500 },
    's-archived': { id: 's-archived', displayTitle: '已归档会话', blank: false, updatedAt: 1400 },
    's-stray': { id: 's-stray', displayTitle: '游离会话', blank: false, updatedAt: 2500 },
  },
  current: 's-1',
  phase: 'ready',
}
const feeds = {
  useWorkspaces: select => select(workspaceState),
  useSessions: select => select(sessionState),
}
const listed = renderToStaticMarkup(React.createElement(component, { wide: true, t: key => key, ...feeds }))

check('renders a session from the workspace account', listed.includes('登录重构：梳理接口'))
check('renders a second session', listed.includes('会话合成插件设计'))
check('renders the first workspace group title', listed.includes('dsh_plugin'))
check('renders the second workspace group title', listed.includes('other'))
check('renders the ungrouped bucket for an unaccounted session', listed.includes('未分组'))
check('renders the unaccounted session', listed.includes('游离会话'))
check('hides subagent children (they belong to a parent catalog)', !listed.includes('子代理会话'))
check('hides archived sessions', !listed.includes('已归档会话'))
check('hides a non-current blank session', !listed.includes('Blank'))

check('marks a running session with the ongoing dot', listed.includes('data-state="ongoing"'))

const { JSDOM } = appRequire('jsdom')
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator, configurable: true, writable: true,
})
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const mountWorkspaceState = {
  items: [{
    workspaceId: 'ws-1', path: '/Users/tclx/tools/dsh_plugin', title: 'dsh_plugin',
    sessionIds: ['s-loose', 's-in-comp', 's-in-nested'],
    createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z',
  }],
  archivedSessionIds: [],
  phase: 'ready',
}
const mountSessionState = {
  ids: ['s-loose', 's-in-comp', 's-in-nested'],
  byId: {
    's-loose': { id: 's-loose', displayTitle: '插件编写方法', blank: false, updatedAt: 3000 },
    's-in-comp': { id: 's-in-comp', displayTitle: '改错误处理', blank: false, updatedAt: 2000 },
    's-in-nested': { id: 's-in-nested', displayTitle: '梳理接口', blank: false, updatedAt: 1000 },
  },
  current: undefined,
  phase: 'ready',
}
const mountDoc = {
  version: 2,
  revision: 3,
  deletions: [],
  comps: [
    { id: 'c1', workspaceId: 'ws-1', parentCompId: null, title: '登录重构', sessionIds: ['s-in-comp'], collapsed: false },
    { id: 'c2', workspaceId: 'ws-1', parentCompId: 'c1', title: '接口层', sessionIds: ['s-in-nested'], collapsed: false },
  ],
}

let liveDoc = structuredClone(mountDoc)
let stateFetches = 0
let conflictSetCollapsedOnce = true
const mutationBodies = []
globalThis.fetch = async (url, options) => {
  if (String(url).endsWith('/state')) {
    stateFetches++
    return { json: async () => ({ ok: true, value: liveDoc }) }
  }
  const body = JSON.parse(options.body)
  mutationBodies.push(body)
  if (body.op === 'setCollapsed' && conflictSetCollapsedOnce) {
    conflictSetCollapsedOnce = false
    liveDoc = { ...liveDoc, revision: liveDoc.revision + 1 }
    return { json: async () => ({ ok: false, error: { code: 'revision-conflict', revision: liveDoc.revision } }) }
  }
  const comps = liveDoc.comps.map(comp => ({ ...comp, sessionIds: [...comp.sessionIds] }))
  let deletions = [...liveDoc.deletions]
  if (body.op === 'assign') {
    for (const comp of comps) comp.sessionIds = comp.sessionIds.filter(id => !body.sessionIds.includes(id))
    const target = comps.find(comp => comp.id === body.compId)
    if (target !== undefined) target.sessionIds.push(...body.sessionIds)
  } else if (body.op === 'setCollapsed') {
    const target = comps.find(comp => comp.id === body.compId)
    if (target !== undefined) target.collapsed = body.collapsed === true
  } else if (body.op === 'dissolveComp') {
    const targetIndex = comps.findIndex(comp => comp.id === body.compId)
    if (targetIndex >= 0) {
      comps.splice(targetIndex, 1)
      for (const comp of comps) if (comp.parentCompId === body.compId) comp.parentCompId = null
    }
  } else if (body.op === 'finishDeleteTree') {
    deletions = deletions.filter(task => task.id !== body.deletionId)
  }
  liveDoc = { ...liveDoc, revision: liveDoc.revision + 1, comps, deletions }
  return { json: async () => ({ ok: true, value: liveDoc }) }
}

const { createRoot } = appRequire('react-dom/client')
const reactRoot = createRoot(document.getElementById('root'))
const unreadCalls = []
const deletedSessionIds = []
let failDeleteSessionOnce = false
const mountedProps = {
  wide: true,
  t: key => key,
  useWorkspaces: select => select(mountWorkspaceState),
  useSessions: select => select(mountSessionState),
  useStore: select => select({ unreadSessionIds: [] }),
  actions: {
    markSessionUnread: id => { unreadCalls.push(`unread:${id}`) },
    markSessionRead: id => { unreadCalls.push(`read:${id}`) },
  },
  openSession: () => {},
  startSession: () => {},
  deleteSession: async id => {
    deletedSessionIds.push(id)
    if (failDeleteSessionOnce && id === 's-in-comp') {
      failDeleteSessionOnce = false
      throw new Error('simulated Session deletion failure')
    }
  },
}
await React.act(async () => {
  reactRoot.render(React.createElement(component, mountedProps))
})

const html = document.getElementById('root').innerHTML
const at = (needle) => html.indexOf(needle)
const count = (needle) => html.split(`>${needle}<`).length - 1

check('mounts and reads the composition document from the host', stateFetches === 1)
check('renders the workspace group', at('dsh_plugin') >= 0)
check('renders a composition inside that workspace', at('登录重构') > at('dsh_plugin'))
check('renders a nested composition inside its parent', at('接口层') > at('登录重构'))
check('renders the nested composition\'s session inside it', at('梳理接口') > at('接口层'))
check('composition uses a distinct layers icon', html.includes('data-icon="composition"'))
check('composition children use the airy spacing group', html.includes('dsc-comp-children'))
check('renders the composition\'s session before the loose session', at('改错误处理') < at('插件编写方法'))
check('renders the loose session last, after all compositions', at('插件编写方法') > at('改错误处理'))
check('a session claimed by a composition is not repeated in the loose list', count('改错误处理') === 1)
check('a session in a nested composition is not repeated either', count('梳理接口') === 1)
check('the loose session appears exactly once', count('插件编写方法') === 1)

const workspaceRow = document.querySelector('[data-workspace-id="ws-1"]')
const workspaceMenuButton = workspaceRow?.querySelector('[data-workspace-menu-button="true"]')
check('workspace row restores its ellipsis action', workspaceMenuButton !== null)
await React.act(async () => { workspaceMenuButton.click() })
const workspaceMenuIds = [...workspaceRow.querySelectorAll('[data-menu-id]')].map(node => node.dataset.menuId)
check('workspace ellipsis opens the native rename and delete menu',
  workspaceMenuIds.includes('rename') && workspaceMenuIds.includes('delete'))
check('opening the workspace menu does not collapse the workspace',
  document.querySelector('[data-comp-id="c1"]') !== null)
await React.act(async () => { workspaceMenuButton.click() })

const looseRow = document.querySelector('[data-session-id="s-loose"]')
await React.act(async () => {
  looseRow.dispatchEvent(new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
})
const menuHtml = document.getElementById('root').innerHTML
check('session context menu contains Add to composition', menuHtml.includes('加入合成'))
check('Add to composition submenu starts with New composition', menuHtml.includes('data-submenu-id="comp:new"'))
const looseMenuIds = [...looseRow.querySelectorAll('[data-submenu-id]')].map(node => node.dataset.submenuId)
check('a root session only lists root-level compositions', looseMenuIds.includes('comp:c1') && !looseMenuIds.includes('comp:c2'))
check('a root session does not offer the move-out action', !looseMenuIds.includes('comp:root'))
check('submenu separator does not consume an empty menu row', !menuHtml.includes('data-submenu-id="comp:divider"'))
check('first composition carries the compact visual divider hook', menuHtml.includes('dsc-submenu-break'))

const unreadButton = looseRow.querySelector('[data-menu-id="unread"]')
await React.act(async () => { unreadButton.click() })
check('mark unread delegates to the persisted workspace view store', unreadCalls.includes('unread:s-loose'))
await React.act(async () => { looseRow.click() })
check('opening a Session clears its persisted unread state', unreadCalls.includes('read:s-loose'))

const groupedRow = document.querySelector('[data-session-id="s-in-comp"]')
await React.act(async () => {
  groupedRow.dispatchEvent(new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
})
const groupedMenuIds = [...groupedRow.querySelectorAll('[data-submenu-id]')].map(node => node.dataset.submenuId)
check('a grouped session offers moving back to the workspace root', groupedMenuIds.includes('comp:root'))
check('a grouped session only lists compositions beside it', groupedMenuIds.includes('comp:c2') && !groupedMenuIds.includes('comp:c1'))

const moveOutButton = groupedRow.querySelector('[data-submenu-id="comp:root"]')
await React.act(async () => { moveOutButton.click() })
check('move out sends an explicitly workspace-scoped root assignment', mutationBodies.some(body => body.op === 'assign'
  && body.workspaceId === 'ws-1' && body.compId === null && body.sessionIds[0] === 's-in-comp'))

const nestedCompRow = document.querySelector('[data-comp-id="c2"] .dsc-comp-row')
await React.act(async () => {
  nestedCompRow.dispatchEvent(new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
})
check('right-clicking a composition opens its menu', nestedCompRow.querySelector('[data-menu="open"]') !== null)
const dissolveButton = nestedCompRow.querySelector('[data-menu-id="dissolve"]')
check('composition menu contains Dissolve composition', dissolveButton?.textContent.includes('解散合成') === true)
await React.act(async () => { dissolveButton.click() })
check('dissolve sends the dedicated non-destructive mutation',
  mutationBodies.some(body => body.op === 'dissolveComp' && body.compId === 'c2'))
check('dissolve removes the composition without creating a deletion task or deleting Sessions',
  !liveDoc.comps.some(comp => comp.id === 'c2') && liveDoc.deletions.length === 0 && deletedSessionIds.length === 0)

const outerCompRow = document.querySelector('[data-comp-id="c1"] .dsc-comp-row')
await React.act(async () => { outerCompRow.click() })
const collapseMutations = mutationBodies.filter(body => body.op === 'setCollapsed' && body.compId === 'c1')
check('a revision conflict is reloaded and retried once', collapseMutations.length === 2 && stateFetches === 2)
check('collapsing a composition persists its state', liveDoc.comps.find(comp => comp.id === 'c1').collapsed === true)

await React.act(async () => { reactRoot.unmount() })

const persistenceRoot = createRoot(document.getElementById('root'))
await React.act(async () => { persistenceRoot.render(React.createElement(component, mountedProps)) })
check('persisted collapse state is restored after remount', document.querySelector('[data-comp-id="c2"]') === null)
await React.act(async () => { persistenceRoot.unmount() })

liveDoc = {
  version: 2,
  revision: liveDoc.revision + 1,
  comps: [],
  deletions: [{
    id: 'delete-recovery', workspaceId: 'ws-1', rootCompId: 'c1', title: '登录重构',
    compIds: ['c1', 'c2'], sessionIds: ['s-in-comp', 's-in-nested'], createdAt: Date.now(),
  }],
}
const loadingRecoveryRoot = createRoot(document.getElementById('root'))
await React.act(async () => {
  loadingRecoveryRoot.render(React.createElement(component, {
    ...mountedProps,
    useSessions: select => select({ ...mountSessionState, byId: {}, phase: 'loading' }),
  }))
  await new Promise(resolve => setTimeout(resolve, 0))
})
check('pending deletion waits for the authoritative Session list',
  !mutationBodies.some(body => body.op === 'finishDeleteTree' && body.deletionId === 'delete-recovery'))
await React.act(async () => { loadingRecoveryRoot.unmount() })

const recoveryRoot = createRoot(document.getElementById('root'))
failDeleteSessionOnce = true
await React.act(async () => {
  recoveryRoot.render(React.createElement(component, mountedProps))
  await new Promise(resolve => setTimeout(resolve, 0))
  await new Promise(resolve => setTimeout(resolve, 0))
})
check('a partial Session deletion keeps the durable task for recovery', liveDoc.deletions.length === 1)
const retryDeletionButton = document.querySelector('.dsc-recovery[data-failed="true"]')
check('a failed deletion exposes a retry affordance', retryDeletionButton !== null)
await React.act(async () => {
  retryDeletionButton.click()
  await new Promise(resolve => setTimeout(resolve, 0))
  await new Promise(resolve => setTimeout(resolve, 0))
})
check('retrying an interrupted composition deletion resumes its Session deletes',
  deletedSessionIds.includes('s-in-comp') && deletedSessionIds.includes('s-in-nested'))
check('recovered deletion finishes its durable host task',
  mutationBodies.some(body => body.op === 'finishDeleteTree' && body.deletionId === 'delete-recovery'))
await React.act(async () => { recoveryRoot.unmount() })

console.log(failures === 0 ? '\nall client checks passed' : `\n${failures} check(s) FAILED`)
process.exit(failures === 0 ? 0 : 1)
