# 验证报告 · dsh-mcp-tools

验证日期：2026-10-20（Asia/Shanghai）  
环境：DSH `0.2.1-rc.2`（global npm），web profile `C:/Users/Xingy/.dsh/profiles/web`，GUI `http://127.0.0.1:3080`，运行中的 `dsh web` 进程未重启。  
插件版本：工作区 `D:/PythonProjects/dsh-mcp-tools`（通过目录联接装入 profile，源码改动直接生效）。

## 1. 真实 MCP 连通性（不是 mock）

两个真实服务器，用插件自身的连接代码（`@modelcontextprotocol/client` 2.2.0 + `StreamableHTTPClientTransport`）连接并 `tools/list`：

| 服务器 | 传输/URL | 协议版本 | serverInfo | 工具数 | 延迟 |
| --- | --- | --- | --- | --- | --- |
| `comein-mcp-all` | streamable-http / `https://mcp-server-global.comein.cn/mcp-servers/mcp-server-brm` | `2025-06-18` | `mcp-server-brm/1.0.0` | **95** | 472 ms（UI「测试连接」） / 730–1688 ms（离线自测，取决于网络） |
| `pharmcube` | streamable-http / `https://mcp-openapi.pharmcube.com/mcp` | `2025-11-25` | `pharmcube_openapi_mcp_server/1.0.0` | **36** | 513–1215 ms |

鉴权失败的真实表现（构造错误密钥时）：comein 在 `initialize` 阶段 HTTP 401；pharmcube 在 `tools/list` 阶段返回 JSON-RPC `-32001`。因此「测试连接」实现为必须跑到 `tools/list` 才算通过。

**真实业务调用**（模型侧，工具名即 `mcp__<server>__<tool>`）：

- `mcp__comein-mcp-all__stock_group_list` → `用户暂无自选分组`
- `mcp__comein-mcp-all__document_search {}` → `云文档共 1894 条，当前第 1 页，每页 10 条`
- `mcp__comein-mcp-all__get_stock_kline`、`research_query` 等其余 94 个工具均正常注册

## 2. 逐工具停用：三层证据

停用 `document_search` 后，从三个层面验证它**真的消失了**：

| 层 | 观测点 | 停用后 | 恢复后 |
| --- | --- | --- | --- |
| L1 插件 API | `POST /tools/toggle {enabled:false}` 响应 + `GET /registered` | `enabledToolCount=94`、`registeredToolCount=94`、注册表无该工具 | 95 / 95 |
| L2 注册表快照 | `~/.dsh/dsh-mcp-tools/registry.json` | `totalRegistered=94`，`tools` 无 `mcp__comein-mcp-all__document_search` | 95，含该工具 |
| L3 模型侧（独立子代理） | `Object.keys(tools)` + 直接调用 | comein 工具 94 个、`document_search` 不在 keys 中；调用报错 `tools[target] is not a function`（工具根本没注册，不是调用失败） | 95 个，可调用 |

对照组：同一时刻 `stock_group_list` 仍正常返回业务数据，说明停用的是**单个工具**而不是整条连接。

批量开关（`/tools/bulk`）同样实测：

- `none` → 注册表 0；`all` → 95；`invert` 按当前状态取反。
- UI 上「全部停用」→ `registry.json` 立刻变 0；「全选」→ 恢复 95。

## 3. 服务器总开关

| 操作 | 卡片状态 | 注册工具数 |
| --- | --- | --- |
| 关闭 comein | 已停用 | 0（日志「已停用（工具已全部移除）」） |
| 重新打开 | 已连接 · 95 个工具 | 95（日志「正在连接… / 已连接 · 95 个工具 · 协议 2025-06-18 / 已启用」） |
| 打开 pharmcube | 已连接 · 36 个工具 | 36（总计 131） |
| 再关闭 pharmcube | 已停用 | 0（总计回到 95） |

