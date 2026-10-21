# dsh-mcp-client 内部机制 与「工具级开关」可行性调研

> 调研人：mcp-internals（teammate）；共享任务：task-2
> 目标：为「自定义 MCP 管理器」插件（前端 CRUD + 连通性测试 + 服务器级/工具级开关）提供确定的实现依据。
> 基线：**DSH 0.2.1-rc.2**（全局 npm 安装）。开源仓库与本地安装冲突时，以本地安装为准。
> 本文件只做只读调研记录，未改动 `C:\Users\Xingy\.dsh` 与任何 dsh 进程。

## 0. 路径与简称

| 简称 | 实际路径 |
|---|---|
| `<DSH>` | `C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh` |
| `<PKG>` | `<DSH>\node_modules\@deepseek-ai`（官方插件包全在此：`lib/*.js` + `lib/types/*.d.ts` + `README.zh.md`） |
| `<PROFILE>` | `C:\Users\Xingy\.dsh\profiles\web` |
| `<D>` | `D:\PythonProjects\dsh-mcp-workbench` |

当前 web profile 事实（只读核对）：
- `<PROFILE>\cordis.yml` 是空数组 `[]`，全部由 patch 层组合。
- `<PROFILE>\cordis.patch.yml` 已有 `id: mcp-pharmcube` 的 mcp-client 行，**当前 `disabled: true`**，`serverName: pharmcube`、`transport: streamable-http`、`toolCallTimeoutMs: 120000`、`failOnStartupError: false`。
- 同文件 `agent-preset-registry` 行 `selectedDefault: ptc`（第 342 行）→ **web 默认 agent 的工具呈现模式是 PTC**（`<PKG>\dsh-web-app\presets\ptc.patch.yml:126` 的 `mode: ptc`）。这一条对方案选择影响极大，见 §3/§7。

---

## 1. Q1 · mcp-client 的完整 Config schema 与工具注册机制

### 1.1 Config schema（穷尽字段）

真源：`<PKG>\dsh-mcp-client\lib\index.js:773-800`（Schemastery `z.union([stdio, streamable-http])`），类型声明 `lib/types/index.d.ts:20-88`，README 表格 `README.zh.md:55-67`。

| 字段 | 类型 | 默认值 | 语义 |
|---|---|---|---|
| `transport` | `'stdio' \| 'streamable-http'` | **必填** | 传输选择器 |
| `serverName` | string，`/^[A-Za-z0-9_-]{1,32}$/` | **必填** | 工具名前缀命名空间；同一「注册作用域」内唯一（`lib/index.js:766-773, 811-821`） |
| `command` | string | **stdio 必填** | 可执行文件 |
| `args` | string[] | `[]` | 参数，无 shell 插值 |
| `env` | Record<string,string> | `{}` | 叠加在**已清洗**环境之上（`scrubbedParentEnv()`，`lib/index.js:26-31`） |
| `cwd` | string | `''` | 子进程工作目录（空串=继承） |
| `url` | string | **http 必填** | MCP 端点 |
| `headers` | Record<string,string> | `{}` | 附加请求头（`requestInit.headers`） |
| `toolCallTimeoutMs` | number | `60000` | 每次 `tools/call` 或资源请求的超时 |
| `failOnStartupError` | boolean | `false` | 初始连接/工具同步失败时**让插件激活失败**（`lib/index.js:832`） |
| `maxInstructionBytes` | number（step 1，min 1） | `32768` | 归属化服务器指令的 UTF-8 字节上限，超限连接失败（`lib/index.js:654-656`） |
| `reconnect.enabled` | boolean | `true` | 断线自动重连 |
| `reconnect.initialDelayMs` | number 1..MAX_TIMER_DELAY_MS | `500` | 首次重连延迟，连续失败翻倍 |
| `reconnect.maxDelayMs` | number | `30000` | 退避上限；同时是「重置尝试预算」所需的稳定在线时长 |
| `reconnect.maxAttempts` | integer ≥1 | `10` | 一次中断内连续失败上限，超过即注销工具并停手 |

**没有的字段（重要）**：无 `toolFilter`、无 allow/deny、无 tools 白名单、无 `disabledTools`、无自定义命名字段。
`resolveReconnectPolicy()`（`lib/index.js:453-471`）对未知 `reconnect` 键直接抛错（`xxx.yyy is not a reconnect option`），说明 schema 是**封闭**的。

### 1.2 注册到 ToolRuntime 的方式、时机、命名规则

- 插件身份：`name = 'mcp-client'`，`inject = ['tools']`（`lib/index.js:761-763`）。
- 注册 API：**`ctx.tools.register(definition)`**（`<PKG>\dsh-tools\lib\types\index.d.ts:637`，实现 `dsh-tools/lib/index.js:2974-2983`）。返回**精确 disposer**。
- 注册发生在 `syncTools()`（`lib/index.js:127-161`）：
  1. *Fetch 阶段*：`client.listTools(undefined, { cacheMode: 'refresh' })` → 每个 tool 用 `publicToolName(serverName, rawName)` 建 `ToolDefinition`；同名 raw 重复 → 整个列表判无效并抛错（`:131-132`）。
  2. *Swap 阶段*：**先 dispose 上一代全部 disposer**（`:150`），再逐个 `register`；注册冲突则回滚本代（一个都不留）并记日志（`:154-159`）。
