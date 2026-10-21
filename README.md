<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/logo.png" width="72" height="72" alt="dsh-mcp-tools" />
</p>

<h1 align="center">dsh-mcp-tools</h1>

<p align="center">
  <b>DeepSeek Harness 简洁、优雅的 MCP 工具管理器。</b><br />
  类 Cursor 风格的全局 MCP 控制：自由添加、停用、删除 MCP 接口与工具，适合 MCP 测试、按需请求、拓展上下文等场景。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-mcp-tools"><img src="https://img.shields.io/npm/v/dsh-mcp-tools?color=black" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/dsh-mcp-tools"><img src="https://img.shields.io/npm/dm/dsh-mcp-tools?color=black" alt="npm downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-black.svg" alt="license" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D22.13-black.svg" alt="node" /></a>
  <a href="https://github.com/hxlog/dsh-mcp-tools"><img src="https://img.shields.io/badge/GitHub-hxlog%2Fdsh--mcp--tools-black?logo=github" alt="GitHub" /></a>
</p>

<p align="center">
  <a href="https://github.com/hxlog/dsh-mcp-tools">GitHub 仓库</a> ·
  <a href="https://www.npmjs.com/package/dsh-mcp-tools">npm</a> ·
  <a href="https://github.com/hxlog/dsh-mcp-tools/issues">问题反馈</a> ·
  <a href="README.en.md">English</a>
</p>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-overview.png" width="49%" alt="设置服务器" />
  <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-detail.png" width="49%" alt="MCP 工具详情" />
</p>

> 一站式管理用户的 MCP Server，按需开关 MCP Tools。被停用的 MCP 工具**不会注册进模型**，既不占上下文，也无法被误调用。

## ✨ 功能

| 能力 | 说明 |
| --- | --- |
| **服务器管理** | 两种传输：`streamable-http`（URL + 请求头）与 `stdio`（命令 / 参数 / 环境变量 / 工作目录）；分字段填写，或直接粘贴 `{"mcpServers": { ... }}` 一次导入多个。 |
| **像 Postman 一样填密钥** | 请求头是键值对行而不是 JSON 文本框，默认带一行 `x-mcp-key`；值默认掩码、可逐行显示；名称重复就地报错。 |
| **真正的逐工具控制** | 每个工具是一个 chip，点击即从模型工具列表消失（不是注册了再报错）；支持搜索 / 全选 / 反选 / 全部停用，悬停查看完整描述。 |
| **连通性测试与事件日志** | 临时建连 `initialize → tools/list → 关闭`，回报耗时 / 协议版本 / 工具数，不影响运行中的服务器；「最近事件」记录连接、重载、测试与失败。 |
| **服务器开关与配置复制** | 关闭服务器即断开并注销其全部工具（不删配置）；一键复制该服务器的 `mcpServers` 片段。 |
| **与 DSH 原生一致** | 沿用 `--dsw-*` 设计 token、平铺行与 32px 输入框，深浅色 / 中英文自适应；客户端是 classic script，无构建步骤。 |

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-add-server.png" width="48%" alt="添加服务器：键值对请求头" />
  <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-tools.png" width="48%" alt="逐工具 chip" />
</p>

## 🚀 安装

