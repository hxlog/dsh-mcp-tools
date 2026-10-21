# DSH Web 第三方插件架构调研（host 插件 + client UI）

> 调研对象：本机全局安装的 DSH `0.2.1-rc.2`（无 monorepo 源码 checkout），profile = `web`，GUI = http://127.0.0.1:3080
> 调研方式：只读。未修改 `C:\Users\Xingy\.dsh` 下任何文件，未重启/停止任何 dsh 进程。
> 结论全部以**本机安装包内代码**为准；与 GitHub 仓库冲突时以本机为准。

---

## 0. 结论先行（TL;DR）

1. **可以完全在「只有 npm 全局安装包」的机器上开发第三方插件**，不需要 DSH monorepo。DSH 把 client bundle 当作**预构建产物**读取：宿主只 `stat` 并原样提供 `exports["./client"]` 指向的文件，不做任何编译。你只需要自己用 esbuild/tsdown/rolldown 产出一个符合约定的 classic script。
2. **一个包可以同时是 host 插件和 client 插件**（dual-face），这是官方与三个第三方生态插件的统一形态：`main` 指向 host ESM 入口，`exports["./client"]` 指向浏览器 bundle，`dsh.client.platform = "web"`，`dsh.bundle.patch` 指向自带的 `cordis.patch.yml`。
3. **client 侧生效不需要重启、不需要 monorepo**：`dsh-client-hmr` 每 500ms `stat` 每个已加载插件的 client bundle（mtime/ctime/size），一变就通过 `/plugins/events` SSE 推 `rebuilt` 帧，浏览器原地换模块（页面不刷新，React 状态丢失）。**改 `lib/client.js` 并重写文件即可在 3080 上立刻看到**。
4. **host 侧热更新取决于改动类型**：`cordis.patch.yml` / profile `package.json`（`dsh.profile.bundles` 顺序）被 `@deepseek-ai/dsh-hmr` 监听，约 1s 内重新组合（dshmarket README 实证）；**新增/升级 npm 包**建议装完刷新页面、必要时重启 `dsh web`。
5. **自定义后端 RPC 不要走官方 `typert`**：`@deepseek-ai/dsh-api-remotes` 的 remote 是**构建期代码生成产物**（`./typert` / `./remote` artifact，需 monorepo 的 generator），第三方包无法生成。正确做法是 **`ctx.webServer.register()` 挂 exact HTTP 路由 + 浏览器 `fetch`**，并用 `ctx.connection.requestRejection()` 复用宿主自带的 Host/Origin/登录闸门。`dshmarket` 和 `dsh-chat-import` 两个已装第三方插件都是这么做的。
6. **设置页分区** 注册到 slot `settings.section`；**左侧栏面板**是 `sidebar.panellist`（列表行）+ `main`（keyed，面板主体）成对注册；**浮层 toast** 用 `shell.overlay`；**右侧栏标签页**用 `sidebar.right.pane.tab`。
7. **「关掉服务器 / 关掉单个工具」无法用官方 `dsh-mcp-client` 的配置做到**：它一次注册该 server 的全部工具，且 `ctx.tools.restrict()` 只作用于「调用者的 agent scope」，不能全局隐藏。要实现 per-tool 开关，**必须由我们自己的 host 插件持有 MCP 连接、按启用集合选择性注册工具**（连接与工具适配器都可复用官方导出的 `createMcpToolDefinition`）。
8. 由此推出本插件架构：**单包 dual-face（host 持有连接 + client 设置页）**，不用 `@deepseek-ai/dsh-mcp-client` 的 loader 行，改用我们自己的连接管理器。详见 §7。

---

## 1. 本机环境的关键事实（会决定实现方式，先看这里）

### 1.1 三方模块解析桥：`~/.dsh/profiles/node_modules`

```
C:\Users\Xingy\.dsh\profiles\node_modules\@deepseek-ai\     ← 202 个包，全部是指向全局安装的符号链接
   cordis  -> C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\cordis
   ...
C:\Users\Xingy\.dsh\profiles\web\node_modules\@deepseek-ai\ ← 只有 12 个（browser-use / computer-use / dsh-mcp-client / schemastery ...）
```

Node 从 `profiles\web\node_modules` 逐级向上找，最终命中 `profiles\node_modules` 的符号链接，**realpath 与 dsh 主进程一致**，所以第三方插件 import `@deepseek-ai/*` 拿到的是**同一份模块实例**。实测（在 `profiles\web` 目录下）：

```
@deepseek-ai/dsh-tools  => C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\dsh-tools\lib\index.js
@deepseek-ai/cordis     => C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\cordis\lib\index.js
@modelcontextprotocol/client => C:\Users\Xingy\.dsh\profiles\web\node_modules\@modelcontextprotocol\client\dist\index.mjs
```

> ⚠️ 坑：不要假设 `profiles\web\node_modules\@deepseek-ai\dsh-tools` 存在——它不存在，靠的是上一层 `profiles\node_modules`。如果你把插件源码放在 `D:\PythonProjects\...` 并用 `link:` 安装，Node 会从**源码 realpath** 解析，拿不到这套桥，`@deepseek-ai/*` 会解析失败。解决办法见 §4.4 与 §8 坑 4。

### 1.2 运行中的 dsh web 组合（决定哪些 slot / service 一定存在）

`C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\dsh-web-app\cordis.patch.yml`：

| 行号 | id | 包 | 作用 |
|---|---|---|---|
| L179-188 | `webserver` | `@deepseek-ai/dsh-host-webserver` | HTTP 服务，127.0.0.1:3080，compression gzip |
| L197-204 | `web-runtime` | `@deepseek-ai/dsh-web-app` | 前端 dist + fallback seat |
| L214-219 | `client-hmr` | `@deepseek-ai/dsh-client-hmr` | **client bundle 热替换 + /plugins/events** |
| L227-228 | `modules` | `@deepseek-ai/dsh-client-modules` | `__DSH_BOOT__` 图 + `/plugins/*` 提供者 |
| L234-241 | `connection` | `@deepseek-ai/dsh-client-connection` | `/api` 网关 + 宿主请求闸门 |
| L248-249 | `api-remotes` | `@deepseek-ai/dsh-api-remotes` | 官方 remote 装配 |
| L266-267 | `ui-layout` | `@deepseek-ai/dsh-client-ui-layout` | `main` slot、layout service |
| L279-284 | `ui-sidebar` / `ui-sidebar-right` | 左侧栏 / 右侧栏 | `sidebar.panellist` / 右侧栏 slots |
| L306-324 | `ui-settings` / `ui-settings-general` / `ui-plugin-manager` ... | 设置域 | `settings.section` 等 |

这解释了为什么 `cordis.patch.yml` 里能直接按 id 覆盖 `ui-settings-general` 的 config（用户文件里已有这条）。

---

## 2. Q1 —— 第三方插件包的最小结构（四个在装实例为证）

### 2.1 四个已安装第三方插件的目录树与关键字段

#### (a) `dsh-context@0.73.3` —— 最干净的 dual-face 范例

```
C:\Users\Xingy\.dsh\profiles\web\node_modules\dsh-context\
  package.json
  cordis.patch.yml          (256B)
  lib\index.js              (68KB)   ← host 入口
  lib\index.d.ts            (29KB)
  lib\client.js             (478KB)  ← 浏览器 bundle（预构建）
  locale\en.json  locale\zh.json
  icon.svg
```