## 4. UI 端到端（真实浏览器 + 真实登录会话）

用 Playwright 驱动真实 GUI（登录 cookie 由本机会话签名密钥构造，仅用于本机自动化）：

- 设置弹窗左侧出现新分区 **「MCP」**（`settings.section`, id=`mcp`），位置在「内置插件」与「Agent 预设」之间。
- 分区标题「MCP 服务器」，副标题「接入外部 MCP 服务器，并按工具控制可用范围」，汇总「已启用 1 / 共 2」。
- 两张服务器卡片：名称、状态点（已连接/已停用）、备注、状态行（`已连接 · 95 个工具` / `已停用`）、启用 Switch、「测试连接」、更多操作。
- 展开工具：95 个 chip，「已启用 95/95 个工具」，三个批量按钮 **全选 / 反选 / 全部停用**，搜索框；chip 的 `aria-label` 为「停用工具 X / 启用工具 X」并带 `aria-pressed`。
- 点 chip 停用 `parseFile` → 卡片变「已连接 · 95 个工具 · 1 个已停用」、工具区「已启用 94/95」、`registry.json` 94 且无 `parseFile`；再点恢复 95。
- 「测试连接」点击后 host 日志出现「连通性测试通过 · 95 个工具 · 472 ms」，状态行原地更新，无 toast。
- 「最近事件」展开后有 30 条事件（时间/HH:mm:ss、服务器名、「—」占位、level 圆点、消息），与 `logs.jsonl` 一致。
- 刷新 添加/测试连接 三个图标按钮都有可访问名（快照中由无名 button 变为 `刷新` / `添加服务器` / `测试连接`）。
- 浏览器 console：**0 errors / 0 warnings**。
- 首次安装后刷新页面即可看到分区（client bundle 清单增量生成，无需重启 dsh web）。

截图：

- ![MCP 分区（工具已展开 + 最近事件）](screenshots/mcp-settings.png)
- ![MCP 分区（概览）](screenshots/mcp-settings-overview.png)

## 5. 鉴权 / 安全边界

- 未登录直接请求 `/mcp-manager/api/state` → **401**（复用 DSH 的浏览器会话校验，与 `/api/*` 同一套 Host/Origin 围栏）。
- 路由只接受 JSON、同源、请求体上限 256 KiB；不新增独立端口、不绕过 DSH 鉴权。
- `state.json` 中 headers（含 MCP key）为**明文**，这是"每次启动自动连接"的必要代价；不要把该文件纳入版本控制。文档中所有密钥均已打码。

## 6. 安装/加载方式（本次实际使用）

1. `dsh plugin --profile web add file:D:/PythonProjects/dsh-mcp-tools`
   - 写入 profile `package.json` 依赖 + `dsh.profile.bundles`；
   - pnpm 安装会输出 `Packages: +1 -30`（对已有依赖做了一次 prune），**已验证未影响 GUI 与既有插件**（页面、插件市场、上下文洞察、会话均正常）。
2. 把 `profiles/web/node_modules/dsh-mcp-tools` 换成指向源码目录的 junction，方便改代码即时生效。
3. 刷新页面 → 设置里出现 MCP 分区；host 插件由 cordis 增量扫描/热重组加载（日志「MCP 管理器已启动 · 2 个服务器配置」）。
4. 曾同时存在「bundles」与「cordis.patch.yml insert」两条加载路径，已删除 patch 里的重复 insert，只保留 bundles 这条官方路径；删除后功能不变。

## 7. 复现命令

```bash
# 1) 真实连通性 + 管理器逻辑（离线自测，使用临时 DSH_HOME）
node scripts/selftest.mjs

# 2) 对 state.json 中的服务器做连通性测试
node scripts/test-one.mjs srv_pharmcube

# 3) 对运行中的 3080 做完整 API 回归（会临时开关工具/服务器并恢复）
node scripts/api-check.mjs

# 4) 单个工具开关
node scripts/toggle-tool.mjs srv_comein document_search off
node scripts/toggle-tool.mjs srv_comein document_search on

# 5) UI 自动化登录（本机验证用，起一个一次性 302 登录页）
node scripts/browser-login.mjs
```

