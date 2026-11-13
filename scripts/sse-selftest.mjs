// scripts/sse-selftest.mjs — pre-install integration test for the SSE transport.
// Usage: $env:SSE_URL='https://host/general/sse'; $env:SSE_KEY='sk-...'; node scripts/sse-selftest.mjs
// The key is read from the environment and never written to disk by this script.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const home = path.join(root, '.testhome-sse')
fs.rmSync(home, { recursive: true, force: true })
fs.mkdirSync(home, { recursive: true })
process.env.DSH_HOME = home

const url = process.env.SSE_URL || ''
const key = process.env.SSE_KEY || ''
if (!url) { console.error('SSE_URL missing'); process.exit(2) }
if (!key) { console.error('SSE_KEY missing'); process.exit(2) }

const store = await import('../lib/store.js')
const { McpManager } = await import('../lib/manager.js')

store.ensureDir()
const server = store.normalizeServer({
  id: 'srv_test_sse',
  name: 'sse-demo',
  transport: 'sse',
  url: url,
  headers: { apiKey: key },
  note: 'sse selftest',
  enabled: true
}, null)
if (server.transport !== 'sse') throw new Error('normalizeServer dropped the sse transport: ' + server.transport)
store.writeState({ version: 1, servers: [server] })

const registered = new Set()
const ctx = {
  tools: {
    register(definition) {
      if (registered.has(definition.name)) throw new Error('duplicate tool name: ' + definition.name)
      registered.add(definition.name)
      return function () { registered.delete(definition.name) }
    }
  },
  get() { return undefined },
  effect(fn) { return fn() },
  inject() {},
  logger: { info() {}, warn() {}, error() {} }
}

const log = store.createEventLog()
const manager = new McpManager(ctx, log)
manager.statePathForUi = function () { return store.statePath() }
const t0 = Date.now()
await manager.init()
const connectMs = Date.now() - t0

const view = manager.views()[0]
const result = {
  transport: view.transport,
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
console.log(JSON.stringify(result, null, 2))
await manager.dispose()
if (view.status !== 'connected') process.exit(1)