- 注册**时机**：`apply()` 里 `await connection.ready`（`:831`）→ 即**插件激活期间**完成首轮同步；因此「harness 开始首个轮次前工具已就位」（README `:91`）。
- 工具名规则 `publicToolName()`（`:96-102`）：`mcp__<serverName>__<rawName>` → 非法字符 `[^A-Za-z0-9_-]` → `_`；若发生替换或长度 > 64，则截断到 51 字符并追加 `_` + sha256(serverName \0 rawName) 的前 12 位十六进制。rawName 只在 wire 上（`tools/call`）使用，绝不反向解析公共名。
- `ToolDefinition` 是**手写对象**（不走 `defineTool`）：`parameters` 直接用 MCP 原始 `inputSchema`；`output` 由 `createOutput()` 声明 `{content[], structuredContent?}` 与文本渲染（`:200-221`）；`execute` 由 `createExecutor()` 归一化结果、`isError` 转抛错、图片走 `projectContent`（`:226-255, 179-198`）。
- **额外副作用（不止注册工具）**：`registerServerContext()`（`:731-743`）
  - `ctx.inject(['mcpResources'])` → `mcpResources.register(server, resources)`：**让 dsh-mcp-resources 的 3 个共享资源工具与「服务器名列表」提示词段落认识这台服务器**；
  - `ctx.inject(['systemPrompt'])` → 注册 `mcp:<server>` 段落（服务器 instructions）。
  ⇒ **只要 mcp-client 实例活着，即使把它的工具全部隐藏，服务器名仍出现在系统提示词里，`read_mcp_resource` 仍能读它的资源。**（见 §3.4）
- 工具列表变更的自动再同步：MCP SDK 的 `listChanged: { tools: { autoRefresh: false, debounceMs: 0, onChanged } }`（`:602-608`）→ `refreshTools()` → `enqueueSync()` → 又一次 `syncTools` 换代（`:632-640`）。**这是「不改 cordis 配置就能换工具集」的唯一官方通路**，方案 D 依赖它。
- 重连失败耗尽 → 注销全部工具并停止（`:567-575`）；只有 reload 插件或重启 Host 才能恢复。
- 实例释放：`ctx.effect(() => dispose, 'mcp-client.connection')` + `internal/plugin` 钩子（`:824-830`）；`dispose()` 关传输、等 `syncChain`、注销全部 disposer（`:700-716`）。HMR 换实例 = 旧实例 dispose + 新实例 apply，同名 `serverName` 复现同名工具。

---

## 2. Q2 · 官方是否已有工具级 allow/deny/filter 配置？

**mcp-client：完全没有。**（§1.1 已逐字段核对 schema 与 d.ts；README 也无论及。）

官方生态里与「工具可见性」相关的只有这些**通用**能力（都不在 mcp-client 里）：

| 位置 | 能力 | 能否做 MCP 工具级开关 |
|---|---|---|
| `ToolRuntime.restrict(ToolRestriction)`（`dsh-tools`） | 按 **agent 作用域**对**继承来的（global/祖先）工具**做 allow/deny 掩码 | ✅ 唯一能「模型看不到」的官方机制 |
| `ToolRuntime.guard(ToolGuard)` + `tools/pre-execute` | 单调拒绝调用 | ❌ 工具仍可见 |
| `subagent` 的 `toolFilter?: ToolRestriction` | 子 agent 的同一套掩码（`<PKG>\dsh-subagent\lib\types\descriptor.d.ts:78`；落地 `dsh-subagent/lib/index.js:395` 的 `childCtx.tools.restrict(composition.toolFilter)`） | 可复用为**范式参考**，只对新建的子 agent 生效 |
| `tools` 的 `mode: native|ptc` / `presentAs()` | 呈现模式 | ❌ 不做过滤 |
| `system-prompt` 的 `toolOrder` | 只排序 | ❌ |
| `dsh-mcp-resources` 的 3 个共享工具 | 资源访问 | 与工具开关正交 |

结论：**要做工具级开关，必须由第三方插件补上**，可用的官方原语就是 `restrict()`（隐藏+不可派发）与 `guard/pre-execute`（仅拒绝）。

---

## 3. Q3 · 第三方插件能拦截/过滤 mcp-client 的注册或调用吗？全机制表

### 3.1 机制清单（按「能否让模型看不到」排序）