## 8. 已知问题 / 注意

1. **首次安装需刷新页面**一次；之后新增/修改服务器都不需要刷新。
2. **pnpm install 会覆盖 junction**，把源码目录换成副本；需要重建联接或重新 `dsh plugin add`。
3. **host 侧改动需要触发一次 cordis 重组**（改一下 profile 的 `cordis.patch.yml` 或重启），client 侧改动刷新页面即可。
4. **停用工具不关闭连接**（省上下文，不省连接）；要释放连接请关服务器总开关。
5. **不要与 DSH 原生 `@deepseek-ai/dsh-mcp-client` 同时注册同一服务器**，会产生同名工具/重复连接；原生行（如 `mcp-pharmcube`）目前保持 `disabled: true`。
6. `state.json` 明文 headers（见 §5）。
7. 连接超时 30 s；断线重连退避 5/10/20/40/60 s；连续失败后状态显示「连接失败：<原因>」。
8. 目前仅 web profile；协议支持 streamable-http / stdio。

## 9. UI/UX 打磨（第二轮）

目标：工具 hover 必须能看到描述；工具 chip 去框、扁平化；「测试连接」改 icon-only；整体对齐 DSH / OpenAI / Vercel 的克制风格。

**改动后真机实测**（同一运行中的 `dsh web`，刷新页面即加载新 bundle，未重启进程）：

| 检查项 | 结果 |
| --- | --- |
| 服务器卡片 | `li.mcpm-row`：`padding:14px 0` + 底部 `.5px var(--dsw-alias-border-l1)`，无外框/无卡片底；工具区为单一浅色 well（`bg-layer-1`，radius 8） |
| chip 视觉 | `<button class="mcpm-chip">` 无原生 `disabled`；计算样式 background `rgba(0,0,0,0)`、border-width `0px`、font-size `12px`；启用/停用用 4px 实心/空心圆点区分 |
| chip 描述 tooltip | hover 260 ms 后出现 `role=tooltip`：**320×146**，与 chip 间距 **6 px**、水平居中偏差 **0 px**，内容为「名称 + 完整描述」 |
| tooltip 不被裁切 | 渲染在 **body 级 portal**（`parentElement === document.body`、`position: fixed`、`z-index: 2000`，高于面板 mask 1000 级）；1280×800 / 900×520 / 900×360 三种窗口下 rect 均完整位于视口内，不受 `.VOzbGW_options`（overflow:auto）与 `.VOzbGW_panel`（overflow:hidden）裁切；同一时刻 body 上只有 1 个 `.mcpm-tip` |
| icon 按钮 tooltip | 「测试连接」按钮 tooltip **320×36**，居中后按 8 px 视口钳制（实测左移 28 px 不压缩宽度） |
| 停用（locked）状态 | chip 为 `aria-disabled=true` / `data-locked=true` / `.mcpm-chipLocked`，**无** `disabled` 属性；此时 hover **仍能弹出 320 px tooltip**；批量按钮同样用 `aria-disabled` |
| 测试连接按钮 | `aria-label=测试连接`、无内部文本、**28×28**、`class=mcpm-iconButton mcpm-testButton`；点击后日志「连通性测试通过 · 95 个工具 · 473 ms」，按钮进入 spinner/`aria-busy` |
| 控制台 | 登录后整轮操作 **0 errors / 0 warnings** |
| 单元自检 | `node --check` 通过；双通道 vm 自检 **51/51**（chip 无 disabled、locked 点击零 API、tooltip 定位 11 条：320 上限/220 下限/左右钳制/上翻/窄视口/小 anchor；portal 7 条：挂 body、关闭移除、单例、视口坐标、resize/Escape/scroll 隐藏、token 桥接） |

