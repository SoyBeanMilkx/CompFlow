const STYLE_ID = 'dsh-session-comps/native-sidebar'

function ensureStyles() {
  if (typeof document === 'undefined' || document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return
  const tag = document.createElement('style')
  tag.dataset.plugin = PACKAGE_NAME
  tag.dataset.pluginCss = STYLE_ID
  tag.textContent = CLIENT_CSS
  document.head.appendChild(tag)
}