| # | 机制 | 入口 | 效果 | 模型看不到 | 调用真不可用 | 适用模式 |
|---|---|---|---|---|---|---|
| M1 | **`ctx.tools.restrict({allow?,deny?})`** | `dsh-tools/lib/index.js:2991-3006` | 该 agent 作用域可见集合被掩码；`schemas()`、`sdkSchemas()`、`get()`、`resolveExecution()` 共用同一 `view()`（`:3055-3081, 3119-3133, 3107-3112`） | ✅ | ✅（解析不到 → UNKNOWN_TOOL） | native + **ptc** |
| M2 | `ctx.tools.guard(fn)` | `:3016+`（d.ts:522） | 命中即返回拒绝理由；单调，无法被后续监听器翻回允许 | ❌ | ✅ | 两者 |
| M3 | `tools/pre-execute` waterfall | `d.ts:47`，`PreToolDecision`（`d.ts:445-460`）支持 deny/cancel/ask | 派发前允许/拒绝/询问 | ❌ | ✅ | 两者 |
| M4 | `tools/execute` / `tools/post-execute` / `tools/result` | `d.ts:58/70/92` | 包装、替换或阻断结果 | ❌ | 部分（post-execute 的 block 只把结果变错误） | 两者 |
| M5 | `system-prompt/assemble` 改写 `assembly.tools` | 装配点 `<PKG>\dsh-system-prompt\lib\index.js:398` | 只改**本次装配**的工具数组 | ⚠️ **仅 native** | ❌（注册仍在，仍可派发） | native only |
| M6 | agent 作用域注册**同名工具**遮蔽全局（`register`：Scoped tools shadow globals，`d.ts:631-637`） | — | 名字仍在列表（换成桩），语义脏 | ❌ | 可（桩抛错） | 两者 |
| M7 | 直接 dispose mcp-client 的注册 disposer | ❌ 第三方拿不到该 map（`syncTools` 内部私有） | — | ✅ | ✅ | 两者 |
| M8 | 猴补丁 `ctx.tools.register` | Cordis 服务对象可被赋值改写，但无官方 hook 点 | 全局影响所有插件 | ✅ | ✅ | **不推荐**，升级易碎 |
| M9 | `tools/change` 事件（`d.ts:93-102`） | 纯通知 | 只能**观察**注册/注销/限制变化（刻意不做 scope 过滤） | — | — | 驱动 UI 与掩码重算 |

### 3.2 M1 的关键语义（务必按这些约束设计）

1. **必须有 scoped context**：`restrict()` 内部 `scopeOf(this.ctx)`，为 `undefined` 直接抛错「tools.restrict() requires a scoped context (agent.ctx): a context-global restriction would mask every agent」（`dsh-tools/lib/index.js:2992-2993`）。
   → 全局插件里不能直接 `ctx.tools.restrict(...)`。
2. **只过滤「继承来的」工具，永不过滤自己那一层**：`view()` 用 `layers.every(layer => layer.admits(name))` 过滤 inherited，随后**无条件**把 own 层工具塞进 visible（`:3063-3074`；注释 `:3033-3051` 解释了保留这条豁免的原因）。
   → **mcp-client 必须挂在 profile 根（全局层）**；若把 mcp-client 放进 preset（agent 自身层），restrict 就管不到它。
3. **名字必须是当前已知的 global 名**，否则抛错并列出全部已知名（`:3002-3004`）。
   → 开关状态变化、服务器工具增删，都必须**先重算掩码再调用**；不能长期持有含「已消失工具名」的 deny 列表。
4. **空 filter 报错**（`tools.restrict({}) is a no-op`，`:2996`）→ 全开时必须 dispose 那个 restriction，而不是传空对象。
5. **多个 restriction 取交集**（`ToolLayer.admits` 逐个 filter 都必须放行，`:2737-2741`）。
6. **`allow` 是危险的**：allow 列表外的工具全部隐藏 → 服务器以后新增的工具在掩码刷新前一律不可见。**做「逐工具开关」优先用 `deny`**（deny 掉被关掉的那些）。
7. **`run_code` 不可命名**（`:3001`）；PTC 模式要关就关 MCP 工具，PTC 传输本身不能关。
8. **对 PTC 同样有效**：`sdkSchemas()` 也走 `view(scope).visible`（`:3123-3133`）⇒ 关掉的工具会从生成的 SDK 里消失 —— 这是「web 默认 ptc 模式下真的看不到」的硬证据。
9. restriction 随宿主 effect 释放，返回的 disposer 即「恢复」。

### 3.3 在全局插件里安全拿到 scoped ctx 的做法

`<PKG>\dsh-scope` 提供 `createScope(ctx, key)`（README `:29-39`）与 `scopeTarget()`（`:43-46`）；`Agent` 自带 agent 作用域上下文 `readonly ctx: Context`（`<PKG>\dsh-agent\lib\types\runtime-types.d.ts:148-149`）。官方插件拿 agent 的姿势是监听 `agent/created`（serial 事件，`runtime-types.d.ts:227-231`，payload 里有 agent）。

两条实现路径：
- **路径 1（推荐）**：全局插件里 `ctx.on('agent/created', ({agent}) => ...)`，用 `agent.ctx.tools.restrict(...)` 或 `createScope(ctx, agent).ctx.tools.restrict(...)`；注册随 agent dispose 自动解开。一处代码覆盖所有会话。
- **路径 2**：把「开关应用器」做成 preset 子插件（agent 作用域里直接 restrict）。代价：**preset 声明提前加载、修改只影响之后创建的 Agent**（`<PKG>\dsh-agent-preset\README.zh.md:12`）→ 热更新差，不推荐承载开关状态。

