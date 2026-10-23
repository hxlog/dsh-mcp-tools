# dsh-mcp-tools · Host ↔ Client API 契约（v1）

> 实现方：host = `lib/*.js`（Node，cordis 插件）；client = `client/client.js`（浏览器 bundle）。
> 所有接口同源、JSON、走登录 cookie；默认返回 `{ ok: true, ... }`，失败返回 `{ ok: false, error: string }`（HTTP 200/4xx/500 都可能，前端一律按 `ok` 字段判断）。
> 路由前缀：`/mcp-tools/api`（不得占用 `/api`、`/plugins`）。

## 0. 数据模型

### Server（存储在 `$DSH_HOME/dsh-mcp-tools/state.json`）

```jsonc
{
  "id": "srv_xxx",                 // 服务端生成，稳定不变
  "name": "demo-mcp",        // 用户输入，唯一；同时是工具命名空间 mcp__<name>__<tool>
                                   // 约束 ^[A-Za-z0-9_-]{1,32}$
  "transport": "streamable-http",  // "streamable-http" | "stdio"
  "url": "https://…",              // http 传输必填
  "headers": { "x-mcp-key": "…" }, // http 传输可选
  "command": "npx",                // stdio 传输必填
  "args": ["-y", "…"],             // stdio 可选
  "env": { "K": "V" },             // stdio 可选
  "cwd": "",                       // stdio 可选
  "note": "给用户自己看的备注",       // 可选
  "enabled": true,                 // 服务器总开关
  "toolCallTimeoutMs": 60000,      // 可选
  "tools": { "document_search": false }, // 显式工具开关；缺省 = 启用（true）
  "createdAt": 0, "updatedAt": 0
}
```

### ServerView（接口返回给前端的服务器对象）

在 Server 基础上追加运行时字段：

```jsonc
{
  "id": "…", "name": "…", "transport": "…", "url": "…", "headers": {…},
  "command": "…", "args": [], "env": {}, "cwd": "", "note": "…",
  "enabled": true, "toolCallTimeoutMs": 60000,
  "status": "connected",           // "disabled" | "connecting" | "connected" | "error"
  "error": null,                   // status=error 时的可读原因
  "protocolVersion": "2025-06-18", // 连接后协商的 MCP 协议版本
  "serverInfo": { "name": "…", "version": "…" } | null,
  "latencyMs": 194,                // 最近一次连接耗时
  "connectedAt": 0,
  "tools": [                       // 已发现的工具（按 name 排序）
    { "name": "document_search", "description": "…", "enabled": true }
  ],
  "toolCount": 95,
  "enabledToolCount": 90,
  "registeredToolCount": 90,       // 实际注册进 ctx.tools 的数量（= enabledToolCount，除非注册冲突）
  "lastTest": { "at": 0, "ok": true, "latencyMs": 194, "toolCount": 95, "error": null } | null
}
```

- `status=disabled` 时 `tools` 保留上次发现结果（可展示但全部置灰），`registeredToolCount=0`。
- 工具开关语义：`enabled=false` 的工具**不注册**，模型完全看不到；服务器 `enabled=false` 时该服务器所有工具都不注册。

## 1. 读取

### GET `/mcp-tools/api/state`
返回全部服务器与最近事件。
```jsonc
{
  "ok": true,
  "version": 1,
  "servers": [ ServerView ],
  "events": [ { "at": 0, "level": "info", "server": "demo-mcp", "message": "已连接 · 95 个工具" } ],
  "registeredTotal": 131,
  "paths": { "state": "C:\\Users\\…\\.dsh\\dsh-mcp-tools\\state.json" }
}
```

### GET `/mcp-tools/api/registered`
验证用：当前真正注册进模型的工具清单。
```jsonc
{ "ok": true, "total": 131, "tools": ["mcp__demo-mcp__document_search", …],
  "byServer": { "srv_xxx": { "name": "demo-mcp", "tools": ["mcp__…"] } } }
```

### GET `/mcp-tools/api/logs?limit=100`
```jsonc
{ "ok": true, "events": [ { "at": 0, "level": "info|warn|error", "server": "name|null", "message": "…" } ] }
```

## 2. 连通性测试