`package.json` 关键字段：

```jsonc
{
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "icon": "icon.svg",
  "exports": {
    ".":               { "types": "./lib/index.d.ts", "default": "./lib/index.js" },
    "./client":        "./lib/client.js",
    "./package.json":  "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": ["lib/client.js", "lib/index.js", "lib/index.d.ts", "cordis.patch.yml", "locale/*.json", "icon.svg"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-api-remotes", "@deepseek-ai/dsh-client-connection",
                 "@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-ui-conversation",
                 "@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-client-ui-sidebar-right"]
    },
    "compatibility": { "dshReleases": { "0.1.7-rc.2": "compatible", "0.2.0-rc.2": "compatible" } }
  }
}
```

`cordis.patch.yml`（官方 bundle 一层，只需插一条 row）：

```yaml
- insert:
    - id: dsh-context
      name: dsh-context
```

> 该文件注释原文即机制说明："the row loads the package's main entry as the host half (a plain Cordis plugin); the `dsh.client` declaration makes the web app load its `./client` bundle as the browser half."

#### (b) `dsh-chat-import@0.26.2` —— host 是 `.mjs`、client 是 `lib/client.js`

```
dsh-chat-import\
  package.json
  cordis.patch.yml              ("- insert: [{id: import-claude, name: dsh-chat-import}]")
  bin\dsh-chat-import.mjs
  lib\index.mjs                 ← main
  lib\client.js   (362KB)       ← exports["./client"]
  lib\panel.mjs   (28KB, 可读)  ← 面板 HTTP 路由（重要参考，见 §5）
  lib\tools\*.mjs  lib\convert\*.mjs ...
  README.md  README.zh-CN.md  docs\*.md  assets\import.svg
```

关键字段：

```jsonc
{
  "type": "module",
  "main": "./lib/index.mjs",
  "icon": "assets/import.svg",
  "bin": { "dsh-chat-import": "bin/dsh-chat-import.mjs" },
  "exports": {
    ".":                    { "types": "./lib/index.d.ts", "default": "./lib/index.mjs" },
    "./client":             { "default": "./lib/client.js" },
    "./cordis.patch.yml":   "./cordis.patch.yml",
    "./package.json":       "./package.json"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "platform": "web", "inject": ["@deepseek-ai/dsh-client-locale"] }
  }
}
```

#### (c) `dshmarket@1.66.44` —— client bundle 不在 `lib/` 下，且附带 TS 源码（最好的抄写对象）

```
dshmarket\
  package.json
  cordis.patch.yml          (125B)
  lib\index.js              (19KB)   ← host 入口
  lib\types\index.d.ts
  lib\routes.js             (427KB 构建产物) ← HTTP 路由
  client\client.js          (807KB)  ← exports["./client"]，注意路径
  src\                      ← **TypeScript 源码被打进包里**（第三方包，可读）
    index.ts  routes.ts  http.ts  install.ts ...
    client\index.ts  SettingsCard.tsx  MarketSection.tsx  sidebar-entry.ts  section-gate.ts ...
  locale\{en,zh}.json
  assets\logo.svg
```

关键字段：

```jsonc
{
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "assets/logo.svg",
  "exports": {
    ".":                  { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client":           "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json":    "./locale/*.json"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-ui-settings",
                 "@deepseek-ai/dsh-client-ui-theme"]
    }
  }
}
```

#### (d) `@agentscope-ai/reme-dsh-plugin@0.1.2` —— `./client` 指向 `dist/client.js`；用 cordis group 包一层

```
@agentscope-ai\reme-dsh-plugin\
  package.json
  cordis.patch.yml
  dist\index.js                    ← main
  dist\client.js (114KB)           ← exports["./client"]
  dist\client\index.js (+ .js.map, 未压缩、可读)  ← 源码近似
  dist\*.d.ts
  figures\*.png
```

关键字段：

```jsonc
{
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".":       { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./client": { "default": "./dist/client.js" }
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-connection",
                 "@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-client-ui-settings-plugins",
                 "@deepseek-ai/dsh-client-ui-plugin-manager", "@deepseek-ai/dsh-client-ui-primitives"]
    }
  },
  "peerDependencies": { "@deepseek-ai/cordis": "~4.0.4 || ^4.0.5-alpha.1", "@deepseek-ai/dsh-tools": "...", "@deepseek-ai/dsh-typert-protocol": "..." }
}
```

`cordis.patch.yml` 演示了「隔离一个 service 命名空间」：

```yaml
- insert:
    - id: reme-memory-scope
      name: "@deepseek-ai/cordis-plugin-group"
      group: true
      isolate: { remeMemory: true }
      config:
        - id: reme-memory
          name: "@agentscope-ai/reme-dsh-plugin"
```

### 2.2 `dsh.client` 字段的权威定义

`@deepseek-ai/dsh-package-manifest\lib\types\types.d.ts`（本机全局安装内）——这是 `package.json` 里 `dsh` 段的唯一权威 schema：

```ts
export interface DshPackageManifest {
  name: string; version: string; description?: string;
  /** SVG/PNG/JPEG/WebP 相对路径，≤256KiB，realpath 必须在该包内 */
  icon?: string;
  private?: boolean;
  dependencies?: Record<string,string>;
  peerDependencies?: Record<string,string>;
  engines?: { dsh?: string; node?: string; npm?: string };
  dsh?: DshManifest;
}
export interface DshManifest {
  manifestVersion?: 1;
  bundle?: { patch: string | string[] };   // 相对包根，可有序多个，按序应用为「一个 bundle 层」
  profile?: { bundles?: string[] };
  client?: DshClientManifest;
}
export interface DshClientManifest {
  platform: string;        // Web 消费方选 'web'
  inject?: string[];       // 仅"信息性包名依赖"，用于模块图排序，**不是** Cordis service 注入
  immediately?: boolean;   // 启动第一优先级；缺省进共享 application batch
  external?: string[];     // 出基线模块表的精确请求；缺省仅基线
}
```

`@deepseek-ai/dsh-client-modules` 解析时读的正是 `exports["./client"]`：

- `lib\index.js` **L171-181** `clientExportOf(pkgName, exportsField)`：接受 `"./client": "string"` 或 `{ default: "string" }`，其它形态抛错。
- `lib\index.js` **L720-749** `resolveMeta()`：`parseDshClient(packageName, pkg.dsh.client)` 校验 → `clientExportOf` 取相对路径 → 缺 `./client` 时抛 `client-modules: <pkg> declares dsh.client but exports no "./client" bundle`。
- `lib\index.js` **L937** 提供 URL 前缀：`/plugins/${record.entry.id}/`。

### 2.3 最小目录结构（本插件用）

```
dsh-mcp-workbench/
├── package.json
├── cordis.patch.yml
├── README.md
├── icon.svg
├── locale/{zh.json,en.json}
├── lib/index.js            # host 入口（ESM）
├── client/client.js        # 浏览器 bundle（预构建，必需）
└── src/client/*.tsx        # client 源码 + scripts/build-client.mjs
```

注意 id：`cordis.patch.yml` 的 row id 只用于 loader 寻址；**浏览器模块 id = 包名**。

### 2.4 client bundle 的名字与 id 约定（易错）