### 3.4 「关掉服务器」≠「关掉它的工具」——三个残留面（真实验收必查）

只隐藏 `mcp__<server>__*` 会「看起来关了，其实还能访问」：

1. **`dsh-mcp-resources` 的 3 个共享工具**（`list_mcp_resources` / `list_mcp_resource_templates` / `read_mcp_resource`）由 mcp-client 的 `mcpResources.register()` 喂数据（`mcp-client/lib/index.js:731-734`）。这些共享工具注册在 **mcp-resources 自己的作用域**（全局），服务器名来自作用域注册表 → 不卸载 provider，资源读仍成功，且系统提示词 `MCP resource servers` 段落仍列出该服务器名（`<PKG>\dsh-mcp-resources\README.zh.md:34, 90`）。
2. **服务器 instructions 提示词段落**（`mcp:<server>`，`mcp-client/lib/index.js:735-742`）仍在。
3. **`restrict` 不改变 mcp-client 内部状态**：连接、重连、resources provider 全都活着；「关掉」只是 agent 视野。

⇒ **服务器级开关必须落到「实例不运行」（disable 该 cordis 行）或「代理层拒绝」**；工具级开关用 restrict 即可。最终验收脚本要把这两件事分开测。

---

## 4. Q4 · 能否运行时注销/重注册某服务器的「一部分」工具？

**ToolRuntime 侧：能力齐全，但按所有者分配。**
- `register()` 返回**精确 disposer**（`index.js:2974-2983`）；`restrict()` / `guard()` / `presentAs()` 同样返回 effect disposer；`ctx.effect()` 与 agent scope 都把注销挂在生命周期上。即「注销一部分」在 API 层完全支持 —— **前提是你持有那些 disposer**。
- mcp-client 自己就是这么干的：`syncTools` 第二阶段整代 dispose + 整代 register（`:150-153`），disposer map 存在闭包 `disposers`（`:713-714`）。
- **第三方拿不到该 map**：无导出 getter、无「tools/unregister」公开方法、`tools/change` 只是通知。因此：
  - 想「精确注销某服务器的一部分工具」→ 只能**自建 bridge 自己持有 disposer**（方案 A），或**让工具根本不出现**（方案 D 代理过滤 tools/list），或用 **restrict**（方案 B，不改注册表只改可见性）。
  - 想「靠重载整个 mcp-client 实例换工具集」→ 可以，但**全有或全无**，且每次都要重连（stdio 重启子进程、重跑协商与 tools/list；http 重连会话）。工具多、开关频繁时体验与开销都差。

---

## 5. Q5 · 改 `cordis.patch.yml` 后能热重载吗？运行中的 agent 下一轮能看见吗？

### 5.1 能热重载（前提：HMR 行启用）

- base 组合包默认挂 `hmr` 行，条件 `disabled: !!js "!ctx.get('profileContext')"`，`config.root: []`（`<PKG>\dsh-base\cordis.patch.yml:27-32`）。
- `dsh web` 由启动器提供 `profileContext`；app-boot 明确：**随产品交付的 web 模板实时重载**，其他随附模板只在启动时应用 patch；「启用的 dsh-hmr 会监视 profile manifest 与两份用户 patch 文件」（`<PKG>\dsh-app-boot\README.zh.md:50, 63`）。
- HMR 侧：`watchConfig()` 精确监听目标路径 + 必要父目录，默认 `awaitWriteFinish: true`（Chokidar 2s 稳定窗）；`runExclusive()` 把配置变更、Loader 更新、自动重载串行化；「仅 volatile 变化由 Loader 就地提交」，其余走 `reconcileProfile()` → `recomposeProfile()`（`<PKG>\dsh-hmr\README.zh.md:41, 47, 59, 61, 69`）。
- `disabled`、增删行、`config` 替换都属于普通 Loader 条目更新；`config` 变化（含 serverName）会**原地重载该 mcp-client 实例**：dispose 旧 → apply 新 → 重连 → 重新 tools/list → 工具集换代。README 原话：「编辑配置项会在原地重载服务器连接，未变的名称保持不变」（`mcp-client/README.zh.md:93`）。
- **什么时候必须重启**：HMR 行被禁用/省略（headless、sdk、acp 模板默认禁；或用户 patch 把 hmr 置 disabled）→ 改动只在下次启动生效（`dsh-hmr/README.zh.md:27`）。`<PROFILE>\cordis.patch.yml` 里那句「然后重启 dsh web」的注释，**在当前 web profile 下并非必需**（HMR 由 base 行提供，用户 patch 没禁）；但这是用户既有笔记，产品文案应写「一般实时生效；HMR 被禁用时需重启」，不要断言「必须重启」。

### 5.2 运行中的 agent 下一轮就能看到（硬证据链）

