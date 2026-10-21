// scripts/test-one.mjs — run the plugin's connectivity test for one stored server.
// Usage: node scripts/test-one.mjs <serverId>
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const here = path.dirname(fileURLToPath(import.meta.url))
const store = await import('../lib/store.js')
const { McpManager } = await import('../lib/manager.js')

const id = process.argv[2]
if (!id) { console.error('usage: node scripts/test-one.mjs <serverId>'); process.exit(2) }
const ctx = { tools: { register() { return function () {} } } }
const log = store.createEventLog()
const manager = new McpManager(ctx, log)
manager.state = store.loadState()
const server = manager.state.servers.find(function (item) { return item.id === id })
if (!server) { console.error('server not found: ' + id); process.exit(2) }
const result = await manager.testConnectivity({ server: server })
const shown = {
  id: id,
  name: server.name,
  ok: result.ok,
  latencyMs: result.latencyMs,
  protocolVersion: result.protocolVersion || null,
  serverInfo: result.serverInfo || null,
  toolCount: result.toolCount || 0,
  sampleTools: (result.tools || []).slice(0, 8).map(function (tool) { return tool.name }),
  error: result.error || null
}
console.log(JSON.stringify(shown, null, 1))