- 浏览器模块行 id = **`package.json.name`**（client-modules 用「解析到的 manifest 包名」标识浏览器模块）。
- `lib\client.js` 内注册的 id 会被 `stripClientSuffix()` 处理：`<pkg>/client` 与 `<pkg>` 等价（`dsh-client-modules\lib\client.js` **L702-714**）。
- 两个不同 Loader 源解析到同一个包名会被拒绝；同一 id 重复注册会抛 `duplicate factory registration ... (bundle executed twice without invalidate?)`（同上 L706-709）。

---

## 3. Q2 —— client bundle 如何被 web 端加载

### 3.1 全链路（host 扫描 → `__DSH_BOOT__` → `/plugins` → 浏览器懒执行）

依据 `@deepseek-ai/dsh-client-modules\README.md` + `lib\index.js` + `dsh-web-frontend\dist\assets\index-CN7NIWNw.js`：

1. **host 半边**（`modules` row，`@deepseek-ai/dsh-client-modules`）用 Cordis 的 `internal/plugin` 事件**增量扫描** Loader 条目；凡是 `package.json.dsh.client` 存在、`platform: 'web'`、且 `exports["./client"]` 可解析的包，登记为一个浏览器模块行。
2. 合成 **boot graph**，序列化后以 `<script>window.__DSH_BOOT__ = {...}</script>` 注入 index.html 的 `<head>`（由 `dsh-host-webserver` 的 index-inject 机制 + `dsh-web-frontend` 的 dist 模板承载）。
3. 每个 bundle 通过 **combo 路由**（`/plugins/<id>/<file1>+<file2>?rev=<rev>` 形式）或 **单资源 `/plugins/<id>/<file>?rev=<rev>`** 提供。rev 由 `mtimeMs + ctimeMs + size` 派生（不哈希内容）。
4. **浏览器半边**（shell 的 boot kernel，`dsh-web-frontend` dist）在 `window.__DSH_BOOT_READY__` 之后 `window.__ModuleLoader__.create(...)`，把 `staticModules`（基线表）+ boot graph 交给 `ClientModuleSystem`。
5. 每个 bundle **只是注册一个 factory**：`window.__ModuleLoader__.load({id, factory})`；模块体副作用（含 CSS 注入）都在 factory 闭包里，**首次 import/物化时才执行**。所以启动不跑插件代码。

### 3.2 bundle 的精确协议（三种真实写法一致）

```js
// 三段实证：@agentscope-ai/reme-dsh-plugin/dist/client.js、dshmarket/client/client.js、dsh-chat-import/lib/client.js
window.__ModuleLoader__.load({
  id: "<package.json.name>",          // 必须等于包名
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    // ... 你的 CJS 代码，可 require("react") / require("@deepseek-ai/dsh-client-ui-primitives")
    module.exports = { name, inject, apply };
    return module.exports;            // 必须 return 导出对象
  }
});
```

关键点：
- **必须是 classic script**，不能是 ESM（有顶层 `import` 会直接报错）。`require` 是宿主注入的同步 CJS 解析器。
- `apply(ctx)` / `inject` 是 cordis 客户端插件契约；`inject` 里写**服务名**（如 `['slots','locale','theme']`），不是包名。
- 异步 chunk 用 `require.async("./client.<name>.js")`（tsdown 拆分产物），宿主按 `/plugins/<id>/client.<name>.js?rev=...` 提供；自研构建可不用。

### 3.3 可 import 的「基线模块表」（唯一 11 个，实测）

`dsh-web-frontend\dist\assets\index-CN7NIWNw.js` 偏移 916075 处：

```js
function SZ(){return{
  react: sC, "react/jsx-runtime": uC, "react-dom": mC, "react-dom/client": yC,
  "@deepseek-ai/cordis": Fb,
  zod: Zj,
  "@tanstack/react-virtual": Yj,
  "@deepseek-ai/dsh-client-store": wI,
  "@deepseek-ai/dsh-client-ui-slots": SI,
  "@deepseek-ai/dsh-client-ui-primitives": zU,
  "@deepseek-ai/dsh-client-ui-dockkit": xZ
}}
```

- 只 import 这 11 个（且是精确子路径，如 `react/jsx-runtime`）→ **`dsh.client.external` 什么都不用写**。
- 需要别的（如 `@deepseek-ai/dsh-client-ui-settings` 的 `renderSlot`/`settingsScope`）→ 必须写进 `dsh.client.external`，并在 `dsh.client.inject` 里点名提供方包，否则启动报「malformed request / missing supplier / 请求环」。
- **`@deepseek-ai/dsh-client-ui-primitives` 是基线内的** → 这是做到「和 DSH 现有 UI 一致」的正道（Switch/Input/Button/Badge/Dialog/Tag/Toast 等都应从这里取，不要自己手搓）。
- 子路径要小心：基线表是**精确键**，`@deepseek-ai/dsh-client-ui-primitives/xxx` 不在表里。

### 3.4 本地改了 client 代码，如何让 3080 生效（`dsh-client-hmr` 机制）

`@deepseek-ai/dsh-client-hmr\lib\index.js` 全文很短，机制一目了然：

```js
const EVENTS_ENDPOINT = "/plugins/events";
const Config = z.object({ pollIntervalMs: z.number().step(1).min(1).default(500) });
function bundleStat(path){ const b = statSync(path); return { mtimeMs, ctimeMs, size } }
// apply(ctx):
//   ctx.effect(() => {
//     syncWatches()                                   // 对每个图行取 artifactBaseline(row.id).path
//     ctx.clientModules.onGraphChanged(syncWatches)
//     const timer = setInterval(pollWatches, pollIntervalMs)   // 默认 500ms
//   })
//   变化 → ctx.clientModules.rebuilt(id) → SSE {type:"rebuilt", id, rev}
```

- **监听的就是该包解析出来的 client bundle 文件本身**（`exports["./client"]` 的 realpath），不是 TS 源码，不是 monorepo 的 dist 目录约定。
- 因此：**你在 `D:\PythonProjects\dsh-mcp-workbench` 里重跑一次构建脚本把 `client/client.js` 覆盖写 → 3080 页面 0.5s 内自动换新模块**。不需要 `pnpm run dev:web`，不需要 monorepo，不需要重启。
- 代价：**React 组件状态丢失**（重新执行 bundle、重新挂载 fiber）；连接/会话状态保留。失败不回滚，会在 设置→插件→插件列表 显示错误并可重试。
- `dsh-web-app\cordis.patch.yml` L214-219 明确：`client-hmr` **always mounted**，在没有重建 watcher 时是 idle 的，所以这条链路在你的 profile 上一定是通的。

> 自研 watcher：`node scripts/build-client.mjs --watch`（esbuild watch）即可；HMR 负责剩下的。

### 3.5 构建工具

没有硬性要求，只要产出 §3.2 的 wrapper。已验证的三种：
- `tsdown`（官方包 + dshmarket）
- `rolldown`（dshmarket/reme 产物特征：`//#region \0rolldown/runtime.js`）
- **esbuild + 手写 banner/footer**（最简单，推荐给本插件）

---

## 4. Q3 —— 安装 / 启用路径，以及「是否必须重启」

### 4.1 三条安装路径（都可，推荐第一条）