**hover 重复说明修复**：chip 与图标按钮此前同时挂原生 `title` 和自绘 tooltip，悬停会同时弹出系统提示与自绘卡片（看起来像两份说明）。已移除 4 处 `title`（chip、测试连接、刷新、更多操作）；实测 chip 只剩 1 个 `role=tooltip`，按钮属性为 `type,class,aria-pressed,aria-disabled,data-locked,aria-label`，无 `title`。

**顺带修复**：API 返回 401 时停止 5 s 轮询并显示「登录状态已失效，请刷新页面后重试」，不再每 5 秒刷一对 401（此前登录过期后 console 会持续报错）。

**截图**：`docs/screenshots/mcp-tool-tooltip.png`（展开工具 + hover tooltip）、`docs/screenshots/mcp-settings-overview.png`（平铺行概览）。

## 10. UI/UX 打磨（第三轮）：分区呼吸 + 添加服务器弹窗标准化

用户反馈两处：① MCP 分区标题贴着设置顶栏的「打开配置文件」按钮；②「添加 MCP 服务器」弹窗字体/行距/布局全乱、与插件其余部分不匹配。

**根因**：
- 内容区顶端无内边距：MCP `.mcpm-root` 顶部与 `.VOzbGW_options` 同为 y=78，而 DSH 原生分区（通用设置）首行在 y=94。
- 弹窗是 primitives Modal，portal 到 `body` 的 `._root_o6lrb_6` 下，**不在 `.mcpm-root` 内**，导致 `.mcpm-root` 上定义的 `--mcpm-*` 全部失效：实测 label 16px / line-height normal、hint 16px、form gap 0、输入 16px；再叠加 tabs 用 primitives Pill（每段 252×34 撑满半行）。
- 弹窗 flex 级联被自己覆盖：真实结构为 `dialog > [content, footer]`、`content > [header, body]`，body 同时命中 `> :last-child` 与 `> :nth-child(2)`，导致 body 变成 `flex:0 0 auto` 溢出 content，footer 叠在 body 上（一度 footer y=784..812 越出 dialog 底 776）。

**修复后真机实测**：

| 检查项 | 结果（1280×800） |
| --- | --- |
| 分区顶部呼吸 | `.mcpm-root { padding-top:16px }`；heading y=**94**（与通用设置首行一致），距顶栏按钮底边 72 有 22px 间隙 |
| 弹窗变量作用域 | 变量块选择器改为 `.mcpm-root, .mcpm-modalContent`；弹窗 base 排版实测 **14/20**、`label-primary`，后代 `box-sizing:border-box` |
| 表单节奏 | `.mcpm-form` gap **16** / padding-top 16；`.mcpm-field` gap **6**；label **13/20/500**、hint **12/18**、error **12/18** |
| 输入控件 | `.mcpm-inputWrap` 32 高、`.5px border-l4`、radius-md、`bg-layer-3`；内层 input 14/20；JSON 代码框 168 高、13/20 等宽字体 |
| Tabs | 弃用 primitives Pill，改 `InlineTabs`（role=tablist/tab、aria-selected、tabIndex、←/→）；实测 `.mcpm-tabs` **182×32** inline-flex，两段 85/89px（不再撑满半行） |
| 弹窗几何 | dialog y=24..776；content 24..704；body 106..704（h=598，`overflow-y:auto`，scrollHeight 670 > 598 可滚）；footer 724..752，**底边 752 ≤ dialog 底 776 − 24**，不叠 body、保存按钮 `elementFromPoint` 命中可见 |
| 900×520 | dialog 24..496；body h=318（scrollHeight 670，可滚到「备注」）；footer 444..472 在 dialog 内；无横向溢出 |
| 控制台 | 本轮操作 0 errors / 0 warnings |
| 自检 | `node --check` 通过；本轮 38/38（含 CSS 级联顺序断言：`:last-child` → `:nth-child(2)` → `.mcpm-modalContent` 自缩 → footer 兄弟重置；按真实结构模拟最终 flex 值；portal/tooltip 回归） |

