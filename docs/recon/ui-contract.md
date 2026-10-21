# DSH MCP 管理器 · UI 契约（与现有 Web UI 完全一致）

> **版本对齐**：`@deepseek-ai/dsh@0.2.1-rc.2`（本机全局安装）+ 正在运行的 Web 前端 bundle
> `dsh-web-frontend/dist/assets/index-CN7NIWNw.js`、`index-BxpfOGf3.css`
>
> **调研方式**：只读源码（官方包 `lib/client.js` 未压缩的可读 bundle、`lib/types/**/*.d.ts`、`locale/*.json`）、
> 只读运行中前端的共享模块表与样式；**未修改 `C:\Users\Xingy\.dsh` 下任何文件，未点击/未发消息/未重启 127.0.0.1:3080**。
> 因此本文的样式与 API 证据比截图更硬：数值全部来自官方 CSS 与 d.ts 原文。
>
> **读者**：后续实现者。照本文写即可得到“和 DSH 设置页/插件页一模一样”的观感。

---

## 0. 结论速览（12 条）

1. 官方 Web 客户端插件 = **host 半侧 `lib/index.js` + 浏览器半侧 `lib/client.js`**。后者是一段
   `window.__ModuleLoader__.load({ id, factory: (require) => {…} })` 的自包含 bundle；唯一入口是
   `exports.apply(ctx)` 与 `exports.inject = [...]`。
2. 浏览器侧**不能随意 import 组件**。运行时只提供固定共享模块白名单（§1.3）；其中
   `@deepseek-ai/dsh-client-ui-primitives` 就是官方 UI 原子库。
3. 新增**设置页分区**：`ctx.slots.inject('settings.section', () => ctx.slots.register({ name:'settings.section', id, order, label, locale, inject }, Section))`。
4. 新增**侧边栏面板**：`main`（keyed，key=PANEL_ID）+ `sidebar.panellist`（list，id=PANEL_ID）**成对注册**，两个 id 必须一致。
5. 设计 token **全部是 `--dsw-*` CSS 变量**，定义在 `dsh-client-ui-theme/lib/client.js`；暗色 = `body[data-ds-dark-theme]`。
   **任何硬编码颜色/字号都会在暗色模式翻车**。
6. 设置面板几何固定：**800×800、`--dsw-radius-panel`(28px)、导航列 188px、内容列 `padding:0 24px 24px`、分区 `max-width:760px`**。
7. 文本层级固定：分区标题 18px/600、页面标题 20px/500/28、正文 14px/22、说明 13px/20、辅助 12px/18。
8. 状态可视化直接复用：`StateDot`（done / warning / ongoing / error / idle）+ `Tag`（success / info / warning / danger / neutral / outline / solid）+ `Switch`。
9. 反馈策略与官方一致：**成功就地显示状态，不弹 toast**；失败原地报错，只有“离开页面也要看见”的失败才 toast；破坏性操作走 `Modal` 二次确认。
10. 运行时 primitives 与 npm 类型有 1 处不一致：`ConfigField` 在 d.ts 里有、运行时共享模块**没有导出**（§8 坑 1）。
11. 推荐落点：**设置页「MCP」分区**（`order` 取 17~18，排在「内置插件」15 与「智能体预设」20 之间）承载全部管理能力；
    侧边栏面板只在确实需要全屏大列表时再加。
12. 文案语气：短句、动词开头、不用感叹号；“无法/未能 + 原因 + 请重试”是官方报错句式（§7.4 文案表）。

---

## 1. 插件形态与运行时加载

### 1.1 package.json 契约

```jsonc
{
  "name": "dsh-mcp-workbench",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".":                { "types": "./lib/index.d.ts", "default": "./lib/index.js" },
    "./client":         "./lib/client.js",
    "./package.json":   "./package.json",
    "./locale/*.json":  "./locale/*.json"
  },
  "files": ["lib/index.js", "lib/client.js", "lib/index.d.ts", "locale/*.json", "cordis.patch.yml"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "inject": ["@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-ui-settings"],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.1-rc.2",
    "react": ">=18.2.0",
    "react-dom": ">=18.2.0"
  }
}
```

证据（同形）：

| 包 | `dsh.client.inject` | 说明 |
| --- | --- | --- |
| `dsh-client-ui-settings-plugins` | `["@deepseek-ai/dsh-client-locale","@deepseek-ai/dsh-client-ui-settings"]` | 注册设置分区的最小集 |
| `dsh-client-ui-settings-agent-loop` | 上面两个 + `"@deepseek-ai/dsh-client-ui-plugin-manager"` | 往插件页塞配置页 |
| `dsh-client-ui-plugin-manager` | `["@deepseek-ai/dsh-api-remotes","@deepseek-ai/dsh-client-locale","@deepseek-ai/dsh-client-ui-layout","@deepseek-ai/dsh-client-ui-sidebar"]` | 侧边栏面板的最小集 |
| 第三方 `dsh-context` | 同上风格（含 `dsh-client-ui-settings`、`dsh-client-ui-sidebar-right`） | 第三方照抄可行 |

> 可选字段 `dsh.compatibility.dshReleases`（见 `dsh-context`：`{"0.1.7-rc.2":"compatible","0.2.0-rc.2":"compatible"}`），
> 用来声明本插件在哪些 DSH 版本上验证过；不做版本闸门时可省略。
>
> `dsh.client.inject` 的语义是“这些插件必须先加载/必须存在”，不是 npm 依赖声明。
> 注册设置分区 → 必须含 `dsh-client-ui-settings`（拿 `configForms`/slot 类型）+ `dsh-client-locale`。
> 注册侧边栏面板 → 必须加 `dsh-client-ui-layout` + `dsh-client-ui-sidebar`。

### 1.2 浏览器半侧 bundle 形态（必须长这样）

```js
window.__ModuleLoader__.load({
  id: "dsh-mcp-workbench",                     // 必须等于包名
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    let react_jsx_runtime = require("react/jsx-runtime");
    let react = require("react");
    let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");

    // …你的实现…

    exports.inject = ["slots", "locale"];     // cordis fiber 服务名
    exports.apply = apply;
    return module.exports;
  }
});
```

官方同一文件里同时做三件事，照抄结构即可：

```js
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "mcp-manager: dictionaries");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("settings.section", () => ctx.slots.register({ … }, McpSection));
}
```

- `ctx.effect(fn, "描述")`：把注册/订阅挂到当前 fiber，插件卸载自动回收。**所有**注册都要包在
  `ctx.effect` 或 `ctx.slots.inject` 的返回值里。
- `ctx.slots.inject(slotKey, () => disposer)`：**等待该 slot 被声明**后同步执行回调（已声明则立即执行），
  折叠时自动回滚。所以**永远不要直接 `ctx.slots.register('settings.section', …)`**，必须包 `inject`。
- 字典命名空间 `NS`（如 `"mcpManager"`）同时用于 `ctx.locale.register` / `bind`，注册时传 `locale: NS`
  就会自动注入 `t` 到组件 props。

### 1.3 运行时共享模块白名单（唯一可 require 的裸模块）

运行中前端 `SZ()` 的返回对象（`index-CN7NIWNw.js` 内 ≈ 偏移 916313）：

