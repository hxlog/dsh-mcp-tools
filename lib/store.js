// lib/store.js — state.json persistence, validation, file watcher, logs, registry dump.
// No third-party imports: this module must load before any MCP SDK resolution.
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

export const STATE_VERSION = 1

export function dshHome() {
  return process.env.DSH_HOME && process.env.DSH_HOME.trim() ? process.env.DSH_HOME.trim() : path.join(os.homedir(), '.dsh')
}

export function managerDir() {
  return path.join(dshHome(), 'dsh-mcp-tools')
}

// One-time state migration from earlier package names
// (~/.dsh/dsh-mcp-manager, ~/.dsh/dsh-mcp-workbench). Copy, never move, so a
// rollback to an older local build still finds its data. When several legacy
// directories exist, the most recently written state wins.
const LEGACY_DIRS = ['dsh-mcp-workbench', 'dsh-mcp-manager'];
function migrateLegacyDir() {
  try {
    const next = managerDir()
    if (fs.existsSync(next)) return
    const candidates = LEGACY_DIRS
      .map(function (name) { return path.join(dshHome(), name) })
      .filter(function (dir) { return fs.existsSync(path.join(dir, 'state.json')) })
      .sort(function (a, b) {
        return fs.statSync(path.join(b, 'state.json')).mtimeMs - fs.statSync(path.join(a, 'state.json')).mtimeMs
      })
    if (!candidates.length) return
    fs.mkdirSync(next, { recursive: true })
    for (const name of ['state.json', 'logs.jsonl', 'registry.json']) {
      const from = path.join(candidates[0], name)
      if (fs.existsSync(from)) fs.copyFileSync(from, path.join(next, name))
    }
  } catch {
    // migration is best-effort; a fresh state is created below when needed
  }
}

export function statePath() { return path.join(managerDir(), 'state.json') }
export function registryPath() { return path.join(managerDir(), 'registry.json') }
export function logsPath() { return path.join(managerDir(), 'logs.jsonl') }

export function ensureDir() {
  migrateLegacyDir()
  fs.mkdirSync(managerDir(), { recursive: true })
}

export function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

export function newId() {
  return 'srv_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function defaultState() {
  return { version: STATE_VERSION, servers: [] }
}

function asString(value) { return typeof value === 'string' ? value : '' }
function asBool(value, fallback) { return typeof value === 'boolean' ? value : fallback }

function normalizeHeaders(raw) {
  const out = {}
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'string' && key.trim()) out[key.trim()] = value
    }
  }
  return out
}

function normalizeArgs(raw) {
  if (Array.isArray(raw)) return raw.filter(function (value) { return typeof value === 'string' })
  if (typeof raw === 'string') return raw.trim() ? raw.trim().split(/\s+/) : []
  return []
}

function normalizeEnv(raw) {
  const out = {}
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'string' && key.trim()) out[key.trim()] = value
    }
  }
  return out
}

function normalizeToolsMap(raw) {
  const out = {}
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'boolean' && key) out[key] = value
    }
  }
  return out
}

function normalizeKnownTools(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(function (tool) { return tool && typeof tool.name === 'string' && tool.name })
    .map(function (tool) {
      return {
        name: tool.name,
        description: typeof tool.description === 'string' ? tool.description : ''
      }
    })
}

export function normalizeServer(input, existing) {
  const base = existing || {}
  const transportRaw = asString(input && input.transport) || base.transport || 'streamable-http'
  const transport = transportRaw === 'stdio' ? 'stdio' : 'streamable-http'
  const server = {
    id: asString(input && input.id) || base.id || newId(),
    name: asString(input && input.name) || base.name || '',
    transport: transport,
    url: asString(input && input.url) || base.url || '',
    headers: input && input.headers !== undefined ? normalizeHeaders(input.headers) : normalizeHeaders(base.headers),
    command: asString(input && input.command) || base.command || '',
    args: input && input.args !== undefined ? normalizeArgs(input.args) : normalizeArgs(base.args),
    env: input && input.env !== undefined ? normalizeEnv(input.env) : normalizeEnv(base.env),
    cwd: asString(input && input.cwd) || base.cwd || '',
    note: asString(input && input.note) || base.note || '',
    enabled: asBool(input && input.enabled, asBool(base.enabled, true)),
    toolCallTimeoutMs: Number.isFinite(Number(input && input.toolCallTimeoutMs))
      ? Math.min(600000, Math.max(1000, Math.trunc(Number(input.toolCallTimeoutMs))))
      : (Number.isFinite(Number(base.toolCallTimeoutMs)) ? Number(base.toolCallTimeoutMs) : 60000),
    tools: input && input.tools !== undefined ? normalizeToolsMap(input.tools) : normalizeToolsMap(base.tools),
    knownTools: input && input.knownTools !== undefined ? normalizeKnownTools(input.knownTools) : normalizeKnownTools(base.knownTools),
    lastTest: base.lastTest || null,
    createdAt: Number(base.createdAt) || Date.now(),
    updatedAt: Date.now()
  }
  return server
}

