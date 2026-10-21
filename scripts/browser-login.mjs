// scripts/browser-login.mjs — one-shot loopback login helper for automated UI checks.
// Starts on a random 127.0.0.1 port, sets the dsh browser-session cookie for
// 127.0.0.1 (host-scoped, so port does not matter), then redirects to the GUI.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import crypto from 'node:crypto'

const authority = process.env.GUI_AUTHORITY || '127.0.0.1:3080'
const gui = 'http://' + authority + '/'

function base64url(buf) { return Buffer.from(buf).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '') }

function readSecret() {
  const file = path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), '.credentials.yaml')
  const yaml = fs.readFileSync(file, 'utf8')
  const match = yaml.match(/client-connection\/browser-session:\s*\n(?:\s+[^\n]*\n)*?\s+secret:\s*([A-Za-z0-9_-]+)/)
  if (!match) throw new Error('browser-session secret not found')
  return Buffer.from(match[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
}

const secret = readSecret()
const now = Date.now()
const lifetimeMinutes = Number(process.env.GUI_COOKIE_MINUTES || 10)
const payload = { version: 1, authority: authority, issuedAt: now, expiresAt: now + lifetimeMinutes * 60000 }
const body = base64url(Buffer.from(JSON.stringify(payload), 'utf8'))
const sig = base64url(crypto.createHmac('sha256', secret).update(body).digest())
const cookieName = 'dsh-auth-' + base64url(crypto.createHash('sha256').update(authority).digest())
const cookieValue = 'v1.' + body + '.' + sig

const server = http.createServer(function (request, response) {
  response.writeHead(302, {
    'set-cookie': cookieName + '=' + cookieValue + '; Path=/; HttpOnly; SameSite=Strict',
    location: gui,
    'cache-control': 'no-store'
  })
  response.end('ok')
  setTimeout(function () { process.exit(0) }, 1500)
})
server.listen(0, '127.0.0.1', function () {
  console.log('LOGIN_PORT=' + server.address().port)
})