// scripts/selftest.mjs — pre-install integration test: real MCP connection + fake ctx.tools.
// Usage: $env:MCP_KEY='cm_...'; node scripts/selftest.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const home = path.join(root, '.testhome')
fs.rmSync(home, { recursive: true, force: true })
fs.mkdirSync(home, { recursive: true })
process.env.DSH_HOME = home

const key = process.env.MCP_KEY || ''
if (!key) { console.error('MCP_KEY missing'); process.exit(2) }

const store = await import('../lib/store.js')
const { McpManager } = await import('../lib/manager.js')

store.ensureDir()
const server = store.normalizeServer({
  id: 'srv_test_demo',
  name: 'demo-mcp',
  transport: 'streamable-http',
  url: 'https://mcp.example.com/mcp',
  headers: { 'x-mcp-key': key },
  note: 'selftest',
  enabled: true
}, null)
store.writeState({ version: 1, servers: [server] })

const registered = new Set()
const ctx = {
  tools: {
    register(definition) {
      if (registered.has(definition.name)) throw new Error('duplicate tool name: ' + definition.name)
      registered.add(definition.name)
      return function () { registered.delete(definition.name) }
    }
  }
  , get() { return undefined }
  , effect(fn) { return fn() }
  , inject() {}
  , logger: { info() {}, warn() {}, error() {} }
}

const log = store.createEventLog()
const manager = new McpManager(ctx, log)
manager.statePathForUi = function () { return store.statePath() }
const t0 = Date.now()
await manager.init()
const connectMs = Date.now() - t0

const view = manager.views()[0]
const result = {
  connectMs: connectMs,
  status: view.status,
  error: view.error,
  protocolVersion: view.protocolVersion,
  serverInfo: view.serverInfo,
  toolCount: view.toolCount,
  enabledToolCount: view.enabledToolCount,
  registeredToolCount: view.registeredToolCount,
  registeredActual: registered.size,
  firstTools: view.tools.slice(0, 5).map(function (tool) { return tool.name })
}

const sample = view.tools.find(function (tool) { return tool.name === 'document_search' }) || view.tools[0]
if (!sample) throw new Error('no tools discovered')

// 1) disable one tool -> it must disappear from the registry
await manager.toggleTool(view.id, sample.name, false)
result.afterDisableTool = {
  tool: sample.name,
  registeredCount: registered.size,
  toolInRegistry: Array.from(registered).some(function (name) { return name.endsWith('__' + sample.name) }),
  viewEnabled: manager.views()[0].enabledToolCount
}

// 2) re-enable it
await manager.toggleTool(view.id, sample.name, true)
result.afterEnableTool = {
  registeredCount: registered.size,
  toolInRegistry: Array.from(registered).some(function (name) { return name.endsWith('__' + sample.name) })
}

// 3) bulk disable all -> zero tools
await manager.bulkTools(view.id, 'none')
result.afterDisableAll = { registeredCount: registered.size }

// 4) bulk enable all
await manager.bulkTools(view.id, 'all')
result.afterEnableAll = { registeredCount: registered.size }

// 5) turn the server off -> zero tools, no live registration
await manager.toggleServer(view.id, false)
result.afterServerOff = {
  registeredCount: registered.size,
  status: manager.views()[0].status,
  registeredToolCount: manager.views()[0].registeredToolCount
}

// 6) turn it back on -> tools return
const onView = await manager.toggleServer(view.id, true)
result.afterServerOn = {
  registeredCount: registered.size,
  status: onView.status,
  registeredToolCount: onView.registeredToolCount
}

// 7) connectivity test on a bad endpoint must fail cleanly
const bad = await manager.testConnectivity({ server: { name: 'bad-test', transport: 'streamable-http', url: 'http://127.0.0.1:9/mcp' } })
result.badTest = { ok: bad.ok, error: String(bad.error).slice(0, 120) }

result.registry = JSON.parse(fs.readFileSync(store.registryPath(), 'utf8'))
await manager.dispose()
console.log(JSON.stringify(result, null, 1))