```text
react, react/jsx-runtime, react-dom, react-dom/client,
@deepseek-ai/cordis, zod, @tanstack/react-virtual,
@deepseek-ai/dsh-client-store, @deepseek-ai/dsh-client-ui-slots,
@deepseek-ai/dsh-client-ui-primitives, @deepseek-ai/dsh-client-ui-dockkit
```

除此之外的裸模块 require 会在浏览器里抛错。要打**新** npm 依赖，必须打进自己的 bundle（不能 external）。

### 1.4 类型依赖（只为 tsc，不进运行时）

```bash
pnpm add -D @deepseek-ai/dsh-client-ui-primitives@0.2.1-rc.2             @deepseek-ai/dsh-client-ui-slots@0.2.1-rc.2             @deepseek-ai/dsh-client-store@0.2.1-rc.2             @deepseek-ai/dsh-client-ui-settings@0.2.1-rc.2             @deepseek-ai/cordis@4.0.x
```

- npm 上 `@deepseek-ai/dsh-client-ui-primitives` 的 `next` tag 才是 0.2.1-rc.2，`latest` 是 0.0.1-rc.1（别装错）。
- `@deepseek-ai/dsh-client-ui-settings` 只做 `import type`（它声明的 `settings.section` 等 SlotMap 类型需要被 TypeScript 看见）；
  运行时**不要** require 它。
- 官方原话（`dsh-client-ui-plugin-manager/lib/types/client/slot-contract.d.ts` 头注释）：
  “A registrant merges this contract with `import type` and registers through `ctx.slots`; it never imports this package at runtime.”

### 1.5 样式注入（没有 CSS 文件，只有字符串）

官方构建把 `.module.css` 编译成字符串，bundle 里做：

```js
const css = ".mcpM-xxx_root{...}";
const tagId = "dsh-mcp-workbench/McpManager.module.css";
if (typeof document !== "undefined" &&
    document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-mcp-workbench";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
```

类名约定：官方用构建期 hash 前缀（`._8HJdBW_group`、`.VOzbGW_panel`）。第三方用 `mcpm-<局部>` 之类
唯一前缀即可；**不要**写裸 `.card` / `.row` 这种通用名。

---

## 2. 挂载点 A：设置页新增「MCP」分区（推荐主落点）

### 2.1 官方契约（原文证据）

`dsh-client-ui-settings/lib/types/client/contract/slots.d.ts`

```ts
'settings.section': { kind: 'list'; scope: 'root'; owner: SettingsSectionOwnerProps };
// …
export interface SettingsSectionOwnerProps {
  /** Close the settings panel (the shell owns the open state). */
  close: () => void;
}
```

- 渲染位置由 `dsh-client-ui-settings-general`（设置外壳，占 `sidebar.settings`）决定：
  `renderSlot("settings.section", { close }, { only: active })`，即**一次只渲染当前选中的分区**。
- 导航列的 label/order 由外壳读取 `ctx.slots.entries("settings.section")` 排序生成
  （`resolveSlotLabel(e.options.label)`），所以 `label` 必须是 `() => t("nav")`。
- 现有分区与 order（读自各官方 bundle）：`account` -10、`general` 0、`models` 10、`plugins` 15、`agent-presets` 20。
  → **MCP 取 order = 17 或 18**，导航里落在「内置插件」之后、「智能体预设」之前。

### 2.2 注册模板（可直接抄）

```js
const NS = "mcpManager";

const zh = { nav: "MCP", title: "MCP 服务器", intro: "接入外部 MCP 服务器，并按工具控制可用范围" /* … */ };
const en = { nav: "MCP", title: "MCP servers", intro: "Connect external MCP servers and control which tools are available" /* … */ };

function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "mcp-manager: dictionaries");
  const t = ctx.locale.bind(NS);
  const face = /* 你的 controller.inject()：{ hooks, actions… } */ {};

  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "mcp",                       // 导航 key，也用于 openSection("mcp")
    order: 18,
    label: () => t("nav"),
    locale: NS,
    inject: () => face,
  }, McpSettingsSection));
}

exports.inject = ["slots", "locale"];
exports.apply = apply;
```

组件收到的 props = `{ close, t }` + `inject` 产物 +（声明了 children 时）`renderSlot`。

### 2.3 层级关系

```text
<body data-ds-dark-theme?>
└ #root
  └ ui-layout AppFrame（ui-layout 注册 uiLayout）
    ├ sidebar.settings  ← ui-settings-general 的 SettingsRoot（模态对话框，800×800）
    │   ├ navList：settings.section 列表（账户? / 通用设置 / 模型 / 内置插件 / MCP / 智能体预设）
    │   └ options：active 分区内容（我们的 McpSettingsSection）
    ├ sidebar.panellist ← 插件图标行（plugins、dsh-context 等）
    └ main（keyed）↔ 当前面板页（conversation / plugins / …）
```

- 设置面板是**模态**（`position:fixed; z-index:1000`，mask `--dsw-alias-bg-mask-1` + `--dsw-mask-blur`）。
- 我们的分区内容只负责“内容列”，**不要**自己画标题栏/关闭按钮/导航。

### 2.4 内容列版式（必须对齐官方数字）

`dsh-client-ui-settings-plugins/lib/client.js` 内联 CSS（内置插件分区）：

```css
.section { max-width:760px; color:var(--dsw-alias-label-primary);
           display:flex; flex-direction:column; gap:12px; }
.heading { margin:0; font-size:18px; font-weight:600; }                        /* 分区标题 */
.intro   { color:var(--dsw-alias-label-tertiary); margin:0; font-size:13px; }  /* 一行说明 */
.tabs    { border-bottom:.5px solid var(--dsw-alias-border-l2); align-items:flex-end;
           gap:22px; margin-top:2px; display:flex; }
.tab     { color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:20px;
           padding:7px 1px 9px; border:0; background:0 0; cursor:pointer; position:relative; }
.tab[data-active=true] { color:var(--dsw-alias-label-primary); }
.tab[data-active=true]:after { content:""; position:absolute; left:0; right:0; bottom:-1px;
           height:2px; border-radius:2px 2px 0 0; background:var(--dsw-alias-label-primary); }
.empty   { color:var(--dsw-alias-label-tertiary); margin:0; font-size:13px; }
```

外壳内容列：`.options{flex:1; min-height:0; padding:0 24px 24px; overflow-y:auto}` —— 分区自己**不要再加左右 padding**。

---

## 3. 挂载点 B：侧边栏新增「MCP」面板（可选，全屏管理页）

### 3.1 官方契约

- `sidebar.panellist`（`ui-sidebar` 声明，`kind:'list'`, `scope:'root'`）：
  > “Global panel icons. Each list id addresses the matching main panel; the sidebar owns the button and resolves its label from list metadata.”
  owner props：`{ size: number; selected: boolean }`
- `main`（keyed）：`name:'main', key: PANEL_ID`，页面组件挂在 key 下；`ctx.layout.selectPanel(id)` 切换。

### 3.2 注册模板（官方 plugin-manager 同构）