| 路径 | 命令 / 位置 | 改了什么 |
|---|---|---|
| **`dsh` CLI（官方，推荐）** | `dsh plugin --profile web add dsh-context`（`dsh-context\README.md` L30-44） | profile `package.json` dependencies + `pnpm install` + `cordis.patch.yml` 插入 row + 加到 `dsh.profile.bundles` |
| **Web UI（市场/插件页）** | 侧栏 **Plugins** 页 / `dshmarket` 市场页 | 同上，由 host 侧 `dsh-plugin-manager` 执行 |
| **手动** | 编辑 `profiles\web\package.json` → `pnpm install` → 编辑 `cordis.patch.yml` | 等价，但要自己保证依赖装好 |

本机 profile 的 `package.json` 已是标准形态：

```jsonc
{ "dependencies": { "dsh-chat-import":"0.26.2", ... },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", ..., "dsh-context"] } } }
```

`cordis.yml` 是空数组（`[]`），**不要改它**；所有改动写在 `cordis.patch.yml`（顶层 YAML 数组，可 `- insert:`、`- id: xxx` 覆盖、`disabled:`）。

### 4.2 「启用 / 停用一条 row」的标准写法

```yaml
- insert:
    - id: mcp-manager
      name: dsh-mcp-workbench          # 或 "@scope/dsh-mcp-workbench"
      # disabled: true               # 临时整套停用
      # config: {...}                # 该 row 的 cordis Config
```

`dsh-plugin-manager\README.md` 明确了官方插件的「开关」语义：
> "A plugin toggle updates only `disabled` in the last matching override in the profile's `cordis.patch.yml`, or appends an override when none matches. ... A bundle toggle changes `package.json`'s ordered `dsh.profile.bundles` list."

这正好给了我们**「整个 MCP 服务器开关」的一种实现**（写 `disabled`），但更推荐由插件自己管理连接（见 §7），避免每开关一次就改配置文件。

### 4.3 HMR 到底监听哪些文件 —— 权威清单

`@deepseek-ai/dsh-hmr\README.md`：

| 变更 | 是否热生效 | 说明 |
|---|---|---|
| `cordis.patch.yml`（profile patch） | ✅ 自动重新组合 | "Profile and home patch changes also trigger recomposition" |
| home patch（`~/.dsh/cordis.patch.yml` 一类） | ✅ | 同上 |
| profile `package.json` | ✅ 但**仅当 `dsh.profile.bundles` 顺序变化**才 reload | "manifest notifications reload only when the ordered `dsh.profile.bundles` list changes" |
| 插件安装目录里的文件（`node_modules` 下已加载插件，含 link 目标构建产物） | ✅ 在下一次 recomposition 时替换 | "A package whose files changed in place ... takes effect without a restart at the next such recomposition" |
| 新增一个**尚未解析过**的 npm 包 | ⚠️ 需要它的 Loader entry 重启 | "A new package entry takes effect when its Loader entry restarts" |
| `hmr.config.root` 指定的源码目录 | 需显式配置 | base bundle 里 `root: []`（`dsh-base\cordis.patch.yml` 的 `id: hmr`），即**默认不 watch 源码** |

实证：本机 `C:\Users\Xingy\.dsh\logs\startup-2026-10-20T11-29-42.094Z-*.log` 里有
`name: 'hmr' / 'config reload at %C failed' / 'C:\Users\Xingy\.dsh\profiles\web\package.json'`
—— 证明该 profile 的 HMR 确实把 `package.json` 当配置文件 watch，且 HMR 是启用状态。

第三方生态的直接证词（`dshmarket\README.zh.md` L55、L49、L56）：
> 「**热禁用 / 启用**——开关会往 profile 的 `cordis.patch.yml` 写入 `- id: …` + `disabled: true|false`：DSH 的 HMR 约 1 秒内重新组合，无需重启」
> 「**一键安装**——… 多数插件刷新页面即可用，无需重启」
> 「**按需重启**——无法热加载的变更会在待重启提示旁显示一键重启」

### 4.4 实操结论（本插件）

```bash
# 1) 开发期安装（link 本地目录）
dsh plugin --profile web add link:D:\PythonProjects\dsh-mcp-workbench
#    或手写 package.json 后： cd %USERPROFILE%\.dsh\profiles\web && pnpm install

# 2) 让 host 侧加载：在 profiles\web\cordis.patch.yml 追加
#    - insert: [{ id: mcp-manager, name: dsh-mcp-workbench }]

# 3) 首次启用：刷新 http://127.0.0.1:3080 一次（页面要拿到新 boot graph）
#    host entry 若首次 import 失败 → 需要重启 dsh web（启动是全有全无，见 §8 坑 1）

# 4) 之后每次改 client：node scripts/build-client.mjs  → 页面自动热替换（<1s）
#    之后每次改 host 代码：改一下 cordis.patch.yml（哪怕加个注释）触发 recomposition 即可
```

> ⚠️ 不要为了「热更新」去改 `hmr.root`：watch 源码目录会连带 watch `node_modules`、`.dsh` 下大量文件，容易抖。上面「重建 client.js」+「HMR stat-poll」这条路径更稳。

---

## 5. Q4 —— 如何暴露自定义后端 RPC 给 client

### 5.1 官方 `typert` / `api-remotes` 路线：第三方基本不可用（先说清为什么）

- `@deepseek-ai/dsh-api-remotes\README.md`："The Client entry imports **generated `/remote` artifacts** as runtime values, mounts each contribution through `ctx.remote.$mount()`"；"The capability set is fixed by **explicit build-time value imports**"。
- `@deepseek-ai/dsh-typert-loader\README.md`："each qualifying Loader entry contributes its **generated** host-face reflection, schema factories, and `TYPERT.invocations`"；没有 `./typert` 导出的包**被静默跳过**；解析结果 "cached for the process lifetime, so adding a `./typert` export requires a restart"。
- 生成器（typert generator）是 monorepo 构建期工具，本机无 monorepo → 无法产出合规 artifact。

**结论：第三方插件不要碰 `typert`，也不要去 mount 别人的 remote。** 用 HTTP。

### 5.2 推荐路线：exact HTTP 路由 + 宿主请求闸门（两个在装插件同款）

宿主 API（`@deepseek-ai/dsh-host-webserver\README.md`）：

```ts
const dispose = ctx.webServer.register({ kind: 'exact' | 'prefix', path: '/mcp-manager/api/servers', handler })
ctx.webServer.getOrigin()   // 绑定后的根 URL
```

闸门（`@deepseek-ai/dsh-client-connection\lib\types\rpc.d.ts`）：

```ts
requestRejection(request: ConnectionTrustRequest): 401 | 403 | undefined
// 401 = 需要登录；403 = Host/Origin 不可信；undefined = 放行
```

`dshmarket` 的完整范例（**建议直接照抄**）：

- `dshmarket\src\http.ts`：`refuseUnadmitted(request,response)` —— 调宿主闸门，闸门抛错也按 403 处理（fail-closed）；`sameOrigin()`；`readJsonBody(req, 4KiB)`。
- `dshmarket\src\routes.ts` **L2080-2091**：
  ```ts
  const enforceHostGate = config.desktopHost !== true
  const registerRoute = (route) => {
    if (!enforceHostGate) return host.webServer.register(route)
    const handler = route.handler
    return host.webServer.register({ ...route, handler: (request, response) => {
      if (refuseUnadmitted(request, response)) return
      return handler(request, response)
    }})
  }
  // L2094: registerRoute({ kind:'exact', path:'/dsh-market/api/v1/capabilities', handler })
  ```
