// lib/manager.js — owns the MCP connections and the tool registry.
// Per-tool switch semantics: a disabled tool is NEVER registered on ctx.tools,
// so the model cannot see it and cannot call it. A disabled server has no live
// connection and no registered tools at all.
import * as store from './store.js'
import { publicToolName } from './toolname.js'
import { loadSdk, loadToolAdapter } from './profile-modules.js'

const CLIENT_INFO = { name: 'dsh-mcp-workbench', version: '0.1.0' }
const CONNECT_TIMEOUT_MS = 30000
const LIST_TIMEOUT_MS = 30000
const CLOSE_TIMEOUT_MS = 8000
const RETRY_DELAYS_MS = [5000, 10000, 20000, 40000, 60000]

export function errorText(error) {
  if (!error) return '未知错误'
  if (typeof error === 'string') return error
  if (error.name === 'AbortError') return '请求被取消'
  return String(error.message || error)
}

function withTimeout(promise, ms, label) {
  let timer = null
  const timeout = new Promise(function (resolve, reject) {
    timer = setTimeout(function () { reject(new Error(label + '超时（' + ms + ' ms）')) }, ms)
    if (timer.unref) timer.unref()
  })
  return Promise.race([promise, timeout]).finally(function () { if (timer) clearTimeout(timer) })
}

function endpointLabel(server) {
  if (server.transport === 'stdio') return server.command || '(未设置命令)'
  try {
    const url = new URL(server.url)
    return url.host + url.pathname
  } catch (error) {
    return server.url || '(未设置 URL)'
  }
}

function contentText(content) {
  if (!Array.isArray(content)) return ''
  const parts = []
  for (const block of content) {
    if (!block || typeof block !== 'object') continue
    if (block.type === 'text' && typeof block.text === 'string') parts.push(block.text)
    else if (block.type === 'resource_link' && typeof block.uri === 'string') parts.push(block.uri)
    else if (block.type === 'image') parts.push('[image ' + (block.mimeType || '') + ']')
    else if (block.type === 'audio') parts.push('[audio]')
    else if (block.type === 'resource') parts.push('[resource]')
  }
  return parts.join('\n')
}

function toolInputSchema(tool) {
  if (tool && tool.inputSchema && typeof tool.inputSchema === 'object') return tool.inputSchema
  return { type: 'object', properties: {}, additionalProperties: true }
}

function fallbackDefinition(rt, tool, publicName) {
  const rawName = tool.name
  const description = typeof tool.description === 'string' && tool.description ? tool.description : 'MCP 工具 ' + rawName
  return {
    name: publicName,
    description: description,
    parameters: toolInputSchema(tool),
    output: {
      schema: {
        type: 'object',
        properties: { content: { type: 'array', items: {} } },
        required: ['content'],
        additionalProperties: false
      },
      render: function (args, value) {
        return [{ type: 'text', text: contentText(value && value.content) || '(工具没有返回文本内容)' }]
      }
    },
    execute: async function (args, exec) {
      if (!rt.client) throw new Error('MCP 服务器 ' + rt.server.name + ' 未连接')
      const result = await rt.client.callTool(
        { name: rawName, arguments: args && typeof args === 'object' ? args : {} },
        { signal: exec && exec.signal, timeout: rt.server.toolCallTimeoutMs }
      )
      const content = Array.isArray(result.content) ? result.content : []
      if (result.isError === true) throw new Error(contentText(content) || ('工具 ' + rawName + ' 返回错误'))
      return { content: content }
    }
  }
}

export class McpManager {
  constructor(ctx, log) {
    this.ctx = ctx
    this.log = log
    this.state = store.defaultState()
    this.runtimes = new Map()
    this.watcher = null
    this.queue = Promise.resolve()
    this.adapter = null
    this.disposed = false
  }

  enqueue(task) {
    const run = this.queue.then(task, task)
    this.queue = run.then(function () { return undefined }, function () { return undefined })
    return run
  }

  emit(level, server, message) {
    try { this.log.push(level, server, message) } catch (error) {}
  }

  configKey(server) {
    return JSON.stringify({
      transport: server.transport,
      url: server.url,
      headers: server.headers,
      command: server.command,
      args: server.args,
      env: server.env,
      cwd: server.cwd,
      toolCallTimeoutMs: server.toolCallTimeoutMs
    })
  }

  persist() {
    const hash = store.writeState(this.state)
    if (this.watcher) this.watcher.markWritten(hash)
  }