需要 **DeepSeek Harness 0.2.x**（Web GUI `dsh web` 或 DSH Desktop）与 **Node.js ≥ 22.13**，包已发布到 npm：[dsh-mcp-tools](https://www.npmjs.com/package/dsh-mcp-tools)。

> ⚠️ 这是 **DeepSeek Harness 插件**，不是普通 npm 依赖库：`npm i dsh-mcp-tools` 只会下载包，运行时仍需装进 DSH profile。

**通过插件页安装（推荐）**

1. 打开 DSH Web（或 DSH Desktop）→ 侧边栏 **插件**（Desktop 在 **设置 → 插件**）。
2. 点击安装，填入 `dsh-mcp-tools`，确认。
3. 启用新 bundle，刷新页面，打开 **设置 → MCP**。

**通过命令行安装**

```bash
dsh plugin --profile web add dsh-mcp-tools      # Web
dsh plugin --profile desktop add dsh-mcp-tools  # Desktop
```

> 升级包版本后需要重启 `dsh web` / 重启 DSH Desktop。

## ⚡ 快速开始

1. **设置 → MCP → 添加服务器**：远程服务器填 URL，把密钥粘贴进请求头行（默认 `x-mcp-key`）。
2. 点 **测试连接**，看到类似 `已连接 · 95 个工具 · 478 ms` 后保存，并打开服务器开关。
3. 在会话中直接让模型调用工具，DSH 会注册为 `mcp__<服务器>__<工具>`；用不到的工具展开列表停用即可，启用的工具越少，每次请求里的 tool schema 越小。

## 🖼 更多界面

| 深色模式 | 停用部分工具 |
| --- | --- |
| <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-dark.png" width="100%" alt="深色模式" /> | <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-tool-toggles.png" width="100%" alt="停用部分工具" /> |

| 粘贴 mcpServers JSON | 工具描述 tooltip |
| --- | --- |
| <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-json-import.png" width="100%" alt="粘贴 mcpServers JSON" /> | <img src="https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/zh/mcp-tooltip.png" width="100%" alt="工具描述 tooltip" /> |

## 🧩 工作原理

```
DeepSeek Harness Web (dsh web)
├── Host 插件（lib/）          ← cordis bundle patch，复用原生 MCP 客户端
│   ├── manager.js             连接、工具注册、启停
│   ├── store.js               ~/.dsh/dsh-mcp-tools/state.json（原子写、监听外部修改）
│   └── routes.js              /mcp-tools/api/*
└── 客户端 bundle（client/client.js）
    └── 设置分区「MCP」（id: mcp，order: 18）—— classic script，无需构建
```

- 启停生效于**注册时**而非调用时：停用的工具根本不出现在模型工具列表里。
- 状态存于 `~/.dsh/dsh-mcp-tools/state.json`，原子写入；外部修改会被监听并热应用。
- REST 接口：`GET /mcp-tools/api/state`、`POST /servers/{test,save,delete,toggle,refresh}`、`POST /tools/{toggle,bulk}`、`POST /import`、`POST /reload`、`GET /logs`；详见 [docs/API.md](docs/API.md)。

## 🔒 安全说明

- 请求头以**明文**保存在本地状态文件里，只在本机——不要提交到仓库或同步到公开位置。
- 给每个 MCP 服务器使用独立、最小权限的密钥。
- 除你配置的 MCP 服务器外不发起任何网络请求，没有遥测；删除服务器后它的工具会从后续所有请求中移除。

## 🛠 开发

```bash
git clone https://github.com/hxlog/dsh-mcp-tools.git
cd dsh-mcp-tools
node --check client/client.js
npm run selftest
```

把源码目录链接进 profile 调试（Windows 示例）：

```bat
rmdir "C:\Users\<你>\.dsh\profiles\web\node_modules\dsh-mcp-tools"
mklink /J "C:\Users\<你>\.dsh\profiles\web\node_modules\dsh-mcp-tools" "D:\path\to\dsh-mcp-tools"
```

- **客户端改动**：刷新页面即可，bundle 直接从磁盘提供，无构建。
- **Host 改动**：改一次 profile 的 `cordis.patch.yml`（例如追加一行注释）触发 HMR 重组，日志出现 `MCP 管理器已启动` 即生效。
- 面板是单个 classic script，只能 `require` `react` 与 `@deepseek-ai/dsh-client-ui-primitives`。

## ❓ 常见问题

| 问题 | 处理 |
| --- | --- |
| 设置里没有 MCP 分区 | 多半是 bundle 未启用：插件页确认并刷新，必要时重启 `dsh web`。 |
| 会话里看不到工具 | 确认服务器开关已打开、对应工具 chip 也已启用；停用的工具不会被注册。 |
| 测试连接失败 | 检查 URL、服务器是否使用 `streamable-http`（而非普通 SSE）、请求头名称是否与服务端要求一致；网络 / 代理问题也会在这里暴露。 |
| 状态文件在哪 | `~/.dsh/dsh-mcp-tools/state.json`；删除即重置为空，下次启动自动重建。 |

## 📄 License

[MIT](LICENSE) · Powered by [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