```js
const PANEL_ID = "mcp";   // must be the same string

function apply(ctx) {
  // …
  ctx.slots.inject("main", function* () {
    yield ctx.slots.register({
      name: "main",
      key: PANEL_ID,
      locale: NS,
      inject: () => face,
      children: { /* 需要对外暴露子 slot 时写，如 'mcp.detail.action': {kind:'list',scope:'root'} */ },
    }, McpManagerPage);

    // 可选：离开面板时重置内部视图
    yield ctx.layout.panelInfo.subscribe(() => {
      if (ctx.layout.panelInfo.getSnapshot().activePanelId !== PANEL_ID) { /* reset */ }
    });
  });

  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: PANEL_ID,
    order: 10,                       // 插件=0；越大越靠下
    label: () => t("nav"),
    locale: NS,
  }, ({ size }) => <_primitives.IconApiOutlineRegular size={size} />));
}
```

证据：`dsh-client-ui-plugin-manager/lib/client.js` 末尾（`PANEL_ID="plugins"`，`main` + `sidebar.panellist` 双注册）；
第三方 `dsh-context` 的 `tc()` 等价（`order:20`）。

> 注意：`main` 的注册回调是 **generator**（`function*`，`yield` 多个 disposer），这是布局页“同时注册 slot + 订阅 + 提供 service”的官方写法。
> 简化版可用 `ctx.slots.inject("main", () => ctx.slots.register({...}))`。

### 3.3 与设置分区的取舍

| 维度 | 设置分区（推荐） | 侧边栏面板 |
| --- | --- | --- |
| 语义 | 配置域（服务器/工具/备注） | 一级工作区（像插件页那样带列表-详情导航） |
| 官方先例 | 通用设置、模型、内置插件、智能体预设 | 插件、dsh-context、文件、终端 |
| 空间 | 800×800 模态，内容列 760 | 整页，可 `max-width:960px` |
| 导航成本 | 用户必须点进设置 | 一步直达 |
| 建议 | **MCP 管理器放这里** | 只有做“工具调用日志/大列表”时才加 |

---

## 4. 可复用的官方 React 组件清单

包：`@deepseek-ai/dsh-client-ui-primitives`（运行时 id 同名，来自共享模块表）。以下全部**已确认存在于运行中的共享模块**
（逐个核对过 `index-CN7NIWNw.js` 的导出对象）。

### 4.1 核心控件

| 组件 | export | 关键 props（d.ts 原文摘要） | 在 MCP 管理器里用在哪 |
| --- | --- | --- | --- |
| `Button` | `Button` | `variant?: 'primary'\|'ghost'\|'outline'\|'toolbar'`（默认 ghost）、`size?: 'md'\|'sm'`（36/28px，圆角 12/8）、`icon?: ReactNode`、转发原生 button 属性与 ref | 主按钮「添加服务器」(primary)、「测试连接」「刷新」(outline/ghost)、图标按钮 (ghost+icon) |
| `Switch` | `Switch` | `{ checked, onChange(next), label /* 无障碍名，不是可见文案 */, disabled?, title?, className? }` | 服务器总开关、单工具开关；`label` 用 `启用 {name}` |
| `Tag` | `Tag` | `tone?: 'outline'\|'solid'\|'neutral'\|'quiet'\|'success'\|'info'\|'warning'\|'danger'`、`children` | 状态标签：已连接(success)/连接失败(danger)/连接中(warning)/已停用(neutral)/工具数(info) |
| `StateDot` | `StateDot` | `{ state:'done'\|'warning'\|'ongoing'\|'error'\|'idle', size?, appearance?:'dot'\|'step' }`（aria-hidden，需配文字） | 卡片状态点 |
| `Tooltip` | `Tooltip` | `{ label, side?:'right'\|'bottom'\|'top', delayMs?, maxWidth?, portal?, disabled?, children }`；**会给子元素注入 ref** | 工具 chip 悬浮描述；被截断的服务器名/URL |
| `Modal` | `Modal` | `{ open, onClose, title, closeLabel(非 headless 必填), description?, children?, footer?, className?, contentClassName?, headless?, backdropBlur?, shortcutModal?, onKeyDownCapture? }` | 添加/编辑表单；删除确认 |
| `Toast` | `Toast` | `{ text, icon?, tone?:'success', actions?: [{label, prefix?, onClick}], holdMs?=3000, anchor?, onDone }`；**portal 到 body**，受控卸载 | 保存失败/刷新失败等“离开页面也要看到”的失败 |
| `Input` | `Input` | `{ icon?: ReactNode(16px), …InputHTMLAttributes }`，转发 ref | URL、名称、搜索框 |
| `Checkbox` | `Checkbox` | `{ checked, onChange(next), label, disabled?, title?, className? }` | 批量启用工具 |
| `Menu` | `Menu` | `{ open, anchor, items?: [{id,label,icon?,disabled?,danger?,shortcut?,submenu?}\|{type:'separator'}\|{type:'label'}], selectedId?, onSelect?, onClose, align?, side?, portal?, dense?, compact?, footer?, className?, listClassName? }` | 「更多」菜单（批量操作/导入 JSON） |
| `MenuItemButton` | `MenuItemButton` | `{ children, icon?, shortcut?, disabled?, danger?, separatorBefore?, onSelect }` | 自定义行菜单项 |
| `MenuGroup` / `MenuSurface` | 同名 | 分组标题 / 浮层容器 | 批量操作菜单分组 |
| `Pill` | `Pill` | `{ active?, className?, children, onClick?, …ButtonHTMLAttributes }`（传 onClick 渲染 button） | **工具 tag cloud 的 chip**（active=启用） |
| `SegmentedTabs` | `SegmentedTabs<Value>` | `{ items: [{value,label,id,panelId}], value, onChange, label, className? }` | 「粘贴 JSON / 分字段填写」切换 |
| `SegmentedControl` | 同名 | 分段控件（无面板语义） | 视图切换 |
| `DisclosureRow` | `DisclosureRow` | `{ icon, title, open, expandable, onToggle, running?, collapsedContent?, headerAccessory?, children, … }`（memo） | 服务器卡片展开工具区 |
| `TextShimmer` | `TextShimmer` | `{ active, children, className?, contentClassName? }` | 「连接中…」文字呼吸 |
| `JsonBlock` / `JsonTree` | 同名 | JSON 展示（高亮 / 可折叠） | 粘贴预览、tool inputSchema |
| `MarkdownText` / `CodeBlock` | 同名 | Markdown / 代码块 | 工具描述 |
| `HoverCard` / `HoverCardGroup` | 同名 | `{ anchor, content, openDelayMs?, variant?:'compact'\|'preview', inline?, grouped?, disabled? }` | 工具详情卡（可放长描述） |
| `RiskConfirmation` | 同名 | `{ open,title,description,acknowledgeLabel,cancelLabel,closeLabel,confirmLabel,acknowledged,disabled?,onAcknowledgedChange,onCancel,onConfirm }` | 高风险删除的勾选确认 |
| `ShortcutKeys` | 同名 | 键位展示 | 快捷键提示（可选） |
| `writeClipboard` / `relativeTime` / `focusWithoutRing` / `closeTopModal` | 同名 | 工具函数 | 复制 URL、时间显示 |

### 4.2 Settings 表单家族（若 MCP 配置写进 host settings）