  async init() {
    this.state = store.loadState()
    this.emit('info', null, 'MCP 管理器已启动 · ' + this.state.servers.length + ' 个服务器配置')
    const self = this
    this.watcher = store.watchStateFile(function () {
      self.enqueue(async function () {
        if (self.disposed) return
        self.state = store.loadState()
        self.emit('info', null, '检测到 state.json 外部修改，正在重新加载')
        await self.reconcileAll('file-watch')
      }).catch(function (error) { self.emit('error', null, '重新加载失败：' + errorText(error)) })
    })
    this.adapter = await loadToolAdapter()
    await this.reconcileAll('startup')
  }

  async reconcileAll(reason) {
    const seen = new Set()
    for (const server of this.state.servers) {
      seen.add(server.id)
      if (!server.enabled) {
        await this.disposeRuntime(server.id)
        continue
      }
      try {
        await this.ensureRuntime(server, reason)
      } catch (error) {
        this.emit('error', server.name, '连接失败：' + errorText(error))
      }
    }
    for (const id of Array.from(this.runtimes.keys())) {
      if (!seen.has(id)) await this.disposeRuntime(id)
    }
    this.persist()
    this.writeRegistry()
  }

  ensureRuntime(server, reason) {
    const self = this
    const key = this.configKey(server)
    let rt = this.runtimes.get(server.id)
    if (rt && !rt.disposed && rt.configKey === key) {
      // Rebind to the *current* state object: an external state.json reload
      // replaces the server objects, and tool toggles must act on the live copy.
      rt.server = server
      if (rt.status === 'connected') {
        return (async function () { await self.syncRuntimeTools(rt); return rt })()
      }
      if (rt.status === 'connecting' && rt.connecting) return rt.connecting.then(function () { return rt })
    }
    return (async function () {
      if (rt) await self.disposeRuntime(server.id)
      rt = self.createRuntime(server, key)
      self.runtimes.set(server.id, rt)
      rt.connecting = self.connectRuntime(rt)
      try { await rt.connecting } finally { rt.connecting = null }
      return rt
    })()
  }

  createRuntime(server, configKey) {
    return {
      server: server,
      configKey: configKey,
      status: 'connecting',
      error: null,
      client: null,
      transport: null,
      tools: [],
      disposers: new Map(),
      protocolVersion: null,
      serverInfo: null,
      latencyMs: null,
      connectedAt: null,
      retryTimer: null,
      retryCount: 0,
      disposed: false,
      connecting: null
    }
  }

  buildTransport(sdk, server) {
    if (server.transport === 'stdio') {
      if (!sdk.StdioClientTransport) throw new Error('stdio 传输不可用（SDK 未提供 StdioClientTransport）')
      const env = Object.assign({}, process.env, server.env || {})
      return new sdk.StdioClientTransport({
        command: server.command,
        args: server.args || [],
        env: env,
        cwd: server.cwd || undefined
      })
    }
    return new sdk.StreamableHTTPClientTransport(new URL(server.url), {
      requestInit: { headers: server.headers || {} }
    })
  }

  async connectRuntime(rt) {
    const server = rt.server
    const self = this
    rt.status = 'connecting'
    rt.error = null
    this.emit('info', server.name, '正在连接 ' + endpointLabel(server))
    const started = Date.now()
    try {
      const sdk = await loadSdk()
      const client = new sdk.Client(CLIENT_INFO, { capabilities: {} })
      const transport = this.buildTransport(sdk, server)
      rt.client = client
      rt.transport = transport
      try {
        client.onclose = function () { self.handleDisconnect(rt, '连接被远端关闭') }
      } catch (error) {}
      await withTimeout(client.connect(transport), CONNECT_TIMEOUT_MS, '连接')
      rt.latencyMs = Date.now() - started
      try { rt.protocolVersion = (client.getNegotiatedProtocolVersion && client.getNegotiatedProtocolVersion()) || transport.protocolVersion || null } catch (error) { rt.protocolVersion = null }
      try { rt.serverInfo = client.getServerVersion ? client.getServerVersion() : null } catch (error) { rt.serverInfo = null }
      const listed = await withTimeout(client.listTools(), LIST_TIMEOUT_MS, '工具发现')
      rt.tools = listed && Array.isArray(listed.tools) ? listed.tools : []
      rt.status = 'connected'
      rt.connectedAt = Date.now()
      rt.error = null
      rt.retryCount = 0
      this.updateKnownTools(server, rt.tools)
      this.persist()
      this.emit('info', server.name, '已连接 · ' + rt.tools.length + ' 个工具' + (rt.protocolVersion ? ' · 协议 ' + rt.protocolVersion : ''))
      await this.syncRuntimeTools(rt)
    } catch (error) {
      rt.status = 'error'
      rt.error = '连接失败：' + errorText(error)
      this.emit('error', server.name, rt.error)
      await this.safeClose(rt)
      this.scheduleRetry(rt)
    }
    this.writeRegistry()
    return rt
  }

