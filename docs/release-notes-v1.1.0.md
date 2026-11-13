# dsh-mcp-tools v1.1.0

新增旧版 SSE 传输；修复部分服务端 `tools/list` 分页不终止导致的连接失败。

## 新增

- **SSE 传输（`sse`）**：设置里传输方式新增第三项 `sse`。连接时先建 `text/event-stream`，再通过 POST 发送 JSON-RPC；请求头（如 `apiKey`）同时用于 event-stream 和 POST。适用于只提供 `/sse` 端点的旧版 MCP 服务端。
- **JSON 导入识别 `type: "sse"`**：粘贴 `{ "mcpServers": { "x": { "url": "…/sse", "type": "sse", "headers": { … } } } }` 会直接按 SSE 建立连接；复制配置时 SSE 服务器同时输出 `transport` 与 `type`，方便粘贴到其他客户端。
- **分页工具发现兜底**：部分服务端的 `tools/list` 会一直返回 `nextCursor`（SDK 默认在 64 页后抛 `exceeded listMaxPages`）。现在由插件自己按页抓取：按工具名去重、空 cursor 或整页无新增即停，上限 32 页 / 2000 个工具，避免连接被卡死。

## 验证

- 用真实 SSE 端点（`https://openmcp.bcpmdata.com/general/sse`，header `apiKey`）实测：连接 1.1s，协议 `2025-11-25`，服务端 `openapi-server 1.0.0`，发现 **113** 个工具并全部注册；`GeneralV1_Diseases` 调用成功返回数据。
- 同一配置以 `type: "sse"` 走插件 JSON 导入路径：`imported: 1`、`transport: sse`、`status: connected`、113 个工具。
- `npm test` / `npm run test:manager` / `npm run ci-check` 全部通过。

## 安装 / 升级

```bash
dsh plugin --profile web add dsh-mcp-tools      # Web
dsh plugin --profile desktop add dsh-mcp-tools  # Desktop
```

已发布到 npm：**`dsh-mcp-tools@1.1.0`**（<https://www.npmjs.com/package/dsh-mcp-tools>，`latest`）。装好后重启 `dsh web` / DSH Desktop 生效；已装旧版本的 profile 重新执行上面的 add 即可升级。

**Full Changelog**: https://github.com/hxlog/dsh-mcp-tools/compare/v1.0.3...v1.1.0