| export | 说明（d.ts） |
| --- | --- |
| `SettingsForm` | 表单框：`{ labels:{unavailable,readOnly,saveFailed,save,saving}, state:SettingsFormShell, onSave, onDiscard, children }`；**唯一的写入点是 save** |
| `SettingsValueField` | 单值字段：`{ id,label,hint?,help?,text,overridden,invalid,overriddenLabel,resetLabel,invalidLabel,disabled,onEdit,onReset,numeric?,placeholder? }` |
| `SettingsSecretField` | 写-only 凭据：`{ id,label,hint,text,disabled,onEdit,configured,stateLabel }`（**不要**把 token 回显） |
| `SettingsFormModel` | `new SettingsFormModel(scope, [settingsTextField('a'), settingsNumberField('b')])` → `.bind(selector)` / `.shell()` / `.field(name)` / `.actions()` / `.dispose()` |
| `settingsTextField` / `settingsNumberField` | 字段 spec 工厂（parse/format 内置） |

> 若 MCP 服务器列表是**结构化数组**（不是扁平 scalar 配置），建议自己走 host Remote（另一份契约文档负责），
> 只在「备注/超时」这类单值配置上复用 SettingsForm。

### 4.3 图标

`icons/index` 导出 ~250 个：`Icon<名字><Outline|Fill><Regular|Medium>`。MCP 管理器常用：

| 用途 | export |
| --- | --- |
| 侧边栏面板 / 分区图标 | `IconApiOutlineRegular`、`IconPluginPinwheelOutlineRegular`、`IconDatabaseOutlineRegular` |
| 添加 | `IconPlusOutlineRegular` / `IconPlusOutlineMedium` |
| 测试/刷新 | `IconRefreshOutlineRegular`、`IconLoadingOutlineRegular`（旋转）、`IconCheckOutlineRegular` |
| 失败/警告 | `IconWarningTriangleOutlineRegular`、`IconCloseCircleFillMedium`、`IconInfoOutlineRegular` |
| 连接 | `IconLinkOutlineRegular`、`IconGlobeOutlineRegular` |
| 工具 | `IconSkillOutlineRegular`、`IconListPenOutlineRegular`、`IconSlidersTwoOutlineRegular` |
| 删除 | `IconTrashOutlineRegular` |
| 展开 | `IconChevronDownOutlineRegular`、`IconChevronRightOutlineRegular`、`IconEllipsisOutlineRegular` |
| 搜索 | `IconSearchOutlineRegular` |
| 关闭 | `IconCloseOutlineRegular` |

图标 props（`icons/props.d.ts`）：`{ size?: number; className?: string }`，**颜色随 `currentColor`**。

### 4.4 没有导出的东西 + 官方替代写法

| 缺什么 | 官方怎么做 | 照做 |
| --- | --- | --- |
| `EmptyState` 组件 | 没有。空态就是一行 `<p class="…empty">`，13px + `--dsw-alias-label-tertiary` | 直接写 `<p>` |
| `Spinner` 组件 | 没有独立组件；官方用 `IconLoadingOutlineRegular` + `animation:spin 1s linear infinite`，并 `@media (prefers-reduced-motion:reduce){animation:none}` | 自建 8 行 CSS |
| `Textarea` | 没有导出 | 原生 `<textarea>` + token 样式 |
| `Badge` | 用 `Tag` | — |
| 确认对话框 | `Modal` + footer 两个 `Button` | 见 §6.5 |
| CSS-in-JS / tailwind | 构建期内联 CSS 字符串 | §1.5 |

---

## 5. 设计 token（全部来自官方，禁止自创）

### 5.1 来源与切换机制

| 内容 | 文件 | 说明 |
| --- | --- | --- |
| 变量定义（唯一真源） | `dsh-client-ui-theme/lib/client.js` → `design_platform_css_default`、`base_css_default`、`focus.css`、`scrollbar.css` | 全部以 `<style>` 注入 `body` / `:root` |
| 主题切换 | 同文件的 `DocumentThemeService` | 写 `body[data-ds-dark-theme]`；插件只需用变量 |
| 字体变量 | `ui-theme` 的字体设置写 `--dsh-font-family-text` / `--dsh-font-family-code` | 官方 CSS 用 `--dsw-font-family`、`--ds-font-family-code` |
| 框架 token | `ui-layout` 写 `--dsh-frame-*` | 桌面端顶部留白 |

### 5.2 关键 token 表（Light / Dark）

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--dsw-alias-bg-base` | #fff | #151517 | 应用底色 |
| `--dsw-alias-bg-layer-1` | #fff | #232324 | 一层卡片 |
| `--dsw-alias-bg-layer-2` | #fff | #2c2c2e | **设置面板底**、二层卡片 |
| `--dsw-alias-bg-layer-3` | #fff | #353638 | 三层/hover 面 |
| `--dsw-alias-label-primary` | #0f1115 | #f9fafb | 主文字 |
| `--dsw-alias-label-secondary` | #61666b | #cfd3d6 | 次文字 |
| `--dsw-alias-label-tertiary` | #81858c | #adb2b8 | 说明/空态 |
| `--dsw-alias-label-caption` | #adb2b8 | #81858c | 极高次（11px 提示） |
| `--dsw-alias-border-l1` | #0000000a | #ffffff0f | 最浅分隔 |
| `--dsw-alias-border-l2` | #0000001a | #ffffff1f | **行分隔线（.5px）** |
| `--dsw-alias-border-l3` | #0000001f | #ffffff29 | 卡片描边 |
| `--dsw-alias-border-l4` | #00000029 | #ffffff33 | 强调描边 |
| `--dsw-alias-interactive-bg-hover` | #2631480f | #ffffff14 | 所有 hover 底色 |
| `--dsw-alias-state-business-primary` | #4176e6 | #7aaaff | 品牌/焦点 |
| `--dsw-alias-state-success-primary` | #22c55e | #22c55e | 连接成功 |
| `--dsw-alias-state-error-primary` | #ec1313 | #f25a5a | 连接失败/删除 |
| `--dsw-alias-state-warn-primary` | #f59e0b | #f59e0b | 连接中/注意 |
| `--dsw-alias-bg-skeleton` | #0000000a | #ffffff14 | 骨架屏 |
| `--dsw-alias-bg-mask-1` | #0000003d | #00000080 | 模态遮罩 |
| `--dsw-alias-settings-card-fill` | `var(--dsw-alias-bg-layer-2)` | 同 | 设置卡片底 |
| `--dsw-alias-settings-card-stroke` | `var(--dsw-alias-border-l4)` | 同 | 设置卡片描边 |
| `--dsw-elevation-prominent` | `0 0 0 .5px var(--dsw-elevation-stroke-color), 0 3px 8px #0000000a, 0 0 20px #0000000d` | 同（描边随色） | **设置面板阴影** |
| `--dsw-mask-blur` | `none` | `none` | 遮罩 blur（桌面端可覆盖） |

圆角（`base.css`，`:root`）：

```css
--dsw-radius-xs:4px; --dsw-radius-sm:8px; --dsw-radius-md:12px;
--dsw-radius-lg:16px; --dsw-radius-xl:20px; --dsw-radius-panel:28px;
```

字体/动效/焦点/滚动条：