  updateKnownTools(server, tools) {
    const seen = new Set()
    const known = []
    for (const tool of tools) {
      if (!tool || typeof tool.name !== 'string' || !tool.name) continue
      if (seen.has(tool.name)) continue
      seen.add(tool.name)
      known.push({
        name: tool.name,
        description: typeof tool.description === 'string' ? tool.description : ''
      })
    }
    server.knownTools = known
  }

  async makeDefinition(rt, tool, publicName) {
    if (this.adapter) {
      try {
        const rtRef = rt
        return this.adapter(this.ctx, {
          name: publicName,
          rawName: tool.name,
          description: typeof tool.description === 'string' ? tool.description : ('MCP 工具 ' + tool.name),
          inputSchema: toolInputSchema(tool),
          outputSchema: tool.outputSchema,
          taskRequired: !!(tool.execution && tool.execution.taskSupport === 'required'),
          call: function (args, exec) {
            return rtRef.client.callTool(
              { name: tool.name, arguments: args && typeof args === 'object' ? args : {} },
              { signal: exec && exec.signal, timeout: rtRef.server.toolCallTimeoutMs }
            )
          }
        })
      } catch (error) {
        this.emit('warn', rt.server.name, '官方工具适配器不可用，改用内置定义：' + errorText(error))
      }
    }
    return fallbackDefinition(rt, tool, publicName)
  }

  async syncRuntimeTools(rt) {
    if (!rt || rt.disposed || rt.status !== 'connected' || !rt.client) return
    const server = this.state.servers.find(function (item) { return item.id === rt.server.id }) || rt.server
    rt.server = server
    const enabled = new Set()
    for (const tool of rt.tools) {
      if (server.tools && server.tools[tool.name] === false) continue
      enabled.add(tool.name)
    }
    for (const pair of Array.from(rt.disposers.entries())) {
      const publicName = pair[0]
      const entry = pair[1]
      if (enabled.has(entry.rawName)) continue
      this.unregisterOne(rt, publicName, entry)
    }
    for (const tool of rt.tools) {
      if (!enabled.has(tool.name)) continue
      const publicName = publicToolName(server.name, tool.name)
      if (rt.disposers.has(publicName)) continue
      try {
        const definition = await this.makeDefinition(rt, tool, publicName)
        const dispose = this.ctx.tools.register(definition)
        rt.disposers.set(publicName, { rawName: tool.name, dispose: typeof dispose === 'function' ? dispose : function () {} })
      } catch (error) {
        this.emit('warn', server.name, '工具 ' + tool.name + ' 注册失败：' + errorText(error))
      }
    }
    this.writeRegistry()
  }

  unregisterOne(rt, publicName, entry) {
    try { entry.dispose() } catch (error) {}
    rt.disposers.delete(publicName)
  }

  unregisterAll(rt) {
    if (!rt || !rt.disposers) return
    for (const pair of Array.from(rt.disposers.entries())) this.unregisterOne(rt, pair[0], pair[1])
  }

  handleDisconnect(rt, reason) {
    if (!rt || rt.disposed) return
    if (rt.status === 'error') return
    rt.status = 'error'
    rt.error = '连接已断开：' + reason
    this.unregisterAll(rt)
    this.emit('warn', rt.server.name, rt.error)
    this.safeClose(rt)
    this.scheduleRetry(rt)
    this.writeRegistry()
  }

  scheduleRetry(rt) {
    if (!rt || rt.disposed || !rt.server.enabled || rt.retryTimer) return
    const self = this
    const delay = RETRY_DELAYS_MS[Math.min(rt.retryCount, RETRY_DELAYS_MS.length - 1)]
    rt.retryCount += 1
    rt.retryTimer = setTimeout(function () {
      rt.retryTimer = null
      if (rt.disposed || !rt.server.enabled) return
      self.ensureRuntime(rt.server, 'retry').catch(function (error) {
        self.emit('error', rt.server.name, '重连失败：' + errorText(error))
      })
    }, delay)
    if (rt.retryTimer.unref) rt.retryTimer.unref()
    this.emit('warn', rt.server.name, '将在 ' + Math.round(delay / 1000) + ' 秒后重连（第 ' + rt.retryCount + ' 次）')
  }

