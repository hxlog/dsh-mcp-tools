// lib/routes.js — same-origin JSON routes under /mcp-manager/api.
// Gated by the host's connection service (Host/Origin fence + login cookie) so
// no other local process can drive MCP configuration without the session.

const PREFIX = '/mcp-manager/api'
const MAX_BODY_BYTES = 256 * 1024

function sendJson(response, status, payload) {
  if (response.headersSent) { try { response.end() } catch (error) {} return }
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(payload))
}

function errorText(error) {
  if (!error) return '未知错误'
  return String(error.message || error)
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('请求体过大（上限 256 KiB）')
    chunks.push(chunk)
  }
  const text = Buffer.concat(chunks).toString('utf8').trim()
  if (!text) return {}
  try { return JSON.parse(text) } catch (error) { throw new Error('请求体不是合法 JSON：' + errorText(error)) }
}

function gate(connection, request, response) {
  if (!connection || typeof connection.requestRejection !== 'function') return false
  let rejection
  try { rejection = connection.requestRejection(request) } catch (error) { rejection = 403 }
  if (rejection === undefined) return false
  sendJson(response, rejection, { ok: false, error: rejection === 401 ? '需要登录后再操作' : '请求来源不可信' })
  return true
}

export function registerRoutes(webServer, connection, manager) {
  if (!webServer || typeof webServer.register !== 'function') throw new Error('webServer 服务不可用')
  const disposers = []

  function route(path, methods, handle) {
    const routePath = PREFIX + path
    const handler = async function (request, response) {
      if (gate(connection, request, response)) return
      const method = String(request.method || 'GET').toUpperCase()
      if (methods.indexOf(method) < 0) { sendJson(response, 405, { ok: false, error: '不支持的请求方法：' + method }); return }
      try {
        await manager.ready
        const body = method === 'GET' || method === 'HEAD' ? {} : await readJsonBody(request)
        const result = await handle({ method: method, body: body, url: new URL('http://local' + (request.url || '/')), request: request })
        sendJson(response, 200, result)
      } catch (error) {
        sendJson(response, 400, { ok: false, error: errorText(error) })
      }
    }
    const dispose = webServer.register({ kind: 'exact', path: routePath, handler: handler })
    disposers.push(dispose)
    return dispose
  }

  route('/state', ['GET'], async function () {
    return {
      ok: true,
      version: 1,
      servers: manager.views(),
      events: manager.events(100),
      registeredTotal: manager.registeredSnapshot().total,
      paths: { state: manager.statePathForUi ? manager.statePathForUi() : null }
    }
  })

  route('/registered', ['GET'], async function () {
    const snapshot = manager.registeredSnapshot()
    return { ok: true, total: snapshot.total, tools: snapshot.tools, byServer: snapshot.byServer }
  })

  route('/logs', ['GET'], async function (context) {
    const limit = Number(context.url.searchParams.get('limit') || 100)
    return { ok: true, events: manager.events(limit) }
  })

  route('/servers/test', ['POST'], async function (context) {
    return manager.testConnectivity(context.body)
  })

  route('/servers/save', ['POST'], async function (context) {
    if (!context.body || !context.body.server) throw new Error('缺少 server 字段')
    return { ok: true, server: await manager.save(context.body.server) }
  })

  route('/servers/delete', ['POST'], async function (context) {
    if (!context.body || !context.body.id) throw new Error('缺少 id')
    return await manager.deleteServer(context.body.id)
  })

  route('/servers/toggle', ['POST'], async function (context) {
    if (!context.body || !context.body.id) throw new Error('缺少 id')
    return { ok: true, server: await manager.toggleServer(context.body.id, !!context.body.enabled) }
  })

  route('/servers/refresh', ['POST'], async function (context) {
    if (!context.body || !context.body.id) throw new Error('缺少 id')
    return { ok: true, server: await manager.refreshServer(context.body.id) }
  })

  route('/tools/toggle', ['POST'], async function (context) {
    if (!context.body || !context.body.id) throw new Error('缺少 id')
    return { ok: true, server: await manager.toggleTool(context.body.id, context.body.tool, context.body.enabled !== false) }
  })

  route('/tools/bulk', ['POST'], async function (context) {
    if (!context.body || !context.body.id) throw new Error('缺少 id')
    return { ok: true, server: await manager.bulkTools(context.body.id, String(context.body.action || '')) }
  })

  route('/import', ['POST'], async function (context) {
    return await manager.importServers(context.body)
  })

  route('/reload', ['POST'], async function () {
    return { ok: true, servers: await manager.reloadFromDisk() }
  })

  return function disposeRoutes() {
    for (const dispose of disposers) { try { if (typeof dispose === 'function') dispose() } catch (error) {} }
  }
}
