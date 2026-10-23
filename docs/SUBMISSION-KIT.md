# DSH Marketplace 提交物料包 / Submission kit

> 用途：向需要 GitHub 登录（OAuth）或人工表单的市场提交时，直接复制对应段落即可，避免逐字段现写。
> 最后更新：2026-10-23

## 一句话定位（中 / 英）

- 中：DSH 设置内的 MCP 服务器与工具管理器——添加 streamable-http/stdio 服务器、Postman 式请求头、连通性测试、逐工具开关，停用的工具不会注册进模型。
- 英：Clean MCP server & tool manager inside DSH settings — add streamable-http or stdio servers with Postman-style headers, test connectivity, and toggle individual tools so disabled ones never reach the model.

## 60 字简介

- 中：在 DSH 设置里集中管理 MCP 服务器与工具开关，支持请求头、连通性测试与按工具禁用，停用工具不进入模型上下文。
- 英：A settings-native MCP manager for DSH: per-server headers, connectivity tests, and per-tool toggles that keep disabled tools out of the model context.

## 200 字简介

- 中：dsh-mcp-tools 把 MCP 服务器管理搬进 DeepSeek Harness 设置页：可以添加 streamable-http 或 stdio 服务器，用 Postman 式键值对填写请求头，一键测试连通性，并按工具单独开关。被停用的工具不会被注册进模型，减少上下文占用与误调用。纯本地存储，无遥测；MCP 凭据以明文保存在 `~/.dsh/dsh-mcp-tools/state.json`（README 有安全说明）。
- 英：dsh-mcp-tools brings MCP server management into the DeepSeek Harness settings page: add streamable-http or stdio servers, fill headers as Postman-style key/value rows, run a one-click connectivity test, and toggle each tool individually. Disabled tools are never registered with the model, cutting context noise and accidental calls. Local-only storage, no telemetry; MCP credentials are stored in plaintext at `~/.dsh/dsh-mcp-tools/state.json` (documented in the README).

## 标准字段

| 字段 | 值 |
| --- | --- |
| 名称 | dsh-mcp-tools |
| npm 包 | dsh-mcp-tools（最新 1.0.2） |
| 仓库 | https://github.com/hxlog/dsh-mcp-tools |
| 许可证 | MIT |
| 分类 | Tools / MCP 工具 |
| 平台 | web（DSH 0.2.1-rc.2 实测） |
| 安装（npm） | `dsh plugin --profile web add dsh-mcp-tools` |
| 安装（git） | `dsh plugin --profile web add github:hxlog/dsh-mcp-tools` |
| 截图 | docs/screenshots/（settings 面板、请求头编辑、工具开关） |

## 权限声明（表单常用）

- filesystem：读写自身状态文件 `~/.dsh/dsh-mcp-tools/state.json`
- network：仅访问用户填写的 MCP 端点（streamable-http）；连通性测试对该端点做一次 MCP 握手
- shell：仅当用户显式添加 stdio 服务器时，由 MCP 客户端启动用户填写的命令
- UI：注入设置面板（`@deepseek-ai/dsh-client-ui-settings`、`@deepseek-ai/dsh-client-locale`）

## 各市场填写提示

### dshplugins.com（审核制目录，需 GitHub 登录）
- 提交页：https://dshplugins.com/submit
- 用上面的「一句话定位 + 60 字简介 + 仓库 URL + 安装命令」填写即可；该站要求 README 中有精确安装步骤（已有）

### dsh-plugin.org（dsh-plugin-hub，需 Claim 仓库）
- 站点：https://dsh-plugin.org
- 已有 Issue #391 核对记录；「Claim your repo」需 GitHub OAuth，登录后认领即可

### dsh-plugins.net（GitHub Discussions 通道）
- 已在 https://github.com/deepseek-ai/deepseek-harness/discussions/10768 提交（Show Your Plugins!）
- 如需更新，直接编辑该 Discussion

### 通用（Issue 表单类）
- 必填通常是：仓库 URL、固定 commit（当前 main：见 `git rev-parse HEAD`）、manifest 路径 `package.json`、patch 路径 `cordis.patch.yml`、许可证、安装命令

## 关联文档

- 收录矩阵与状态：[MARKETPLACES.md](./MARKETPLACES.md)
- 逐市场提交记录见矩阵的「待审」表