  async safeClose(rt) {
    const client = rt.client
    rt.client = null
    rt.transport = null
    if (!client) return
    try { await withTimeout(client.close(), CLOSE_TIMEOUT_MS, '关闭连接') } catch (error) {}
  }

  async disposeRuntime(id) {
    const rt = this.runtimes.get(id)
    if (!rt) return
    rt.disposed = true
    if (rt.retryTimer) { clearTimeout(rt.retryTimer); rt.retryTimer = null }
    this.unregisterAll(rt)
    this.runtimes.delete(id)
    await this.safeClose(rt)
    this.writeRegistry()
  }

  findServer(id) {
    const server = this.state.servers.find(function (item) { return item.id === id })
    if (!server) throw new Error('找不到 MCP 服务器：' + id)
    return server
  }

  viewStatus(server, rt) {
    if (!server.enabled) return 'disabled'
    if (!rt) return 'connecting'
    return rt.status
  }

  viewOf(server) {
    const rt = this.runtimes.get(server.id)
    const known = Array.isArray(server.knownTools) ? server.knownTools : []
    const tools = known.map(function (tool) {
      return {
        name: tool.name,
        description: tool.description || '',
        enabled: !(server.tools && server.tools[tool.name] === false)
      }
    })
    const enabledToolCount = tools.filter(function (tool) { return tool.enabled }).length
    return {
      id: server.id,
      name: server.name,
      transport: server.transport,
      url: server.url,
      headers: server.headers,
      command: server.command,
      args: server.args,
      env: server.env,
      cwd: server.cwd,
      note: server.note,
      enabled: server.enabled,
      toolCallTimeoutMs: server.toolCallTimeoutMs,
      status: this.viewStatus(server, rt),
      error: rt ? rt.error : null,
      protocolVersion: rt ? rt.protocolVersion : null,
      serverInfo: rt ? rt.serverInfo : null,
      latencyMs: rt ? rt.latencyMs : null,
      connectedAt: rt ? rt.connectedAt : null,
      tools: tools,
      toolCount: tools.length,
      enabledToolCount: enabledToolCount,
      registeredToolCount: rt ? rt.disposers.size : 0,
      lastTest: server.lastTest || null,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt
    }
  }

  views() {
    const self = this
    return this.state.servers.map(function (server) { return self.viewOf(server) })
  }

  registeredSnapshot() {
    const byServer = {}
    const tools = []
    for (const server of this.state.servers) {
      const rt = this.runtimes.get(server.id)
      const names = rt ? Array.from(rt.disposers.keys()) : []
      byServer[server.id] = { name: server.name, tools: names }
      for (const name of names) tools.push(name)
    }
    return { total: tools.length, tools: tools, byServer: byServer }
  }

  writeRegistry() {
    const self = this
    try {
      store.writeRegistry({
        updatedAt: Date.now(),
        servers: this.state.servers.map(function (server) {
          const rt = self.runtimes.get(server.id)
          const registered = rt ? Array.from(rt.disposers.keys()) : []
          const known = Array.isArray(server.knownTools) ? server.knownTools : []
          return {
            id: server.id,
            name: server.name,
            enabled: server.enabled,
            status: self.viewStatus(server, rt),
            error: rt ? rt.error : null,
            totalTools: known.length,
            enabledTools: known.filter(function (tool) { return !(server.tools && server.tools[tool.name] === false) }).map(function (tool) { return tool.name }),
            registered: registered
          }
        }),
        totalRegistered: this.registeredSnapshot().total,
        tools: this.registeredSnapshot().tools
      })
    } catch (error) {}
  }

  // ---- mutations (all serialized through the queue) ----

  async save(input) {
    const self = this
    return this.enqueue(function () { return self.applySave(input) })
  }

  async applySave(input) {
    const existing = input && input.id ? this.state.servers.find(function (item) { return item.id === input.id }) : null
    const server = store.normalizeServer(input || {}, existing || null)
    store.validateServer(server, this.state.servers)
    const rt = this.runtimes.get(server.id)
    const configChanged = rt && rt.configKey !== this.configKey(server)
    if (existing) Object.assign(existing, server)
    else this.state.servers.push(server)
    if (configChanged) await this.disposeRuntime(server.id)
    this.persist()
    const target = existing || server
    if (target.enabled) await this.ensureRuntime(target, 'save')
    else await this.disposeRuntime(target.id)
    this.emit('info', target.name, existing ? '已更新配置' : '已添加服务器')
    this.writeRegistry()
    return this.viewOf(target)
  }