```css
--dsw-font-family: <系统栈>;      --ds-font-family-code: <等宽栈>;
--ds-transition-duration:.2s;   --ds-transition-duration-fast:.1s;  --ds-transition-duration-slow:.3s;
--ds-ease-in-out:cubic-bezier(.4,0,.2,1);
--dsw-focus-ring-width:2px;     --dsw-focus-ring-color:var(--dsw-alias-state-business-primary);
--dsh-scrollbar-thumb / -hover / -width:5px;   /* 容器内可覆盖 */
```

### 5.3 从官方 CSS 抄出来的尺寸常量

| 场景 | 值 | 来源 |
| --- | --- | --- |
| 设置面板 | `800×800`，`height:min(800px, calc(100vh - 2*max(24px, var(--dsh-frame-overlay-top,24px))))`，`radius-panel`，`bg-layer-2`，`elevation-prominent` | settings-general `.panel` |
| 设置导航列 | 188px，`padding:22px 12px 0`，`gap:18px`；标题 16/500/24；导航行 40px、`radius-md`、`padding:9px 16px 9px 12px`、14/400/22 | settings-general `.nav*` |
| 设置内容列 | `padding:0 24px 24px`；header 54px | settings-general `.options/.header` |
| 分区内容 | `max-width:760px`，`gap:12px` | settings-plugins `.section` |
| 分区标题 / 说明 | 18/600 · 13/20 tertiary | settings-plugins |
| 页面标题 | 20/500/28；页面说明 13/20 secondary | plugin-manager `.pageTitle/.pageIntro` |
| 页面容器 | `max-width:960px`、`padding:0 clamp(24px,4vw,48px) 48px`、`gap:32px` | plugin-manager `.page` |
| 行 | `padding:16px 0` + `border-bottom:.5px solid var(--dsw-alias-border-l2)`；标题 14/20，描述 12/18 secondary | settings-general `.row` |
| 列表卡片 | 卡片 `radius-xl`(20) `margin:0 -8px`；头 `padding:8px` `gap:14px`；图标 48×48 `radius-lg` `border:.5px border-l3`；标题 14/500/20；描述 13/18 tertiary 单行省略 | plugin-manager `.card*` |
| 更密的行 | `padding:12px 2px`，行图标 40×40 `radius-md`，行标题 13.5/500/20，模块名 11.5/16 等宽 | plugin-manager `.row*` |
| 图标按钮 | 28×28，`radius-sm`，caption 色，hover `interactive-bg-hover` | plugin-manager `.iconButton` |
| 骨架屏 | `background:var(--dsw-alias-bg-skeleton)` + `animation:2s cubic-bezier(.36,0,.64,1) infinite` 透明度呼吸；`prefers-reduced-motion` 关闭 | plugin-manager `.skeleton*` |
| 状态标签 | 高 18px、`padding:0 7px`、字号 10 | plugin-manager `.statusTag` |
| 焦点环 | `outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary)); outline-offset:2px` | settings-plugins `.tab:focus-visible` |
| 视觉隐藏 | `clip:rect(0 0 0 0); width:1px; height:1px; position:absolute; overflow:hidden` | settings-general `.hiddenLabel` |

### 5.4 官方 CSS 写法范例（可直接用作 chip / card）

```css
/* 工具 chip */
.mcpm-chip {
  display:inline-flex; align-items:center; gap:6px;
  height:26px; padding:0 10px;
  border:.5px solid var(--dsw-alias-border-l3);
  border-radius:var(--dsw-radius-sm);
  background:transparent; color:var(--dsw-alias-label-primary);
  font:inherit; font-size:12px; line-height:18px; cursor:pointer;
}
.mcpm-chip:hover { background:var(--dsw-alias-interactive-bg-hover); }
.mcpm-chip[aria-pressed="false"] {
  color:var(--dsw-alias-label-tertiary);
  border-style:dashed;
}
.mcpm-chip:focus-visible {
  outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset:2px;
}

/* 服务器卡片 */
.mcpm-card {
  border:.5px solid var(--dsw-alias-settings-card-stroke);
  border-radius:var(--dsw-radius-lg);
  background:var(--dsw-alias-settings-card-fill);
  padding:12px 14px;
}
.mcpm-cardTitle { font-size:14px; font-weight:500; line-height:20px; }
.mcpm-cardDesc  { color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:18px; }
```

---

## 6. 交互状态矩阵（Cursor 风格 MCP 管理器）

### 6.1 服务器卡片状态机

| 状态 | 触发 | 视觉 | 文案（zh） | 可操作 |
| --- | --- | --- | --- | --- |
| `enabled-idle` | 已启用，尚未测试 | 开关 on；`StateDot idle`；工具区折叠 | `已启用` | 测试 / 展开 / 编辑 / 删除 / 关闭 |
| `disabled` | 用户关闭服务器 | 开关 off；标题降 `label-secondary`；工具区置灰不可点 | `已停用` | 打开 / 编辑 / 删除 |
| `testing` | 点「测试连接」 | 按钮 `测试中…` + 旋转图标 + disabled；`Tag warning` | `连接中…` | 仅取消（可选） |
| `connected` | 测试/启动成功 | `StateDot done`；`Tag success` | `已连接 · {count} 个工具` | 全部 |
| `connected-partial` | 有工具被关闭 | `StateDot done` + `Tag info` | `已连接 · {count} 个工具 · {off} 个已停用` | 全部 |
| `failed` | 连接/握手失败 | `StateDot error`；`Tag danger`；错误行 error 色 | `连接失败：{reason}` | 重试 / 编辑 / 删除 |
| `config-error` | URL/headers/JSON 非法 | `Tag warning`；错误行 error 色；开关禁用 | `配置有误：{fieldMessage}` | 编辑 / 删除 |
| `unavailable` | host 不提供 MCP 能力 | 整页提示，不渲染列表 | 见 §6.7 | — |
| `loading` | 首次拉列表 | 骨架卡片（4 行） | `正在读取 MCP 服务器…` | — |

卡片结构（官方 plugin-manager 同构）：`图标(48px) + 主列(标题行[名称+Tag] + 描述行[备注/URL]) + 尾部(开关 + 图标按钮组)`；
展开后在卡片内出现工具区（`DisclosureRow` 或自建折叠），**不要把工具区做成第二个页面**。

### 6.2 连通性测试按钮

| 阶段 | 视觉 | 文案 | 行为 |
| --- | --- | --- | --- |
| idle | `Button variant=outline size=sm icon=IconRefreshOutlineRegular` | 测试连接 | 点击 → testing |
| loading | 同上，icon=`IconLoadingOutlineRegular` 旋转，`disabled` | 测试中… | 忽略重复点击 |
| success | 按钮恢复；`StateDot done` + `Tag success` | 已连接 · {count} 个工具 | **不弹 toast** |
| fail | 按钮恢复；卡片 error 行 | 连接失败：{reason} | 可重试；toast 仅在用户已切走页面时（`holdMs≈5000`） |
| timeout | 失败的一种 | 连接超时，请检查 URL 或网络 | 同上 |

官方细节（`ui-plugin-manager` README）：手动刷新/测试点击 **500ms 后**才显示 tooltip；加载指示至少显示 **400ms** 防闪烁；
成功后**不 toast**；失败保留旧内容 + 失败 toast + 可重试；首次成功读取前的失败 → 原位错误 + 「重试」（不 toast）。

