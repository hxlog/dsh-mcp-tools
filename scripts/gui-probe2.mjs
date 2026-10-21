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

const response = await fetch(origin + '/', { headers: { cookie: cookie } })
const text = await response.text()
const start = text.indexOf('__DSH_BOOT__')
const end = text.indexOf('</script>', start)
const bootSource = text.slice(start, end)
const boot = JSON.parse(bootSource.slice(bootSource.indexOf('=')+1).trim())
console.log('entries:', boot.entries.length)
const ids = boot.entries.map(function (entry) { return entry.id })
console.log('mcp-manager entry:', JSON.stringify(boot.entries.filter(function (entry) { return entry.id === 'dsh-mcp-workbench' })))
console.log('third-party sample:', JSON.stringify(ids.filter(function (id) { return !id.startsWith('@deepseek-ai/') })))
const entry = boot.entries.find(function (item) { return item.id === 'dsh-mcp-workbench' })
if (entry) {
  const asset = await fetch(origin + '/' + entry.url, { headers: { cookie: cookie } })
  const body = await asset.text()
  console.log('asset status:', asset.status, 'len:', body.length)
  console.log('asset head:', body.slice(0, 160).replace(/\s+/g, ' '))
}