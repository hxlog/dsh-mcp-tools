// lib/index.js — cordis host entry for dsh-mcp-tools.
// Owns the MCP connections, registers only the enabled tools on ctx.tools, and
// exposes the management API used by the settings-page client bundle.
import * as store from './store.js'
import { McpManager } from './manager.js'
import { registerRoutes } from './routes.js'

export const name = 'mcp-manager'
export const inject = ['tools']

export function apply(ctx) {
  const log = store.createEventLog()
  const manager = new McpManager(ctx, log)
  manager.statePathForUi = function () { return store.statePath() }
  manager.ready = manager.init().catch(function (error) {
    log.push('error', null, '初始化失败：' + String((error && error.message) || error))
  })

  ctx.effect(function () {
    return function () {
      return manager.dispose()
    }
  }, 'mcp-manager: dispose connections')

  ctx.inject(['webServer'], function (webCtx) {
    ctx.inject(['connection'], function (connCtx) {
      try {
        const disposeRoutes = registerRoutes(webCtx.webServer, connCtx.connection, manager)
        ctx.effect(function () { return disposeRoutes }, 'mcp-manager: routes')
      } catch (error) {
        log.push('error', null, '管理接口注册失败：' + String((error && error.message) || error))
      }
    })
  })

  return { manager: manager, ready: manager.ready }
}