- 客户端侧（`dshmarket\src\client\market-data.ts`）同源 `fetch('/dsh-market/api/v1/...')`。

`dsh-chat-import` 的更轻量范例：
- `dsh-chat-import\lib\panel.mjs` **L40-58** `jsonRoute(path, handle)`（统一 JSON 出口、异常→500）；**L150** `registerPanelRoutes(ctx, ws, registryDir)`；全部路由 `POST /api-import/*`，经 `ctx.inject(['webServer'])` 延迟挂载（无 webServer 时永不执行，headless 安全）。

### 5.3 最小代码骨架（host 侧）

```js
// lib/index.js（host 入口，ESM）
export const name = 'mcp-manager'
export const inject = ['tools']            // 必需：要注册/注销工具
// webServer 是可选且可能晚挂载的 → 用嵌套 inject，不要写进顶层 inject
export function apply(ctx, config = {}) {
  const connections = new Map()            // serverId -> {client, tools, disposers}
  const state = loadState()                // 见 §7.3

  ctx.inject(['webServer'], (web) => {
    ctx.inject(['connection'], (conn) => {
      const gate = (req, res) => {
        const status = conn.connection.requestRejection?.(req)
        if (status === undefined) return false
        res.writeHead(status, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: status === 401 ? 'login required' : 'untrusted origin' }))
        return true
      }
      const routes = [
        ['GET',  '/mcp-manager/api/servers',      () => ({ ok: true, servers: listServers(state, connections) })],
        ['POST', '/mcp-manager/api/servers/test',  body => testConnectivity(body)],   // 连一次 listTools 再关
        ['POST', '/mcp-manager/api/servers/toggle',body => setServerEnabled(body)],
        ['POST', '/mcp-manager/api/tools/toggle',  body => setToolEnabled(body)],
      ]
      ctx.effect(() => {
        const offs = routes.map(([method, path, fn]) => web.webServer.register({
          kind: 'exact', path,
          handler: async (req, res) => {
            if (gate(req, res)) return
            if (req.method !== method) { res.writeHead(405, { allow: method }); return res.end() }
            try {
              const body = method === 'POST' ? await readJson(req, 64 * 1024) : undefined
              sendJson(res, 200, await fn(body))
            } catch (e) { sendJson(res, 500, { ok: false, error: String(e?.message ?? e) }) }
          },
        }))
        return () => offs.forEach(off => off())
      }, 'mcp-manager: http routes')
    })
  })

  // 启动时按 state 恢复已启用的服务器
  ctx.effect(() => { for (const s of state.servers) if (s.enabled) connectServer(ctx, s, state) },
             'mcp-manager: connections')
}
```

要点：
- `register()` 返回 disposer，必须 `ctx.effect` 里成对释放（HMR / 停用插件时不留脏路由）。
- 路由前缀用 `/mcp-manager/...`，**不要碰 `/api` 与 `/plugins`**（分别被 connection 网关和 client-modules 占用）。
- `requestRejection` 是较新宿主才有的方法 → 必须 `?.` 兜底（dshmarket 注释写明 "a host older than this service" 的情况）。

---

## 6. Q5 —— 客户端 UI 扩展点（含官方注册代码 包名+文件+行号）

### 6.1 槽位总表（本插件可能用到的）

| 需求 | slot | 类型/scope | 声明方（权威） |
|---|---|---|---|
| 设置页新增**分区/标签页** | `settings.section` | list / root | `@deepseek-ai/dsh-client-ui-settings\lib\types\client\contract\slots.d.ts` |
| 设置页「插件」分区内的一个 tab | `settings.plugins.tab` | list / root | 同上 |
| 设置页「通用」里的单行偏好 | `settings.general.item` | list / root | 同上（由 ui-settings-general 运行时声明） |
| 左侧栏**面板**（列表行） | `sidebar.panellist` | list / root | `@deepseek-ai/dsh-client-ui-sidebar\lib\client.js` L503-506 |
| 左侧栏面板的**主体**（中栏页面） | `main` | **keyed** / root | `@deepseek-ai/dsh-client-ui-layout\lib\client.js` L631-634 |
| 浮层（toast 等） | `shell.overlay` | list / root | ui-layout / ui-chat 等使用 |
| 右侧栏标签页 | `sidebar.right.pane.tab` | keyed / root | `@deepseek-ai/dsh-client-ui-sidebar-right\lib\types\client\contract\slots.d.ts` |
| 右侧栏会话面板 | `rightbar.session` | single / root | 同上 |
| 设置入口（侧栏脚） | `sidebar.settings`（occupant 单座） | single | ui-settings-general 占据 |

### 6.2 设置页分区：官方注册代码

`@deepseek-ai/dsh-client-ui-settings-general\lib\client.js`
- **L1293-1298**：注册 General 分区本身
  ```js
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section", id: "general", order: 0, label: () => t("general.nav"), locale: NS,
  }, ...))
  ```
- **L337**：shell 渲染当前分区
  ```js
  children: active !== void 0 && renderSlot("settings.section", { close: onClose }, { only: active })
  ```
- **L1145-1155**：导航列表从 `ctx.slots.entries("settings.section")` 读取 id/order/label，并 `ctx.slots.subscribe`

`@deepseek-ai/dsh-client-ui-settings-models\lib\client.js` **L4485-4490**：Models 分区
```js
ctx.slots.inject("settings.section", () => ctx.slots.register({
  name: "settings.section", id: "models", order: 10, label: () => t("nav"), inject: injected,
}, ...))
```

`@deepseek-ai/dsh-client-ui-settings-plugins\lib\client.js`：声明 `settings.plugins.tab` 宿主分区；
`@deepseek-ai/dsh-client-ui-settings-plugin-inventory\lib\client.js`：在其中注册一个 tab（可做只读插件清单）。

**第三方最干净的抄写对象**：`dshmarket\src\client\index.ts`（TypeScript 未压缩）
```ts
ctx.slots.inject('settings.section', () => ctx.slots.register({
  name: 'settings.section', id: 'market', order: 40, label: () => t('nav'),
  locale: NS, inject: () => ({ t }),
}, (ownerProps) => buildMarketElement({ ...ownerProps, surface: 'settings' })))
```
配套模式：`label` 是 **thunk**（locale 变更时用新文案重新注册，shell 不订阅 locale）；`inject` 提供该分区需要的 props；返回值可能是 `undefined`（要做 `typeof off === 'function'` 兜底）。

### 6.3 左侧栏面板：`sidebar.panellist` + `main` 成对注册

官方 `@deepseek-ai/dsh-client-ui-plugin-manager\lib\client.js`
- **L4355**：`const PANEL_ID = "plugins"`（侧栏行 id 与主面板 key 共用同一字符串）
- **L4417-4420**：面板主体
  ```js
  yield ctx.slots.register({ name: "main", key: PANEL_ID, locale: NS, store, inject: () => face, children: {...} })
  ```
- **L4477-4482**：侧栏列表行
  ```js
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist", id: PANEL_ID, order: 0, label: () => t("panel"), locale: NS,
  }, owner => /* 图标 */))
  ```

`@deepseek-ai/dsh-client-ui-sidebar\lib\client.js`
- **L454-469**：从 `ctx.slots.entriesOfSlot("sidebar.panellist")` 生成面板列表并订阅
- **L190-193**：`renderSlot("sidebar.panellist", { size: wide ? 16 : 18, active }, { only: id })`

