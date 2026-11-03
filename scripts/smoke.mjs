// scripts/smoke.mjs — offline checks that need no MCP server or DSH runtime.
// Usage: npm test
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const failures = []
function check(name, fn) {
  try { fn(); console.log('ok   ' + name) }
  catch (error) { failures.push(name + ': ' + error.message); console.log('FAIL ' + name) }
}
function assert(condition, message) { if (!condition) throw new Error(message) }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8') }

const pkg = JSON.parse(read('package.json'))
const client = read('client/client.js')

check('client bundle parses', () => {
  new vm.Script(client, { filename: 'client/client.js' })
})
check('package name matches client loader id', () => {
  assert(client.includes('id: "' + pkg.name + '"'), 'loader id != package name')
  assert(client.includes('STYLE_ID = "' + pkg.name + '/'), 'style id prefix != package name')
})
check('cordis patch targets the package', () => {
  const patch = read('cordis.patch.yml')
  assert(patch.includes('name: ' + pkg.name), 'bundle name missing from cordis.patch.yml')
  assert(pkg.dsh && pkg.dsh.bundle && pkg.dsh.bundle.patch === './cordis.patch.yml', 'dsh.bundle.patch missing')
})
check('locale files carry display metadata', () => {
  for (const lang of ['en', 'zh']) {
    const meta = JSON.parse(read('locale/' + lang + '.json')).meta
    assert(meta && typeof meta.title === 'string' && meta.title.length > 0, lang + ' meta.title')
    assert(meta && typeof meta.description === 'string' && meta.description.length > 0, lang + ' meta.description')
  }
})
check('client dictionaries have identical keys', () => {
  const zh = client.indexOf('zh: {')
  const en = client.indexOf('en: {')
  assert(zh >= 0 && en > zh, 'dictionaries not found')
  const zhBlock = client.slice(zh, en)
  const enBlock = client.slice(en, client.indexOf('\n      }\n    };', en))
  const keys = (block) => Array.from(block.matchAll(/^\s{8}([A-Za-z0-9]+):/gm)).map((m) => m[1]).sort()
  const zhKeys = keys(zhBlock)
  const enKeys = keys(enBlock)
  assert(zhKeys.length > 50, 'too few keys extracted: ' + zhKeys.length)
  assert(JSON.stringify(zhKeys) === JSON.stringify(enKeys), 'zh/en keys differ')
})
check('header editor is key/value rows, not a JSON textarea', () => {
  assert(client.includes('headerRowsFromHeaders'), 'row serializer missing')
  assert(client.includes('addHeader'), 'add-row action missing')
  assert(!client.includes('fieldHeadersJson'), 'legacy JSON header field still present')
})
check('README screenshots exist (zh primary + en)', () => {
  for (const file of ['README.md', 'README.en.md']) {
    const refs = Array.from(read(file).matchAll(/docs\/screenshots\/[^)\s]+\.png/g)).map((m) => m[0])
    assert(refs.length >= 5, 'expected at least 5 screenshots in ' + file)
    for (const ref of refs) assert(fs.existsSync(path.join(root, ref)), file + ' missing ' + ref)
  }
})
check('Chinese README is the npm/GitHub landing page', () => {
  const text = read('README.md')
  assert(text.includes('DeepSeek Harness 简洁'), 'tagline missing from README.md')
  assert(text.includes('README.en.md'), 'language switch missing from README.md')
})
check('npm files whitelist contains runtime paths', () => {
  for (const entry of ['lib', 'client/client.js', 'locale', 'cordis.patch.yml', 'icon.svg', 'README.md', 'README.en.md', 'LICENSE']) {
    assert(pkg.files.includes(entry), 'files missing ' + entry)
  }
})

check('tooltip bubble is content-sized', () => {
  const rule = client.match(/\.mcpm-tip \{[^}]*\}/)
  assert(rule, '.mcpm-tip rule missing')
  assert(rule[0].includes('width: max-content'), 'tooltip must size to its content')
  assert(!/width:\s*320px/.test(rule[0]), 'tooltip still pins a fixed 320px width')
  assert(rule[0].includes('max-width: min(320px'), 'tooltip lost the 320px cap')
})

check('stdio form keeps args/env compact', () => {
  assert(client.includes('.mcpm-textarea.mcpm-code { min-height: 64px'), 'compact args/env rule missing')
  assert(client.includes('.mcpm-textarea.mcpm-jsonEditor { min-height: 168px'), 'JSON editor rule missing')
  const rows = Array.from(client.matchAll(/textArea\(dialogId \+ "-(args|env)", "\w+", (\d+)/g))
  assert(rows.length === 2, 'args/env textareas not found: ' + rows.length)
  for (const match of rows) assert(Number(match[2]) <= 2, match[1] + ' rows too tall: ' + match[2])
})

check('disabled servers keep management actions', () => {
  assert(!client.includes('var locked = isOff'), 'ServerCard still locks disabled servers')
  assert(client.includes('onRefreshTools'), 'refresh-tools action missing')
  assert(client.includes('disabledTestPassed'), 'disabled test outcome missing')
})

check('test failures are not double-prefixed', () => {
  assert(!client.includes('tRef.current("connectFailed", { reason: result.error })'), 'host reason is wrapped a second time')
})

if (failures.length > 0) {
  console.error('\n' + failures.length + ' check(s) failed')
  process.exit(1)
}
console.log('\nall checks passed')