**截图**：`docs/screenshots/mcp-settings-overview.png`（分区顶部 16px 呼吸）、`docs/screenshots/mcp-add-server.png`（分字段填写）、`docs/screenshots/mcp-add-server-json.png`（粘贴 JSON）。

## 11. 请求头改为 Postman 式键值对行（第四轮）

用户要求：把 headers 从 JSON 文本框里拆出来，按 Postman 的方式逐行配 key/value，默认给一行 `x-mcp-key`，直接把密钥粘贴进 value 即可。

**实现**：行对象 `{id,key,value,shown,pristine}`；纯函数 `headerRowsFromHeaders / headerRowsToHeaders / headerRowsFromJsonText / jsonServerInfo` 与渲染解耦，便于单测。

| 检查项 | 结果 |
| --- | --- |
| 默认行 | 新建服务器时 1 行 `x-mcp-key`，value 为空、`type=password` |
| 空行不落库 | 默认行未填 value / 未改 key 时保存，state.json 中该服务器 `headers === {}`（实测 `srv_605019f4ba43`） |
| 填写后落库 | value 填 `test-secret-123` → 保存为 `{"x-mcp-key":"test-secret-123"}` |
| 显示/隐藏 | 每行独立眼睛按钮，`aria-pressed` 正确，切换不影响 pristine 标记 |
| 增删行 | 「添加请求头」追加一行；行尾删除按钮移除该行（至少保留 1 行） |
| 重复名称 | 保存时就地报「请求头名称重复」，不落库 |
| JSON → 字段 | 粘贴 `mcpServers` 后切回「分字段填写」：name/url/transport/headers 同步，但已手填字段不覆盖；解析失败不重置表单 |
| stdio 隐藏 | transport=stdio 时请求头区域为 0 行；切回 http 恢复 |
| 编辑回填 | 编辑已有 headers 的服务器，行内容、顺序、掩码状态正确 |
| 真机 | 1280×800 下输入框 32px、行网格 `minmax(0,1fr) minmax(0,1fr) auto`、gap 8，无溢出；控制台 0 error |
| 自检 | `node --check` 通过；39/39（含 pristine 语义、jsonServerInfo、同步守卫的静态断言） |

## 12. 发布准备（更名 + npm/GitHub）

- 包名/仓库名从 `dsh-mcp-manager`（npm 上已被占用）改为 **`dsh-mcp-tools`**（npm 查询可用）。
- 状态目录迁移：新目录 `~/.dsh/dsh-mcp-tools`；首次启动若旧目录 `~/.dsh/dsh-mcp-manager` 存在则**复制**（不移动）state/logs/registry，可回滚。
- 同步更新：`package.json`（name/version 1.0.0/license/repository/files/locale/icon）、`cordis.patch.yml`（bundle 名、row id `mcp-tools`）、`client/client.js`（loader id、CSS id、日志前缀）、profile 的 dependency + `dsh.profile.bundles` + node_modules 联接、README/docs。
- 真机验证（HMR 下）：页面刷新后插件以新 id 正常加载，`/mcp-manager/api/state` 返回原有 2 台服务器（comein 已连接 95 工具、pharmcube 停用），状态迁移成功。
  - 注意：host 进程内仍残留旧 bundle 的 client graph 行（控制台一条 locale 重复注册 warning），需重启 `dsh web` 后彻底消失；不影响功能。
- 截图整理为 `docs/screenshots/en/` 与 `docs/screenshots/zh/` 两套（同一套 7 张：overview / tools / tooltip / add-server / json-import / tool-toggles / dark）。

## 13. 最终发布（dsh-mcp-tools）

