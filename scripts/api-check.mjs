// scripts/api-check.mjs — end-to-end check of the plugin's HTTP API against the live
// dsh web process on 127.0.0.1:3080, using the persisted browser-session signing secret.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const origin = 'http://127.0.0.1:3080'
const authority = '127.0.0.1:3080'
const base = '/mcp-manager/api'

function base64url(buf) { return Buffer.from(buf).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '') }

function readSecret() {
  const file = path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), '.credentials.yaml')
  const yaml = fs.readFileSync(file, 'utf8')
  const match = yaml.match(/client-connection\/browser-session:\s*\n(?:\s+[^\n]*\n)*?\s+secret:\s*([A-Za-z0-9_-]+)/)
  if (!match) throw new Error('browser-session secret not found in .credentials.yaml')
  return Buffer.from(match[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
}

const secret = readSecret()
const now = Date.now()
const payload = { version: 1, authority: authority, issuedAt: now, expiresAt: now + 86400000 }
const body = base64url(Buffer.from(JSON.stringify(payload), 'utf8'))
const sig = base64url(crypto.createHmac('sha256', secret).update(body).digest())
const cookieName = 'dsh-auth-' + base64url(crypto.createHash('sha256').update(authority).digest())
const cookie = cookieName + '=v1.' + body + '.' + sig

async function call(method, route, body, withCookie) {
  const headers = { 'content-type': 'application/json' }
  if (withCookie !== false) headers.cookie = cookie
  const response = await fetch(origin + base + route, {
    method: method,
    headers: headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  let json = null
  try { json = await response.json() } catch (error) { json = null }
  return { status: response.status, json: json }
}

const report = {}
const unauth = await call('GET', '/state', undefined, false)
report.unauthStatus = unauth.status

const state0 = await call('GET', '/state')
report.stateStatus = state0.status
report.servers = (state0.json && state0.json.servers || []).map(function (server) {
  return { id: server.id, name: server.name, enabled: server.enabled, status: server.status, tools: server.toolCount, enabledTools: server.enabledToolCount, registered: server.registeredToolCount, note: server.note }
})
report.registeredTotal = state0.json && state0.json.registeredTotal

const reg0 = await call('GET', '/registered')
report.registeredSnapshot = { status: reg0.status, total: reg0.json && reg0.json.total }

const testPharm = await call('POST', '/servers/test', { id: 'srv_pharmcube' })
report.testPharmcube = testPharm.json && { ok: testPharm.json.ok, toolCount: testPharm.json.toolCount, protocol: testPharm.json.protocolVersion, latencyMs: testPharm.json.latencyMs }

const off = await call('POST', '/tools/toggle', { id: 'srv_comein', tool: 'document_search', enabled: false })
report.disableTool = { status: off.status, enabledTools: off.json && off.json.server && off.json.server.enabledToolCount, registered: off.json && off.json.server && off.json.server.registeredToolCount }
const reg1 = await call('GET', '/registered')
report.disableToolAbsent = reg1.json && !reg1.json.tools.some(function (name) { return name === 'mcp__comein-mcp-all__document_search' })

const reOn = await call('POST', '/tools/toggle', { id: 'srv_comein', tool: 'document_search', enabled: true })
report.reenableTool = { registered: reOn.json && reOn.json.server && reOn.json.server.registeredToolCount }

const none = await call('POST', '/tools/bulk', { id: 'srv_comein', action: 'none' })
report.bulkNone = { registered: none.json && none.json.server && none.json.server.registeredToolCount }
const all = await call('POST', '/tools/bulk', { id: 'srv_comein', action: 'all' })
report.bulkAll = { registered: all.json && all.json.server && all.json.server.registeredToolCount }

const pharmOn = await call('POST', '/servers/toggle', { id: 'srv_pharmcube', enabled: true })
report.pharmcubeOn = { status: pharmOn.status, state: pharmOn.json && pharmOn.json.server && pharmOn.json.server.status, tools: pharmOn.json && pharmOn.json.server && pharmOn.json.server.toolCount, registered: pharmOn.json && pharmOn.json.server && pharmOn.json.server.registeredToolCount }
const reg2 = await call('GET', '/registered')
report.registeredWithPharmcube = reg2.json && reg2.json.total
const pharmOff = await call('POST', '/servers/toggle', { id: 'srv_pharmcube', enabled: false })
report.pharmcubeOff = { status: pharmOff.status, state: pharmOff.json && pharmOff.json.server && pharmOff.json.server.status, registered: pharmOff.json && pharmOff.json.server && pharmOff.json.server.registeredToolCount }
const reg3 = await call('GET', '/registered')
report.registeredAfterOff = reg3.json && reg3.json.total

const imported = await call('POST', '/import', { json: JSON.stringify({ mcpServers: { 'comein-mcp-all': { transport: 'streamable-http', url: 'https://mcp-server-global.comein.cn/mcp-servers/mcp-server-brm', headers: { 'x-mcp-key': 'cm_your_key_here' } } } }) })
report.import = { status: imported.status, updated: imported.json && imported.json.updated, imported: imported.json && imported.json.imported, errors: imported.json && imported.json.errors }

const saved = await call('POST', '/servers/save', { server: { id: 'srv_comein', name: 'comein-mcp-all', enabled: true, note: '公司内部研报 / 文档 / 行情 MCP（95 个工具）' } })
report.restoreNote = { status: saved.status, note: saved.json && saved.json.server && saved.json.server.note, tools: saved.json && saved.json.server && saved.json.server.toolCount }

const logs = await call('GET', '/logs?limit=5')
report.lastEvents = (logs.json && logs.json.events || []).map(function (event) { return event.level + ' ' + (event.server || '-') + ' ' + event.message })

const finalState = await call('GET', '/state')
report.final = { registeredTotal: finalState.json && finalState.json.registeredTotal, servers: (finalState.json && finalState.json.servers || []).map(function (s) { return s.name + ':' + s.status + '/' + s.registeredToolCount }) }

console.log(JSON.stringify(report, null, 1))