### POST `/mcp-tools/api/servers/test`
不改变任何状态、不注册工具；临时连接 → initialize → tools/list → 关闭。
请求二选一：
```jsonc
{ "server": { "name": "x", "transport": "streamable-http", "url": "https://…", "headers": {…} } }
// 或
{ "id": "srv_xxx" }
```
响应：
```jsonc
{
  "ok": true,
  "latencyMs": 194, "protocolVersion": "2025-06-18",
  "serverInfo": { "name": "mcp-server-brm", "version": "1.0.0" },
  "toolCount": 95,
  "tools": [ { "name": "document_search", "description": "…" } ],
  "error": null
}
```
失败时 `{ "ok": false, "error": "连接失败：HTTP 401 …" }`。**注意：远端鉴权可能到 tools/list 才暴露（pharmcube 实测），所以测试必须跑到 tools/list。**

## 3. 服务器增删改 / 开关

### POST `/mcp-tools/api/servers/save`
```jsonc
{ "server": { "id": "可选，缺省=新建", "name": "…", "transport": "…", "url": "…", "headers": {}, "command": "…", "args": [], "env": {}, "cwd": "", "note": "…", "enabled": true, "toolCallTimeoutMs": 60000 } }
```
→ `{ "ok": true, "server": ServerView }`；校验失败 → `{ ok:false, error }`。保存后若 enabled 立即连接并注册工具，否则断开。

### POST `/mcp-tools/api/servers/delete`
`{ "id": "srv_xxx" }` → `{ "ok": true }`

### POST `/mcp-tools/api/servers/toggle`
`{ "id": "srv_xxx", "enabled": true|false }` → `{ "ok": true, "server": ServerView }`
- enabled=false：断开连接并注销该服务器**全部**工具。
- enabled=true：连接并注册所有 enabled 的工具。

### POST `/mcp-tools/api/servers/refresh`
`{ "id" }` → 重新 tools/list（已连接）或重连（断线时），刷新工具列表与状态 → `{ "ok": true, "server": ServerView }`

### POST `/mcp-tools/api/reload`
从磁盘重新读取 state.json 并全量重启连接（自动化/验证用）→ `{ "ok": true, "servers": [ServerView] }`

## 4. 工具开关

### POST `/mcp-tools/api/tools/toggle`
`{ "id": "srv_xxx", "tool": "document_search", "enabled": false }` → `{ ok:true, server: ServerView }`
- 立即注册/注销该单个工具（不需要重连）。

### POST `/mcp-tools/api/tools/bulk`
`{ "id": "srv_xxx", "action": "all" | "none" | "invert" }` → `{ ok:true, server: ServerView }`
- 作用对象 = 当前已发现的工具集合；`invert` 逐工具取反。

## 5. 导入

### POST `/mcp-tools/api/import`
`{ "json": "{ \"mcpServers\": { \"demo-mcp\": { \"url\": \"https://…\", \"headers\": { \"x-mcp-key\": \"…\" } } } }" }`
或直接传对象 `{ "json": { "mcpServers": { … } } }`。
- 兼容 `{ "mcpServers": { name: { transport?, url?, headers?, command?, args?, env?, note? } } }`；缺少 transport 时按有无 url 推断（url→streamable-http，command→stdio）。
- 同名服务器已存在 → 覆盖更新（保留 id 与工具开关），响应里 `updated` 列出。
- → `{ "ok": true, "imported": 1, "updated": 0, "servers": [ServerView], "errors": [] }`

## 6. 事件与状态

- 事件在 host 内存 ring buffer（最多 300 条），尽量同时写 `$DSH_HOME/dsh-mcp-tools/logs.jsonl`。
- 任何开关/连接动作都会产生事件，前端操作后重新 GET `/state` 即可。
- 客户端轮询：设置页可见时每 5s GET `/state`（仅当页面处于 MCP 分区且 document.visibilityState === "visible"）。

## 7. 关键行为约定（前端可依赖）

1. `save/toggle/tools.*` 都是**同步生效**（host 内 await 连接/注册完成后返回）；返回的 ServerView 已是最新状态。
2. 连接失败不会导致 save 失败：服务器仍保存，`status="error"`，`error` 为可读原因；前端显示错误并允许重试。
3. `status="connecting"` 只会短暂出现（GET 期间）。
4. `tools[].enabled` 已经是“显式 false 则 false，否则 true”的最终值，前端不要自己再算缺省。
5. 删除服务器会立即注销其全部工具。
6. 工具名、顺序以 `tools[].name` 为唯一键；**顺序不稳定，禁止按下标存状态**。
7. headers / env 属于敏感信息：前端只在编辑表单里回显，列表卡片只显示 URL/备注，不做日志输出。