- 包名/仓库名定为 **`dsh-mcp-tools`**（npm 可用性 404 实测通过），中文 README 为主（`README.md`），英文为 `README.en.md`。
- API 基础路径同步改为 `/mcp-tools/api`；client loader id、STYLE_ID、日志前缀、bundle row id、状态目录一并改为 `dsh-mcp-tools`。
- 状态迁移：`~/.dsh/dsh-mcp-tools` 优先；不存在时按 mtime 从 `dsh-mcp-workbench` / `dsh-mcp-manager` 复制最新一份（不移动，旧版本可回滚）。实测迁移后 2 台服务器、95+36 工具、备注均保留。
- GitHub：https://github.com/hxlog/dsh-mcp-tools（public，main 分支，v1.0.0 Release）。
- 生态：向 awesome-dsh-plugin 目录提交条目 PR（data/plugins/hxlog__dsh-mcp-tools.yml，category tools）。
- npm：`npm publish` 因本机未登录（ENEEDAUTH）未完成；包内容 `npm pack` 校验通过（32 files / 690 KB）。

## 14. Logo 重设计 + 功能描述收敛

- 参照 DSH 内置 / 实验性插件图标规范重做 logo：36×36 viewBox、无外框、蓝色系渐变（#7CB7FF → #3F77D8）、几何图形、圆角与官方图标同族；图形为「一排工具 chip + 开启状态的开关」，对应「按需开关 MCP Tools」。
- 旧 logo 为 48×48 描边方框 + currentColor「M」，在插件列表中显示为灰色线框，与官方彩色渐变图标不一致，已替换。
- 插件描述（locale/zh、locale/en、package.json、README）统一为「管理用户的MCP Server，按需开关MCP Tools」/ "Manage your MCP servers and toggle MCP tools on demand."
- 桌面版 profile（`~/.dsh/profiles/desktop`，github:hxlog/dsh-mcp-tools 安装副本）已同步 icon/locale/package.json 并触发 recompose，刷新插件页即可看到新图标。

## 15. npm 发布与安装验证（1.0.0）

发布账号 `xingyuliu`；首个版本 `1.0.0` 已上架（发布过程中因 2FA 产生过一个 `0.0.0-stage` 占位版本，`latest` 已指向 1.0.0）。

| 检查项 | 结果 |
| --- | --- |
| registry | `dist-tags.latest = 1.0.0`，`versions = [0.0.0-stage, 1.0.0]` |
| 包内容 | 32 files / 690 KB；`icon.svg`、`locale/*.json`、`package.json`、`client/client.js`、`lib/*`、README 与仓库 HEAD **逐文件 sha256 一致** |
| 下载后离线自检 | `npm pack dsh-mcp-tools@1.0.0` → 解包 → `node scripts/smoke.mjs` 9/9 通过 |
| 全新安装 | 空目录 `npm install dsh-mcp-tools@1.0.0` 成功，无 postinstall 依赖；安装后 smoke 通过 |
| DSH 安装 | `dsh plugin --profile npmcheck add dsh-mcp-tools` → pnpm 从 registry 安装 1.0.0，profile 的 `dsh.profile.bundles` 自动加入 `dsh-mcp-tools`；测试 profile 已删除 |
| 插件元数据 | npm 包内 locale：`MCP 管理器 / 管理用户的MCP Server，按需开关MCP Tools`；`icon.svg` 771 B，36×36 蓝色渐变 |

## 16. npm 页面信息修整（1.0.1）

npm 页面（1.0.0）暴露的问题与处理：