  async toggleServer(id, enabled) {
    const self = this
    return this.enqueue(async function () {
      const server = self.findServer(id)
      server.enabled = !!enabled
      server.updatedAt = Date.now()
      self.persist()
      if (server.enabled) await self.ensureRuntime(server, 'toggle')
      else await self.disposeRuntime(server.id)
      self.emit('info', server.name, server.enabled ? '已启用' : '已停用（工具已全部移除）')
      self.writeRegistry()
      return self.viewOf(server)
    })
  }

  async toggleTool(id, toolName, enabled) {
    const self = this
    return this.enqueue(async function () {
      const server = self.findServer(id)
      if (typeof toolName !== 'string' || !toolName) throw new Error('缺少工具名')
      server.tools = Object.assign({}, server.tools || {})
      server.tools[toolName] = !!enabled
      server.updatedAt = Date.now()
      self.persist()
      const rt = self.runtimes.get(server.id)
      if (rt && rt.status === 'connected') await self.syncRuntimeTools(rt)
      self.writeRegistry()
      return self.viewOf(server)
    })
  }

  async bulkTools(id, action) {
    const self = this
    return this.enqueue(async function () {
      const server = self.findServer(id)
      const known = Array.isArray(server.knownTools) ? server.knownTools : []
      const next = Object.assign({}, server.tools || {})
      for (const tool of known) {
        const current = next[tool.name] !== false
        if (action === 'all') next[tool.name] = true
        else if (action === 'none') next[tool.name] = false
        else if (action === 'invert') next[tool.name] = !current
        else throw new Error('未知的批量操作：' + action)
      }
      server.tools = next
      server.updatedAt = Date.now()
      self.persist()
      const rt = self.runtimes.get(server.id)
      if (rt && rt.status === 'connected') await self.syncRuntimeTools(rt)
      self.emit('info', server.name, '批量更新工具开关：' + action)
      self.writeRegistry()
      return self.viewOf(server)
    })
  }

  async refreshServer(id) {
    const self = this
    return this.enqueue(async function () {
      const server = self.findServer(id)
      if (!server.enabled) throw new Error('服务器已停用，请先启用再刷新')
      const rt = self.runtimes.get(server.id)
      if (rt && rt.status === 'connected' && rt.client) {
        const listed = await withTimeout(rt.client.listTools(), LIST_TIMEOUT_MS, '工具发现')
        rt.tools = listed && Array.isArray(listed.tools) ? listed.tools : []
        self.updateKnownTools(server, rt.tools)
        self.persist()
        await self.syncRuntimeTools(rt)
        self.emit('info', server.name, '已刷新 · ' + rt.tools.length + ' 个工具')
      } else {
        await self.ensureRuntime(server, 'refresh')
      }
      self.writeRegistry()
      return self.viewOf(server)
    })
  }

  async deleteServer(id) {
    const self = this
    return this.enqueue(async function () {
      const server = self.findServer(id)
      await self.disposeRuntime(id)
      self.state.servers = self.state.servers.filter(function (item) { return item.id !== id })
      self.persist()
      self.emit('info', server.name, '已删除服务器（工具已全部移除）')
      self.writeRegistry()
      return { ok: true }
    })
  }