### 6.3 工具 tag cloud

| 元素 | 规格 |
| --- | --- |
| 容器 | `display:flex; flex-wrap:wrap; gap:6px; padding-top:8px`；上方一行 `已启用 {on}/{total} 个工具` |
| chip | `Pill`（`active` = 启用）或自建 §5.4 `.mcpm-chip`；高 26px、12px 字、`radius-sm` |
| 关闭态 | 文字 `--dsw-alias-label-tertiary` + 虚线边框（或 `opacity:.55`），**不要删除 chip**（用户要能再开） |
| tooltip | `Tooltip({ label: tool.description ?? tool.name, side:"top", delayMs:400, maxWidth:360 })`，外层套 `<span>`（Tooltip 给子元素注入 ref，Pill 不是 forwardRef） |
| 搜索 | `Input({ icon:<IconSearchOutlineRegular size={16}/> })`，占位 `搜索工具`，客户端过滤 name/description |
| 全选/反选 | 两个 `Button variant=ghost size=sm`：`全选` / `反选`；或 `Checkbox` 「全选」 |
| 空态 | 搜索无结果 → `没有匹配的工具。`；服务器无工具 → `这个服务器没有提供任何工具。` |
| 计数 | `共 {count} 个`、`{count} 个已停用`（官方原句：`共 {count} 个` / `{count} 已停用`） |
| 长列表 | 超过 ~200 个工具时 `max-height:240px; overflow:auto` |
| 语义 | chip 用 `<button aria-pressed={on}>`，`aria-label` 用 `启用工具 {name}`；不要用纯 div |

### 6.4 添加 / 编辑表单

两种入口并存，用 `SegmentedTabs` 切换：

| 模式 | 内容 | 校验 |
| --- | --- | --- |
| `粘贴 JSON` | 一个 `<textarea>`（等宽 `--ds-font-family-code`），占位给 `{ "mcpServers": { … } }` 示例；下方 `JsonBlock` 预览 | 解析失败 → 字段下方 error；支持 Cursor/claude 风格 `{mcpServers:{name:{url,headers}}}` 自动拆条 |
| `分字段填写` | `名称*`(Input) · `传输方式`(SegmentedTabs: `streamable-http` / `sse`) · `URL*`(Input) · `请求头`(textarea，`Key: Value` 每行一条) · `备注`(textarea) | 名称非空且唯一、URL 必须 `http(s)://`、headers 每行含 `:` |

- 表单放在 `Modal`（`title="添加 MCP 服务器"` / `编辑 MCP 服务器`），`footer` = `取消` + `保存`（`variant=primary`）。
- 保存中：主按钮 `保存中…` + disabled；失败：留在对话框，错误 + 保留草稿。
- 首个输入框加 `data-modal-autofocus`（Modal 官方约定），不要 React `autoFocus`。
- 编辑态在 footer 左侧放 `删除`（危险色）。

### 6.5 删除确认

`Modal` + footer：

```text
标题：删除 MCP 服务器
描述：删除后，{name} 上的全部工具都会从会话中移除，且无法恢复。
按钮：取消（outline）  /  删除（primary，颜色覆盖为 var(--dsw-alias-state-error-primary)）
```

- `Button` 没有 `danger` variant（只有 primary/ghost/outline/toolbar）：危险按钮 = `variant=primary` + 类覆盖背景为
  `var(--dsw-alias-state-error-primary)`，或 `variant=outline` + error 文字色。
- 高风险场景可换 `RiskConfirmation`（需勾选「我已了解」才能确认）。
- 删除中：`删除中…` + disabled；失败保留对话框 + 错误行。

### 6.6 备注字段

- 多行 `<textarea rows=2>`，label `备注（可选）`，hint `只用于你自己识别，不会发送给模型`。
- 卡片描述行优先显示备注，其次 `transport · url`；过长单行省略 + `Tooltip` 全量。
- 备注不参与连通性/工具发现。

### 6.7 空态 / 加载 / 不可用

| 场景 | 官方写法 | 我们的文案 |
| --- | --- | --- |
| 无服务器 | `<p class=empty>`（13px tertiary） | `还没有添加 MCP 服务器。` |
| 首次加载 | 分组标题占位 + 4 行骨架卡片（呼吸），无障碍文案 | `正在读取 MCP 服务器…` |
| 读取失败（无缓存） | 原位 error + `重试` | `无法读取 MCP 服务器，请检查网络后重试。` |
| 读取失败（有缓存） | 保留列表 + toast | `刷新失败，请重试` |
| 部署不提供 MCP | 整页一行说明，不渲染控件 | `本部署没有可管理的 profile，无法管理 MCP 服务器。` |
| 无工具 | 折叠区内一行 | `这个服务器没有提供任何工具。` |

### 6.8 无障碍 / 键盘

- 开关 `label` = `启用 {name}` / `启用工具 {name}`；chip `aria-pressed`；`StateDot` 是 aria-hidden，务必配文字。
- 所有可点区域必须 `:focus-visible` 有焦点环（全局 token 已给默认，自建元素用 §5.4 写法）。
- 模态：`Modal` 自带 Escape/遮罩点击/焦点返回；首个输入框用 `data-modal-autofocus`。
- Toast：`holdMs` 5s 用于可读的失败句；成功不用 toast。
- 测试按钮进入 loading 时 `aria-busy`。
- 减少动效：`@media (prefers-reduced-motion:reduce){ animation:none; }`。

---

## 7. 线框图 / 组件树 / 中文文案

### 7.1 设置分区版线框（推荐）

```text
┌─ 设置 ─────────────────────────────────────────────────────────────┐
│ 设置   │  MCP 服务器                                           [×]  │
│ ─────  │  ────────────────────────────────────────────────────────  │
│ 通用设置│  接入外部 MCP 服务器，并按工具控制可用范围                  │
│ 模型    │                                                          │
│ 内置插件│  已启用 2 / 共 3                    [刷新] [+ 添加服务器]  │
│ ▸ MCP  │  ───────────────────────────────────────────────────────  │
│ 智能体  │  ⬤ pharmcube                      [● 开]  [测试] [⋯]     │
│ 预设    │    streamable-http · mcp-openapi…                        │
│        │    已连接 · 35 个工具 · 3 个已停用                        │
│        │    ┌─────────────────────────────────────────────────┐   │
│        │    │ 已启用 32/35 个工具           [全选] [反选]      │   │
│        │    │ [搜索工具…]                                     │   │
│        │    │ (批量查询)(单股行情)(财报摘要)(研报检索)(公告列表)│   │
│        │    │ (行业分类)（宏观指标）（ETF成分）…              │   │
│        │    └─────────────────────────────────────────────────┘   │
│        │                                                          │
│        │  ⬤ akshare-mcp                   [○ 关]  [测试] [⋯]     │
│        │    https://…/sse · 已停用                                │
│        │                                                          │
│        │  ⬤ bad-server                    [● 开]  [测试] [⋯]     │
│        │    ！连接失败：HTTP 401 Unauthorized        [重试]         │
└────────────────────────────────────────────────────────────────────┘
```

### 7.2 侧边栏面板版线框（可选）