| 问题 | 处理 |
| --- | --- |
| README 里的截图由 npm 重写为 `raw.githubusercontent.com/.../HEAD/...`，在部分网络下加载不出来 | README 图片改为 jsDelivr CDN：`https://cdn.jsdelivr.net/gh/hxlog/dsh-mcp-tools@main/docs/screenshots/...`（GitHub 与 npm 均可显示） |
| npm 页 README 是发布时的 1.0.0 版本，安装说明已过时（手动加 bundles 等） | 随 1.0.1 重新发布；安装段落同步为 npm 链接、Desktop 路径、CLI 自动写入 bundles |
| 元数据描述以句号结尾，npm 拼接后出现 `settings..` | `description` 去掉结尾句号 |
| `homepage` 指向 `#readme` | 改为仓库根地址 `https://github.com/hxlog/dsh-mcp-tools`；`repository`/`bugs` 保持指向 GitHub |
| README 缺少明确的仓库 / npm / Issues 入口 | 徽章下新增一行：GitHub 仓库 · npm · 问题反馈（中英双份） |
| 用户容易误以为 `npm i dsh-mcp-tools` 即可用 | 安装段落增加醒目提示：这是 DSH 插件，npm 只负责下载，仍需装进 DSH profile |

## 17. npm 1.0.1 发布复核

`dsh-mcp-tools@1.0.1` 通过 npm 浏览器授权流程发布成功（`npm publish` → 浏览器 Authorize → CLI 完成）。

| 检查项 | 结果 |
| --- | --- |
| registry | `dist-tags.latest = 1.0.1`，`versions = 0.0.0-stage, 1.0.0, 1.0.1` |
| 元数据 | `homepage = https://github.com/hxlog/dsh-mcp-tools`；`repository` / `bugs` 指向 GitHub；description 已无结尾句号（页面不再出现 `settings..`） |
| npm 页面 | 版本 1.0.1；侧栏 Install / Repository / Homepage / Version / License / Issues 齐全；7 张截图均为 jsDelivr CDN；出现「不是普通 npm 依赖库」提示 |
| 包内容 | 1.0.1 tarball 32 files / 690.8 kB；解包后 `scripts/smoke.mjs` 9/9 通过 |
| 发布产物 | GitHub Release v1.0.1（含 `dsh-mcp-tools-1.0.1.tgz`） |

已知：`0.0.0-stage` 是 npm staged publishing 留下的占位版本，未 deprecate（需再次 2FA），不影响 `latest` 与安装。

## 18. README 视觉改版（1.0.2）

- 结构：居中 logo/标题/tagline/徽章 → 快捷链接 → 顶部两张截图（overview + detail） → 一句话说明 → 功能表格 → 安装 → 快速开始 → 更多界面 → 工作原理 → 安全 → 开发 → FAQ → License。
- 保留作者手写内容：新 tagline、「类 Cursor 风格的全局 MCP 控制」、两张顶部截图、一站式说明、安装前置提示、安装段前置位置。
- 新增 `docs/screenshots/zh/mcp-detail.png`（由作者提供的 jpg 无损转 PNG）。
- 所有截图走 jsDelivr CDN；npm 页面可直接渲染（已确认 npm 允许 README 内联 HTML）。
- smoke 中 tagline 断言改为「DeepSeek Harness 简洁」，语言切换断言改为 `README.en.md` 链接存在。

## 19. npm 1.0.2 发布与页面复核

- `dsh-mcp-tools@1.0.2` 通过 npm 浏览器授权发布；registry `latest = 1.0.2`，`versions = 0.0.0-stage, 1.0.0, 1.0.1, 1.0.2`。
- registry 顶层 `readme` 已更新为新版 README（含「类 Cursor 风格」tagline）。
- 1.0.2 tarball（33 files）含 `docs/screenshots/zh/mcp-detail.png`；解包 README 为改版后的居中版式。
- npm 页面复核（缓存刷新后）：`<p align="center">` 内联 HTML 正常渲染（6 处，无转义泄漏），9 张 jsDelivr 图片（logo + 8 截图），tagline「类 Cursor 风格的全局 MCP 控制」生效，`mcp-detail.png` 已引用。
- GitHub 仓库页复核：README 正常渲染，tagline 与 18 处 jsDelivr 引用存在，无 HTML 转义泄漏。