1. agent 每个**步**都重新装配：`preStep()` → `this.loopCtx.systemPrompt.assemble(assembleContextFor(this, signal))`（`<PKG>\dsh-agent-loop\lib\index.js:902-927`）；
2. `assemble()` 每次从 toolProviders 收集 schema，做 `orderTools` 后作为 `assembly.tools`（`<PKG>\dsh-system-prompt\lib\index.js:356-406`，集合点 365-379）；agent-loop 把它放进 `buildRequest(config, preparedCall, assembly.tools, ...)`（`agent-loop/lib/index.js:1075`）。
3. `tools/change` 事件语义即「可用的工具集合变了（可能只对一个 scope）」（`dsh-tools/lib/types/index.d.ts:93-102`）。

⇒ 注册/注销/限制的变更**在下一次模型请求（同 turn 的下一步，或下一 turn）就反映**；不需要重启会话。反之：正在进行的那次请求不受影响；KV cache 前缀会变（与 `mcp-resources/README.zh.md:98` 同类描述）。

### 5.3 官方推荐的持久化写入 API（不要自己 fs.writeFile 写 patch）

| API | 用途 | 关键语义 |
|---|---|---|
| `ctx.pluginManager.setPluginEnabled(id, enabled)` | **服务器级开关**（改 disabled） | `<PKG>\dsh-plugin-manager\lib\types\index.d.ts:100-105`；只更新 profile patch 里**最后一条匹配覆盖项**的 disabled，没有就追加；组合结果已等于目标状态则删冗余覆盖项（README `:40`）；HMR 开启时立即生效；返回 `ChangeResult{changed, application: 'applied'|'restart-required'|'overridden'|'failed', restartReason?, warnings?}`（`types.d.ts:114-144`）；受保护的「管理组件」行不可关（`protectsManager`） |
| `ctx.configEditor.edit(entry, change)` | 改某行的完整 config（新增/改 URL/headers） | `<PKG>\dsh-config-editor\lib\types\index.d.ts:34`；写前验证完整候选值、与 profile 变更/HMR 串行、原子替换覆盖项、保留其他 YAML 注释与 `!!js`；**仅能编辑 profile 根 Include 拥有且可唯一定位的条目**（README `:69`） |
| `ctx.settings` + `configure({auto:false}, ctx.fiber)` | 让插件自身 Config 出现在设置面板 | 只展示 `.volatile()` 字段、按 profile 条目 id 定位、拒绝过期写（`<PKG>\dsh-settings\README.zh.md:12, 33-39`） |
| `ctx.loader.create/update/remove` | 直接增删 Loader 条目 | `<PKG>\cordis-plugin-loader\README.md:36-49`；⚠️ app-boot 的 `recomposeProfile` 会「移除新一代组合不再列出的行」，程序创建的条目不在 profile 组合里 → 下一次 profile 重组合可能被清掉，不适合做持久开关 |

这两个服务在 web profile 下均已挂载（`plugin-manager` 行条件同 HMR；`config-editor` 由 base 提供）；插件内先 `ctx.inject(['pluginManager'], ...)` / `ctx.get('pluginManager')`。

---

## 6. Q6 · `dsh-tool-cordis` 的 cordis_define / cordis_run —— 前提需要纠正

### 6.1 事实：本版本没有这两个模型工具

- `dsh-tool-cordis` 只注册**两个只读检查工具**：`cordis_inspect_list`、`cordis_inspect_query`（`<PKG>\dsh-tool-cordis\lib\index.js:38-98`；`inject = ['tools','cordisInspect']`；README `:1-6` 自述「只读运行时 API 查询」）。
- 全量检索 `<PKG>` 下所有 `*.js` 与 `*.d.ts`：`cordis_define` / `cordis_run` 仅出现在 **client UI 卡片渲染器**（`dsh-client-ui-cordis`、`dsh-cordis-client-runner` 的 client.js、`dsh-client-ui-tool`）与 `dsh-cordis-host-runner` 的**错误文案**里；**没有任何插件注册这两个工具**。
- `dsh-cordis-host-runner` README 明确：Agent 通过 tool-cordis 发现 API、通过 Plugin Manager 安装持久化 bundle；**没有模型工具创建动态定义**。
- 相关服务 `ctx.dynamicCordisRunner`（define/run/stop/undefine、host 半沙箱生命周期、`cordis/request-run`）确实挂在 web-app 组合里（`<PKG>\dsh-web-app\cordis.patch.yml:157-164`），但**不是模型可达工具**。

### 6.2 即使程序化使用动态包，也做不了「接口开关」

动态宿主半运行在 `node:vm` 沙箱（`<PKG>\dsh-cordis-host-runner\lib\types\sandbox.d.ts:1-21`），其 ctx 门面只放行 `effect/on/once/provide/timeout/interval/setTimeout/setInterval/throttle/debounce`（`lib/index.js:550-561`）+ 注入的已声明服务；`ctx.tools` 只剩 `register`（marker 校验过的 harness.defineTool 产物）、`schemas()`、`get()`（**只回 schema 视图，绝不返回 execute**，`lib/index.js:570-585`）。

⇒ 动态包：**不能 import 模块、不能 ctx.plugin() 挂子插件、不能调用 tools.restrict、拿不到 mcp-client 的工具定义**。
⇒ 因此**无法**用动态插件「挂载/卸载 mcp-client 实例」或做「工具过滤层」。这条路线对本案**不可行**（除非改官方包）。