```text
┌ 侧栏 ┐┌─ MCP ─────────────────────────────────── [刷新] [添加服务器] ┐
│ 会话  ││ MCP                                                   │
│ 文件  ││ 接入外部 MCP 服务器，并按工具控制可用范围                │
│ MCP ◀ ││                                                       │
│ 插件  ││ ┌───────────────────────────────────────────────────┐ │
│      ││ │ ⬤ pharmcube  已连接 · 35 个工具        [测试] [⋯] │ │
│      ││ │   streamable-http · https://mcp-openapi…          │ │
│      ││ │   (批量查询)(单股行情)(财报摘要)…                  │ │
│      ││ └───────────────────────────────────────────────────┘ │
│      ││ ┌───────────────────────────────────────────────────┐ │
│      ││ │ ⬤ bad-server  连接失败：HTTP 401       [重试] [⋯] │ │
│      ││ └───────────────────────────────────────────────────┘ │
└──────┘└───────────────────────────────────────────────────────┘
```

### 7.3 组件树

```text
McpSettingsSection({ close, t, …inject })          // settings.section id="mcp"
├─ <div class=section>                             // max-width:760px; gap:12px
│  ├─ <h2 class=heading>{t("title")}</h2>
│  ├─ <p class=intro>{t("intro")}</p>
│  ├─ <div class=toolbar>
│  │  ├─ <span class=summary>{t("summary",{on,total})}</span>
│  │  ├─ Button(variant=outline,size=sm,icon=refresh){t("refresh")}
│  │  └─ Button(variant=primary,size=sm,icon=plus){t("add")}
│  ├─ <ul class=cards>
│  │  └─ <li><ServerCard server={s}>
│  │       ├─ StateDot(state=done|error|ongoing|idle)
│  │       ├─ IconCard(48×48, radius-lg, border-l3)
│  │       ├─ <div class=cardMain>
│  │       │  ├─ <div class=titleRow>
│  │       │  │  ├─ <button class=cardOpen>{name}</button>
│  │       │  │  └─ Tag(tone=success|danger|warning|neutral|info)
│  │       │  ├─ <p class=cardDesc>{note || transport + " · " + url}</p>
│  │       │  └─ <p class=statusLine>{t("connected",{count})}</p>
│  │       ├─ Switch(checked=enabled, label="启用 "+name, disabled=busy)
│  │       ├─ Button(ghost,icon=ellipsis) → Menu(编辑/复制配置/删除)
│  │       ├─ Button(outline,sm,icon=refresh|loading){测试连接|测试中…}
│  │       └─ <div class=toolPanel>              // 展开时
│  │          ├─ <div class=toolHead>{t("toolsSummary",{on,total})} [全选][反选]</div>
│  │          ├─ Input(icon=search, placeholder="搜索工具")
│  │          └─ <div class=chips>
│  │             Tooltip(label=desc) > span > Pill(active,onClick)
│  └─ 空态 <p class=empty>{t("empty")}</p>
├─ AddServerDialog  → Modal(title, footer=[取消][保存])
│  ├─ SegmentedTabs(items=[json,fields])
│  ├─ (json)   <textarea class=code/> + JsonBlock 预览
│  └─ (fields) 名称 Input / 传输方式 SegmentedTabs / URL Input / 请求头 textarea / 备注 textarea
├─ ConfirmDeleteDialog → Modal(footer=[取消][删除])   // 或 RiskConfirmation
└─ <Toast/>（仅“离开页面仍需看到”的失败；state 驱动，onDone 卸载）
```

### 7.4 中文文案表（与 DSH 现有语气一致）

语气规则（从 `ui-plugin-manager` / `ui-settings-plugins` 字典提炼）：短句、动宾结构、无感叹号；
错误 = 「无法/未能 + 对象 + ，请 + 动作」；进行中 = 「正在…」或「…中…」；计数用「共 {n} 个 / {n} 个已停用 / {n} 个工具」；
界面路径用「」包裹（如「设置 → 内置插件」）。

| key | 中文 | 说明 |
| --- | --- | --- |
| `nav` | `MCP` | 设置导航项 / 面板名 |
| `title` | `MCP 服务器` | 分区标题 |
| `intro` | `接入外部 MCP 服务器，并按工具控制可用范围` | 一行说明 |
| `summary` | `已启用 {on} / 共 {total}` | 列表汇总 |
| `add` | `添加服务器` | 主按钮 |
| `refresh` | `刷新` | 次级按钮 |
| `loading` | `正在读取 MCP 服务器…` | 骨架期无障碍文案 |
| `empty` | `还没有添加 MCP 服务器。` | 空态 |
| `readFailed` | `无法读取 MCP 服务器，请检查网络后重试。` | 首次失败 |
| `refreshFailed` | `刷新失败，请重试` | 有缓存时失败（toast） |
| `unavailable` | `本部署没有可管理的 profile，无法管理 MCP 服务器。` | 能力缺失 |
| `retry` | `重试` | 失败行按钮 |
| `test` | `测试连接` | 卡片按钮 |
| `testing` | `测试中…` | loading |
| `connected` | `已连接 · {count} 个工具` | 成功（就地，无 toast） |
| `connectedPartial` | `已连接 · {count} 个工具 · {off} 个已停用` | 部分关闭 |
| `connectFailed` | `连接失败：{reason}` | 失败就地 |
| `timeout` | `连接超时，请检查 URL 或网络` | 失败细分 |
| `enabled` / `disabled` | `已启用` / `已停用` | 状态 |
| `configInvalid` | `配置有误：{message}` | URL/headers 非法 |
| `enableServer` | `启用 {name}` | Switch 无障碍名 |
| `tools` | `工具` | 折叠区标题 |
| `toolsSummary` | `已启用 {on}/{total} 个工具` | 折叠区头 |
| `toolsTotal` | `共 {count} 个` | 计数 |
| `toolsOff` | `{count} 个已停用` | 计数 |
| `selectAll` / `invert` | `全选` / `反选` | 批量 |
| `searchTools` | `搜索工具` | 输入框占位 |
| `noToolMatch` | `没有匹配的工具。` | 搜索空态 |
| `noTools` | `这个服务器没有提供任何工具。` | 无工具 |
| `enableTool` | `启用工具 {name}` | chip aria-label |
| `addTitle` / `editTitle` | `添加 MCP 服务器` / `编辑 MCP 服务器` | 对话框标题 |
| `tabJson` / `tabFields` | `粘贴 JSON` / `分字段填写` | SegmentedTabs |
| `fieldName` | `名称` | 必填 |
| `fieldTransport` | `传输方式` | `streamable-http` / `sse` |
| `fieldUrl` | `URL` | 必填 |
| `fieldHeaders` | `请求头` | 每行 `Key: Value` |
| `fieldNote` | `备注（可选）` | 备注 |
| `fieldNoteHint` | `只用于你自己识别，不会发送给模型` | hint |
| `jsonPlaceholder` | `{ "mcpServers": { "example": { "url": "https://…" } } }` | 占位 |
| `jsonInvalid` | `无法识别的 JSON：{reason}` | 校验 |
| `nameRequired` | `请填写名称` | 校验 |
| `nameDuplicated` | `已有同名服务器` | 校验 |
| `urlInvalid` | `URL 必须以 http:// 或 https:// 开头` | 校验 |
| `headersInvalid` | `请求头需要「名称: 值」的格式` | 校验 |
| `save` / `saving` | `保存` / `保存中…` | 主按钮 |
| `saveFailed` | `没有保存成功，请重试` | 就地错误 |
| `cancel` | `取消` | — |
| `delete` | `删除` | 菜单项/危险按钮 |
| `deleteTitle` | `删除 MCP 服务器` | 确认标题 |
| `deleteDescription` | `删除后，{name} 上的全部工具都会从会话中移除，且无法恢复。` | 确认描述 |
| `deleteFailed` | `删除失败，请重试` | 错误 |
| `copyConfig` | `复制配置` | 菜单项（`writeClipboard`） |
| `copied` | `已复制` | 复制反馈 |

