/** Assemble the client fragments into DSH's browser factory format. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const lib = join(root, 'lib')
mkdirSync(lib, { recursive: true })

const host = readFileSync(join(root, 'src', 'index.js'), 'utf8')
writeFileSync(join(lib, 'index.js'), host)

const clientParts = [
  'bootstrap.js', 'styles.js', 'locales.js', 'data.js',
  'components.js', 'browser.js', 'entry.js',
]
const clientCss = readFileSync(join(root, 'src', 'client', 'styles.css'), 'utf8').trimEnd()
const body = [`const CLIENT_CSS = ${JSON.stringify(clientCss)}`]
  .concat(clientParts.map(file =>
    readFileSync(join(root, 'src', 'client', file), 'utf8').trimEnd()))
  .join('\n\n')
const indented = body.replace(/^(?=.)/gm, '\t\t')
const bundle = `window.__ModuleLoader__.load({
\tid: ${JSON.stringify(pkg.name)},
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
${indented}
\t\treturn module.exports;
\t}
});
`
writeFileSync(join(lib, 'client.js'), bundle)

console.log(`built ${pkg.name}: lib/index.js, lib/client.js`)