### 6.3 可行的「运行时装卸」替代路径

1. **服务器级开关（推荐）**：`ctx.pluginManager.setPluginEnabled('mcp-xxx', false/true)` —— 持久化 + 热生效，即官方插件页开关的同一实现。
2. **工具级开关**：agent 作用域 restrict（§3.2）或代理过滤（§7-D）。
3. 想要「不重连、只换工具可见性」：**只有 restrict 能做到**（它不触碰连接）。反之，走「重载 mcp-client 行」换工具集必然重连。

---

## 7. Q7 · 「工具级开关」方案对比

前提约束：web 默认 preset = **ptc**（`<PROFILE>\cordis.patch.yml:342`，`presets/ptc.patch.yml:126`）；MCP 服务器当前挂在 **profile 根（全局层）**；restrict 必须有 agent 作用域；「模型看不到」与「真的不可用」是两个必须分别验证的断言。

### 方案 A —— 自研 bridge：自己连 MCP + 按白名单注册

做法：插件自己持有 MCP 连接（`@modelcontextprotocol/client@2.2.0`，mcp-client 的运行时依赖，profile `node_modules\@modelcontextprotocol\client` 已有）；复用官方导出的 `createMcpToolDefinition`（`mcp-client/lib/index.js:179-198`，包的 exports 公开）；自己维护 `Map<publicName, disposer>`，开关某工具 = dispose / 重新 register。

| 维度 | 评价 |
|---|---|
| 开发量 | **中～大**：工具桥 ~150 行 + 传输工厂 ~20 行（照抄 `createTransport`）+ 连接/重连/指令/资源 provider ~300 行（移植 `startConnection` 主体）+ 状态与 UI；总 ~600-900 行 TS |
| 热更新 | **最强**：精确到单个工具、毫秒级；不重连、不动 cordis 配置 |
| 原生 MCP 兼容 | 高（结果投影/图片/超时/错误语义全复用官方实现），但要自己补 mcpResources.register 与 systemPrompt 段落，否则资源工具与指令消失 |
| 风险 | 与官方实现**双份维护**（升级漂移）；需声明精确 peerDependencies（对齐 0.2.1-rc.2）；`publicToolName` 命名规则必须自实现且与官方逐字一致，否则同名工具被判重复注册 |

### 方案 B1 —— 复用 mcp-client + `restrict`（推荐工具级方案）

做法：mcp-client 保持不动（继续全局挂载）；管理器插件（全局）在 `agent/created` 里为每个 agent 维护一份 restriction（`deny: [被关掉的 publicName...]`）；每次开关变化 → dispose 旧 restriction → 重新 restrict（先按当前 knownNames 校验）。

| 维度 | 评价 |
|---|---|
| 开发量 | **最小**：核心 ~60-120 行 + UI，无 MCP 连接代码 |
| 热更新 | **强**：下一次模型请求即生效（native 与 PTC 都生效）；**不重连服务器** |
| 原生 MCP 兼容 | **完全兼容**（完全不动官方桥） |
| 坑 | ① 必须 agent 作用域（agent/created 或 createScope）；② 工具增删/重连后 mask 必须重算（用 tools/change 触发）；③ 只用 deny 别用 allow；④ **不解决资源面残留**（§3.4），关服务器还得配 setPluginEnabled；⑤ 只是「视野」层，mcp-client 仍连着、mcpResources 仍注册 |

### 方案 B2/B3 —— guard 或 assemble 过滤（不推荐）

- `guard` / `tools/pre-execute`：能拒绝，但**模型仍看得见**（不满足需求）。
- `system-prompt/assemble` 改 assembly.tools：仅 **native** 生效；**PTC 模式下 SDK 由 sdkSchemas() 独立生成，看不到这层过滤**（`dsh-tools/lib/index.js:3123-3133`）→ 在默认 ptc preset 下**等于没做**；且注册仍在，直接点名调用仍可执行。

### 方案 C —— 改 mcp-client 配置 / hook

- 配置层：schema 封闭，无 filter（§1.1、§2）⇒ 只能整条目重载换工具集。
- hook 层：无扩展点（不导出 sync hook；只导出 createMcpToolDefinition）。
- 结论：**服务器级开关可行且最省事**（pluginManager.setPluginEnabled）；**工具级开关不可行**（每次开关 = 重连 + 重跑 tools/list，stdio 还会重启子进程；服务器工具多时体验差、易触发重连退避）。

### 方案 D —— 本地过滤代理（mcp-client 指向我们自己的 MCP 服务）

做法：插件在本机起一个过滤用 MCP 服务（stdio 最简单：mcp-client 配 `transport: stdio, command: node, args: ['<插件目录>/proxy.mjs', '--server', '<id>']`），proxy 用 `@modelcontextprotocol/client` 连上游真实服务器，把 tools/list 按白名单裁剪；白名单变化时向 mcp-client 推 `notifications/tools/list_changed` → 其 `onChanged → refreshTools → syncTools` 自动换代（`mcp-client/lib/index.js:602-608, 632-640, 127-161`）。