`@deepseek-ai/dsh-client-ui-layout\lib\client.js`
- **L119**：`renderSlot("main", {}, { entryKey: activePanelId ?? "conversation" })`
- **L617**：`new LayoutController(..., (id) => ctx.slots.entries("main").some(e => e.options.key === id), ...)` → 提供 **`ctx.layout.selectPanel(id)`** 导航服务

第三方范例 `dshmarket\src\client\index.ts` / `sidebar-entry.ts`：
```ts
ctx.slots.register({ name: 'main', key: SIDEBAR_PANEL_ID, locale: NS, inject: () => ({ t }) }, () => h(...))
ctx.slots.register({ name: 'sidebar.panellist', id: SIDEBAR_PANEL_ID, order: SIDEBAR_PANEL_ORDER,
                     label: () => t('nav'), locale: NS }, owner => h(MarketLogo, { size: owner.size ?? 16 }))
// 离开页面前先 selectPanel(null)，否则中栏会指向不存在的 key
ctx.inject(['layout'], ({ layout }) => { layout.selectPanel(SIDEBAR_PANEL_ID) })
```

### 6.4 其他

- `shell.overlay`（toast）：`dshmarket\src\client\index.ts` 末尾
  ```ts
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name:'shell.overlay', id:'dsh-market-toast', label: () => 'dsh-market' }, Toast))
  ```
- 本地化：`ctx.locale.register(NS, { zh, en })` + `ctx.locale.bind(NS)`（dshmarket 同款）。**注意**：`@deepseek-ai/dsh-client-locale` 不在基线表，client bundle 里**不要 require 它**，只用 `ctx.locale` 服务。
- 设置项持久化：官方表单是「schema 驱动 + `volatile()` 字段」（`@deepseek-ai/dsh-settings\README.md`），**不适合任意服务器列表**；第三方惯例是自己写状态文件（`profiles\web\.dsh-market\` 就是 dshmarket 的私有状态目录）。本插件建议 `profiles\web\.mcp-manager\state.json`。

---

## 7. Q6 —— 本插件推荐架构与最小骨架

### 7.1 选型结论

**单包 dual-face：`dsh-mcp-workbench`（host 插件 + client UI 同包）**，理由与排除法：

| 方案 | 可行性 | 结论 |
|---|---|---|
| client-only + 复用已有 host API | ❌ | 官方没有 remote 暴露「MCP 连接状态 / 工具开关」；`pluginManager` remote 只管 bundle 与 loader row。且 remote 是构建期生成的，第三方拿不到 |
| host 插件只写 `cordis.patch.yml` 的 `disabled`，UI 侧复用 `dsh-mcp-client` | ⚠️ 部分可行 | 能实现「整个服务器开关」（写 patch + HMR ~1s），**但实现不了 per-tool 开关**：`dsh-mcp-client` 一次注册全部工具，无过滤配置；`ctx.tools.restrict()` 只作用于「调用者 agent scope」，不是全局 |
| **host 插件自己持有 MCP 连接 + 选择性注册工具 + 自定义 HTTP RPC + client 设置页** | ✅ | **推荐**。per-tool 开关的最小阻力路径：不注册 = 模型看不见 = 真不可用 |
| 混合：官方 row 管 server 开关 + 我们的包装 row 管工具过滤 | ❌ | 两个插件抢同一 `mcp__<server>__` 命名空间，`syncTools` 会因 public name 冲突整批回滚 |

关键机制证据（决定必须自己持有连接）：
- `@deepseek-ai/dsh-mcp-client\lib\types\index.d.ts`：`apply(ctx, config)` 连接一个 server 并把**全部**工具注册为 `mcp__<serverName>__<rawName>`；Config 只有 transport/url/headers/timeout/failOnStartupError/reconnect/maxInstructionBytes，**没有工具白名单**。
- `@deepseek-ai/dsh-tools\lib\types\index.d.ts`：`restrict(filter: ToolRestriction): () => void` 的文档是 "**Restrict global tools for the calling agent scope**"——scope 级，不是全局；`ToolRestriction = { allow?, deny? }`。
- 官方导出了**单个工具的适配器**：`export { Config, apply, createMcpToolDefinition, inject, name }`（`dsh-mcp-client\lib\index.js` 末尾）。`createMcpToolDefinition(ctx, { name, rawName, description, inputSchema, outputSchema, taskRequired, call })` 返回一个未注册的 `ToolDefinition` → **我们自己决定注册哪些**。
- ⚠️ `publicToolName()` **没有导出**（export 列表里没有它）。要复用官方命名规则得自己按源码复刻：
  ```js
  // dsh-mcp-client/lib/index.js publicToolName()
  const joined = `mcp__${serverName}__${rawName}`;
  const normalized = joined.replace(/[^A-Za-z0-9_-]/g, "_");
  if (normalized === joined && normalized.length <= 64) return normalized;
  const hash = sha256(`${serverName}\0${rawName}`).hex.slice(0, 12);
  return `${normalized.slice(0, 64 - 12 - 1)}_${hash}`;
  ```

### 7.2 三个实现选项（都可，按成本排序）

1. **动态 import 官方适配器（推荐）**：工具行为（图片/结构化内容/错误映射）与官方完全一致，且因为 realpath 相同，拿到的是宿主**同一个** `dsh-tools` 模块实例。
   ```js
   import { createRequire } from 'node:module'
   import { pathToFileURL } from 'node:url'
   const req = createRequire('C:/Users/Xingy/.dsh/profiles/web/package.json')
   const { createMcpToolDefinition } = await import(pathToFileURL(req.resolve('@deepseek-ai/dsh-mcp-client')).href)
   ```
2. 手写 `ToolDefinition`：`{ name, description, inputSchema, execute }` 直接 `ctx.tools.register(...)`。零官方依赖，但要自己处理结果投影。
3. 正式安装进 profile（`dsh plugin add`），直接 `import` 官方包即可（解析链天然可用）——**生产形态**。

MCP 连接用官方 SDK（profile 里已装，版本 2.2.0）：
```js
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
// 与服务端同款 transport 用法见 dsh-mcp-client/lib/index.js 顶部 import 段
```
> 若用 `link:` 开发，`@modelcontextprotocol/client` 需要在**插件项目自己的 node_modules**里（见 §8 坑 4）。

### 7.3 状态与开关语义

```jsonc
// C:\Users\Xingy\.dsh\profiles\web\.mcp-manager\state.json
{
  "version": 1,
  "servers": [{
    "id": "pharmcube",
    "name": "PharmCube",
    "transport": "streamable-http",                  // | "stdio"
    "url": "https://mcp-openapi.pharmcube.com/mcp",
    "headers": { "Authorization": "Bearer ..." },    // 读接口脱敏；参考 dsh-settings 的 secret role
    "command": null, "args": [], "env": {},
    "enabled": true,
    "tools": { "search_drug": true, "get_trial": false },   // 缺省全开：只记录显式关闭
    "note": "药品检索"
  }]
}
```

语义（直接决定「真的不可用」的验证口径）：
- `server.enabled=false` → 断开连接、dispose 全部工具 → 模型侧 `mcp__<server>__*` 全部消失（真不可用，不是"调用被拒绝"）。
- `tools[raw]=false` → 该工具**根本不注册** → 模型看不到，`run_code` 里也调不到。
- server 端 `notifications/tools/list_changed` → 重新 `tools/list`，按保存的开关集合重建注册。
- 工具命名沿用官方 `mcp__<server>__<raw>`，切换前后对模型/历史会话行为一致。

### 7.4 最小可运行骨架文件清单

```
D:\PythonProjects\dsh-mcp-workbench\
├── package.json                 # §7.5
├── cordis.patch.yml             # - insert: [{ id: mcp-manager, name: dsh-mcp-workbench }]
├── icon.svg
├── README.md
├── locale\zh.json  locale\en.json
├── lib\
│   ├── index.js                 # host 入口：apply/inject；注册路由；恢复连接
│   ├── store.js                 # state.json 读写（原子写、schema 版本）
│   ├── mcp.js                   # 连接管理：connect/dispose/listTools/registerEnabledTools
│   ├── toolname.js              # publicToolName 复刻 + 开关 key
│   └── routes.js                # exact HTTP 路由表 + 闸门
├── scripts\build-client.mjs     # esbuild → 套 __ModuleLoader__ wrapper → client\client.js
├── client\client.js             # 构建产物（HMR 监听的就是它）
└── src\client\
    ├── index.tsx                # apply/inject + slots 注册
    ├── ManagerSection.tsx       # 设置页分区主体（列表 + 表单 + 连通性测试 + 工具 tag cloud）
    ├── ServerCard.tsx  ToolTagCloud.tsx  api.ts（fetch 封装）
    └── styles.css               # 用 primitives 的 token；不要自造视觉
