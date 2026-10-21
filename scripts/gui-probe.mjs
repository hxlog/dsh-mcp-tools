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

const targets = ['/', '/plugins/dsh-context/client.js', '/plugins/dsh-mcp-workbench/client.js', '/api/plugins', '/plugins', '/manifest.json', '/api/manifest']
for (const route of targets) {
  try {
    const response = await fetch(origin + route, { headers: { cookie: cookie } })
    const text = await response.text()
    console.log(route, '->', response.status, 'len', text.length)
    if (route === '/') {
      const scripts = text.match(/<script[^>]*src="[^"]+"[^>]*>/g) || []
      console.log('  scripts:', scripts.slice(0, 12).join(' | '))
      const boot = text.indexOf('__DSH_BOOT__')
      console.log('  bootIndex:', boot, text.slice(Math.max(0, boot - 100), boot + 600).replace(/\s+/g, ' '))
    }
    if (route === '/api/plugins' || route === '/plugins') console.log('  body:', text.slice(0, 600))
  } catch (error) { console.log(route, 'ERR', String(error)) }
}