| 维度 | 评价 |
|---|---|
| 开发量 | **中**：stdio JSON-RPC 循环（按行分隔 ~60 行）+ 上游 client 封装 + 透传 tools/list、tools/call、resources/*、prompts + 白名单文件/控制通道（~200-350 行 JS，可纯 JS 免构建） |
| 热更新 | **强**：工具级即时（发 list_changed，不重连）；服务器级 = 白名单置空/拒绝，或直接 disable 行 |
| 原生 MCP 兼容 | 好（mcp-client 侧行为完全不变：图片/结果投影/超时/重连/指令都走官方路径），代价是多一跳进程、要正确透传资源与通知、注意 toolCallTimeoutMs 叠加 |
| 风险 | 引入子进程与自有协议实现（错误传播、取消、超时要自己保证）；stdio 环境被 `scrubbedParentEnv()` 清洗（`:26-31`）⇒ proxy 不能依赖父进程密钥，需从插件配置/`!!js` 显式传；上游 header/凭据要么 proxy 持有要么透传 |

### 推荐组合（落点）

- **服务器级开关**：`pluginManager.setPluginEnabled`（官方、持久、热生效、与插件页一致）。
- **工具级开关**：优先 **B1（restrict）** —— 开发量最小、PTC/native 双模式正确、不重连，天然满足「看不到 + 调不到」。
- **若要「连资源工具一起断、且不想靠 disable 整行」**：叠 **D（代理过滤）**；或接受 B1 + 同时限制 `list_mcp_resources`/`read_mcp_resource`（但这两个是**全局共享**工具，一刀会砍掉所有服务器 ⇒ 只能靠代理，或在 mcp-resources 侧做 server 级过滤——后者官方无此配置）。
- **方案 A** 只在「必须精确到工具、且完全不依赖 restrict 语义」时值得；维护成本最高。

---

## 8. 真实连通性与「关掉后真的不可用」验收清单

### 8.1 连通性测试（probe，独立于 bridge）

1. 按 config 建 transport（stdio：`StdioClientTransport` + `scrubbedParentEnv()`；http：`StreamableHTTPClientTransport(new URL(url), {requestInit:{headers}})`）；
2. `new Client({name:'dsh-mcp-workbench-probe', version:'0.0.1'}, {capabilities:{}, versionNegotiation:{mode:'auto'}})` → `await client.connect(transport)` → `await client.listTools()` → 得到工具名清单（tag cloud 数据源）→ `await client.close()`；
3. 超时按 README 口径：SDK 默认 60s 协商/发现（`mcp-client/README.zh.md:209`）；成功后立刻关传输，**不要留进程**；
4. stdio 探测会真启动子进程；`failOnStartupError` 只影响 mcp-client，不影响 probe。

### 8.2 「关掉服务器/工具真的不可用」的四层验证（缺一层就不算过）

在真实 web GUI 里新 turn 后：
1. **PTC SDK 文本**里不含被关工具的 `mcp__<server>__<tool>`（对应 `sdkSchemas`，`dsh-tools/lib/index.js:3123`）；
2. **`ctx.tools.get(name, agent)` 为空**，直接派发该名字得到 `ToolNotFoundError` / UNKNOWN_TOOL（`:3107-3112`）；
3. 服务器级关闭后：**资源工具与 `MCP resource servers` 提示词段落**也不再能访问该服务器（只 restrict 工具时这一步**会失败**，见 §3.4）；
4. 重连/重载后不「复活」：关闭状态要跨 HMR 重组合与 Host 重启保持（持久化在 patch 或插件自身 Config/state）。

### 8.3 顺带确认的兼容性事实

- 第三方插件依赖写法：`peerDependencies` 声明 `@deepseek-ai/dsh-*`（参考 `<PROFILE>\node_modules\dsh-context\package.json`、`dsh-chat-import\package.json`），运行时由 launcher 的 runtime resolution 解析官方包（app-boot README `:52-56`；plugin-manager README `:50` 提到 runtime resolution 发布）。
- 前端调宿主方法：宿主类 `extends TypertRemoteService`（参考 `PluginManager`，`<PKG>\dsh-plugin-manager\lib\types\index.d.ts:38`），生成的 `lib/typert.remote-client.d.ts` 形如 `interface TypertRemoteNamespace$... { setPluginEnabled: (...) => Promise<RemoteResult<ChangeResult>> }`，client 侧即可经 `ctx.remote.<namespace>.<method>()` 调用。
- `dsh plugin` / `plugin_manager` 工具在非 Creator 模式默认禁用（`<PKG>\dsh-plugin-manager\README.zh.md:31-33`）；管理器插件不要依赖它，直接注入 `pluginManager` 服务。

---

## 9. 关键坑速查（给 lead 的 3 条）

1. **web 默认 preset 是 ptc**（`<PROFILE>\cordis.patch.yml:342`）。任何「改 assembly.tools / system-prompt/assemble」的过滤在 PTC 下**完全无效**（SDK 由 sdkSchemas() 独立生成）。**唯一正确的官方机制是 ctx.tools.restrict()**，它同时满足「看不到 + 调不到」，且必须从 **agent 作用域**调用（全局插件用 agent/created）。
2. **dsh-tool-cordis 没有 cordis_define / cordis_run**（只有 cordis_inspect_list/query 两个只读工具）；动态包沙箱也不能 import、不能 ctx.plugin()、不能 restrict ⇒「用动态插件挂载/过滤 mcp-client」这条路**不成立**。运行时装卸请用 `pluginManager.setPluginEnabled` / `configEditor.edit`（自动串行 + 热生效），不要自己写 cordis.patch.yml，也别用 `loader.create`（下一次 profile 重组合会被清掉）。
3. **只隐藏 mcp__server__* 工具 ≠ 关掉服务器**：mcp-client 还向 mcpResources 注册了 provider、向 systemPrompt 注册了 mcp:<server> 指令段落（`mcp-client/lib/index.js:731-743`）。验收「关掉后真的不可用」必须同时检查资源工具与提示词段落，服务器级关闭务必落到「实例不运行」。

---

## 10. 未验证 / 需实测项（诚实标注）

- `agent/created` 里 `agent.ctx.tools.restrict()` 的时序：事件是 serial 且在创建完成前 await（`dsh-agent` 类型 `runtime-types.d.ts:214-231`），但「第一个 turn 之前一定装好 restriction」需实测；必要时在 `agent/created` 内用 `createScope(ctx, agent)` 同步注册。
- `pluginManager.setPluginEnabled` 对**用户 patch 里 insert 的行**是否等价（README 说按 id+模块名匹配最后一条覆盖项；预期可行，需实测返回 application）。
- HMR 对 cordis.patch.yml 的 `awaitWriteFinish`（2s 稳定窗）意味着**改文件后约 2-3s 才生效**（UI 应做「生效中」提示）。
- 方案 D 的 `notifications/tools/list_changed` 是否被 SDK 的 onChanged 稳定触发（代码路径已确认存在，未跑通实测）。
- restrict 与 **PTC 的 run_code SDK 缓存**：schema 前缀变化会让 KV cache 失效（与 `mcp-resources/README.zh.md:98` 同类描述），频繁开关显著抬高成本 → UI 应做成「保存后批量生效」。

---

## 11. 证据索引（文件:行）

- mcp-client Config / 命名 / 注册 / 生命周期：`<PKG>/dsh-mcp-client/lib/index.js:26-31, 96-102, 127-161, 179-198, 200-221, 226-255, 434-471, 530-584, 595-675, 700-716, 731-743, 761-767, 773-800, 809-833`；`lib/types/index.d.ts:20-88`；`README.zh.md:55-93, 209`
- MCP SDK 依赖：`<PKG>/dsh-mcp-client/package.json`（`@modelcontextprotocol/client: 2.2.0`）
- ToolRuntime：`<PKG>/dsh-tools/lib/index.js:2737-2741, 2974-2983, 2991-3006, 3016+, 3055-3081, 3107-3112, 3119-3133`；`lib/types/index.d.ts:36-103, 445-522, 527-712`；`README.zh.md:83-95`
- 装配：`<PKG>/dsh-system-prompt/lib/index.js:87-94, 356-406`；`<PKG>/dsh-agent-loop/lib/index.js:902-927, 928-940, 1075`
- HMR / app-boot：`<PKG>/dsh-hmr/README.zh.md:27, 41, 47, 59, 61, 69`；`<PKG>/dsh-app-boot/README.zh.md:50, 52-56, 63, 94, 104`；`<PKG>/dsh-base/cordis.patch.yml:27-32`
- 官方管理 API：`<PKG>/dsh-plugin-manager/lib/types/index.d.ts:38, 100-111`、`lib/types/types.d.ts:114-144`、`README.zh.md:14, 31-44`；`<PKG>/dsh-config-editor/lib/types/index.d.ts:34`、`README.zh.md:33, 41, 69`；`<PKG>/dsh-settings/README.zh.md:12, 33-39`
- 动态插件：`<PKG>/dsh-tool-cordis/lib/index.js:38-98`、`README.zh.md:1-6`；`<PKG>/dsh-cordis-host-runner/lib/index.js:550-585`、`lib/types/sandbox.d.ts:1-21`、`README.zh.md`（无模型工具创建动态定义）；`<PKG>/dsh-web-app/cordis.patch.yml:157-164`
- 作用域：`<PKG>/dsh-scope/README.zh.md:29-46, 60-76`；`<PKG>/dsh-agent/lib/types/runtime-types.d.ts:148-149, 214-231`；`<PKG>/dsh-subagent/lib/types/descriptor.d.ts:78`、`dsh-subagent/lib/index.js:395`
- 资源：`<PKG>/dsh-mcp-resources/README.zh.md:34, 57, 90, 98, 121`
- 用户 profile：`<PROFILE>/cordis.yml`、`<PROFILE>/cordis.patch.yml`（mcp-pharmcube 行；`:342` selectedDefault: ptc）、`<PROFILE>/package.json`