```

### 7.5 `package.json` 骨架

```jsonc
{
  "name": "dsh-mcp-workbench",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "MCP server & per-tool manager for the DSH Web GUI",
  "icon": "icon.svg",
  "main": "./lib/index.js",
  "exports": {
    ".": { "default": "./lib/index.js" },
    "./client": { "default": "./client/client.js" },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": ["lib", "client", "locale", "cordis.patch.yml", "icon.svg", "README.md"],
  "dsh": {
    "manifestVersion": 1,
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-client-ui-sidebar"],
      "external": []
    }
  },
  "engines": { "node": ">=22.13", "dsh": ">=0.2.0-rc.2" },
  "dependencies": { "@modelcontextprotocol/client": "2.2.0" },
  "peerDependencies": { "@deepseek-ai/cordis": "~4.0.5" },
  "scripts": {
    "build:client": "node scripts/build-client.mjs",
    "build:client:watch": "node scripts/build-client.mjs --watch"
  }
}
```

> `dsh.client.inject` 里的包名按「提供方包名」填，用于模块图排序；本项目只用基线模块（react / primitives），可留空。`external: []` 刻意留空——一旦 import 基线外的模块再补。

### 7.6 client bundle 构建脚本骨架

```js
// scripts/build-client.mjs
import { build } from 'esbuild'
const banner = 'window.__ModuleLoader__.load({ id: "dsh-mcp-workbench", factory: (require) => { var module = { exports: {} }; var exports = module.exports;'
const footer = 'module.exports = { name: "mcp-manager", inject: ["slots", "locale"], apply }; return module.exports; } });'
const opts = {
  entryPoints: ['src/client/index.tsx'], bundle: true, format: 'cjs', platform: 'browser',
  outfile: 'client/client.js', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
             '@deepseek-ai/cordis', 'zod', '@tanstack/react-virtual',
             '@deepseek-ai/dsh-client-store', '@deepseek-ai/dsh-client-ui-slots',
             '@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-ui-dockkit'],
  banner: { js: banner }, footer: { js: footer }, sourcemap: true, legalComments: 'none',
}
await build(opts)     // --watch 用 esbuild 的 context().watch()
```

### 7.7 client 注册骨架

```tsx
// src/client/index.tsx
import { h } from 'react'
import { ManagerSection } from './ManagerSection'

export const name = 'mcp-manager'
export const inject = ['slots', 'locale']