export const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/

export function validateServer(server, allServers) {
  if (!SERVER_NAME_PATTERN.test(server.name)) {
    throw new Error('名称必须为 1-32 位字母、数字、下划线或连字符（它会成为工具名的命名空间）')
  }
  const duplicated = (allServers || []).some(function (other) {
    return other.id !== server.id && other.name === server.name
  })
  if (duplicated) throw new Error('已有同名服务器：' + server.name)
  if (server.transport === 'streamable-http') {
    let url = null
    try { url = new URL(server.url) } catch (error) { url = null }
    if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
      throw new Error('URL 必须以 http:// 或 https:// 开头')
    }
  } else if (server.transport === 'stdio') {
    if (!server.command || !server.command.trim()) throw new Error('stdio 传输需要填写启动命令（command）')
  } else {
    throw new Error('不支持的传输方式：' + server.transport)
  }
  if (server.note && server.note.length > 500) throw new Error('备注不能超过 500 字')
  return server
}

export function loadState() {
  ensureDir()
  const file = statePath()
  try {
    const text = fs.readFileSync(file, 'utf8')
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.servers)) return defaultState()
    return {
      version: Number(parsed.version) || STATE_VERSION,
      servers: parsed.servers.map(function (server) { return normalizeServer(server, server) })
    }
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      try { fs.renameSync(file, file + '.broken-' + Date.now()) } catch (ignored) {}
    }
    return defaultState()
  }
}

export function writeState(state) {
  ensureDir()
  const text = JSON.stringify(state, null, 2) + '\n'
  const file = statePath()
  const temp = file + '.tmp-' + process.pid
  fs.writeFileSync(temp, text, 'utf8')
  fs.renameSync(temp, file)
  return hashText(text)
}

export function writeRegistry(snapshot) {
  ensureDir()
  const text = JSON.stringify(snapshot, null, 2) + '\n'
  const file = registryPath()
  const temp = file + '.tmp-' + process.pid
  try {
    fs.writeFileSync(temp, text, 'utf8')
    fs.renameSync(temp, file)
  } catch (error) {
    // Registry dump is diagnostics only: never let a disk problem break tool registration.
  }
}

export function watchStateFile(onChange) {
  ensureDir()
  const file = statePath()
  let lastHash = null
  try { lastHash = hashText(fs.readFileSync(file, 'utf8')) } catch (error) {}
  let timer = null
  let closed = false
  const watcher = fs.watch(managerDir(), { persistent: false }, function (eventType, filename) {
    if (closed) return
    if (filename && filename !== 'state.json') return
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () {
      timer = null
      let text = null
      try { text = fs.readFileSync(file, 'utf8') } catch (error) { return }
      const hash = hashText(text)
      if (hash === lastHash) return
      lastHash = hash
      try {
        const parsed = JSON.parse(text)
        if (parsed && Array.isArray(parsed.servers)) onChange(parsed)
      } catch (error) {}
    }, 250)
    if (timer.unref) timer.unref()
  })
  watcher.on('error', function () {})
  if (watcher.unref) watcher.unref()
  return {
    markWritten: function (hash) { lastHash = hash },
    close: function () {
      closed = true
      if (timer) clearTimeout(timer)
      try { watcher.close() } catch (error) {}
    }
  }
}

export function createEventLog() {
  const ring = []
  let fileWarned = false
  function append(event) {
    const entry = {
      at: Number(event.at) || Date.now(),
      level: event.level === 'warn' || event.level === 'error' ? event.level : 'info',
      server: event.server || null,
      message: String(event.message || '')
    }
    ring.push(entry)
    if (ring.length > 300) ring.shift()
    try {
      ensureDir()
      fs.appendFileSync(logsPath(), JSON.stringify(entry) + '\n', 'utf8')
    } catch (error) {
      if (!fileWarned) { fileWarned = true }
    }
    return entry
  }
  return {
    push: function (level, server, message) { return append({ level: level, server: server, message: message }) },
    list: function (limit) {
      const size = Math.max(1, Math.min(300, Number(limit) || 100))
      return ring.slice(Math.max(0, ring.length - size))
    },
    all: function () { return ring.slice() }
  }
}