---

## 8. 落地清单与关键坑

### 8.1 实现顺序建议

1. host 半侧：`lib/index.js` 提供 MCP 服务器 CRUD + 连通性探测 + 工具启用状态持久化与 Remote 方法（另一份契约文档）。
2. client 半侧：先「设置分区壳 + 空态 + 添加表单（分字段）」，跑通一条真实服务器。
3. 再加工具 tag cloud + 开关 + 全选/反选 + 搜索。
4. 再加 JSON 粘贴、删除确认、toast 策略、骨架屏、无障碍收尾。
5. 最后补**真实验证**：关服务器 → 工具从会话消失；关单个工具 → 该工具不可调用（由 lead 的验证任务覆盖）。

### 8.2 关键坑（务必先看）

1. **`ConfigField` 运行时不存在**。npm 包 `@deepseek-ai/dsh-client-ui-primitives@0.2.1-rc.2` 的 d.ts 导出了
   `ConfigField`，但**运行中 Web 前端的共享模块导出表里没有它**（逐项核对过 288 个导出：`ConfigField: false`）。
   `require('@deepseek-ai/dsh-client-ui-primitives').ConfigField === undefined` → 渲染时崩。
   用 `SettingsValueField`（单值）或自建字段。同理：**只使用本文 §4 列出的名字**，新增导出前先在本机
   `index-CN7NIWNw.js` 的 `zU` 导出对象里确认。
2. **不能直接 `ctx.slots.register` 目标 slot**。`settings.section` / `main` / `sidebar.panellist` 都由别家插件在运行时声明；
   必须 `ctx.slots.inject(key, () => ctx.slots.register(...))`，否则早于声明注册会被拒绝，或声明折叠时不被清理。
3. **id 必须成对**。侧边栏面板：`sidebar.panellist` 的 `id` 与 `main` 的 `key` 必须是同一字符串，否则点图标打不开页面。
   设置分区：`settings.section` 的 `id` 同时是 `openSection(id)` 的寻址键。
4. **不要硬编码颜色**。暗色模式只切 `body[data-ds-dark-theme]`，硬编码 `#fff` 的卡片在暗色里会刺眼。
   所有颜色/圆角/字号用 §5.2 变量；分隔线用 `.5px`（官方到处是 `0.5px`，不是 `1px`）。
5. **骨架/加载指示最短时长**。官方给加载指示设了 400ms 下限、刷新按钮 hover 500ms 才出 tooltip；照做可避免“一闪而过”的廉价感。
6. **`Tooltip` 需要可转发 ref 的子元素**。`Pill` 不是 `forwardRef`，把 `Tooltip` 直接包 `Pill` 拿不到锚点；包一层 `<span>`。
7. **`Button` 没有 danger variant**。危险按钮靠 CSS 覆盖或直接 error 色。
8. **一次只渲染一个分区**。`settings.section` 是 `list` 但外壳按 `only` 只渲染 active；分区内部若有 tab，
   照 `PluginsSettingsSection` 的“首次选中后保持挂载”，避免搜索词/滚动位置丢失。

---

## 9. 证据索引（可复现）

| 结论 | 证据位置 |
| --- | --- |
| 设置 slot 契约 | `@deepseek-ai/dsh-client-ui-settings/lib/types/client/contract/slots.d.ts:11-125` |
| 设置外壳渲染 `settings.section` | `dsh-client-ui-settings-general/lib/client.js`（`renderSlot("settings.section", { close }, { only: active })`） |
| 设置分区注册模板 | `dsh-client-ui-settings-plugins/lib/client.js`（`apply()` 末尾） |
| 分区 CSS（18/600、760px、tabs） | 同文件 `PluginsSettingsSection.module.css` 内联字符串 |
| 侧边栏面板注册 | `dsh-client-ui-plugin-manager/lib/client.js` 末尾（`PANEL_ID="plugins"`、`main` + `sidebar.panellist`） |
| `sidebar.panellist` 契约 | `dsh-client-ui-sidebar/lib/types/client/contract/slots.d.ts`（`SidebarPanelIconOwnerProps{size,selected}`） |
| 最小设置页实现 | `dsh-client-ui-settings-agent-loop/lib/client.js`（`inject` / `apply` / `ctx.slots.inject("plugins.item", ...)`） |
| 官方组件 props | `@deepseek-ai/dsh-client-ui-primitives@0.2.1-rc.2` 的 `lib/types/*.d.ts`（Button/Switch/Tag/Tooltip/Modal/Toast/Input/Pill/Menu/SegmentedTabs/DisclosureRow/StateDot/SettingsForm…） |
| 运行时导出表 | `dsh-web-frontend/dist/assets/index-CN7NIWNw.js` 内 `const zU=Object.freeze(…{__proto__:null, …})` |
| 共享模块白名单 | 同文件 `function SZ(){return{react:…,"@deepseek-ai/dsh-client-ui-primitives":…}}` |
| 设计 token 定义 | `dsh-client-ui-theme/lib/client.js`（`design-platform.css` → `--dsw-static-*` / `--dsw-alias-*`；`base.css` → radius/字体/动效；`focus.css` → 焦点环） |
| 设置面板几何 | `dsh-client-ui-settings-general/lib/client.js`（`SettingsRoot.module.css`：800×800、188px nav、`radius-panel`） |
| 卡片/行/骨架/状态标签尺寸 | `dsh-client-ui-plugin-manager/lib/client.js`（`PluginManagerPage.module.css`） |
| 第三方可行先例 | `C:\Users\Xingy\.dsh\profiles\web\node_modules\dsh-context\lib\client.js`（`main`+`sidebar.panellist`、`require` primitives） |
| 中文语气样本 | `dsh-client-ui-plugin-manager/lib/client.js` 内联 `zh` 字典（`panel/title/intro/loading/error/empty/retry/refresh`…） |

> 复现提示：官方包的 `lib/client.js` 是**未 minify 的可读 bundle**（保留注释与 `//#region`），
> 直接 `Select-String` 关键字即可定位实现；`lib/types/**/*.d.ts` 就是 API 文档。
> 运行时 primitives/slots/store/dockkit 可从 npm 取同名同版本 tarball 读 d.ts：
> `npm pack @deepseek-ai/dsh-client-ui-primitives@0.2.1-rc.2`。

_本文不含截图：按纪律未在 127.0.0.1:3080 上点击任何设置项/发消息；样式结论全部来自运行中前端的实际 CSS 与官方 d.ts，数值可复核。_
