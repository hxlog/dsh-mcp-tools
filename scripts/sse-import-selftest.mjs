// scripts/sse-import-selftest.mjs — end-to-end test of the SSE type through the
// same JSON import path the Settings dialog uses.
// Usage: $env:SSE_URL='https://host/general/sse'; $env:SSE_KEY='sk-...'; node scripts/sse-import-selftest.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const home = path.join(root, '.testhome-sse-import')
fs.rmSync(home, { recursive: true, force: true })
fs.mkdirSync(home, { recursive: true })
process.env.DSH_HOME = home

const url = process.env.SSE_URL || ''
const key = process.env.SSE_KEY || ''
if (!url || !key) { console.error('SSE_URL / SSE_KEY missing'); process.exit(2) }

const store = await import('../lib/store.js')
const { McpManager } = await import('../lib/manager.js')

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
store.ensureDir()
store.writeState({ version: 1, servers: [] })
await manager.init()

const config = {
  mcpServers: {
    'sse-demo': {
      url: url,
      type: 'sse',
      headers: { apiKey: key }
    }
  }
}
const imported = await manager.importServers({ json: JSON.stringify(config) })
const view = manager.views()[0] || null
const result = {
  importedServers: imported.imported,
  errors: imported.errors,
  storedTransport: view && view.transport,
  status: view && view.status,
  protocolVersion: view && view.protocolVersion,
  serverInfo: view && view.serverInfo,
  toolCount: view && view.toolCount,
  registeredActual: registered.size,
  error: view && view.error
}
console.log(JSON.stringify(result, null, 2))
await manager.dispose()
if (!view || view.transport !== 'sse' || view.status !== 'connected' || !view.toolCount) process.exit(1)
