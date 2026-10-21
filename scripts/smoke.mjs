// scripts/smoke.mjs — offline checks that need no MCP server or DSH runtime.
// Usage: npm test
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
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
  execFileSync(process.execPath, ['--check', path.join(root, 'client/client.js')], { stdio: 'pipe' })
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
check('README screenshots exist', () => {
  const readme = read('README.md')
  const refs = Array.from(readme.matchAll(/docs\/screenshots\/[^)\s]+\.png/g)).map((m) => m[0])
  assert(refs.length >= 5, 'expected at least 5 screenshots in README')
  for (const ref of refs) assert(fs.existsSync(path.join(root, ref)), 'missing ' + ref)
})
check('npm files whitelist contains runtime paths', () => {
  for (const entry of ['lib', 'client/client.js', 'locale', 'cordis.patch.yml', 'icon.svg', 'README.md', 'LICENSE']) {
    assert(pkg.files.includes(entry), 'files missing ' + entry)
  }
})

if (failures.length > 0) {
  console.error('\n' + failures.length + ' check(s) failed')
  process.exit(1)
}
console.log('\nall checks passed')