export function apply(ctx) {
  try {
    ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section', id: 'mcp-manager', order: 55,
      label: () => 'MCP 服务器', locale: 'mcp-manager',
    }, () => h(ManagerSection, { ctx })))
  } catch (e) { console.error('[mcp-manager] mount failed', e) }   // 单个插件抛错会拖垮整个 app
}
```

---

## 8. 坑清单（按「会浪费你最久」排序）

1. **DSH 启动是全有全无**。`dsh-app-boot` 的 `auditStartupEntries` 会在任何 required 插件失败时拒绝启动；本机 startup 日志里就有一条 `webserver` EADDRINUSE 导致 "2 required plugins did not activate" 的完整栈。→ host 插件 `apply()` 必须全程 `try/catch`；可选服务（`webServer`）一律用嵌套 `ctx.inject(['webServer'], ...)`，绝不能写进顶层 `inject`。
2. **client bundle 不是 ESM**。顶层 `import`/`export` 会直接 SyntaxError；必须套 `window.__ModuleLoader__.load({id, factory})`，且 factory 末尾 `return module.exports`。id 必须等于 `package.json.name`（`<pkg>/client` 也行，会被 strip）。
3. **基线模块表只有 11 项**（`react`、`react/jsx-runtime`、`react-dom`、`react-dom/client`、`@deepseek-ai/cordis`、`zod`、`@tanstack/react-virtual`、`dsh-client-store`、`dsh-client-ui-slots`、`dsh-client-ui-primitives`、`dsh-client-ui-dockkit`）。`@deepseek-ai/dsh-client-ui-settings` / `dsh-client-locale` 等**只能通过 `ctx.<service>` 用，不能 import**；确实要 import 的必须写 `dsh.client.external` + 让提供方行先加载。
4. **`link:` 本地开发会破掉 `@deepseek-ai/*` 解析**。Node 从源码 realpath 解析，拿不到 `profiles\node_modules` 的符号链接农场。三种解法：① `dsh plugin add` 正式安装（推荐）；② 在插件项目里 `pnpm install` 装 npm 上的官方包（同版本存在，但会是**第二份** cordis/dsh-tools 实例，只用纯函数/纯对象才安全）；③ 在插件项目里建目录联接 `node_modules\@deepseek-ai` → `C:\Users\Xingy\.dsh\profiles\node_modules\@deepseek-ai`（realpath 一致 → 同一实例）。
5. **不要用 `typert` 给第三方插件做 RPC**。`./typert` artifact 是 monorepo 生成物，缺它会被 typert-loader 静默跳过；api-remotes 的能力集是构建期硬编码的。用 exact HTTP 路由 + `connection.requestRejection` 闸门（§5）。
6. **`/api`、`/plugins` 是别人的路由**（connection 网关的 prefix、client-modules 的 bundle 路由）。自定义路由用自己的前缀；同表内 exact 路径重复注册会 throw。
7. **per-tool 开关不能靠 `ctx.tools.restrict`**：它是 calling-agent-scope 级的，换 agent/会话就失效。必须「不注册」。
8. **`publicToolName` 未导出**：自己复刻命名规则（含 12 hex 的 sha256 兜底），否则长工具名/非法字符时与官方不一致，历史会话里的工具名会对不上。
9. **`dsh-mcp-client` row 与我们抢命名空间**：用户 `cordis.patch.yml` 里现有一条 `disabled: true` 的 `mcp-pharmcube`（`serverName: pharmcube`）。启用本插件后应**移除或保持 disabled**，否则同一 serverName 触发 public name 冲突（整批回滚，零工具）。迁移时把 url/headers 搬进本插件 state。
10. **HMR 换 bundle 会丢组件状态**：表单草稿、tab 选择要放 store/URL，而不是 `useState`。失败不回滚，只在插件列表显示可重试错误。
11. **HMR 不 watch 源码**：`dsh-base` 里 `id: hmr` 的 `config.root` 是 `[]`。想「保存即生效」请把源码→bundle 的构建开成 watch（`build:client:watch`），HMR 只负责把新 `client.js` 推给浏览器。
12. **`settings.section` 的 `label` 是 thunk**，locale 变化时要重新注册；`ctx.slots.register` 的返回值在旧宿主上可能不是函数，disposer 要 `typeof off === 'function'` 兜底。
13. **`icon` 文件约束**：≤256 KiB，且 realpath 必须落在包内（符号链接逃逸会被拒）。

---

## 9. 端到端验证建议（给 lead / 验证同学）

**A. 连通性「真的通」**
1. `curl -s http://127.0.0.1:3080/mcp-manager/api/servers` → 已配置 server + live 状态。
2. `POST .../servers/test`（body: 完整 config）→ `{ok:true, toolCount:N, tools:[{name,description}]}`。实现就是「临时 `new Client` → connect → `tools/list` → `close()`」，不注册任何工具，零副作用。
3. 交叉验证：用现有 `mcp-pharmcube` row 临时启用（或 `curl` 直接对 `https://mcp-openapi.pharmcube.com/mcp` 发 `initialize`+`tools/list`）对照工具清单。

**B. 「关掉服务器 → 真的不可用」**
1. `POST /mcp-manager/api/servers/toggle {id, enabled:false}` → 返回 `{registered:0}`。
2. `GET /mcp-manager/api/tools` → `[]`（我们自己的注册视图）。
3. 模型侧交叉验证：新建会话问「调用 `mcp__pharmcube__*`」→ 应报工具不存在；或在 `run_code` 里取该工具名 → `undefined`。
4. 反向：`enabled:true` → 工具数恢复 = `tools/list` 长度。

**C. 「关掉单个工具 → 真的不可用」**
1. `POST .../tools/toggle {server:'pharmcube', raw:'get_drug_label', enabled:false}` → 该 public name 从注册视图消失，其余不变。
2. 直接调该工具 → 不存在；改调一个仍启用的 → 成功。
3. 理想情况下验证「重启 dsh web 后状态仍生效」（state.json 持久化）。

**D. 不干扰用户会话**
- 所有验证走 `curl` 直连 3080 的 API，**不要在用户的 GUI 会话里点设置/发消息**。
- 任何一次 `dsh web` 重启都必须显式申请许可（当前 3080 进程严禁被我们 kill）。

---

## 10. 证据索引（包路径一览）

| 主题 | 文件（前缀省略 `C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\`） |
|---|---|
| `dsh` manifest schema | `dsh-package-manifest\lib\types\types.d.ts` |
| client 模块系统（host half） | `dsh-client-modules\lib\index.js` L171-181, L720-749, L937；README.md |
| client 模块系统（browser half） | `dsh-client-modules\lib\client.js` L680-714 |
| client HMR | `dsh-client-hmr\lib\index.js` 全文、README.md |
| 基线模块表 | `dsh-web-frontend\dist\assets\index-CN7NIWNw.js` 偏移 916075（`function SZ()`） |
| Web 组合（client 名单） | `dsh-web-app\cordis.patch.yml` L179-324 |
| host HMR 配置 | `dsh-base\cordis.patch.yml`（`id: hmr`, `root: []`）、`dsh-hmr\README.md` |
| webserver API | `dsh-host-webserver\README.md`、`lib\types\index.d.ts` |
| 请求闸门 | `dsh-client-connection\lib\types\rpc.d.ts`（`requestRejection`） |
| typert 生成物要求 | `dsh-typert-loader\README.md`、`dsh-api-remotes\README.md` |
| settings slot 契约 | `dsh-client-ui-settings\lib\types\client\contract\slots.d.ts` |
| 设置分区注册 | `dsh-client-ui-settings-general\lib\client.js` L337, L1145, L1293；`dsh-client-ui-settings-models\lib\client.js` L4485 |
| 侧栏面板 | `dsh-client-ui-plugin-manager\lib\client.js` L4355, L4417, L4477；`dsh-client-ui-sidebar\lib\client.js` L190, L454-469, L503；`dsh-client-ui-layout\lib\client.js` L119, L617, L631 |
| MCP 工具桥 | `dsh-mcp-client\lib\types\index.d.ts`、`lib\types\tools.d.ts`、`lib\index.js`（`publicToolName` / 末尾 export） |
| 工具可见性限制 | `dsh-tools\lib\types\index.d.ts`（`restrict` / `ToolRestriction`） |
| 插件管理语义 | `dsh-plugin-manager\README.md` |
| 第三方实例（可读源码） | profile：`dshmarket\src\client\index.ts`、`dshmarket\src\http.ts`、`dshmarket\src\routes.ts` L2080-2091、`dsh-chat-import\lib\panel.mjs` L40-58 / L150、`@agentscope-ai\reme-dsh-plugin\dist\client.js` |
| 用户 profile | `C:\Users\Xingy\.dsh\profiles\web\{package.json, cordis.yml, cordis.patch.yml}`；解析桥 `C:\Users\Xingy\.dsh\profiles\node_modules` |
| HMR 实证 | `C:\Users\Xingy\.dsh\logs\startup-2026-10-20T11-29-42.094Z-*.log` |

---

## 11. 未验证 / 需要实测确认的点（诚实标注）

1. **新增链接包在「不重启」下能否被 HMR 首次 import**：文档给出的是 "A new package entry takes effect when its Loader entry restarts"，而 patch 变更会触发 recomposition。两者叠加下**大概率可以**，但本轮未实测（不允许重启 3080）。保守建议：首次装好后刷新页面；仍 404/未注册则重启 `dsh web`。
2. **`dsh plugin add link:<D:\...>` 在本机的实际行为**（是否要求先在该目录 `pnpm install`、是否会写 `dsh.profile.bundles`）：`dsh-plugin-manager\README.md` 说 "Linked packages use that checkout's dependencies and peers; rebuilding and restarting remain necessary after code changes"，据此要求先 `pnpm install` + `pnpm run build`。
3. **`ctx.connection.requestRejection` 在 0.2.1-rc.2 的实际挂载形状**：d.ts 里既有 `HostConnectionHandle.requestRejection` 也有 `ConnectionService.requestRejection`；dshmarket 通过扫描 `ctx.connection` 取得（`src/index.ts` 的 `setRequestGateSource`）。实现时先 `console.log(Object.keys(ctx.get('connection')))` 确认一次。
4. **`@modelcontextprotocol/client@2.2.0` 子路径 `/stdio`** 在第三方直接依赖时需确认可用（`dsh-mcp-client\lib\index.js` 顶部 import 已证明在本机 profile 内可用）。
5. **`settings.section` 的 `order` 取值**：官方 general=0、models=10、plugins 更靠后；建议 50+ 避免与官方抢位（dshmarket 用 40、chat-import 用 21）。