  async testConnectivity(inputOrId) {
    const self = this
    return this.enqueue(async function () {
      const started = Date.now()
      let server = null
      let stored = null
      if (inputOrId && typeof inputOrId === 'object' && inputOrId.id && !inputOrId.name) {
        stored = self.findServer(inputOrId.id)
        server = stored
      } else if (inputOrId && typeof inputOrId === 'object' && inputOrId.id) {
        stored = self.state.servers.find(function (item) { return item.id === inputOrId.id }) || null
        server = store.normalizeServer(inputOrId, stored)
      } else if (inputOrId && typeof inputOrId === 'object' && inputOrId.server) {
        stored = inputOrId.server.id ? (self.state.servers.find(function (item) { return item.id === inputOrId.server.id }) || null) : null
        server = store.normalizeServer(inputOrId.server, stored)
      } else {
        throw new Error('缺少要测试的服务器配置')
      }
      let client = null
      try {
        const sdk = await loadSdk()
        client = new sdk.Client(CLIENT_INFO, { capabilities: {} })
        const transport = self.buildTransport(sdk, server)
        await withTimeout(client.connect(transport), CONNECT_TIMEOUT_MS, '连接')
        const protocolVersion = (client.getNegotiatedProtocolVersion && client.getNegotiatedProtocolVersion()) || transport.protocolVersion || null
        const serverInfo = client.getServerVersion ? client.getServerVersion() : null
        const listed = await withTimeout(client.listTools(), LIST_TIMEOUT_MS, '工具发现')
        const tools = (listed && Array.isArray(listed.tools) ? listed.tools : []).map(function (tool) {
          return { name: tool.name, description: typeof tool.description === 'string' ? tool.description : '' }
        })
        const latencyMs = Date.now() - started
        if (stored) {
          stored.lastTest = { at: Date.now(), ok: true, latencyMs: latencyMs, toolCount: tools.length, error: null }
          self.persist()
        }
        self.emit('info', server.name, '连通性测试通过 · ' + tools.length + ' 个工具 · ' + latencyMs + ' ms')
        return {
          ok: true,
          latencyMs: latencyMs,
          protocolVersion: protocolVersion,
          serverInfo: serverInfo,
          toolCount: tools.length,
          tools: tools,
          error: null
        }
      } catch (error) {
        const latencyMs = Date.now() - started
        if (stored) {
          stored.lastTest = { at: Date.now(), ok: false, latencyMs: latencyMs, toolCount: 0, error: errorText(error) }
          self.persist()
        }
        self.emit('warn', server.name, '连通性测试失败：' + errorText(error))
        return { ok: false, error: '连接失败：' + errorText(error), latencyMs: latencyMs }
      } finally {
        if (client) { try { await withTimeout(client.close(), CLOSE_TIMEOUT_MS, '关闭连接') } catch (error) {} }
      }
    })
  }

  async reloadFromDisk() {
    const self = this
    return this.enqueue(async function () {
      for (const id of Array.from(self.runtimes.keys())) await self.disposeRuntime(id)
      self.state = store.loadState()
      self.emit('info', null, '已从磁盘重新加载 state.json')
      await self.reconcileAll('reload')
      return self.views()
    })
  }

  async importServers(payload) {
    const self = this
    return this.enqueue(async function () {
      let data = payload && payload.json !== undefined ? payload.json : payload
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (error) { throw new Error('JSON 解析失败：' + errorText(error)) }
      }
      if (!data || typeof data !== 'object') throw new Error('JSON 内容为空或格式不正确')
      const map = data.mcpServers || data.servers
      if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error('JSON 里没有 mcpServers 对象')
      const imported = []
      const errors = []
      let updated = 0
      for (const name of Object.keys(map)) {
        try {
          const raw = map[name] || {}
          const transport = raw.transport === 'stdio' ? 'stdio' : (raw.transport === 'streamable-http' || raw.transport === 'http' || raw.transport === 'sse' ? 'streamable-http' : (raw.command ? 'stdio' : 'streamable-http'))
          const existing = self.state.servers.find(function (server) { return server.name === name }) || null
          const input = {
            id: existing ? existing.id : undefined,
            name: name,
            transport: transport,
            url: raw.url || (raw.serverUrl || ''),
            headers: raw.headers || {},
            command: raw.command || '',
            args: raw.args || [],
            env: raw.env || {},
            cwd: raw.cwd || '',
            note: raw.note !== undefined ? raw.note : (existing && existing.note ? existing.note : ''),
            enabled: raw.enabled !== undefined ? raw.enabled !== false : (existing ? existing.enabled !== false : true),
            toolCallTimeoutMs: raw.toolCallTimeoutMs,
            tools: existing ? existing.tools : undefined
          }
          const view = await self.applySave(input)
          imported.push(view)
          if (existing) updated += 1
        } catch (error) {
          errors.push(name + '：' + errorText(error))
        }
      }
      self.emit('info', null, '导入完成 · 新增 ' + (imported.length - updated) + ' · 更新 ' + updated + (errors.length ? ' · 失败 ' + errors.length : ''))
      self.writeRegistry()
      return {
        ok: true,
        imported: imported.length - updated,
        updated: updated,
        servers: imported,
        errors: errors
      }
    })
  }

  events(limit) {
    return this.log.list(limit)
  }

  async dispose() {
    this.disposed = true
    if (this.watcher) { try { this.watcher.close() } catch (error) {} this.watcher = null }
    for (const id of Array.from(this.runtimes.keys())) {
      try { await this.disposeRuntime(id) } catch (error) {}
    }
  }
}
