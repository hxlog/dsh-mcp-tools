// scripts/manager-test.mjs — offline integration test for the host manager
// against a fake stdio MCP server. Covers the 1.0.3 semantics: a disabled
// server can be tested and refreshed, its per-tool switches persist without
// registering anything, and enabling it registers only the enabled tools.
//
// The MCP SDK is resolved from a local DSH profile (no dependencies are added
// to this package). On a machine without a DSH install the script skips with a
// clear message so CI stays green.
//
// Usage: npm run test:manager
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const fixture = path.join(here, 'fixtures', 'fake-mcp-server.mjs')

const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-mcp-tools-test-'))
process.env.DSH_HOME = home

const failures = []
function check(name, fn) {
  try {
    fn()
    console.log('ok   ' + name)
  } catch (error) {
    failures.push(name + ': ' + error.message)
    console.log('FAIL ' + name + ': ' + error.message)
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}
function eq(actual, expected, label) {
  if (actual !== expected) throw new Error(label + ': expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual))
}

const mod = (rel) => pathToFileURL(path.join(root, rel)).href
const store = await import(mod('lib/store.js'))
const { McpManager } = await import(mod('lib/manager.js'))
const { loadSdk } = await import(mod('lib/profile-modules.js'))

let sdkError = null
try {
  await loadSdk()
} catch (error) {
  sdkError = error
}
if (sdkError) {
  console.log('SKIP (no MCP SDK resolvable from a local DSH profile: ' + String((sdkError && sdkError.message) || sdkError) + ')')
  fs.rmSync(home, { recursive: true, force: true })
  process.exit(0)
}

function readDiskState() {
  return JSON.parse(fs.readFileSync(store.statePath(), 'utf8'))
}

const registered = new Map()
const ctx = {
  tools: {
    register(definition) {
      registered.set(definition.name, definition)
      return function () {
        registered.delete(definition.name)
      }
    }
  }
}

let manager = null
try {
  store.ensureDir()
  const fake = store.normalizeServer({
    id: 'srv_fake',
    name: 'fake-mcp',
    transport: 'stdio',
    command: process.execPath,
    args: [fixture],
    enabled: false
  }, null)
  store.writeState({ version: 1, servers: [fake] })

  manager = new McpManager(ctx, store.createEventLog())
  await manager.init()

  const initial = manager.views()[0]
  check('disabled server starts idle with no tools registered', () => {
    eq(initial.status, 'disabled', 'status')
    eq(initial.toolCount, 0, 'toolCount')
    eq(initial.registeredToolCount, 0, 'registeredToolCount')
    eq(registered.size, 0, 'ctx registered')
  })

  const test = await manager.testConnectivity({ id: 'srv_fake' })
  check('test connection works while the server is disabled', () => {
    eq(test.ok, true, 'ok')
    eq(test.toolCount, 3, 'toolCount')
    assert(Array.isArray(test.tools) && test.tools.length === 3, 'tools payload')
  })
  check('successful test caches discovered tools without registering them', () => {
    const disk = readDiskState()
    eq(disk.servers[0].knownTools.length, 3, 'disk knownTools')
    const view = manager.views()[0]
    eq(view.status, 'disabled', 'status')
    eq(view.toolCount, 3, 'visible toolCount')
    eq(view.registeredToolCount, 0, 'registeredToolCount')
    eq(registered.size, 0, 'ctx registered')
    assert(view.tools.every((tool) => tool.enabled === true), 'tools default enabled')
  })

  const toggled = await manager.toggleTool('srv_fake', 'echo', false)
  check('per-tool switch persists while disabled and registers nothing', () => {
    eq(toggled.tools.find((tool) => tool.name === 'echo').enabled, false, 'view echo.enabled')
    eq(readDiskState().servers[0].tools.echo, false, 'disk echo flag')
    eq(toggled.registeredToolCount, 0, 'registeredToolCount')
    eq(registered.size, 0, 'ctx registered')
  })

  const refreshed = await manager.refreshServer('srv_fake')
  check('refresh works while disabled (temporary connection, no registration)', () => {
    eq(refreshed.status, 'disabled', 'status')
    eq(refreshed.toolCount, 3, 'toolCount')
    eq(refreshed.registeredToolCount, 0, 'registeredToolCount')
    eq(registered.size, 0, 'ctx registered')
  })

  const none = await manager.bulkTools('srv_fake', 'none')
  const inverted = await manager.bulkTools('srv_fake', 'invert')
  check('bulk switches work while disabled', () => {
    assert(none.tools.every((tool) => tool.enabled === false), 'none disables every tool')
    assert(inverted.tools.every((tool) => tool.enabled === true), 'invert re-enables every tool')
    eq(registered.size, 0, 'ctx registered')
  })

  await manager.toggleTool('srv_fake', 'echo', false)
  const enabled = await manager.toggleServer('srv_fake', true)
  check('enabling registers only the enabled tools', () => {
    eq(enabled.status, 'connected', 'status')
    eq(enabled.registeredToolCount, 2, 'registeredToolCount')
    eq(registered.size, 2, 'ctx registered')
    assert(registered.has('mcp__fake-mcp__upper'), 'upper registered')
    assert(registered.has('mcp__fake-mcp__reverse'), 'reverse registered')
    assert(!registered.has('mcp__fake-mcp__echo'), 'echo stays unregistered')
  })

  const reEnabled = await manager.toggleTool('srv_fake', 'echo', true)
  check('per-tool switch still registers a live tool', () => {
    eq(reEnabled.registeredToolCount, 3, 'registeredToolCount')
    assert(registered.has('mcp__fake-mcp__echo'), 'echo registered')
  })

  const disabledAgain = await manager.toggleServer('srv_fake', false)
  check('disabling unregisters every tool again', () => {
    eq(disabledAgain.status, 'disabled', 'status')
    eq(disabledAgain.registeredToolCount, 0, 'registeredToolCount')
    eq(registered.size, 0, 'ctx registered')
  })

  const bad = store.normalizeServer({
    id: 'srv_bad',
    name: 'bad-mcp',
    transport: 'stdio',
    command: 'dsh-mcp-tools-not-a-real-binary',
    enabled: false
  }, null)
  manager.state.servers.push(bad)
  manager.persist()

  const badTest = await manager.testConnectivity({ id: 'srv_bad' })
  check('a failed test on a disabled server reports instead of throwing', () => {
    eq(badTest.ok, false, 'ok')
    assert(typeof badTest.error === 'string' && badTest.error.startsWith('连接失败：'), 'error text: ' + badTest.error)
  })

  let refreshError = null
  try {
    await manager.refreshServer('srv_bad')
  } catch (error) {
    refreshError = error
  }
  check('a failed refresh rejects with a readable reason', () => {
    assert(refreshError, 'expected refresh to reject')
    assert(String(refreshError.message).startsWith('刷新失败：'), 'message: ' + String(refreshError && refreshError.message))
  })
} finally {
  if (manager) {
    try { await manager.dispose() } catch (error) {}
  }
  try { fs.rmSync(home, { recursive: true, force: true }) } catch (error) {}
}

if (failures.length > 0) {
  console.error('\n' + failures.length + ' manager check(s) failed')
  process.exit(1)
}
console.log('\nall manager checks passed')
