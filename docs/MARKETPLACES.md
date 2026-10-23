# 插件市场收录矩阵 / Marketplace Listings

> 最后核验：2026-10-23（已收录 47 个市场 + 74 个待审/待跟进 PR/Issue/目录站（bruc3van 已 approved 2026-10-23，但站点 index 实测固定 1000 条（star/热度排序），未进榜）；dshmk 条目待重新采集）。状态说明：✅ 已确认收录 · 🟢 PR 已合并 · 🟡 PR/Issue 待审 · ⏳ 自动采集待生效 · ⚪ 未提交。

## 一、已确认收录

| 市场 | 规模 | 收录方式 | 状态 | 链接 |
| --- | --- | --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 20k★ | 人工 PR | ✅ 已合并（PR #8407，2026-10-22） | https://awesome-dsh-plugin.com/p/hxlog/dsh-mcp-tools/ （2026-10-23 复核：独立详情页 200、首页列表命中） |
| [Werewolf-Wu/awesome-dsh-plugin-status](https://github.com/Werewolf-Wu/awesome-dsh-plugin-status) | 每日中文镜像（带仓库状态徽章，0★/2026-10-23 起） | 自动镜像 awesome-dsh-plugin 列表 | ✅ 已含（GitHub code search 命中本插件名） | https://github.com/Werewolf-Wu/awesome-dsh-plugin-status |
| [dsh-plugin-catalog](https://www.npmjs.com/package/dsh-plugin-catalog)（npm 目录包） | 3.2k 条 | 随主市场上游自动生成 | ✅ 每日构建含本插件（2026-10-23 构建 `2026.1023.9552`，plugins.json 7.47MB 已核验） | https://unpkg.com/dsh-plugin-catalog/index.json |
| [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 188★ / 19.6k 仓库 | GitHub topic 自动索引（2h） | ✅ registry.json 已含 | https://github.com/bradeGithub/DSH-Plugins-Marketplace |
| [ZASENJC/dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store)（dshmk.com） | 72★ / 2500 验证 | 服务端自动采集 + 沙箱验证 | 🟡 待复核：2026-10-23 实测 `catalog.json`（9.4MB）未含本插件，已提交 issue #13 请求重新采集/验证 | https://dshmk.com |
| [imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)（deepseek1024.com） | 312★ | 人工 PR（catalog JSON，CI 自动合并） | 🟢 已合并（PR #669）；线上 API 已返回：`GET /api/v1/plugins/hxlog/dsh-mcp-tools`（2026-10-23 核验） | https://deepseek1024.com/ |
| [fendouai/awesome-deepseek-harness](https://github.com/fendouai/awesome-deepseek-harness) | 41★ | 定时 discover workflow 自动写入 data/plugins.json | ✅ 已含（README 搜索到 hxlog/dsh-mcp-tools） | https://github.com/fendouai/awesome-deepseek-harness |
| [vvlife/awesome-deepseek-harness-plugins](https://github.com/vvlife/awesome-deepseek-harness-plugins) | 10★ | PR #168（README.md Tools & Editor UX，机器人规则审核通过后自动 squash-merge） | 🟢 已合并（2026-10-23，commit c337c46） | https://github.com/vvlife/awesome-deepseek-harness-plugins |
| [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | 453★ | 每日抓取 `dsh-plugin` topic + 人工/规则复核，写入 data/approved.json | 🟡 已进入 `data/approved.json`（2026-10-23 核准），但站点索引 `bruc3van.com/dsh-plugins/index.json` 实测固定 **1000 条**（按 star/热度取 Top1000），`data/market.json`、`curated.json` 均无我们 → 核准≠进榜，需 star/下载量升到 Top1000 才会渲染。安装目标映射 `data/packages.json` 由维护者审核补充。原：✅ 已通过复核（approved.json 记录 `hxlog/dsh-mcp-tools: 2026-10-23`），README/feed 待下一轮渲染 | https://github.com/bruc3van/awesome-dsh-plugin · **已 approved：`data/approved.json["hxlog/dsh-mcp-tools"] = "2026-10-23"`**；`repositories.json` 已有我们，但 `market.json` 有体积上限（约 1000 条，分类轮转 + star 排序），2★ 暂未进渲染，升星后自动进入，**无需 PR** |
| [2BingLing/dsh-market](https://github.com/2BingLing/dsh-market)（dsh.market） | 168★ / 6000+ | topic 自动扫描写入 data/plugins.json | ✅ 已含（`sources: [topic]`，cordis-plugin，已生成中文简介） | https://dsh.market/ |
| [unStone/dsh-xray](https://github.com/unStone/dsh-xray) | 7★ / 静态能力扫描注册表 | topic 自动收录（能力卡片 C3：runtime patch / exec / dev 网络） | ✅ 已收录：<https://unstone.github.io/dsh-xray/p/hxlog__dsh-mcp-tools.html> | 自动扫描，无需提交 |
| [linny006/mcp-servers-live](https://github.com/linny006/mcp-servers-live) | 13★ / 15 分钟刷新 MCP 索引 | GitHub 全量 MCP 仓库自动索引 | ✅ 已收录：<https://linny006.github.io/mcp-servers-live/r/hxlog/dsh-mcp-tools/index.html> | 自动抓取，无需提交 |
| [lwmxiaobei/dsh-plugins](https://github.com/lwmxiaobei/dsh-plugins)（dsh-plugins.org） | 5★ / 747 插件自动同步 | GitHub 自动汇总 + 基础校验（sync workflow） | ✅ 已收录：`catalog/plugins.json` 含本仓库（含 install 命令与 bundlePatch 信息） | https://dsh-plugins.org |
| [dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)（dsh-plugin.org） | 310★ / 16.5k | Issue #391 官方核对 + 站点同步 | ✅ 已收录并上线：https://dsh-plugin.org/plugins/hxlog/dsh-mcp-tools | https://dsh-plugin.org/ |
| [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | 397★ / 20.1k | 人工 review PR + 每日自动扫描 | ✅ 已合并：PR #671（2026-10-23T09:02Z），条目在 MCP Servers 分区 | https://github.com/Dominic789654/awesome-deepseek-harness |
| [LivXue/dsh-plugin-shop](https://github.com/LivXue/dsh-plugin-shop) | 656★ / 18,276 插件（每日刷新） | npm 关键词自动采集（`dsh-plugin`/`deepseek-harness`） | ✅ 已收录：`registry/first-seen.yml` 载明 `dsh-mcp-tools`（`added: 2026-10-21`；仓库已改造成 host 插件 + registry 数据仓，旧的 `LivXue.github.io` Pages 地址已 404，勿再引用） | https://github.com/LivXue/dsh-plugin-shop/tree/main/registry |
| [dsh.so](https://www.dsh.so)（ihuajiu/dsh.so） | 21,303 插件验证注册表 | npm/GitHub 自动收录 + L1–L5 扫描 | ✅ 已收录：<https://www.dsh.so/artifact/dsh-mcp-tools/>（**Verification L5 · Run tested**，LowRisk / Trust Gold，2026-10-21 复检）（2026-10-21 发布） | 自动抓取，无需提交（2026-10-23 复核：artifact 页 200 且含本插件） |
| [DshMarketPlace/dshmarketplace](https://github.com/DshMarketPlace/dshmarketplace)（dshmarketplace.dev） | 3★ / 3,420 listing + **13,175 条 API 索引** | GitHub topic 自动 ingest + 沙箱验证安装命令 | ✅ 已收录：`/api/v1/index` 含 `hxlog/dsh-mcp-tools`（`category: tools` + install 命令；2026-10-23 复核，`generated` 10:38Z，`count: 13175`）；`path` 为 null（暂无人工精选详情页，非必需）。曾开 Issue #7 申请，复核后自行关闭并说明 |
| [UntR/dsh-plugin-marketplace](https://github.com/UntR/dsh-plugin-marketplace)（`untr-dsh-marketplace`，1★，registry-backed） | 自有 registry v1（`index.json` 33.2MB + 每插件 JSON） | GitHub topic 自动 crawl（每小时/按需 enrich） | ✅ 已收录：`registry/v1/plugins/1427825895.json`（slug `hxlog/dsh-mcp-tools`、`bundle.detected=true`+`patch=./cordis.patch.yml`、`install.spec=dsh-mcp-tools@1.0.2`、`npm.repositoryMatches=true`、`requiresBuildApproval=false`、license MIT；2026-10-23 09:15Z enrich） | https://github.com/UntR/dsh-plugin-marketplace/tree/main/dsh-plugin-registry |
| [ymck-x/dsh-plugin-index](https://github.com/ymck-x/dsh-plugin-index)（cj.codexve.cn） | 22,485 条 · 证据优先索引 | 服务端管道：topic 枚举 + code search + npm 关键词，**只认 `dsh.bundle.patch`** | ✅ 已收录：站点分片 `p/20261023-180504-25.json` 含 `hxlog/dsh-mcp-tools`（`n: dsh-mcp-tools`、`v: 1.0.2`、tag 固定安装地址、分类「模型接入」、证据 `e:2`；数据 `generated 2026-10-23T10:05Z`） | https://cj.codexve.cn/ |
| [helloHupc/dsh-plugin-hub](https://github.com/helloHupc/dsh-plugin-hub)（dsh-plugin-hub.hupc.site） | 22★ · 多源聚合检索（每小时刷新） | GitHub topic + dshworks 等多源去重聚合 | ✅ 已收录：`data/plugins.json`（16.0MB）含 `id: hxlog/dsh-mcp-tools`、`status: verified`、`sources: [github_topic, dshworks]`、category tools（2026-10-23 10:50 刷新） | https://dsh-plugin-hub.hupc.site |
| [dshfind.com](https://dshfind.com)（hikariming/dshfind） | DSH 插件超市 + 学习社区（四语言） | 自动同步 GitHub `dsh-plugin` topic 全量仓库，每日刷新 star/增长/质量分 | ✅ 已收录：`/zh/plugins/hxlog/dsh-mcp-tools` 页面 200（分类「工具集成」；展示 star/7 日增长/语言/更新日；另有可嵌入 README 的 badge/card API；安装命令按其探测的 Release `.tgz` 推导，当前显示 v1.0.0 属抓取缓存，下一轮同步会取 v1.0.2） | https://dshfind.com/zh/plugins/hxlog/dsh-mcp-tools |
| [realguan/dsh-plugin-market](https://github.com/realguan/dsh-plugin-market)（索引源：`realguan.github.io/dsh-plugin-market/dsh-index.json`、`cdn.jsdelivr.net/gh/realguan/dsh-plugin-market@dist/dsh-index.json`） | 4,562 条 / 23 分类 | 每日 03:17Z 从上游 feed 自动重建索引 | ✅ 已含（2026-10-23 核验 `dsh-index.json` 7.72MB：`name=dsh-mcp-tools`、`versions[0]=1.0.2`、`source.type=npm`、`metadata.category=tools`） | https://realguan.github.io/dsh-plugin-market/ |
| [vbarter/dsh-plugin-registry](https://github.com/vbarter/dsh-plugin-registry)（[dsplugin.app](https://dsplugin.app)） | 社区插件注册表 + 发布流程（`publish.html`） | 自动发现 + 站点数据快照 | ✅ 已含（`data/plugins.json` 25.4MB 内条目 `id: hxlog/dsh-mcp-tools`，含中英描述） | https://github.com/vbarter/dsh-plugin-registry/blob/main/data/plugins.json |
| [hoyyang/dsh-market-index](https://github.com/hoyyang/dsh-market-index)（dsh-store 市场目录索引） | 可订阅索引 `registry.json`（29.3MB） | GitHub Actions 定时抓取 `#dsh-plugin` 全量仓库生成 | ✅ 已含（2026-10-23 抓 `registry.json` 检索到 `dsh-mcp-tools`） | https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/registry.json |
| [XingLingQAQ/dsh-plugin-registry](https://github.com/XingLingQAQ/dsh-plugin-registry) | 机器可读目录 `catalog.json`（451KB，每日刷新） | 自动抓取 | ✅ 已含（2026-10-23 抓 `catalog.json` 检索到 `dsh-mcp-tools`） | https://raw.githubusercontent.com/XingLingQAQ/dsh-plugin-registry/main/catalog.json |
| [WSK-build/awesome-dsh-mobile-plugins](https://github.com/WSK-build/awesome-dsh-mobile-plugins)（移动端精选列表，站点 wsk-build.github.io） | 45 条目 · 每插件一个 `data/plugins/<owner>__<repo>.yml` | Issue/PR 投稿，CI 有三道闸（`dsh.bundle` 清单、仓库年龄 ≥1 天、非常规整拷贝）+ 描述查重 | ⏳ **PR #24**（2026-10-23 提交；本地已跑 `validateEntries`=0 problems、18 个测试全绿、`build-site.mjs` 通过） | https://github.com/WSK-build/awesome-dsh-mobile-plugins/pull/24 |
| [deepseekplugin.org](https://deepseekplugin.org)（DeepSeek Harness 插件目录） | 目录 sitemap 8,593 条 · 2.67MB `registry/v1/catalog.json` | **自助 API 投稿**：`POST /api/submissions {url}`，识别后即时发布 | ✅ 已收录（2026-10-23 提交，`state=published`；解析出标题/中英描述/安装命令 `dsh plugin --profile web add dsh-mcp-tools`/tags/`installable=true`/`security.score=5`） | https://deepseekplugin.org/plugins/submitted?slug=hxlog-2f-dsh-2d-mcp-2d-tools |
| [dsh-plugins-mp.com](https://dsh-plugins-mp.com)（`dsh-plugins-hub` npm 客户端的数据源） | 19,175 个插件条目（`/api/plugins` 分页 24/页） | 自动抓取 + 结构校验（`verificationState: structure_ok`） | ✅ 已含（API `?q=` 命中 `slug: hxlog--dsh-mcp-tools`，`license: MIT`、`profiles:[web]`、`categories:[tools,models]`；站点页 `/plugins/hxlog--dsh-mcp-tools` 200） | https://dsh-plugins-mp.com/plugins/hxlog--dsh-mcp-tools |
| [dsh.qomob.ai](https://dsh.qomob.ai)（qomob 的 DSH 导航站，数据内嵌在 SPA bundle） | 1,700+ 条（bundle 内嵌全量 JSON） | 非自建目录：聚合 awesome 列表 + GitHub 元数据（`source: awesome-list`） | ✅ 已含（bundle 内 `id: hxlog/dsh-mcp-tools`，`category: terminal`、`score: 53`、`installCmd: dsh plugin add "github:hxlog/dsh-mcp-tools"`、topics/stars/license 与我们仓库一致，`updatedAt: 2026-10-23`） | https://dsh.qomob.ai/ |
| [dsh.pub](https://dsh.pub)（12,704 条，按固定 commit 可安装的插件注册表） | 12,704 条（`community.generated.json`） | GitHub Topic `dsh-plugin` 自动同步 + 静态契约校验（`topic-catalog-sync.yml`） | ✅ 已含（`id: github:hxlog/dsh-mcp-tools`、`slug: dsh-mcp-tools`、`version: 1.0.2`、`license: MIT`、`type: bundle`、`category: client-ui`；7 项静态校验全 true：pinnedCommit / bundleManifest / safeBundlePatch / committedRuntime / committedClient / readme / license；`discoveredVia: github-topic:dsh-plugin`，`status: verified`） | https://dsh.pub/en/plugins/dsh-mcp-tools/ |
| [dshhub.org](https://dshhub.org)（`coderPerseus/dsh-hub`，README 自称静态目录 + CLI + Harness 原生工具，每日刷新） | 2,000+ 插件（站点 README） | 每日抓取 GitHub；Issue 投稿 `[Plugin] ...`；`data/catalog-enrichment.json` 10.7MB 带中文摘要 | ✅ 已含（`github:hxlog/dsh-mcp-tools` 在 enrichment 中；详情页 200，含中文描述「管理MCP服务器并按需开关MCP工具」、安装命令 `npx -p @deepseek-ai/dsh dsh plugin --profile web add github:hxlog/dsh-mcp-tools`、MIT；**版本字段仍显示 1.0.0 / 兼容性「待验证」，等每日刷新**） | https://dshhub.org/plugins/hxlog/dsh-mcp-tools |
| [dshhub.co](https://www.dshhub.co)（Passcode Market，口令/付费插件市场） | 13,144 条 sitemap URL | 从 GitHub / awesome 目录抓取 + 站内 Publish | ✅ 已含（`/en/plugin/hxlog/dsh-mcp-tools`、`/zh/plugin/...` 均为 200，标题带插件名，正文含中文功能描述、分类「工具与能力」、`Added 2026-10-22`、★ 2、源仓库与 awesome-dsh-plugin 原页链接） | https://www.dshhub.co/en/plugin/hxlog/dsh-mcp-tools |
| [dshpluginhub.ai](https://dshpluginhub.ai)（DSH Plugin Hub，有 CLI `pax-beehive/dsh-hub-cli` 277★、Profiles/Categories/News/Docs） | 站点 sitemap 331 条（插件页动态不入 sitemap） | 从 npm/GitHub 抓取 + 固定 commit 安装源 + README/兼容性/版本展示 | ✅ 已含（`/plugins/dsh-mcp-tools` 200，`<title>Mcp Tools — DSH Plugin…</title>`，正文有功能描述、`dsh plugin --profile web add github:hxlog/dsh-mcp-tools#9d0ac4551ad69e2c7844363c4e3a989f219bdefa` 固定 commit 安装命令、版本 1.0.2/1.0.0、MIT、README） | https://dshpluginhub.ai/plugins/dsh-mcp-tools |

> **回归核验（2026-10-23）**：已收录渠道逐一在线复核，全部仍含 `hxlog/dsh-mcp-tools`——awesome-dsh-plugin feed（7.47MB）、npm `dsh-plugin-catalog@2026.1023.9552`、dsh.so（L5）、deepseek1024 API、bradeGithub registry（19MB）、2BingLing data/plugins.json（39.8MB，master）、dsh-xray 能力卡、linny006 MCP 索引页、lwmxiaobei catalog、imsai `catalog/plugins/hxlog--dsh-mcp-tools.json`、fendouai README、vvlife README、dsh-plugin.org 详情页、dshmarketplace.dev API。bruc3van 待每日 14:17Z 重建。

## 二、待审提交

| 市场 | 规模 | 提交 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins)（dsh.works） | 24★ / 20.7k | PR #184（data/plugins.json） | 🟡 待审 · **2026-10-23 深夜二次 rebase 到 `8c0bb95`**：冲突仅在渲染产物 `docs/plugins-embed.js`/`docs/stats.json`，取上游后用仓库脚本 `npm run render`（20,770 条）重建，`validate` ok、`render:check` in sync，最终 diff 7 文件 +53/−12，`mergeable_state: clean`（该仓库 `coverage: sweep` 自动提交约每小时一次，合并前可能再次 dirty） | 维护者按 Sweep 批量 fold 贡献者 PR | 队列机制：`coverage.json`（2026-10-23）显示 topic 唯一仓库 25,430 / 已决定 22,456 / **队列 472**，本仓库可通过 `topic:dsh-plugin` 检索到（GitHub search 命中 1）→ 由 sweep 决定批次收录；PR #184 为并行路径。
| [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | 1.2k★ | PR #737（README + README.zh-CN 的 Tools & Utilities） | 🟡 待审 | 手选列表；CATALOG 由 topic 自动生成，后续可能自动出现 · **lint 基线相同**（2026-10-23 本地复跑 workflow 同命令）：`main` 与 PR 分支均 exit 1 / **21 个相同 issue**，本 PR 新增 0 个；维护者 2026-10-16 后未再处理 PR（仓库现有 22 个 PR 全部 `action_required`） |
| [AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar) | 1.5k★ | PR #968（PLUGINS.md 单插件表登记） | 🟡 待审 | 未登记也会每日 02:00 扫 topic 自动收录 |
| [kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins) | 64★ | PR #150（plugins/mcp.md） | 🟡 待审 | 14 类目录，归 mcp 分类 · **已同步 main**（2026-10-23 合并上游后重跑仓库自带检查通过，`behind: 0` / `MERGEABLE`） |
| [beancookie/awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | 171★ | PR #236（README + README.en 的工具与能力） | 🟡 待审 | 504 个插件的中文目录 · **已同步 main**（2026-10-23 合并上游后重跑仓库自带检查通过，`behind: 0` / `MERGEABLE`） |
| [Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | 558★ | Issue #94（目录无 PR 入口，请求收录） | 🟡 待回复 | 纯生成式目录 · **PR [#96](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/pull/96) 已开**（README.md + README.zh-CN.md 各 +1 行，`CLEAN`/`MERGEABLE`，`Closes #94`；该仓库近期按批次合并外来 PR：#86–#91 已于 10-16/10-18 合并） |
| [losebird/dsh-plugin-market](https://github.com/losebird/dsh-plugin-market) | 16★ | PR #54（registry/curated） | 🟡 待审 | 合并后数秒内上架 · **本地复跑门禁**（2026-10-23）：`node scripts/validate.mjs` → `校验通过: 28 个 curated 条目`；PR 仅新增 1 个 curated 文件，`behind: 0` |
| [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | 103★ | PR #162（catalog/plugins.json + 生成的中文镜像） | 🟡 待审（CI 需维护者批准首跑） | 双语 JSON 目录，developer-tools 分类；本地 `generate_readmes.py --check` 通过 |
| [Anil-matcha/awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | 13★ | PR #13（Tools & Capabilities） | 🟡 待审 | 单行条目，格式与相邻条目一致 |
| [GordenSun/awesome-dsh-plugins](https://github.com/GordenSun/awesome-dsh-plugins) | 10★ | PR #6（生态基建与开发 + 英文镜像） | 🟡 待审 | 审核会看「解决什么问题 / 为何有代表性 / 如何安装」 |
| [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins) | 7★ | PR #38（verified-plugins.csv 的 mcp 分类 + 重新生成文档） | 🟡 待审 | 要求加载证据、许可证、权限与数据流披露；已按模板填写 |
| [white0dew/awesome-dsh-plugins](https://github.com/white0dew/awesome-dsh-plugins) | 12★ | PR #21（data/sources/reviewed-catalog-additions.json + 重新生成内容） | 🟡 待审 | 生成器硬编码计数已同步（11→12、8561→8562、10776→10777） · **本地复跑门禁**（2026-10-23）：`npm run validate-content` → `Content validation passed for 10777 bilingual plugins`；脚本内 pinned 计数 11→12 / 8561→8562 两处一致更新 |
| [awesome-deepseekharness/awesome-deepseek-harness](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) | 25★ | PR #186（README.md + README.zh.md 的 Tools 表格） | 🟡  curator 已核验通过并建议合并（待 @hdjekuue 签字）（submission-guard 通过，人工审核） | 机器人在 PR 里提示「14 天内第 4 个自荐会自动关闭」，本仓库只投 1 个，暂不再追加 |
| [walkinglabs/awesome-deepseek-harness-plugins](https://github.com/walkinglabs/awesome-deepseek-harness-plugins) | 48★ | Issue #120（submit-plugin 表单） | 🟡 待审核 | 该仓库只收 Issue，不接受直接 PR · 仓库已改名 `awesome-deepseek-harness-plugins`；**PR [#121](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/pull/121) 已提交**（含 README.md + README.zh.md，`Closes #120`），该仓库近一周每日都在以外来 PR 合并新增（#110–#119） |
| [xianyu110/awesome-deepseek-harness](https://github.com/xianyu110/awesome-deepseek-harness) | 11★ | PR #126（README.md 工作流与开发集成） | 🟡 待审 | 手动精选区；自动发现区不动 |
| [leenkcool/Blue-Whale-Harness](https://github.com/leenkcool/Blue-Whale-Harness) | 196★ / 1819 真插件 | Issue #181（catalog-intake 模板） | 🟡 待审核 | 维护者核对 `cordis.patch.yml` 后写入 catalog/intents.json 并重建站点 |
| [like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | 96★ | PR #43（data/curated.json override，`keep: true` 绕过 min_stars=3 初筛） | 🟡 待审 | 4 小时自动同步，2★ 低于门槛，按 CONTRIBUTING 走人工 override |
| [whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 44★ / 2103 | Issue #76（plugin-submission 模板） | 🟡 待审核 | 目录按 topic 抓取但只收 top-N，需人工提名；目录每小时刷新 |
| [zp-home/dsh-recommend](https://github.com/zp-home/dsh-recommend) | 19★ | Issue #41（submit-plugin 模板 + 精选认证申请） | 🟡 待审核 | 每日同步 topic；`dsh.bundle` 可安装，申请 🏅 精选认证 |

| [diegosouzapw/awesome-omni-dsh-plugins](https://github.com/diegosouzapw/awesome-omni-dsh-plugins) | 19★ / 3626 | PR #3723（catalog/plugins/hxlog-dsh-mcp-tools.yaml，每插件一 PR） | 🟡 待审（本地 `catalog validate` 3627 entries valid；已 re-pin 到最新 commit `65fc438`，semgrep 重跑中） | 创作者优先 PR；分类 coding-developer-tools · **本地已过 CI 门禁**（2026-10-23，按 workflow 同命令）：`catalog validate` → `3627 entries valid`；`docs-check --skip-count` → passed |
| [polang233/dsh-plugin-index](https://github.com/polang233/dsh-plugin-index)（[dshopen.org](https://dshopen.org) · Open Plugin Market，876 条索引） | 35★ | 维护者**手工批量**写进 `data/sources.json`（非 PR 通道）；Issue #58 已由维护者回复「已核查并加入收录配置」 | ✅ 已收录（2026-10-23）：`https://dshopen.org/index.json` 可检索到 `dsh-mcp-tools`（title zh「MCP 管理器」/en「MCP Manager」、category `tools`、★3、keywords 含 dsh/dsh-plugin/mcp、repository 指向本仓库、图标已生成） | 索引每 6 小时重建；条目由维护者手写，不带 install spec，安装走插件市场默认解析 |
| [dingdang66686/dsh-market-index](https://github.com/dingdang66686/dsh-market-index)（format-1 市场索引，3,365 插件 / 1.26 万版本） | 0★ / GitHub Actions **每 12h** 从 awesome feed 全量重建并校验 | 产出可直接加进官方 Discover 的索引源（raw / GitHub Pages / jsDelivr 三地址，README 已实测三地址 200） | ✅ 已收录：`index.json` 含 `dsh-mcp-tools` 条目（中英描述、`category: tools`、versions、install 源），由 canonical feed 自动派生 | 自动生成，无需提交；只要 feed 有我们它就有 |
| [ukinch605/awesome-dsh-hub](https://github.com/ukinch605/awesome-dsh-hub)（站点 [ukinch605.github.io/awesome-dsh-hub](https://ukinch605.github.io/awesome-dsh-hub/)） | 17,769 个插件 / 21,133 监测仓库 · 自动维护的机器可读 Registry + 中英双语分类目录 + 可检索静态站；每 1 小时刷新 | **无需申请**：仓库加 `dsh-plugin` 话题 + 根 `package.json` 声明 `dsh.bundle.patch` 即自动收录；分类/描述可改 `data/overrides.json` 提 PR | 🟢 已收录：`registry/plugins.json` 含 `hxlog/dsh-mcp-tools`（`discoverySource: github-topic:dsh-plugin`、`packageVersion 1.0.2`、`firstSeenAt 2026-10-23T07:58Z`）；`docs/catalog.en.md` / `catalog.zh.md` 均有词条与安装命令 | — |
| [Victor-770/dsh-plugin-directory](https://github.com/Victor-770/dsh-plugin-directory)（站点 [dsh-plugin-directory.online](https://dsh-plugin-directory.online/)） | 13,752 款插件 · 中英双语、按功能分类、README 全文搜索、按热度排序；数据源 `topic:dsh-plugin`，GitHub Actions 每 6 小时同步；Cloudflare Pages 静态站 | 无需申请（自动抓取），仅接受分类/描述纠错 | 🟢 已收录：`site/public/data/browse-lite.json` 含 `"full_name":"hxlog/dsh-mcp-tools"`（★3、JavaScript、分类「工具/开发」、中文描述） | — |
| [dshmarketplace.dev](https://dshmarketplace.dev)（[DshMarketPlace/dsh-plugins-store](https://github.com/DshMarketPlace/dsh-plugins-store) ★8 / npm `dshmarketplace-plugin` / `[DshMarketPlace/awesome-dsh-plugin](https://github.com/DshMarketPlace/awesome-dsh-plugin)`） | 13,175 条目录 · DSH 内安装的市场插件 + 浏览器站，同一 `/api/v1/plugins` 端点（目录每小时变）；另带预设、安装文档与 `riskFlags` 风险提示 | **自动收录为主**：作者称「Most plugins are found automatically」，站点有 `/submit` 手工提交入口（粘贴仓库 URL，人工复核后发布） | 🟢 **已收录**：`GET /api/v1/plugins?q=dsh-mcp-tools` → `total:1`，命中我们的条目（category `tools`、`installKind: npm`、`installable: true`、`install: dsh plugin --profile web add dsh-mcp-tools`、`npmPackage: dsh-mcp-tools`、`riskFlags: ["terminal surface"]`、`inRegistry: true`） | — |
| [dsh-ai.org](https://dsh-ai.org)（DeepSeek Harness Plugin Org，目录 + Meilisearch，Built by SkillHub） | 目录约 **3,900+** 条（分类计数合计），数据源 awesome-dsh-plugin `plugins.json` + GitHub topic 候选；带 `reviewState`、`signals`（stars/downloads30d/bundleVerified）、`install.command`、RSS | **agent 友好提交 API**：`POST https://dsh-ai.org/api/submissions`，body `{"repositoryUrl":"…","note":"…"}`，匿名 5 次/天、登录 20 次/天；人工审核后进目录 | 🟡 **已提交并受理**：202 `{"state":"queued","id":"b86ba7ea-…"}`（`statusUrl: /api/submissions/b86ba7ea-…`），审核后出现；站点 RSS 最新为 2026-08-21，明显滞后，可能先于人工审核被下次同步自动收录 | 查 `?q=`（Meilisearch 模糊）不能作为未收录判据，要看 `slug` 精确匹配 |
| [YELEBAI/dsh-plugin-marketplace](https://github.com/YELEBAI/dsh-plugin-marketplace)（npm `dsh-plugin-marketplace@0.9.5`，★21，DSH Web+Desktop 内市场 UI） | 「经过验证的 DSH 插件市场 + 自主维护的中心 Registry」：每 2 小时扫 `topic:dsh-plugin archived:false`（discovery.json 13,870 条），再用 install-classifier-v11 / dsh-std-preflight-v1 验证 manifest、bundle patch、loader entry、运行产物与精确安装来源，只有验证通过才写入 `registry/plugins.json`（18MB）并展示 | 自动扫描 + 验证（无人工提交入口；不达标进 `registry/rejected.json`，需构建/生命周期脚本的转「安装 Agent」路径） | 🟢 **已收录（verified）**：`registry/plugins.json` 有我们的条目（`verifiedAt 2026-10-23T13:28:18Z`、`verifiedCommit 5c0a7f6`、`install.mode automatic`、`spec github:hxlog/dsh-mcp-tools#5c0a7f6`、profiles desktop+web、`requiresBuildApproval false`）；`registry/state.json` 状态 `verified` | — |
| [billLiao/awesome-dsh-plugin](https://github.com/billLiao/awesome-dsh-plugin)（★15，站点 billliao.github.io/awesome-dsh-plugin） | 自动聚合 `topic:dsh-plugin` 全量仓库（21,470 条）的分类目录 + 可搜索站点；`data/plugins.json`(10.8MB) 与 `categories/*.md` 同源，另有 Issue 表单 `plugin-submission.yml` 与 PR 模板 | 自动抓取（`scripts/fetch_plugins.py` + `categorize_and_generate.py`，站点 Pages 部署） | 🟢 **已收录**：`categories/tools-capabilities.md` 有我们条目（`hxlog/dsh-mcp-tools` ⭐2「DeepSeek Harness 最简洁、优雅的 MCP 工具管理器…」），`data/plugins.json` `hasUs=true` | — |
| [zyf-maker/dsh-catalog-merged](https://github.com/zyf-maker/dsh-catalog-merged)（站点 [zyf-maker.github.io/dsh-catalog-merged/web](https://zyf-maker.github.io/dsh-catalog-merged/web/)，插件本体 [dsh-market-own](https://github.com/zyf-maker/dsh-market-own)） | 「DSH Market · 我的市场」：自己抓取/合并/排名/修兼容，非套壳；`data/` 每 6h CI 重建（`data/catalog.json` 30MB + `data/plugins.json` 17.6MB），另有 Pages 站点、兼容注册表 raw URL、可选 Worker API | 自动采集（无人工提交入口；插件读 `data/catalog.json`，可用 `DSH_MARKET_CATALOG` 覆盖） | 🟢 **已收录**：`data/catalog.json` 与 `data/plugins.json` 均含 `dsh-mcp-tools`；Pages 站点 200 | — |
| [StarPivotNet/dsh-plugin-catalog](https://github.com/StarPivotNet/dsh-plugin-catalog)（[StarPivot marketplace](https://github.com/StarPivotNet/dsh-plugins-public)，marketplace protocol v1） | StarPivot 市场 Discover 数据源（`catalog.json`，原 19 条）；规则：必须是 npm 包且声明 `dsh.bundle.patch`，禁 git-only、skills、需手写 `cordis.patch.yml` 的包；定时 Action 每 30 分钟对照 npm latest 钉 `version`/`updatedAt` | PR #2（`catalog.json` 追加 1 条） | 🟡 待审 · **2026-10-23 22:55 已 rebase 到 `0e96fa7`**（解决与 refresh-catalog 自动提交的 DIRTY 冲突，最终 diff 仅 +9 行，`mergeable_state: clean`；已留言说明解决方式） | 上游 bot 每 30 分钟提交会持续制造冲突，合并前若又变 dirty 需再次 rebase |
| [DshHunt/community](https://github.com/DshHunt/community)（[dshhunt.com](https://dshhunt.com)） | 独立目录站（静态结构证据 + 社区投稿） | Issue [#4](https://github.com/DshHunt/community/issues/4)（plugin-submission 表单） | 🟡 待审（2026-10-23 提交） | 站点 `/plugins` 已上线但未含我们；投稿要求固定 commit SHA + 公开证据，已按表单字段提交（SHA `6cb6342`、bundle path `.`、npm `dsh-mcp-tools`、分类 developer-tools、MIT） |
| [REALOIYO/dsh-plugin-market](https://github.com/REALOIYO/dsh-plugin-market) | 7,123 个插件 / 58,629 个版本 · 自建 format 1 索引 | Issue [#1](https://github.com/REALOIYO/dsh-plugin-market/issues/1)（召回缺口报告 + 建议补种子） | 🟡 待回复（2026-10-23 提交） | 索引源 `realoiyo.github.io/dsh-plugin-market/index.json`；每 6 小时重建（10-23T10:55Z success），但我们这个**声明了 `dsh.bundle` 且带 `dsh-plugin` 关键字**的包仍未被召回 → 判断为其切片式 npm 搜索召回缺口，建议把包名加进 `seeds/dsh-so.json` |
| [dsh-pluginmarket/metadata](https://github.com/dsh-pluginmarket/metadata)（DSH Registry，站点 `dsh-pluginmarket.github.io/registry/`） | 82 条元数据 · plugin/skill/preset/theme 注册表 | Issue [#6809](https://github.com/dsh-pluginmarket/metadata/issues/6809) → 机器人自动开 PR [#6810](https://github.com/dsh-pluginmarket/metadata/pull/6810) | 🟡 待合并（2026-10-23 提交，issue→PR 全自动链路已跑通） | 投稿用 `Add:` issue 模板；Actions 校验后由 `issue-to-entry.mjs` 生成 `entries/github_hxlog_dsh-mcp-tools.json` 并开 PR，维护者合并即上架；已验证 workflow 两次 run 均 success、bot 已回「Metadata validated and a pull request was opened」 |
| [hashgraph-online/awesome-ai-plugins](https://github.com/hashgraph-online/awesome-ai-plugins)（[hol.org/registry/plugins](https://hol.org/registry/plugins)） | 837★ / 跨客户端 AI 插件目录（Codex / Claude Code / Gemini CLI / DSH / Cursor …），含 **DeepSeek Harness Plugins** 分区；每条自动进 HOL Plugin Registry 并跑 HAL 扫描打分 | 单行 PR（README 分区内按字母序，`- [Name](repo) - 一句描述`）；CI 三道：alphabetical、validate-contribution（格式+仓库可达）、validate-plugins（离线生成器）；**`pull_request_target` Sweep 还会对源仓库跑既有 scanner，要求 score ≥ 80 才能过 gate** | 🟢 [PR #949](https://github.com/hashgraph-online/awesome-ai-plugins/pull/949) 已开：alphabetical 通过、`Open Plugin Contribution Gate` **success**、`Scan PR (949…): success`；**scanner score 初始 79 未达 80，已在源仓库修完 5 条 findings（pin actions / SECURITY.md / dependabot / lockfile）→ 复扫 100 分 0 findings** | 等 maintainer 合并；合并后自动进 README 列表与 HOL Registry |
| [fjzzwxp/awesome-dsh-plugins](https://github.com/fjzzwxp/awesome-dsh-plugins)（[awesome-dsh-plugins.vercel.app](https://awesome-dsh-plugins.vercel.app)） | 1★ · 自动采集 + 人工策展 list（`data/plugins/` 每插件一个 YAML，689 条），Vercel 站点；README 由脚本生成 | 加 `data/plugins/<owner>__<repo>.yml`（`url`/`name`/`category`/`description.en`）+ `npm run generate` 重生成两个 README，同 PR 提交；CI：`check-submission.mjs`（本地+远程仓库存在/未归档/年龄≥1 天）、`npm run check` | 🟢 [PR #2](https://github.com/fjzzwxp/awesome-dsh-plugins/pull/2) 已开：本地校验 689 entries 通过、`npm run check` exit 0、README 两行 +1 | 等 maintainer 合并 |
| [tanle-mtr/dsh-plogin-plugin-recommender](https://github.com/tanle-mtr/dsh-plogin-plugin-recommender) | 2★ · AI 策展 DSH 插件清单（`plugins.json` 约 12 万字节），按「智能度」分类、每小时更新；README 91KB | README 明确「Open an Issue — suggest a plugin」，无固定模板 | 🟡 [Issue #1](https://github.com/tanle-mtr/dsh-plogin-plugin-recommender/issues/1) 已提（标题 `[Plugin] Add hxlog/dsh-mcp-tools…`） | 等维护者处理 |
| [Herdeny/awesome-dsh-plugins-2026](https://github.com/Herdeny/awesome-dsh-plugins-2026) | 7★ / 268 条（含 dsh-qc 评分分级） | PR #9（README.md + README.en.md 的「🧩 MCP 与集成」末尾，badge 268→269） | 🟡 待审（`Structure Check` = `action_required`，首次贡献者需维护者批准；本地已跑通 `refresh_counts.py`/`sync_audit.py`/`check_markdown.py` 全部 3 个 CI 脚本；PR Spam Guard 建议性评论） | 收录标准要求「独立热度证据」（可用第三方收录记录/下载/引用）；zh/en 必须 lockstep |
| [jiji262/awesome-deepseek-harness](https://github.com/jiji262/awesome-deepseek-harness) | 16★ | PR #48（README.md + README_EN.md 的「功能扩展插件 / Capability Plugins」末尾） | 🟡 待审（仓库无 CI，仅人工审） | 中英双语手选列表（star 快照 2026-08-19）；贡献规则仅要求「与 DSH 直接相关 + 清晰 README」 |
| [majiayu000/dsh-plugin-registry](https://github.com/majiayu000/dsh-plugin-registry)（[plugin.dshdesk.com](https://plugin.dshdesk.com)，Harness Registry） | 可搜索注册表（`curated` + `manifest_verified` 双可信等级） | Issue [#88](https://github.com/majiayu000/dsh-plugin-registry/issues/88)（`[Plugin submission]` 模板） | 🟡 待审（2026-10-23 提交） | 其发现管道未收录我们（`public/data/registry-audit.json` 中连 `hxlog` 都没有），已附包/manifest/CI/固定 SHA 证据提交；其 `manifest_verified` 契约＝topic + 有效 `dsh.bundle` + patch 文件为顶层 YAML 数组，我方 `cordis.patch.yml` 已满足（顶层 `- insert:` 数组） |
| [tuofangzhe/dsh-plugins](https://github.com/tuofangzhe/dsh-plugins)（[52dsh.com/plugins](https://52dsh.com/plugins)） | 社区插件注册表（`registry/<owner>/*.yaml` + `candidates/discovered.json`） | Issue [#15](https://github.com/tuofangzhe/dsh-plugins/issues/15)（`[Plugin submission]` 模板：固定 40 位 commit + SPDX + 权限/数据流） | 🟡 待审（2026-10-23 提交） | 其 `candidates/discovered.json`（643KB）里没有我们 → 未被发现；已在 issue 内逐项写明文件/命令/网络端点/凭据/会话数据影响面 |
| [TYEclipse/dsh-plugins-hub](https://github.com/TYEclipse/dsh-plugins-hub) | 独立插件目录（README 精选表：install/status/security/trial/checked-at/commit） | Issue [#65](https://github.com/TYEclipse/dsh-plugins-hub/issues/65)（`[Plugin Submission]` 模板） | 🟡 待审（2026-10-23 提交） | 其流水线对每个投稿做隔离环境验证：安全审查 → 安装 → **一次真实端到端工具调用**，再进目录表 |

> **合并节奏观察（2026-10-23）**：dsh-plugin-radar 只合并 `app/github-actions` 机器人生成的快照 PR，人工提交的 PR（本仓库 #968）不会被合并，收录以它每日快照为准；dshworks 由维护者 lroolle 批量合并，最近一次合并 2026-10-19（本仓库 #184 已 CLEAN 等其下个批次）。

| [zhu1090093659/dsh-community-plugins](https://github.com/zhu1090093659/dsh-community-plugins) | 1★（dsh-market.com 创意工坊数据源，供给 9.3k★ dsh-web/Workshop） | PR #52（community.json 追加 1 条） | 🟡 待审（gate 144 entries OK + 9/9 单测；review 路由已通过；`ci.yml`（community:check+9 单测）待维护者批准首跑） | 合并后进入 dsh-market.com manifest 与 Workshop 商店 · **本地已过 gate**：`node scripts/community-index.cjs --check` → `OK (144 entries)`，`node --test scripts/community-index.test.mjs` → 9/9 通过（2026-10-23 在 PR 分支实测）；该仓库的 `community.json` 同时是 dsh-web（9,357★）创意工坊商店与 dsh-market.com manifest 的唯一数据源 |
## 三、暂不提交

| 市场 | 原因 |
| --- | --- |
| bruc3van/awesome-dsh-plugin（453★） | 作者自荐区要求 star > 10；等 star 增长后提交 SHOWCASE.md · **已 approved：`data/approved.json["hxlog/dsh-mcp-tools"] = "2026-10-23"`**；`repositories.json` 已有我们，但 `market.json` 有体积上限（约 1000 条，分类轮转 + star 排序），2★ 暂未进渲染，升星后自动进入，**无需 PR** |
| dsh-external/hub | 仓库私有/404，是其手选目录上游，无公开入口 |
| libukai（319★）、SihanTeng、ZeroPointRepo、uyq 等 | 维护者长期不活跃（libukai 自 2026-09-12 起无合并）或规模过小，收益有限；如需覆盖再按第二梯队处理 |
| billLiao/awesome-dsh-plugin（15★） | 目录由 topic 自动生成（21k 条），本仓库已在 topic 内，等待下一轮刷新即可 |

## 四、经主市场分发的下游（无需单独提交）

| 下游 | 分发方式 | 状态 |
| --- | --- | --- |
| [zhu1090093659/dsh-community-plugins](https://github.com/zhu1090093659/dsh-community-plugins) | 1★（dsh-market.com 创意工坊数据源，供给 9.3k★ dsh-web/Workshop） | PR #52（community.json 追加 1 条） | 🟡 待审（gate 144 entries OK + 9/9 单测；review 路由已通过；`ci.yml`（community:check+9 单测）待维护者批准首跑） | 合并后进入 dsh-market.com manifest 与 Workshop 商店 · **本地已过 gate**：`node scripts/community-index.cjs --check` → `OK (144 entries)`，`node --test scripts/community-index.test.mjs` → 9/9 通过（2026-10-23 在 PR 分支实测）；该仓库的 `community.json` 同时是 dsh-web（9,357★）创意工坊商店与 dsh-market.com manifest 的唯一数据源 |
| [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)（8.3k★，应用内市场） | 直接读 awesome-dsh-plugin.com 的 index.json | ✅ index.json 已含本插件 |
| [awesome-dsh-plugin registry feed](https://awesome-dsh-plugin.com/plugins.json) | 6,565 条官方 JSON 注册表（7.5MB） | 由 awesome-dsh-plugin 自动生成 | ✅ 已收录（`dsh-mcp-tools` v1.0.2，含 install 命令与能力扫描）；该 feed 被 dshmarket.com（8.3k★）等客户端实时拉取 | https://awesome-dsh-plugin.com/plugins.json（feed 条目字段已核验：`1.0.2` / npm 安装命令 / 中英双语描述 / capabilities 5 项 / 详情页） |
| [Sanqi-normal/dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin)（104★） | 浏览 awesome-dsh-plugin.com 目录 | ✅ 同上 |
| [AwesomeHou/dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace)（33★） | 设置页内市场，运行时实时同步 GitHub `dsh-plugin` topic | ✅ topic 已打，用户端搜索即可见（无需提交） |
| [anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)（32.6k★）内置 Community Market | 从用户选择的目录源（含 awesome-dsh-plugin registry feed）发现插件 | ✅ 已随 registry feed 覆盖（无需单独提交） |
| [dsh-plugin.store](https://dsh-plugin.store) | 14,082 个 GitHub 真实插件目录（Next.js） | 直接消费 `awesome-dsh-plugin.com/plugins.json` | ✅ 已收录：`/p/hxlog/dsh-mcp-tools` 详情页 200 | https://dsh-plugin.store/p/hxlog/dsh-mcp-tools （2026-10-23 复核 200，页面命中本插件） |
| [YELEBAI/dsh-plugin-marketplace](https://github.com/YELEBAI/dsh-plugin-marketplace)（21★） | 每日扫描 `dsh-plugin` topic 进中心 Registry | ⏳ topic 已打，下轮扫描自动进候选 |
| [w2112515/dsh-plugin-marketplace](https://github.com/w2112515/dsh-plugin-marketplace)（17★） | 扫描 topic 后逐个证明可安装，再进入市场 | ⏳ 同上 |

## 五、新发现目录站（2026-10-23 扫描域名确认）

| 站点 | 规模/形态 | 收录机制 | 状态 |
| --- | --- | --- | --- |
| [dsh-plgstore](https://github.com/YureWright/dsh-plgstore)（yurewright.github.io/dsh-plgstore） | 1★ / 2,521 条 · 每日 13:00 更新 + 每日日报 | GitHub + npm 多路聚合，**只收有官方声明/依赖 DSH 核心的插件**，AI 体检报告分三档 | ⏳ 待自动收录：数据更新到 2026-10-23T09:52Z 仍无我们；抽查同为新近且更高星（`oil-oil/dsh-oil-ui` 137★）也缺席 → 其扫描存在滞后，**非我方条件不满足**（bundle 声明 + npm 一致 + MIT 均已具备）；每日 13:00 跑，观察 | https://yurewright.github.io/dsh-plgstore/ |
| [dsh.directory](https://dsh.directory)（alexchenzl/dsh-plugin-directory） | 10,773 个插件页 / 15 个分类（sitemap 10,826 条） | 自动爬取：按 default-branch HEAD 校验 DSH bundle 契约（声明仓库包）；**提交入口已失效** | ⏳ 待观察：我们未收录（`/plugins/hxlog/dsh-mcp-tools` 404）；站点的 issue 表单指向的 GitHub 仓库已 404，无法提交；爬取选择性且疑似停滞（10-23 实测高星新插件也缺席）。**勿浪费 PR** |
| [dshplugins.com](https://dshplugins.com) | 审核制目录（含 /submit 页） | 需 GitHub 登录由管理员审核；提交需在 README 写清安装步骤 | 🟡 待人工 OAuth 提交 |
| [dsh-plugins.net](https://dsh-plugins.net) | 带验证方法论的社区目录 | 表单生成 Markdown，发到 deepseek-harness GitHub Discussions 由维护者审核 | 🟡 已发 [Discussion #10768](https://github.com/deepseek-ai/deepseek-harness/discussions/10768)（Show Your Plugins! 分类） |
| [dshplugin.net](https://dshplugin.net)（coolbat/awesome-dsh-plugins） | 1★ / 双语证据式目录 | GitHub Issue `plugin-submission` 模板（需固定 commit） | 🟡 已提交 Issue #34 · 仓库已改名 `coolbat/awesome-dsh-plugins`（1★，证据型双语目录，数据源 `data/plugins.json`，1709 条）；issue #34 仍在；**已按 CONTRIBUTING 逐条提交证据 + 拟好的 JSON 条目**（2026-10-23，含 40 位 SHA / manifest / patch / 双 license / lifecycle none / 能力信号；分类对齐已有先例 `Discovery & Management`） |
| [dsh.store](https://dsh.store)（AI-Scarlett/DSH-Store） | 5★ / 第三方市场 + 生命周期管理 | 每 8 小时自动 radar 扫描写入 `registry/catalog.json` | 🟡 机器人预检**已通过**（固定 commit `f245bca`、识别 `dsh-mcp-tools@1.0.2`、无生命周期脚本、扫描完整；唯一 Warning 是 dev 测试脚本里的 `child_process`）。**已修**：`scripts/smoke.mjs` 改用 `vm.Script` 语法校验（commit `14d5be1`），并把 dev 脚本移出 npm `files`，运行时面零 shell/子进程；已在 #1551 说明（#issuecomment-6363039134），等下一轮扫描/复核 |
| [dshplugins.org](https://dshplugins.org)「深鲸插件港」 | 聚合型（14000+） | 聚合 AdamPlatin123 / vvlife / libukai / 0xsline 等 awesome 列表 | ⏳ 随上游列表合并自动跟进 · **lint 基线相同**（2026-10-23 本地复跑 workflow 同命令）：`main` 与 PR 分支均 exit 1 / **21 个相同 issue**，本 PR 新增 0 个；维护者 2026-10-16 后未再处理 PR（仓库现有 22 个 PR 全部 `action_required`） |
| [dshplugin.app](https://dshplugin.app) | 注册表 + 审核提交 | `/submit` 表单（无需账号，但有 captcha）；提交后抓取仓库并分类 | 🟡 待人工/带 captcha 提交 |
| [dshplugin.market](https://dshplugin.market) | 插件/技能/Agent 目录（含 MCP Servers 分类） | `/submit` 无表单：collector 按 GitHub topic 索引 | ⚪ 停止跟进：sitemap 的 lastmod 停在 **2026-08-15**，collector 已 2 个月未跑 |
| [dsh-store.com](https://dsh-store.com) | 域名重定向到「DSHalpha」法语衣架商店 | 与本生态无关 | ⚪ 排除（域名混淆） |
| [dsh-plugin.net](https://dsh-plugin.net) | 官方发布预检 + 注册表 | 按其「官方发布方式」：仓库加 `dsh-plugin` topic 即进入其 registry 同步 | ⏳ topic 已打，待其同步（当前 `/plugins` 未含） |
| [dshmarketplace.com](https://dshmarketplace.com) | 人工审核目录（3,400+） | 邮件提交 `hello@dshmarketplace.com`（**注意：与 dshmarketplace.dev 是两个不同站点**；后者已自动收录我们） | 🟡 待发邮件（无法自动化） |
| [dshplugin.dev](https://dshplugin.dev)（arkyu2077/awesome-dsh-plugin） | 导航式说明书（5★） | 从该仓库 catalog 生成 | ⚪ 仓库自 2026-08-17 未更新，暂停投入 |
| [dshplugin.io](https://dshplugin.io)（tjsdyy/dshplugin） | Next.js 市场（6★） | 自带 DB/drizzle 目录 | ⚪ 仓库自 2026-09-12 未更新，暂停投入 |
| [dshplugins.cc](https://dshplugins.cc) | 静态目录（sitemap 2026-09-20） | 静态快照 | ⚪ 已停更，暂停投入 |
| [dsh-plugin.com](https://dsh-plugin.com) | 落地页 + waitlist | 尚未开放收录（仅邮件 waitlist） | ⚪ 未开放 |

## 五、自动采集节奏（无需操作，仅回查）

| 来源 | 频率 | 预计出现 |
| --- | --- | --- |
| DSH-Plugins-Marketplace registry | 2 小时增量 | 已收录 |
| dshmk.com API | 30 分钟 | 已收录 |
| dsh-plugin-radar 快照 | 每日 02:00 | PR 合并或下一次扫描 |
| 0xsline CATALOG（topic） | 每次快照生成 | 下一轮 · **lint 基线相同**（2026-10-23 本地复跑 workflow 同命令）：`main` 与 PR 分支均 exit 1 / **21 个相同 issue**，本 PR 新增 0 个；维护者 2026-10-16 后未再处理 PR（仓库现有 22 个 PR 全部 `action_required`） |
| dsh-plugin.org | 每周/按审核队列 | Issue 处理前后 · 页面已上线并带 **Verified** 徽章：`https://dsh-plugin.org/plugins/hxlog/dsh-mcp-tools`（`Listed on 2026-10-21`，索引共 16,498 仓库） |

## 六、后续动作

1. 每天回查一次待审 PR/Issue；合并后把状态改为 ✅ 并补链接（当前共 10 个待审 PR + 2 个 Issue）。
5. 首跑 CI 处于 `action_required` 的 PR（Alex #162、beancookie、keji、losebird、0xsline）只有维护者能批准，保持内容正确、必要时礼貌留言即可。
2. dsh-plugin.org 收录后，可在 README 加其官方徽章（`https://dsh-plugin.org/badges/listed.svg`）。
3. 待 star > 10 后提交 bruc3van SHOWCASE.md。
4. 如需把这些收录徽章同步到 npm 页面，需要发一个新版本（README 改动才会进 npm 包）。

## 六、下游市场插件（随 feed / topic 自动覆盖，无需提交）

这些 npm 包把「插件市场」做进 DSH 设置页，数据源都是 awesome-dsh-plugin feed、GitHub `dsh-plugin` topic 或本目录源，因此**本插件出现在 feed/topic 即自动可搜到**：

| 包 | 数据源 | 覆盖状态 |
| --- | --- | --- |
| `dshmarket`（dsh-market/dsh-market，8.4k★） | awesome-dsh-plugin catalog | ✅ `/browse/` 已含（见上表） |
| `@dsh-market/plugin` + `dsh-market-plus` | 同上（dsh-market.com 品牌） | ✅ 随 catalog |
| `dsh-plugin-marketplace`（YELEBAI） | 自主 registry（topic 扫描） | ✅ verified（见上表） |
| `@99galaxy/dsh-plugin-market` | 浏览 awesome-dsh-plugin 目录 | ✅ 随 catalog |
| `@1e0zj/dsh-plugin-mall` | 实时搜 GitHub `dsh-plugin` topic | ✅ 随 topic |
| `dsh-plugin-console`（AlexYin-Tongji） | 可配置 catalog sourceUrl（默认社区目录） | ✅ 随 catalog |
| `safer-dsh-market`（bruc3van） | bruc3van 自家 feed | 🟡 随 bruc3van market 渲染 · **已 approved：`data/approved.json["hxlog/dsh-mcp-tools"] = "2026-10-23"`**；`repositories.json` 已有我们，但 `market.json` 有体积上限（约 1000 条，分类轮转 + star 排序），2★ 暂未进渲染，升星后自动进入，**无需 PR** |
| `dsh-find-plugin`（204★） | awesome-dsh-plugin 索引 | ✅ 随 catalog |
| `@linxin666/dsh-client-ui-market` | dsh-market.com + 本地 | ✅ 随 catalog |
| `dshhub-market`（dshhub.co，口令制） | 自有口令库 | ⚪ 不同分发模型，不适用 |

| [dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)（dsh-plugin.org，318★） | 目录 4,597 条（v2.0+ 只展示 **npm 一键可装** 的插件） | 人工 Issue 提交（`[插件提交]` 模板） | ✅ 已收录：Issue **#391 CLOSED**；本插件已发布 npm `dsh-mcp-tools@1.0.2`，符合「npm 可装」门槛 | https://dsh-plugin.org/plugins/hxlog/dsh-mcp-tools |

### 6.1 2026-10-23 下游索引覆盖审计（代码/数据实测）

| 索引源 | 规模 | 我们是否在库 | 机制与结论 |
| --- | --- | --- | --- |
| `zhushaochun/dsh-plugin-index` | 2,428 条 | ✅ 已含 | 由 awesome 系 feed 生成，无需提交 |
| `xiaojiu190918/dsh-plugin-index` | corpus 2.3MB | ✅ 已含 | 按 npm keywords（`dsh-plugin` / `deepseek-harness` / `dsh`）发现 |
| `TheYoungChen/dsh-plugin-market`（4★） | 3,562 条 | ❌ | 按 star 分区抓 topic；`stars:0..4` 区间实际约 1.9 万仓库，远超其每区间 1,000 条上限 → 2★ 仓库结构性抓不到（**非提交问题，勿浪费 PR**） |
| `Luaphes/dsh-plugins-market`（3★） | 日快照 | ❌ | 仅抓 topic **top ~500 by stars**，无提交入口 |
| `chnjames/dsh-plugin-market`（7★） | 公开目录站 | ❌ | 同上，star 门槛 |
| `inowness/dsh-plugin-index` | 15 条 | ❌ | 只收录官方 `@deepseek-ai` 发布包，非社区插件 |

结论：下游自动索引里，**凡是按 feed 或 npm keywords 取数的都已收录我们**；未收录的都是 star 门槛型（需先把 star 做上去），没有可提交的入口。


### 6.4 上游 feed 条目已落地（2026-10-23 核验）

canonical feed 仓库 `awesome-dsh-plugin/awesome-dsh-plugin`（20.3k★）已生成我们的条目：`data/plugins/hxlog__dsh-mcp-tools.yml`（`name: hxlog/dsh-mcp-tools`，`category: tools`，中英描述齐全，`url` 指向仓库）。这条是绝大多数下游市场（dshmarket / @99galaxy / dsh-find-plugin / dsh.so / 多个 format-1 索引）的**唯一上游**，条目存在即代表下游可继承；`data/added-dates.json` 只记近期新增、不含我们属正常（我们发布时间早于该文件的滚动窗口）。

### 6.8 dsh.store 自动准入条件逐条核对（2026-10-23）

读了 `AI-Scarlett/DSH-Store` 的 `scripts/automate-catalog.mjs`（`automaticApproval` 契约）后逐条核对，我们**全部满足**：

| 条件 | 我们的情况 |
| --- | --- |
| `manifest repository` == 规范 GitHub 仓库 | `package.json` `repository.url = git+https://github.com/hxlog/dsh-mcp-tools.git` ✅ |
| 仓库 license 元数据与 manifest 一致 | GitHub 检测 MIT、`package.json` `license: MIT` ✅ |
| `files` 声明非空的可分发清单 | 有（lib / client / locale / patch / icon / screenshots / README）✅ |
| 显式声明 DSH 兼容 | `dsh.bundle.patch` + `dsh.client.platform` ✅ |
| 显式声明 Node 兼容 | `engines.node >= 22.13` ✅ |
| 无 install lifecycle 脚本 | 无 pre/install/postinstall/prepare ✅ |
| **无 runtime/optional 依赖** | `dependencies`/`optionalDependencies` **整项不存在** ✅（这条最常刷人） |
| 无 bundledDependencies | 无 ✅ |

结论：预检里的 1 条 Warning 只是静态启发式提示（文档里也写明「不是安全审计/阻断」），**不影响自动准入**；下一次 catalog 自动化跑起来应能直接 approved，无需等发版。

### 6.9 百通插件广场（@baitongserver）核验结论：不适用

`@baitongserver/dsh-plugin-market` 的目录来自其自有后端 `https://s.1100111.cn/baitong_ai/api/bt/dsh/plugins`；实测**全站仅 3 个插件**（`Aisland-SJL/dsh-worktable` 等），无公开提交入口、非 topic 自动扫描。属早期内部目录，**不投入**。

### 6.7 2026-10-23 发布面加固（为通过 dsh.store 静态扫描）

dsh.store 预检的唯一 Warning（`warning/shell/child-process`）来自 `scripts/smoke.mjs`——dev 测试脚本里的 `execFileSync(node --check)`。已做两处收紧（commit `14d5be1`）：
1. `scripts/smoke.mjs` 改用 `new vm.Script(client)` 做语法校验，**彻底移除 `node:child_process` 依赖**；`npm test` 仍 10/10 通过。
2. `package.json` 的 `files` 去掉 `scripts/smoke.mjs` / `scripts/selftest.mjs`，dev 脚本不再进入发布包。

运行时面（`lib/*.js` 6 个 + `client/client.js`）实测**零** `child_process`/`exec*`/`spawn`/`node:http(s)`/`fetch(` 命中；唯一的网络行为是用官方 MCP client 连用户自己配置的端点。下一次 dsh.store 扫描（或下次发版）即可看到 Warning 消失。

### 6.6 2026-10-23 PR 正文自检

18 个 open PR 的正文全部包含 dsh 徽章（`powered_by-dsh`），长度 636–1,679 字符，无空正文。

### 6.5 2026-10-23 全量 PR 可合并性复核（18 个 open PR）

| 结论 | 数量 | 明细 |
| --- | --- | --- |
| 冲突 / 需 rebase | **0** | 无 `DIRTY`/`CONFLICTING` |
| `CLEAN`+`MERGEABLE` | 10 | 含 adh #186（`APPROVED` 待点合并）、Zhiyuan-Fan #96、walkinglabs #121 等 |
| `BLOCKED` | 2 | omni #3723、zhu #52 —— 规则集要求维护者批准 workflow |
| `UNSTABLE` | 6 | white0dew #21、beancookie #236、keji #150、losebird #54、0xsline #737、Alex-Yanggg #162 —— 实测 `commits/<sha>/status = pending` 且 **contexts 为空、check-runs 为空**，即首跑 workflow 处于 `action_required` 等维护者批准，**非我方失败项** |

### 6.3 发布包可安装性自检（2026-10-23，供审核方复现）

`npm i dsh-mcp-tools@1.0.2` 后检查：运行期文件齐全（`cordis.patch.yml`、`lib/*.js`、`client/client.js`、`locale/*.json`、LICENSE、双 README、截图），`package.json` 的 `dsh.bundle.patch = ./cordis.patch.yml` 存在，且包内自带的 `scripts/smoke.mjs` 在干净目录下 **6/6 项通过**（locale 元数据、client 字典键一致、header 编辑器为键值行而非 JSON 文本域、README 截图齐全、中文 README 为落地页、npm files 白名单含运行路径）。这是 1024Store / dshopen 等「npm-only 安装」市场审核时最容易被卡的一环，可随时重跑复现。
### 6.2 2026-10-23 新发现：3 个未登记目录站

| 站点 | 规模 / 数据源 | 状态 | 动作 |
| --- | --- | --- | --- |
| `dshplugin.store` | **19,850 个仓库**，明示「synced from the GitHub topic `dsh-plugin`」，上次同步 2026-10-21 14:31 UTC | 未含我们 | 纯 topic 同步，无提交入口，下次同步自动收录（可用来观察 star 门槛型站点之外的另一种延迟） |
| `dsh-plugin.app` | 11,630 个项目，同上「GitHub Topic」驱动，页面标注更新于 08/26 | 未含我们 | 同上，等下次同步 |
| `dshmarket.app`（curated） | 95 个插件 / 11 类，编辑精选制 | 未含我们 | 页脚 submit 链指向 `dshmarket.ai/submit`，但该域名该路由已 **404**；无可行动入口，仅记录 |

（另：`dshplugin.net` 实为 `coolbat/awesome-dsh-plugins` 的镜像站，提交入口就是 coolbat 的 issue #34，已在处理中。）

**另新增两个手选 awesome list 的 PR（不是自动聚合，需人工 merge）**：
- **`Herdeny/awesome-dsh-plugins-2026`**（★7，268 条，带 `Structure Check` / `Link Check` / `PR Spam Guard` 三个 Actions + dsh-qc 评分体系）：贡献规则最细——要求「独立热度证据」、「zh/en README lockstep」、「badge 插件数必须等于实际条目数」。已按规则同时改 `README.md`/`README.en.md`（MCP 与集成分类末尾）+ badge 268→269，并在 PR 里提供 41 个市场收录记录、npm 发布与 Manifest/Descriptor 校验证据；本地跑通全部 3 个 CI 脚本后提交 [PR #9](https://github.com/Herdeny/awesome-dsh-plugins-2026/pull/9)（`Structure Check` 显示 `action_required` = 首次贡献者需维护者点批准，非失败）。
- **`jiji262/awesome-deepseek-harness`**（★16，中英双语手选）：贡献规则宽松（与 DSH 直接相关 + 清晰 README），已同步改 `README.md`/`README_EN.md` 的「功能扩展插件 / Capability Plugins」末尾，提交 [PR #48](https://github.com/jiji262/awesome-deepseek-harness/pull/48)（仓库无 CI）。
- **`jqueryscript/awesome-dsh-plugins`**（★5，带 quality CI）明确 admission ≥30 stars，我们 3★ 不符合，暂不提交。

### 6.61 2026-10-23 `billLiao/awesome-dsh-plugin` 收录（41st）；`cordis.run` 需登录、`jqueryscript` 有 30★ 门槛

**`billLiao/awesome-dsh-plugin`（第 41 个）**：★15，站点 https://billliao.github.io/awesome-dsh-plugin/（HTTP 200），自动聚合 `topic:dsh-plugin` 全量 21,470 个仓库，按 12 个分类生成 `categories/*.md` + `data/plugins.json`（10.8MB），由 `scripts/fetch_plugins.py`/`categorize_and_generate.py` 定时重生成，另有 `plugin-submission.yml` Issue 表单与 PR 模板。证据：`categories/tools-capabilities.md` 明确有 `[hxlog/dsh-mcp-tools](https://github.com/hxlog/dsh-mcp-tools) ⭐2 — DeepSeek Harness 最简洁、优雅的 MCP 工具管理器…`，`data/plugins.json` 含 `hxlog/dsh-mcp-tools`。属自动聚合目录（非人工精选），收录靠 topic 自动覆盖，无需提交。

**同批评估**：
- **`cordis.run`**（DSH 插件市场站点，331 条开放索引；同源 awesome 列表 `web-casa/Awesome-DeepSeek-Harness-Plugins` ★111）：`/submit`「提交工具」页要求 **GitHub 登录**（OAuth），无公开 API/PR 通道，无法自动提交 → 列入待用户操作项（登录后填英文表单，有反链可 24h 快速通道）。
- **`jqueryscript/awesome-dsh-plugins`**（★5，README 165KB，带 `quality.yml`+`update-stars.yml` CI）：CONTRIBUTING 明确 **admission 门槛 ≥30 stars**，我们当前 3★ → 不符合，暂不提交。
- **`inowness/dsh-plugin-index`**（社区托管 format-1 索引）：只收 `@deepseek-ai/*` 官方包，非第三方目录。
- **`feely0208/dsh-plugins`（深鲸，55 插件）**：只收自家 `@deepwhale-cn/*` 系列，非通用市场。
- **`corvus5536-eng/dsh-market-compat`**（format-1 索引 5,144 条，含我们）：按 DSH 0.2.1-rc.2 兼容性从上游索引过滤生成的**镜像**，非独立维护 → 不计入收录。
- **`dingdong2333333-lab/dsh-hub`**：本地桌面控制台，市场数据读 profile 内 `catalog-plugins-zh.json` 缓存（DSH Plugin Hub 客户端），非独立市场。
- **`SteveTanSaMa/DSH-Studio-Plugins`**：2 条目的 prototype（`data/verification.json` 实验数据），未成形。

**计数：收录 40 → 41，待审保持 64。**

### 6.60 2026-10-23 `YELEBAI/dsh-plugin-marketplace` 验证通过（40th）；两个星标/npm 覆盖面截断的目录不计入

**`YELEBAI/dsh-plugin-marketplace`（第 40 个收录）**：npm 包 `dsh-plugin-marketplace@0.9.5`（★21），DSH Web/Desktop 设置内的插件市场 UI，同时自我描述为「经过验证的 DSH 插件市场，以及自主维护的中心 Registry」。机制：
- 每 2 小时扫 `topic:dsh-plugin archived:false` → `registry/discovery.json`（13,870 条，仅 `fullName/categories/starGrowth7d`；我们在内，`categories: integrations/models/data`）
- 再用 `install-classifier-v11` / `dsh-std-preflight-v1` 验证 manifest、bundle patch、loader entry、运行产物、精确安装来源 → 通过才写入 `registry/plugins.json`（18MB 的 verified registry），不达标写 `registry/rejected.json`，需构建/手工步骤的转「安装 Agent」路径
- 我们的 verified 条目（`registry/plugins.json`）：`install.mode: automatic`、`source: github`、`spec: github:hxlog/dsh-mcp-tools#5c0a7f617d05969d57cb6b6223dbf6db9b3c5e46`、`bundlePatch ./cordis.patch.yml`、`hasClient true`、`profiles [desktop, web]`、`requiresBuildApproval false`、`requiresRestart true`、`verifiedAt 2026-10-23T13:28:18.912Z`；`registry/state.json` 里 `status: verified`、`fingerprint` 含 `install-classifier-v11`

**同批排除（自动覆盖机制截断，非提交问题）**：
- `chnjames/dsh-plugin-market`（★7，公开目录站 dsh-plugin-market.vercel.app，1,127 条）：索引来自 GitHub `topic:dsh-plugin` **按 stars 排序翻页**（`src/utils/github-api.ts` 只取前若干页），我们 3★ 远在截断线之后 → 未收录；随 stars 增长会自动进入。
- `REALOIYO/dsh-plugin-market`（★5，format-1 index，7,471 条）：只从 npm `keywords:dsh-plugin` 发现（共 9,813 个），受 npm 搜索接口 `from>5000 重复返回` 限制需切片 hack（作者注释实测单关键词最多 ~5,250），覆盖不全；我们的包带 `dsh-plugin` keyword 但未落入其切片 → 未收录，属工具覆盖限制。
- `439436269-ctrl/dsh-preview-market`：`lib/catalog.js` 仅 2.7KB 的 preview 专用小目录，非通用市场。
- `2026heshao/dsh-armory`（★21）：不是目录，是「MCP 管理器 + Skills + WorkBuddy 专家 + 工具」的一体化面板插件（**与本插件同类竞品**），其 market 是内置 catalog 而非可收录的公共目录。

**`dsh.store`（`AI-Scarlett/DSH-Store`，★5，840 条目录）——按策略评估后不提交**：这是目前自动化最严格的第三方商城（`registry/catalog.json` + `catalog-index.json` + `catalog/details/*.json`，Issue 表单 `[Plugin]` 触发 10 分钟静态预检，8 小时 Catalog 策略重扫，`bounded-source-v3` 准入引擎）。其自动准入要求「完整有界运行时源码没有文件、网络、命令、凭据、原生制品信号」——同类竞品 `hyqhyq3/dsh-mcp-manager`（MCP server manager，0.13.3）在目录里的实际状态就是 **`status: blocked`**，`statusReason` 明确列出 `files / network / commands / credentials permission signal`。我们的 MCP 管理器同样需要 fs/network 与 stdio 子进程，会得到相同结论（blocked 展示，不进入受保护安装通道），因此**不浪费时间提交**；若后续其策略区分「需用户确认的高权限插件」，再考虑。
**bruc3van 复核（22:17 cron 后）**：`https://bruc3van.com/dsh-plugins/index.json` 在 2026-10-23 22:17 UTC+8 定时任务后仍为 **1,000 条 Top1000（stars 截断）且不含我们**（`hasUs=false`），与预期一致——该站点按 stars 取前 1000，我们 3★ 排在截断线外；保持「已批准但 star 门槛未过」状态，随 stars 增长自动覆盖。
**计数：收录 39 → 40，待审保持 64。**

**discovery 侧端到端复现（官方 main@d3b1059，2026-10-23 22:35 +08）**：不只是「模拟一条 verified=true 记录」，而是**直接调用官方 scripts/discovery-sync.mjs 的 observeDshManifest() + applyManifestObservation()** 处理我们真实的 catalog 条目，再喂给 buildRegistryV4FromDiscovery()：

```
BEFORE: { verified:false, manifest_file:null, package_id:null, category:'mcp', rank:1217 }
observeDshManifest('hxlog/dsh-mcp-tools','main') -> observed:true, status:200, file:'dsh-package.json'
AFTER : { verified:true, manifest_file:'dsh-package.json', package_type:'plugin', package_version:'1.0.2',
          category:'mcp', permissions:['fs.read','fs.write','network'], metadata_source:'dsh-package' }
BUILD : accepted:1 / quarantined:0 / rejected:0
PKGS  : plugin hxlog/dsh-mcp-tools -> release v1.0.2, tag v1.0.2,
        digest sha256-435d32393e4f73d04b7b77a76b7bae3770169805c44111278c47f5727bfbb219,
        commit ddfb49acb3cb850b84b9be1a2fe9d85b25430359
```

即：**当前 catalog 里我们仍是 verified:false（因为 catalog 在 11:39Z 同步时 dsh-package.json 尚未提交，仓库 13:10Z 才加）**，但只要下一次增量 sync 扫到我们（脚本 scripts/simulate-discovery.mjs 可复现），就会自动翻成 verified:true 并进入 registry-v4.json。cron = 18 0/6/12/18 * * * UTC（+08 的 08:18/14:18/20:18/02:18），下一次 **02:18**。注意 id hxlog/dsh-mcp-tools 因 sanitize 只接受 ^[A-Za-z0-9_.-]+$（不含 /）被丢成 package_id:null，不影响 accepted；release_tag:null 也一样，builder 会从 Release Descriptor V2 资产反查替代。

### 6.59 2026-10-23 DSH Go Registry V4：补齐 Release Descriptor V2（可安装发布记录），已用官方协议核验器验证

`coeasy/dsh-go` 的 **Registry V4** 不是「仓库被发现就能装」：契约要求 **Manifest V2**（根目录 `dsh-package.json`）+ 每个 GitHub Release 内的 **Release Descriptor V2**（`dsh-package-release.json`），且 artifact 必须是 GitHub Release 归档（`kind: release-archive`、`format: tgz`、`digest: sha256-<64hex>`、`strip_components`）。我们此前只有 Manifest V2（`f803dea`），所以 catalog 里一直是 `verified: false / manifest_file: null`。

**本轮补齐**（tag `v1.0.2`，canonical tag 由 `packageReleaseTag()` 推出 = `v1.0.2`）：

1. 稀疏克隆官方 toolkit（`coeasy/dsh-go` 的 `packages/protocol-core`、`runtime`、`scripts`、`schemas`），用 **Protocol Core 官方实现**核验，而不是只看 JSON Schema：
   - `readDshManifest(repoRoot)` → `manifest ok: hxlog/dsh-mcp-tools 1.0.2 plugin stable`
   - `validatePackageReleaseDescriptor(descriptor, { type, id, version, channel, repository, tag, package_path: null })` → **VALID**
2. 生成并上传 `dsh-package-release.json` 到既有 Release `v1.0.2`（上传后 GitHub 记录 `sha256:a2245cce…`）：
   - `https://github.com/hxlog/dsh-mcp-tools/releases/download/v1.0.2/dsh-package-release.json`
   - `artifact.url = …/download/v1.0.2/dsh-mcp-tools-1.0.2.tgz`、`digest = sha256-435d32393e4f73d04b7b77a76b7bae3770169805c44111278c47f5727bfbb219`、`format: tgz`、`strip_components: 1`
   - `id/type/version/channel` = `hxlog/dsh-mcp-tools` / `plugin` / `1.0.2` / `stable`；`commit = ddfb49a…`（tag `v1.0.2` 的提交）、`published_at = 2026-10-21T09:56:27Z`；`manifest` 内嵌当前 Manifest V2
3. 端到端复验：从 Release URL 下载 descriptor → 再次 `validatePackageReleaseDescriptor` **OK**；再下载 artifact 计算 sha256 → **与 descriptor digest 一致**（797,549 bytes）

**发现链路的现状**：`catalog/plugins.json`（48.6MB，2026-10-23T11:38Z 构建）里我们仍是 `metadata_source: github`、`verified: false`、`manifest_file: null` —— 该快照早于 `dsh-package.json` 提交（13:10Z），下次 discovery sync 应会把 `manifest_file` 置为 `dsh-package.json`（`isAuthoritativeDshManifest`）并进入可安装候选；随后 `registry-v4-source.mjs` 会按 `packageReleaseTag()` 去 Release 取 descriptor、校验后写入 Registry V4。已在 [Issue #165](https://github.com/coeasy/dsh-go/issues/165#issuecomment-6366507249) 同步进展并询问是否还需要 SBOM/SHA256SUMS 资产或显式 source 配置。

**可复现命令**（本地 toolkit）：
```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/coeasy/dsh-go.git dsh-go-toolkit
cd dsh-go-toolkit; git sparse-checkout set packages/protocol-core runtime scripts schemas
node build-descriptor.mjs   # readDshManifest + validatePackageReleaseDescriptor + 写 descriptor
node verify-published.mjs   # 从 Release URL 复核 + artifact digest 校验
```

**4. 用官方 Builder 预演 Registry V4 摄入（决定性验证）**：调用 `scripts/registry-v4-source.mjs` 的 `buildRegistryV4FromDiscovery()`，两种输入都 **accepted**：

- 显式 source 预演：`{ explicitSources: [{ repository: 'hxlog/dsh-mcp-tools', ref: 'main' }] }` → `accepted: 1 / quarantined: 0 / rejected: 0`
- 模拟「下次 discovery sync 之后」的 catalog 记录（`verified: true`、`manifest_file: 'dsh-package.json'`、`metadata_source: 'dsh-package'`）→ `accepted: 1 / quarantined: 0 / rejected: 0`

两次预演产出的 Registry 包一致：
```json
{ "type": "plugin", "id": "hxlog/dsh-mcp-tools", "releases": [ { "version": "1.0.2", "digest": "sha256-435d3239…bb219", "commit": "ddfb49a…", "tag": "v1.0.2" } ] }
```

即：**descriptor 本身已满足官方摄入管线**，唯一剩余变量是 discovery sync 把 catalog 记录从 `verified:false` 翻成 `verified:true`。
**同步节奏**：`.github/workflows/sync.yml` 的 cron 为 `18 0/6/12/18 * * *`（UTC）→ 北京时间 **08:18 / 14:18 / 20:18 / 02:18**；另外 `push` 到 `scripts/*`、`config/registry-v4-sources.json`、`dsh-package.json` 等路径、`repository_dispatch: sync-plugins`、`workflow_dispatch` 也会触发。当前 `catalog/registry-v4.json` 统计：`discovery_count 22,435 / quarantined_count 22,226 / rejected_count 208 / package_count 2` —— 也就是说**几乎全部社区仓库都因缺 Release Descriptor V2 被隔离**（`quarantined: manifest-v2-required`），我们补齐后有望成为极少数可安装的社区包之一。
**与 npm 的一致性**：Release 资产 `dsh-mcp-tools-1.0.2.tgz` 与 npm 上 `dsh-mcp-tools@1.0.2` 为同一 tarball（npm pack 产物），sha256 一致；因此 dsh-go 安装源（Release 归档）与 npm 安装源内容相同，不存在版本漂移。

### 6.58 2026-10-23 `zyf-maker/dsh-catalog-merged` 自动收录（39th）；StarPivot 目录 PR #2；另核 PerryLink/dshbase 非通用市场

**`zyf-maker/dsh-catalog-merged`**（站点 <https://zyf-maker.github.io/dsh-catalog-merged/web/>，插件本体 `zyf-maker/dsh-market-own`）：自称「自有的 DSH 插件市场：自己抓取、自己合并、自己排名、自己修兼容，不是任何现成市场的套壳」。数据与采集管线在本仓库（`ingest/` → `data/`，CI 每 6 小时重建），插件本身在另一个仓库、通过 raw URL 读 `data/catalog.json`（可 `DSH_MARKET_CATALOG` 覆盖）。实测 **`data/catalog.json`（30.2MB）与 `data/plugins.json`（17.7MB）都含 `dsh-mcp-tools`**，Pages 站点 HTTP 200 → **第 39 个收录**，无需提交动作。

**`StarPivotNet/dsh-plugin-catalog`**：StarPivot 市场的 Catalog 源（`catalog.json`，marketplace protocol v1，原 19 条）。收录规则：必须是 **npm registry 包**并声明 `dsh.bundle.patch`，禁 git-only、skills、需手写 `cordis.patch.yml` 的包；定时 Action 每 30 分钟对照 npm latest 钉 `version`/`updatedAt`（失败会开 Issue 并 @ 全体成员）。我们符合规则，已按格式新增条目并开 **[PR #2](https://github.com/StarPivotNet/dsh-plugin-catalog/pull/2)**（`dsh-mcp-tools`、`kind: bundle`、`version 1.0.2`、`updatedAt 2026-10-21T10:00:09.471Z` = npm 1.0.2 发布时间，JSON 校验通过，diff +9 行）。

**同批排除**：
- `PerryLink/dsh-catalog`（npm `dsh-catalog`，★0，Cloudflare/Vercel 部署）：`deploy/artifacts/v1/plugins.json`（124KB）**不含**我们——它是 PerryLink 自家插件家族的 catalog（另有 `dsh-plugin-certification` 数据仓），非通用市场，不计入。
- `dshbase.com`（`ylwl1997/dshbase-catalog`）：站点标题是「Install, Tutorial & vs Claude Code」，是内容站/教程站而非插件目录，`/plugins/dsh-mcp-tools` 无插件条目，不计入。
- `aiko-dsh-plugins/dsh-plugin-catalog`（私有/组织内 catalog）、`LUTAO581314/dsh-plugin-catalog`（给已装插件加市场分类的插件）：均非通用公开市场。

**计数：收录 38 → 39，待审 63 → 64。**

### 6.57 2026-10-23 `dsh-ai.org` 目录：提交 API 已受理（202 queued）；附带 6 个 npm 市场插件下游覆盖

**[dsh-ai.org](https://dsh-ai.org)**（「DeepSeek Harness Plugin Org」，Next.js + Meilisearch）是又一独立目录站：数据从 `awesome-dsh-plugin` 的 `plugins.json` 与 GitHub topic 候选来，卡片带 `reviewState: listed`、`signals`（`stars` / `downloads30d` / `bundleVerified` / `riskFlags`）、`install.command`、`addedAt/updatedAt`，首页有分类计数（ui 430 / tools 320 / dev 208 …），另有 `/sources` 数据流说明、RSS 与 CLI/API。**收录检查**：公开未归档仓库 + `package.json` 声明 `dsh.bundle` + 采集时用真实 dsh CLI 安装验证。

**给 agent 的提交 API**（`/submit` 页明确写「人和 agent 都可以用——同一个接口，同一套规则」）：

```bash
curl -X POST https://dsh-ai.org/api/submissions \
  -H 'content-type: application/json' \
  -d '{"repositoryUrl":"https://github.com/hxlog/dsh-mcp-tools"}'
```

实测提交结果：`HTTP 202` `{"id":"b86ba7ea-7b03-4de1-89b2-886dd9570651","state":"queued","alreadyQueued":false,"statusUrl":"/api/submissions/b86ba7ea-…","message":"Queued for indexing. Submissions are reviewed before they appear in the catalog."}`；提交时注意：`?q=…` 是 Meilisearch 模糊检索（70 条结果里可能混入别的 MCP 插件），**判定收录必须按 `slug`/`sourceUrl` 精确匹配**；该站 RSS 最新条目停在 2026-08-21，目录同步明显滞后，我们可能先被自动同步收录。

**顺带核到的 npm 市场插件（下游自动覆盖，均从 topic/npm/awesome feed 取数，无需提交）**：`dsh-plugin-hub@0.2.4`（[yunhuantian/dsh-plugin-hub](https://github.com/yunhuantian/dsh-plugin-hub) ★7，图形化商店 + 21 个内置插件 + 离线预置 16 条）、`dsh-plugin-market@1.3.0`（[veloce-ailab/dsh-plugin-market](https://github.com/veloce-ailab/dsh-plugin-market)）、`@tobewin/dsh-plugin-market`（[ToBeWin/DSH-Plugin-Market](https://github.com/ToBeWin/DSH-Plugin-Market)）、`@hydrogenoxide18/dsh-plugin-market`（[Zhen-WushuiLingchun/dsh-plugin-market](https://github.com/Zhen-WushuiLingchun/dsh-plugin-market) ★3）、`dsh-plugin-store-optimized`（[yiqizhuapangxiema/harness-plugin-store-optimized](https://github.com/yiqizhuapangxiema/harness-plugin-store-optimized) ★2，yunhuantian hub 0.1.6 定制版）、`dsh-hub-agent`（[dsh-ai-org/dsh-hub-agent](https://github.com/dsh-ai-org/dsh-hub-agent)，向 dsh-ai.org 匿名上报安装清单，默认关闭）。

**计数：待审 62 → 63。**

### 6.56 2026-10-23 下游 format-1 索引源自动覆盖审计（不计入 38 个市场，但用户可在 Discover 直接添加）

这批仓库本身不是「有站点的市场」，而是别人生成/发布的 format-1 `index.json`，用户可在 DSH「插件 → 发现 → 添加索引源」直接填 raw URL。逐个实测其数据文件：

| 索引源 | 生成方式 | 含我们 | 说明 |
| --- | --- | :---: | --- |
| `wangyutansheng/dsh-market-index` | 由 `awesome-dsh-plugin.com/plugins.json` 每日生成，仅收 npm 可装项，用 `@deepseek-ai/dsh-plugin-market-index` 校验 | ✅ | `index.json` 含 `dsh-mcp-tools`；安装解析走 npmmirror |
| `p8054076283-del/dsh-market-index` | 同上（awesome 目录 → format 1，版本/时间取 npm 真值） | ✅ | `index.json` 含 `dsh-mcp-tools`；给出 jsDelivr 与 `cordis.patch.yml` 两种添加方式 |
| `wink-run/dsh-plugin-store`（★3） | 自建静态商店源码，`data/plugins.json` 13.2MB 快照 | ✅ | 条目 `id: hxlog/dsh-mcp-tools`；无线上站点、需自托管，故不计市场 |
| `chainCAI/dsh-plugins-store`（★0） | 构建时抓 topic，`src/data/catalog.json` 22.3MB | ❌ | 快照滞后，待下次构建 |
| `wakeUpGitHub/dsh-plugin-market`（★0） | 内置 format-1 `site/index.json`（7MB） | ❌ | 快照滞后，待下次构建 |
| `jialiang2509/dsh-plugin-index` | npm 包索引（`market.json`，约 5250 包） | ❌ | 未含我们 |
| `Gcy580231/dsh-market-index` / `zhchzh11-tech` / `gitMFQ` / `f0909172434` / `stellvyr` / `hdh20080722-create` | 各自 format-1 索引 | ❌ | 均未见我们（生成时点或过滤差异） |
| `CatGuard35/dsh-plugin-indexes` | 转换官方/第三方索引（awesome / dsh-plugin.org / dsh.so / lanshuagent） | ❌ | 四个 format1 文件均未含我们 |

**结论**：至少 **2 个可添加的 format-1 索引源**已自动包含本插件（另加 wink-run 快照），无需任何提交动作；这说明「上 awesome-dsh-plugin 主 feed」这一步已把下游索引类市场基本自动化覆盖。后续只需定期重跑本表即可发现滞后项补齐。

### 6.55 2026-10-23 `dshmarketplace.dev`（38th）：API 已收录；确认收录判定用 `?q=` 搜索；另核 3 个 store 快照与 1 个 leaderboard

**`dshmarketplace.dev`**（[DshMarketPlace/dsh-plugins-store](https://github.com/DshMarketPlace/dsh-plugins-store) ★8，npm `dshmarketplace-plugin`；目录数据另见 [DshMarketPlace/awesome-dsh-plugin](https://github.com/DshMarketPlace/awesome-dsh-plugin) ★4，其 README 已落后于站点）是「DSH 内安装 + 浏览器站」同一端点：CLI / 浏览器 / 插件都读 `https://dshmarketplace.dev/api/v1/plugins`（约 1.3 万条，目录每小时变）。收录基本自动，站点有 `/submit` 人工提交通道（粘贴仓库 URL，先读公开元数据——topic/licence/description/是否已收录——再人工复核）。

**我们的命中证据**：`GET /api/v1/plugins?q=dsh-mcp-tools` 返回 `total: 1`，条目含 `fullName: hxlog/dsh-mcp-tools`、`category: tools`、`summary`/`summaryZh`、`npmPackage: dsh-mcp-tools`、`installKind: npm`、`installable: true`、`install: dsh plugin --profile web add dsh-mcp-tools`、`inRegistry: true`、`riskFlags: ["terminal surface"]`（因其可拉起 stdio MCP 进程，属提示而非下架）。注意 API 默认 `count=20`，**必须带 `?q=<slug>` 搜索判定**，否则第一页里看不到就误判未收录。

**同批核过的其它目录（未计入）**：
- `wink-run/dsh-plugin-store`（★3）：`data/plugins.json`（13.2MB）**含** `id: hxlog/dsh-mcp-tools`（category `integrat…`，中文描述），但它是需自托管的静态商店源码、无线上站点，按「用户可发现」口径不计入收录。
- `chainCAI/dsh-plugins-store`（★0，`src/data/catalog.json` 22.3MB）与 `wakeUpGitHub/dsh-plugin-market`（★0，`site/index.json` 7MB）：快照均**未含**我们，属自动采集滞后，等下次构建。
- `dshpluginleaderboard.com`（[sandbaseai/dshpluginleaderboard](https://github.com/sandbaseai/dshpluginleaderboard)，仓库已 404）：插件页路径形如 `/plugins/<owner>-<repo>`，我们的 `/plugins/hxlog-dsh-mcp-tools` **404** —— 按 star 排序的榜单，2–3★ 进不去，与 bruc3van Top1000 同类上限，不计入。
- `sandbaseai/dsh-plugin-store`（★3，预览版）与 `yang051211/dsh-plugin-store`（★0，人工审核目录 `market/index.json` 73KB）：均未含我们；后者无公开提交入口，暂不动。

**计数 37 → 38**。

### 6.54 2026-10-23 新抓一批 DSH 目录站：Victor-770 自动收录（37th）；另 4 个因 top-N / 过滤未含我们；fjzzwxp 走每插件 YAML PR

用 GitHub 搜索（`topic:dsh-plugin` 60 条、`dsh-plugin in:name` 60 条、`dsh marketplace in:name` 50 条）按 updated 扫了一批未在矩阵中的目录，逐个核对数据文件：

- **`Victor-770/dsh-plugin-directory`**（站点 <https://dsh-plugin-directory.online/>，标题「DeepSeek Harness 插件目录（13752 款）」）：`site/public/data/browse-lite.json` 明确含 `"full_name":"hxlog/dsh-mcp-tools"`（★3、JavaScript、分类「工具/开发」、中文描述），数据源 `topic:dsh-plugin`、每 6h 同步，**已收录 → 第 37 个**，无需申请。
- **`fjzzwxp/awesome-dsh-plugins`**（<https://awesome-dsh-plugins.vercel.app>）：自动采集 + 人工纠错的 awesome list，数据在 `data/plugins/<owner>__<repo>.yml`（当前 689 条），README 由 `npm run generate` 生成。我们的条目尚未被采集器加入，已按 contributing 规则提交 [PR #2](https://github.com/fjzzwxp/awesome-dsh-plugins/pull/2)（新增 `hxlog__dsh-mcp-tools.yml` + 重生成两份 README，diff 仅 2 行）。其 `pr-check` 跑 `check-submission.mjs` + `npm run check`；`pr-gate` 用 base 仓库 token 复核仓库存在/未归档/年龄（>1 天，我们 2 天，OK）。
- **`ywsldxk/dsh-plugin-stars`**（★7，<https://ywsldxk.github.io/dsh-plugin-stars/> 按 star 排序榜单）：`data/plugins.json`（约 29 万字节）**不含我们**——按 star 截断，3★ 进不了快照；与 bruc3van Top1000 同类上限问题，暂不计入。
- **`dsh-plugin/dsh-plugin.github.io`**（★2，<https://dsh-plugin.github.io/>，标题「DSH 创意工坊」）：`data/plugins.json`（约 40 万字节）不含我们；站点由 `sync-plugins.yml` 从 topic 抓取，可能有过滤或滞后，暂不计入。
- **`Wenston-dev/awesome-dsh-plugin`**（★3，自动聚合 `data/repositories.json` 7.6MB）：`data/last.json` 不含我们（可能按 star/活跃度截断），暂不计入。
- **`tanle-mtr/dsh-plogin-plugin-recommender`**（★2，AI 策展 `plugins.json`）：不含我们（AI 精选子集），暂不计入。

**另**：`tanle-mtr/dsh-plogin-plugin-recommender`（★2，AI 策展、每小时更新）README 提供 Issue 投稿通道，已开 [Issue #1](https://github.com/tanle-mtr/dsh-plogin-plugin-recommender/issues/1) 提议收录（pending）。

**经验**：自动目录基本按 `topic:dsh-plugin` + star 热度截断，3★ 项目在大型榜单里天然吃亏；要进这类榜单要么涨 star，要么走「每插件 YAML/单行 PR」型策展 list（如 fjzzwxp、hashgraph）。计数更新为 **37 收录 / 61 待审**。

### 6.53 2026-10-23 `ukinch605/awesome-dsh-hub`：纯自动收录型目录（36th），无申请入口，靠 topic + `dsh.bundle.patch` 触发

[ukinch605/awesome-dsh-hub](https://github.com/ukinch605/awesome-dsh-hub) 是自动维护的 DSH 插件目录（当前 **17,769** 个插件 / 21,133 监测仓库 / 21.8 万累计 star），产物分三份：机器可读 [`registry/plugins.json`](https://github.com/ukinch605/awesome-dsh-hub/blob/main/registry/plugins.json)（约 19.9MB JSON）、抓取元信息 `registry/meta.json`、中英双语分类目录 `docs/catalog.{zh,en}.md`，外加 GitHub Pages 检索站 <https://ukinch605.github.io/awesome-dsh-hub/>。

**收录规则（完全自动、无需申请）**：① 仓库加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题；② 根目录 `package.json` 声明 `dsh.bundle.patch`。Registry 每小时刷新（`meta.json.generatedAt`），符合规则即出现在下一次运行。另有收录徽章可贴到自己 README。

**我们的命中情况**：`registry/plugins.json` 中已有 `"name": "dsh-mcp-tools"` 条目——`repo: hxlog/dsh-mcp-tools`、`packageVersion: 1.0.2`、`discoverySource: github-topic:dsh-plugin`、`firstSeenAt: 2026-10-23T07:58:44Z`、`lastSeenAt: 2026-10-23T13:02:26Z`；`docs/catalog.en.md` 词条附 GitHub 链接、★3、MIT、英文描述与 `npx @deepseek-ai/dsh plugin --profile web add github:hxlog/dsh-mcp-tools` 安装命令（`catalog.zh.md` 为中文描述）。说明我们的 topic 与 `dsh.bundle.patch` 元数据已满足其自动发现条件，无需 PR。

**可选项**：`data/overrides.json` 可提 PR 修正分类/描述/排除镜像（我们无需改）；如需曝光可在 README 加 [收录徽章](https://github.com/ukinch605/awesome-dsh-hub#%E6%94%B6%E5%BD%95%E5%BE%BD%E7%AB%A0--listing-badge)。计数从 35 → **36**。

### 6.52 2026-10-23 hashgraph `awesome-ai-plugins`：scanner score ≥80 是硬门槛，79→100 的修法（可直接复用到其它 scanner 闸门）

[hashgraph-online/awesome-ai-plugins](https://github.com/hashgraph-online/awesome-ai-plugins)（837★）是跨客户端 AI 插件大目录（Codex/Claude Code/Gemini CLI/**DSH**/Cursor…），含独立 `## DeepSeek Harness Plugins` 分区（19 条），入口规则极简：README 对应分区按字母序加一行 `- [Name](repo) - 一句描述`，PR 说明来源仓库；列表背后[每条会自动进 HOL Plugin Registry](https://hol.org/registry/plugins) 跑 `plugin-scanner` 打分。

**CI 结构（三道 + 一道隐藏闸）**：`Alphabetical Order Check`（按 ## 分区、大小写不敏感、支持 `<!-- pinned -->` 跳过）；`Validate Plugin Contributions`（`scripts/validate-contribution.py`：只校验新增条目格式 `- [Name](https://github.com/owner/repo) - desc` + 源仓库可达 + 扫描可选 CI，告警不阻断）；`Validate marketplace artifacts`（离线跑 `generate_plugins_json.py`）；**`Sweep Open Plugin Contributions`（`pull_request_target`）会对所有 open PR 的源仓库 clone 后跑 `hashgraph-online/ai-plugin-scanner-action`，低于 80 分直接 gate 失败并阻断合并**。

**我们的两道门槛与修复**：PR [#949](https://github.com/hashgraph-online/awesome-ai-plugins/pull/949) 首轮 `Scan PR (949, hxlog, dsh-mcp-tools): failure`——artifact `scan-findings-pr-949-…/findings.json` 显示 **score 79**（阈值 80），5 条 findings：`GITHUB_ACTION_UNPINNED`×2（ci.yml 用了 `actions/checkout@v4`/`setup-node@v4` 浮动 tag）、`DEPENDENCY_LOCKFILE_MISSING`（package.json 存在但无 lockfile）、`SECURITY_MD_MISSING`、`DEPENDABOT_MISSING`。

**源仓库修复（提交 `93981f0` + `7a4950e`）**：
1. GitHub Actions 全部 pin 到 commit SHA（`checkout@11d5960a…# v4.4.0`、`setup-node@49933ea5…# v4.4.0`）；
2. 新增 `SECURITY.md`（支持版本、GitHub Security Advisories 私密报告、威胁模型：state.json 等同凭据、MCP server 为不可信输入、无第三方运行时依赖/无 lifecycle scripts）；
3. 新增 `.github/dependabot.yml`（github-actions + npm 每周，actions 分组）；
4. `npm install --package-lock-only` 生成 `package-lock.json`（零依赖，仅根包）。

**复扫结果**：推一个 `ci: retrigger` 空提交触发 `synchronize` → `Sweep` 变 **success**，artifact 复扫 `score=100, findings=0`；PR #949 五道 check 全绿（`Validate open contribution requirements`、`Open Plugin Contribution Gate`、`Scan PR (949…)` 等）。经验：**scanner 闸门失败时先下 artifact 看 `score/findings`，按 ruleId 逐个修源仓库**，比反复改 PR 有效得多；这套修法对任何用 `ai-plugin-scanner` 的列表/市场都通用。

**待办**：等 maintainer 合并（`pull_request` 那几条显示 `action_required` 是 fork 首贡献者的 workflow 审批门，非失败；`pull_request_target` 的 gate 已通过）。合并后条目进 README + 自动进 HOL Registry，可计入收录（pending #60）。

### 6.51 2026-10-23 DSH Registry（dsh-pluginmarket）：Issue→自动 PR→合并即发布，我们的 PR #6812 已过校验

发现轴：GitHub 通知里出现 `dsh-pluginmarket/metadata:Issue`，反查 org `dsh-pluginmarket` 有两个仓库：`metadata`（当日仍在推送，条目源）与 `registry`（纯静态前端）。

**架构**（读 README 确认）：没有 API/数据库，前端直接浏览器拉 `metadata` 仓库默认分支的 `entries/*.json`，部署在 <https://dsh-pluginmarket.github.io/registry/>；安装引导用 DSH 原生命令 `dsh plugin --profile <name> add <package>`。

**投稿流程与格式**（`Add registry entry` Issue 模板要求 7 个字段）：Kind / Name / GitHub repository / npm package / Description / Tags / Submitter；标题**必须以 `Add:` 开头**（不依赖 label 触发）。Actions 校验后自动生成 PR；PR 即审核闸；合并即发布，并自动关闭原 issue。条目格式（`entries/<owner>_<repo>.json`）固定 25 行：`id: "github:owner/repo"`、`kind/name/description/source/sources/githubRepo/repositoryUrl/npmPackage/tags/status/official/submittedBy/issueNumber`。

**执行结果**：[Issue #6811](https://github.com/dsh-pluginmarket/metadata/issues/6811)（标题 `Add: dsh-mcp-tools`）→ 约 15 秒后 bot 开 [PR #6812](https://github.com/dsh-pluginmarket/metadata/pull/6812)，diff 仅新增 `entries/github_hxlog_dsh-mcp-tools.json`（+25 行），`validate-submission` 通过、`mergeable_state: clean`。注意：首次发 issue 时我把 pinned commit 写成了编造的 hash，已 PATCH 修正为真实 `9b80a8c` —— 教训：**任何对外文本里的 commit/URL 必须先核实再写**。

**跟进结果（同日复核，结论不乐观）**：PR #6812 仍 open。深挖 `metadata` 仓库后确认：默认分支最后提交是 **2026-08-14**（`#93 metadata: add entry from issue #84`），目前 `entries/` 只有 **82 条**；自 8-14 起共有 **3,363 个 open PR + 3,363 个 closed-unmerged PR**（全是 bot 生成、无人处理），说明该 Registry 的自动化仍在跑但**维护者已停止合并**，站点 <https://dsh-pluginmarket.github.io/registry/> 实际长期停在 82 个插件。结论：**投稿已完成且格式/校验全过，但发布依赖维护者复活，不计入收录**；保留 PR 作为后续触发点，不重复提交。

**bruc3van 复核结论（本轮补）**：`bruc3van.com/dsh-plugins/index.json` 现已 200（format 1，标题 Bruce's Plugin Picks），但**恰好 1000 条、无我们**；对照仓库数据：`data/approved.json` 有 `"hxlog/dsh-mcp-tools": "2026-10-23"`（核准），而 `data/market.json`、`curated.json`、`packages.json` 都没有 → 站点索引是「Top1000（star/热度）精选」而非全量核准列表，核准只是入场资格。结论：**无需 PR，star 未到 Top1000 前不会渲染**，此前「受体积上限未渲染」的判断被修正为「Top1000 排序截断」。

### 6.50 2026-10-23 DSH Go（coeasy/dsh-go）：发现层已在我们、可安装层要求 Manifest V2 + Release Descriptor V2

从「topic:dsh-plugin-market 共 767 个仓库」扫到 [coeasy/dsh-go](https://github.com/coeasy/dsh-go)（★1，当日仍在推送）：口号是「原生包管理器 + Registry/Distribution + Marketplace」，API 入口 `https://dsh-go.pages.dev/`，registry revision 每小时级刷新。

**它的两层结构**（读代码+契约文档确认）：

1. **发现层（Discovery）**：扫 GitHub 仓库，产出 `catalog/plugins.json`（22,435 条）与 `registry-candidates-v1.json`。我们**已在**其中（`metadata_source: "github"`、`category: "mcp"`）。
2. **可安装层（Registry V4）**：只认 **Manifest V2 根文件 `dsh-package.json`** + 每个版本在 GitHub Release 里发布的 **Release Descriptor V2**（`dsh-package-release.json`，绑定 type/id/version/channel/repository/commit/tag/published_at/manifest_file/package_path/manifest/artifact）；`artifact` 的 schema 只允许 `kind: release-archive`（GitHub 上的 tgz URL）、`digest: sha256-<64hex>`、`format: tgz`、`strip_components>=1`。当前 registry 只有 2 个包（都是它自己的），属于极早期项目。

**已做的修正（格式对齐）**：在仓库根新增 `dsh-package.json`（Manifest V2，`type: plugin`、`id: hxlog/dsh-mcp-tools`、`version: 1.0.2`、`entrypoints.bundle: cordis.patch.yml`、`publisher.id: hxlog`、`source.repo: hxlog/dsh-mcp-tools`、`compatibility.node: >=22.13.0`、权限 `fs.read/fs.write/network`），本地对官方 schema 校验 **0 错误**，`npm test` 全过，commit `f803dea`。

**待解决**：现有 tag `v1.0.2` 早于 manifest 文件，Release Descriptor 的 manifest binding 要求 descriptor（含 manifest 原文）指向的 commit 上 manifest 存在，故 1.0.2 无法回溯绑 descriptor。已开 [Issue #165](https://github.com/coeasy/dsh-go/issues/165) 问：npm 优先的插件能否用 `git archive`/`npm pack` 的 tgz 当 `release-archive`（root 包 `package_path: null`、`strip_components: 1`），以及下一个版本 tag 附 descriptor 后增量 sync 是否自动转正。**注意**：这不需要发布 npm 新版本也能做（GitHub release 独立），但版本号需与 manifest 对齐，等用户确认 1.0.3 发布节奏后再实施。

**其它候选（本轮扫完）**：`Awesome-AI-Pedia`（★492，AI 资源百科含 `deepseek harness plugins/` 目录，PR 可加条目，非市场）、`coeasy/dsh-go` 之外的 767 个 topic 仓库绝大多是插件本体。

### 6.49 2026-10-23 全量审计「引用官方 feed 的 147 个仓库」：只多出 1 个真市场（已收录）

用 GitHub code search 扫 `"awesome-dsh-plugin.com/plugins.json"`（4 页共 147 个去重仓库），逐个判定是「市场」还是「客户端/工具/文档」，结论：

- **真市场（新增收录）**：[dingdang66686/dsh-market-index](https://github.com/dingdang66686/dsh-market-index) —— 每次 GitHub Actions（12h）从 awesome feed 生成 **format 1** 的 `index.json`（3,365 插件 / 1.26 万版本，23 分类、11 能力标签、排序键 stars/downloads），README 实测 raw / Pages / jsDelivr 三个地址均可作为官方 Discover 索引源。我们的条目在其中（`name: dsh-mcp-tools`、中英描述、`category: tools`、versions）。✅ 计入第 35 个收录。
- **同为 format-1 但个人范围**：`vlln/plugin-registry`（★59，只收作者自己的插件，非社区市场）。
- **客户端/应用内市场（消费 feed，不是独立市场）**：`anywhere-labs/dsh-desktop`、`dsh-market/dsh-market`、`KokuYu-sysu/dsh-market-desktop`、`Liaominduyh/GitHub-dsh-plugin-market`、`Headmaster218/dsh-market-moe4all`、`Sanqi-normal/dsh-webui-market-plugin`、`qichuang321/dsh-plugin-browser`、`anjaymi/dsh-plugin-store`、`striveh/dsh-plugin-extension-center`、`Harzva/harness-flow-hub`（其 `registry/` 只有 platform-support/revocations，非插件目录）、`Eray114514/dsh-find-plugins`（五源聚合查询器）、`flysusdjd/dsh-rank-board`（npm 下载榜）、`Relistencode/dsh-extension-hub`（skills/MCP 管理客户端）、`peter123023/dsh-featured-plugins`（精选客户端）、`LM20230311/dsh-bundles`（persona 整合包）。
- **非市场**：`szhjia/stackharbor`（Go agent harness）、`lincheuk/Deskminis`、`JustGenius-s/DSH-Plugs`（自研套件 monorepo）、`WOO-woo-Waf/agent-harness-landscape`（研究文档）等。

方法论沉淀：**「谁引用了官方 feed」是最可靠的 DSH 市场发现轴**——比按 topic 扫或用关键词搜词召回率高得多（147 个仓库里此前矩阵外的市场只剩 1 个，且已被 feed 覆盖）。后续新增市场若直接消费 feed，会自动覆盖我们，无需逐个提交。

### 6.48 2026-10-23 搞清官方 Discover 的收录机制（format-1 index），并核对主流 index 是否含我们

DSH 官方 Web GUI 的 **Discover 页**（`packages/client/ui-plugin-market` + `packages/boot/plugin-market`）并不维护中心化官方榜单：`Config.indexes` 默认 `[]`，用户手动添加 market index URL 才发请求；格式由 `@deepseek-ai/dsh-plugin-market-index` 定义（`format: 1`，含 `title`/`plugins[].versions[]`/`install target` 等）。官方仓库自带 `apps/plugin-market-generator`（读 npm/git 清单生成 `index.json`）但**没有默认 index 源**，因此「被官方收录」= 出现在用户会添加的那些 `index.json` 里。

实测各市场 index 源是否含我们（2026-10-23）：

| index 源 | 状态 | 含本插件 |
| --- | --- | --- |
| `https://awesome-dsh-plugin.com/index.json` | format 1，2.27MB | ✅ |
| `https://dshopen.org/index.json` | format 1，1.23MB（Open Plugin Market） | ✅ |
| `https://dshmarket.com/index.json` | format 1，2.27MB（awesome feed 的镜像） | ✅ |
| `https://dsh.pub/plugins.json` | 11.8MB 自有 schema（非 format 1） | ✅ |
| `https://dsh.lanshuagent.com/plugins.json` | 自有 schema（cclank） | ❌ 见 §6.46 |
| `https://vlln/plugin-registry`（`raw.../vlln/plugin-registry/main/index.json`） | format 1 个人索引（README："Plugins I build for dsh"），★59 | ❌ 设计上只收作者自己的插件，非社区市场，不作为目标 |

结论：**能进 Discover 的主流 index 源都已覆盖**；`/index.json` 路径还探测过 dshfind、deepseek1024、dshpluginhub.ai、dshhub.co/org、dsh-plugin.store、dsh.so、dshmarket.com、dshplugins.org、dsh.directory、dshplugin.app、dshhub.dev 等 20+ 域名，除 cclank 外均已含我们或使用自有 schema（`/plugins.json`）且已含我们。

### 6.47 2026-10-23 dshlib 插件商店投稿 + 认证体系（PerryLink）识别

**dshlib/dshlib（compliancehub.cn/store）**：代码搜 `dshlib` 商店，实验性插件商店，投稿用 Issue 模板 `Add: <plugin>`，要求 `dsh-plugin` topic + LICENSE + bundle manifest；上架前自动做内容完整性校验（npm 官方 hash）、dshlib-scan + GuardDog 第三方复扫、OSV.dev 依赖检查，并给 CHA2A（L0-L4）认证徽章。已按模板提交 [Issue #4](https://github.com/dshlib/dshlib/issues/4)（附 npm 版本、pinned commit、豁免/安全说明）。注意其仓库自 2026-08-27 无新提交、站内 3 条历史投稿也未处理，属「低活跃实验项目」，不作为主力预期。

**PerryLink/dsh-plugin-certification**（配套 `PerryLink/dsh-cert-mcp`）：结论是**认证数据仓库，不是可浏览的插件市场**——`package.json` 为 private、不发 npm、不可安装；五个维度 A 清单合规 / B 构建卫生 / C OpenSSF Scorecard / D npm provenance / E dsh-test-drive 真实安装冒烟，A-D 级评分。可作为「自证材料」来源（其 b 维度正好检查 `files` allowlist、无恶意 postinstall、lint/typecheck 门禁——我们已满足），但收录与市场曝光无直接关系，暂不投入；若后续要拿认证徽章再按其 `data/certified.json` 的 evidence 规范补齐 Scorecard/provenance 证据。

### 6.46 2026-10-23 新发现 deepseekplugin.store（已走通自动准入 → PR #316）＋ cclank/dsh-plugin-hub（自动抓取型）

用 GitHub 代码搜索 `"dsh plugin --profile web add"` / `"dsh-plugin" "marketplace"`（共 106 个去重仓库）继续扫目录站，发现两家此前矩阵里没有的：

**① deepseekplugin.store（Ericwong5021/deepseek-plugin-store，★23，当日仍在推送）**

- 准入口径写在 `COLLABORATION.md`：仓库加 `topic:dsh-plugin` 只进隐藏候选池；正式收录需根 `package.json` 有 `dsh.bundle` + 通过 `plugin-submission` Issue 提交，Intake Agent 用**默认分支固定 commit** 检查仓库/Manifest/README，不执行外部代码。
- 我们按模板提交 [Issue #315](https://github.com/Ericwong5021/deepseek-plugin-store/issues/315)（含 pinned commit `4c310a6`、MIT、npm `dsh-mcp-tools@1.0.2`、安装命令、分类证据）→ 几分钟内机器人打标 `type:submission, gov:approved, gov:pr-open` 并开出 [PR #316](https://github.com/Ericwong5021/deepseek-plugin-store/pull/316)，新增 `registry/plugins/hxlog-dsh-mcp-tools.json`（80 行，含 `verifiedCommitSha` 与中英 summary）。
- 注意：其自动分类把我们归到 `integrations-communication / collaboration`（源码里 `confidence: low`、`needsReview: true`）；实际更接近 `Tools & Data / General Utilities`。不阻塞合并，若维护者审到可提一句。
- 合并节奏：同类 PR #313/#314（10-20、10-22）仍在 open 且工作流 `action_required`，说明是批量人工审核；等待即可。

**② cclank/dsh-plugin-hub（dsh.lanshuagent.com，★21，655 条在线索引）**

- 站点带开放 API（`/api/plugins`、`/api/registry/status`、`/api/passports/...`）与「岚叔严选」+ 自动收录（Cloudflare Cron 每 12h 扫 topic），**无投稿入口**；准入全靠自动发现+筛查。
- 当前它的 automation 状态 `degraded`、`lastSuccessfulRunAt: 2026-10-07`，`/api/plugins` 655 条与 `plugins.json` 220 条快照均无我们 → 只能等其 cron 恢复。

**另外核实**：`Sanqi-normal/dsh-webui-market-plugin`（★104）只是消费 `awesome-dsh-plugin.com` 目录的应用内市场客户端（我们已在 feed 里，故可浏览）；`dsh-market/dsh-market` 仓库已无 `data/registry-snapshot.json`（404），其应用直接读官方 feed，同样已覆盖。

### 6.45 2026-10-23 发现 dshplugin.io 同步管线被上游删除路径冻死 → 提 PR [#38](https://github.com/tjsdyy/dshplugin/pull/38)

**现象**：dshplugin.io 站点首页自报 3,729 个插件、`app/plugins.json` 的 `updated` 停在 `2026-08-15`，仓库最后一次数据提交是 2026-09-12——而它的 sync workflow 每 6 小时都在「success」。

**根因**：`scripts/sync-plugins.mjs` 的 `UPSTREAM` 常量指向 `https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/docs/plugins.json`，该路径已被上游删除（404，`repos/.../contents/docs` 为空）。fetch 被 try/catch 包住，于是每次 cron 都静默回退到本地快照（并只追加 dshhub.org 的新发现），日志显示「Catalog is already current」。

**修复**：把它指向 awesome-dsh-plugin 官方发布 feed `https://awesome-dsh-plugin.com/plugins.json`（200，`updated: 2026-10-22`，6,565 条，字段 name/owner/url/category/install/双语 description 齐全）。

**本地验证**（fork `hxlog/dshplugin`，Node 24 实跑）：`node scripts/sync-plugins.mjs` → `Scanning DSH Hub page 1/8... Catalog updated to 9158 plugins (2026-10-22).`；独立校验上游 6,565 条全部过 `assertRegistry()`（0 条缺核心字段 / 0 条未知 category / 0 条缺 en|zh / 0 条 owner+name 重复）；生成的 `app/plugins.json` 里 `dsh-mcp-tools` 在列（category `tools`、install `dsh plugin --profile web add dsh-mcp-tools`）。PR 只改 `scripts/sync-plugins.mjs` 一行，数据文件留给其 cron 生成，避免 19 万行 diff。

**顺带结论（本轮扫街）**：`dsh.directory`（10.8k）/ `dshplugin.io`（7.5k）/ `dsh-plugin.com`（7.1k）/ `dshindex.com`（8.3k）/ `deepseek-plugin.org`（13.3k）/ `dsh-plugins.net`（15.2k）这类大目录都含 9★ 的 `dsh-project-mcp-manager` 却**不含 3★ 的我们**，属于按热度/翻页窗口截断，短期不可通过投稿绕过；`dsh.fish` 的 `/submit` 需登录浏览器会话（我们只能在用户手动操作时提供 `npm:dsh-mcp-tools` 参数）。

### 6.44 2026-10-23 收到维护者回复：dshopen.org 已收录（第 34 个）＋ dshplugin 安全建议＋ dsh-pub 失败原因

本轮把「已关闭」的 PR/Issue 也翻了一遍（之前只盯 open，漏了维护者在关闭时留的话），逐条回复并核实：

| 线程 | 维护者原话（节选） | 我们的处理 |
| --- | --- | --- |
| [polang233/dsh-plugin-index#58](https://github.com/polang233/dsh-plugin-index/issues/58) | 「已核查并加入收录配置，提交推送且 GitHub Actions 发布完成后即可在市场中看到」 | ✅ **已验证上线**：`https://dshopen.org/index.json`（876 条）含我们；已回帖确认 + 致谢 |
| [dshplugin/dsh-plugin-hub#391](https://github.com/dshplugin/dsh-plugin-hub/issues/391) | 「目录数据里已经收录，应用内插件中心下一轮同步即可看到」+ **安全建议**：请求头是凭据，明文存在 `state.json`，建议 README 醒目提示、后续接钥匙串 | 已回帖：README 早有「🔒 安全说明 · 状态文件等同密码」段落（`README.md#-安全说明`），FAQ/权限声明各重复一次；钥匙串记入 roadmap 但不承诺时间表 |
| [Dominic789654/awesome-deepseek-harness#671](https://github.com/Dominic789654/awesome-deepseek-harness/pull/671) | 「Verified … merging now」 | 已合并；回帖致谢并说明后续版本保持包名/安装命令稳定 |
| [vvlife/awesome-deepseek-harness-plugins#168](https://github.com/vvlife/awesome-deepseek-harness-plugins/pull/168) | 机器人「✅ AUTO-APPROVED … will be auto-merged」 | 已合并；回帖致谢 |
| [imsai-sh#669](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/pull/669)（1024 Store） | 「review passed … squash-merged automatically」+ Codex review「couldn’t complete this review」（工具失败，不是代码问题）+ 「npm-only，未发布前 browse-only」 | PR 已合并；npm `dsh-mcp-tools@1.0.2` 其实已发布且 manifest 带 `dsh.bundle`，已在 [#678](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/issues/678) 补发布证据请其下次扫描改走 npm |
| [dsh-pub](https://github.com/dsh-pub/dsh-pub) 提交流程 | CI `Plugin submission` / `Quality` 失败 | 读了 job 日志：`{"code":"already_listed","status":"invalid"}` —— **仅因重复投稿**（我们已在 dsh.pub 收录），非代码/格式问题；`Inspect the fixed public source` 之后的步骤全部 skipped |
| [awesome-deepseekharness#186](https://github.com/awesome-deepseekharness/awesome-deepseek-harness/pull/186) | 机器人 `submission-guard:velocity-tip`：14 天内第 4 个自荐 PR 起自动关闭 | 已回帖确认：本仓库只投这 1 个 PR，14 天内不再开自荐 |

**教训**：查「回信」不能只看 open 条目——维护者经常在**合并/关闭的同时**留言（这次 4 条全在已关闭条目里）。以后每轮把 `is:closed` 一并扫。

### 6.43 2026-10-23 bruc3van 管线真相（已进 catalog，站点 index 待重建）＋ DSH Discussion 改成投稿标题

**bruc3van 收录状态说实话**（深挖了它仓库的数据管线）：

| 环节 | 证据 |
| --- | --- |
| 抓取 | `data/repositories.json`（18.3MB）含 `hxlog/dsh-mcp-tools` |
| 核实/批准 | `data/approved.json` 有 `"hxlog/dsh-mcp-tools": "2026-10-23"`（门控：新仓库经核实后才进目录） |
| 目录分册 | `catalog/agents-workflows.md` **已收录**：`[hxlog/dsh-mcp-tools](…) \| … \| JavaScript \| 2 \| MIT \| 2026-10-21` |
| 站点 index | `https://bruc3van.com/dsh-plugins/index.json` 目前 **1000 条、无我们**；`market.json` / `market-v2.json` / `curated.json` 也都没有（站点数据另走一条受 curated 门控的管线） |

结论：**目录/仓库这一层已经算收录**（catalog 文件可复核），站点首页索引要等它下一次重建（其 refresh 工作流由 push/cron 触发，不是我们可控）。另外它「作者自荐」区有硬门槛：**star > 10**（CI 会拒），我们 3★ 走不通，别去提 PR 自荐。

**把 DSH 官方 Discussion 改成它家投稿格式**：dsh-plugins.net 的投稿是「表单生成 markdown → 贴到 DSH Discussions，标题固定 `Plugin submission: <name>`」。我们之前那条 #10768 正文其实已经是结构化投稿格式（plugin name / package / repo / description / version / min DSH / category / 权限声明 / 无遥测），只差标题。已用 GraphQL `updateDiscussion` 把它改名为 **`Plugin submission: dsh-mcp-tools`**（同一条讨论，不新增线程，避免刷屏）：https://github.com/deepseek-ai/deepseek-harness/discussions/10768 。dsh-plugins.net 仍未被收录（12 个项目 / 7,597 插件页均无我们），等它快照重扫。

**PR 状态巡检（19 条在跟）**：本轮无新 merge；`awesome-deepseekharness/awesome-deepseek-harness#186` 是唯一 APPROVED 且 CLEAN 的（curator 已「✅ Verified」，等维护者点 merge）；其余多 CLEAN 但未合，含 libukai#153、ZeroPointRepo#27。

### 6.42 2026-10-23 Topic 榜扫街：dshpluginhub.ai 已收录（第 33 个）＋ libukai 精选插件 PR #153

把 `topic:dsh-plugin` 按 star 排序取前 300 个仓库，用 `market|directory|hub|catalog|index|registry|store|awesome|list|discover` 过滤得 41 个候选，再对没见过的逐个查站点：

| 发现 | 性质 | 结论 |
| --- | --- | --- |
| **pax-beehive/dsh-hub-cli**（277★，homepage `dshpluginhub.ai`） | DSH Plugin Hub 的 CLI/schema/resolver；站点有 Plugins / Profiles / Categories / News / Docs，插件页带固定 commit 安装命令 | ✅ **已收录我们**（详见上表）；`/plugins/hxlog/dsh-mcp-tools` 404 是 slug 规则不同，实际 slug 是 `dsh-mcp-tools` |
| **libukai/awesome-deepseek-harness**（321★，三语 README，`### 精选插件` 分类） | 维护很勤的「终极指南」；插件条目是证据型长句（每行带 license/npm/兼容性/风险），近期 PR #145–#152 全是加插件 | ⏳ 已提 **[PR #153](https://github.com/libukai/awesome-deepseek-harness/pull/153)**：三个 README 各加一行（简中/EN/JA），分类放 `### 工作流与 Agent`；PR 正文按 #150 的样式写「我是作者 + `dsh.bundle.patch` + `cordis.patch.yml` + npm 名 + 零依赖」 |
| Awesome-AI-Pedia/Awesome-AI-Pedia（492★） | 泛 AI 资源百科，含 DSH 插件小节 | 待跟进（不是专门插件市场，价值低） |
| leenkcool/Blue-Whale-Harness（197★） | 「插件总目录 1958 仓库 / 1819 真插件」 | 已在 §6.x 有 issue #181 待审，非新目标 |

**扫街口径**：`sort=stars` 抓 300 个 repo 后过滤名字/描述含 market/directory/hub/catalog/index/registry/store/awesome/list/discover 的词，再与已知 33 个市场 + 待审清单对表，只把「没出现过且有自己的站点/数据文件」的当新目标——这样能把 `cc-safety-net`、`iflytek/skillhub`、`PicGo` 这类蹭 topic 的噪声滤掉。

### 6.41 2026-10-23 npm 反查市场客户端：新增 2 个站点（1 已收录、1 待跟进）、1 个暂不追

方法同 §6.40：npm 搜索 3 组关键词去重得 608 个包 → 91 个「market/directory/hub/catalog/index/store」类 → 逐个看 `links.repository` 与 README 里的上游站点。除已记录的 dshhub.co 外还捞出：

| 站点 / 项目 | 性质 | 结论 |
| --- | --- | --- |
| **deepseekplugins.com** | Next.js 站点，`/plugins/<name>`，当前 **18–19 个精选插件**（modlens、dsh-lark、dsh-vision-toolkit…），首页只链官方仓库与 `topics/dsh-plugin` | ❌ 未收录；**无投稿入口**（无 submit/无 issue/无 repo 链接），只能等人工精选或作者主动加 → 待跟进 |
| **百通插件广场** `s.1100111.cn/baitong_ai`（客户端 `@baitongserver/dsh-plugin-market`，`imyasonly/dsh-plugin-market`） | 服务端目录 API：`GET /api/bt/dsh/plugins`；`/categories` 返回 **401 请先登录** | 目录只有 **3 个插件**（total=3），是面向企业/私域的广场，需百通账号才能投稿 → **暂不追** |

其余客户端包多为**衍生镜像**（数据仍来自我们已确认的平台），不算独立市场：`@99galaxy/dsh-plugin-market`（读 awesome-dsh-plugin 目录）、`dsh-unified-market`（聚合多目录）、`deepseek-harness-market`、`dsh-plugin-studio`、`@x1a0f3n9/dshmarket`/`@gausszhou/dsh-market`/`safer-dsh-market`（dsh-market 分支，数据源 dsh.market）、`@linxin666/dsh-client-ui-market` + `dsh-community-plugins`（zhu 的社区索引，已提 PR #52）。

至此本轮盘点：**32 个已确认收录**、54 个待审/待跟进。

### 6.40 2026-10-23 dshhub.co 已收录（第 32 个）：注意 dshhub.co / dshhub.org / dshhub.dev 是三个不同项目

从 npm 搜索 `dsh-plugin market` 顺出一串**市场客户端包**，逐个推它们的上游站点，找到 **dshhub.co**：

- `dshhub-market` 包（`dshhub-co/dshhub-market`）描述是「DeepSeek Harness 口令插件市场客户端：输码解锁插件，连接创作者与买家（DSHHub.co 驱动）」；
- sitemap `https://dshhub.co/sitemap.xml` **13,144 条**，其中命中我们 2 条：`/zh/plugin/hxlog/dsh-mcp-tools`、`/en/plugin/hxlog/dsh-mcp-tools`；
- 详情页 200，`<title>dsh-mcp-tools · DeepSeek Harness Plugin Passcode · dshhub.co</title>`，正文有「DeepSeek Harness 的 MCP 工具管理器…」中文描述、分类「工具与能力」、`Added 2026-10-22`、`★ 2`、源仓库 + awesome-dsh-plugin 原页链接、`dsh plugin --profile web add dshhub-market` 安装市场客户端命令。

**三个 dshhub 域名别混**：

| 域名 | 项 | 状态 |
| --- | --- | --- |
| dshhub.co | Passcode Market（口令/付费插件市场，`dshhub-co/dshhub-market` 客户端） | ✅ 已收录我们（第 32 个） |
| dshhub.org | `coderPerseus/dsh-hub` 静态目录（10.7MB enrichment） | ✅ 已收录我们（第 31 个，版本字段待刷新） |
| dshhub.dev | 另一个「2,000+ 插件」目录，`/submit` 给模板让贴到 Issue/PR（仓库未公开） | ❌ 未收录 |

**npm 搜索挖市场的思路**（这轮验证有效）：`registry.npmjs.org/-/v1/search?text=dsh-plugin%20market&size=250`（再换 `deepseek harness plugin`、`dsh plugin registry` 两词并去重，本轮 608 个唯一包）→ 过滤名字/描述含 market/directory/hub/catalog/index/store 的 91 个 → 逐个看 `links.repository`，对不是我们已知市场的客户端包，抓它的 README 找**上游站点 URL**，再拿站点 sitemap 搜 `dsh-mcp-tools`。这比盲扫域名准得多。

### 6.39 2026-10-23 dshhub.org 已收录（第 31 个，版本字段待刷新）

`dshhub.org` 和 `dshhub.dev` 是**两个不同项目**，别混：

- **dshhub.org** = `coderPerseus/dsh-hub`（4★，README：「The Best DSH plugins」静态目录，每日抓取刷新；商品数据在 `data/catalog-enrichment.json` 10.7MB）。我们**已被收录**：`github:hxlog/dsh-mcp-tools` 条目在 enrichment 里（中文摘要 + 分析都在），详情页 200：https://dshhub.org/plugins/hxlog/dsh-mcp-tools 。页面显示的 `版本 1.0.0`、`兼容性 待验证`、`★ 0` 是抓取时的快照（我们 10-21 才发 1.0.0），等每日刷新应自动更新；它的投稿方式是 GitHub Issue `[Plugin] owner/repo — 短描述`（模板分「仓库链接 / 用途与安装方式」两栏，见 issue #72），另可直接提 issue 报 metadata 过期。
- **dshhub.dev** = 另一个站（2,000+ 插件、`/plugins/<owner>-<repo>`、`/submit` 给模板让贴到 Issue/PR），**至今未收录我们**；我按 `/plugins/hxlog-dsh-mcp-tools` 探测 404（404 页正文会回显 URL slug，之前差点把它当命中，已排除）。

**方法学教训（已两次踩到）**：404 页会回显请求 URL 里的 slug，`t.includes("dsh-mcp-tools")` 会假阳性。判定「是否收录」必须同时看三点：①二维是 200 ②页面 `<title>` 带插件名 ③正文里有真实描述或安装命令。dshhub.org 这次三条全中，才算数。

### 6.38 2026-10-23 ZeroPointRepo 列表按格式投稿（PR #27）；dsh.directory 投稿入口失效

**ZeroPointRepo/awesome-dsh-plugins**（「80+ verified」、README 45.6KB、有 4 个 CI：`pr-validate` / `verify-installs` / `link-check` / `entry-health`）—— 之前没扫到，从 dsh-plugin-directory 的搜索里顺出来的。它的 `CONTRIBUTING.md` 写得很细，我们逐条对照后投稿：

- 条目格式：`- **动作短语** with [name](repo) by [author](author). 一句事实描述. N★, LICENSE.` + 折叠 `<details><summary>Install</summary>` 代码块；
- 安装命令必须**从项目自己的 README 抄**（我们用了 README 第 66 行 `dsh plugin --profile web add dsh-mcp-tools`）；
- 验收：能装、仓库可解析且未归档、未重复收录、分类正确；
- 风格：**禁止 em dash**、少 tag、不堆副条目、描述 ~120 字符内。

已提 **[PR #27](https://github.com/ZeroPointRepo/awesome-dsh-plugins/pull/27)**（分类放在 `### Find and manage plugins`，与 `dsh-web-plugin-manager` 同类；正文说明可让维护者移动分类）。

**dsh.directory（10,826 URL）的投稿入口是坏的**：页头 Submit 按钮指向 `https://github.com/alexchenzl/dsh-plugin-directory/issues/new?template=plugin-submission.yml`，但该仓库 404（账号存在、其它 repo 正常，说明该 repo 被删或转私有）。它的目录仍从 `dsh-plugin` topic 自动发现候选，所以等自动重扫即可；如需人工提交得等它修好入口。

### 6.37 2026-10-23 站点域名扫街：dsh.pub 已收录（第 30 个）＋ 9 个新目录站全部未收录（附投稿路径）

**先修正之前的判断**：`dsh.pub` 详情页此前 404 是因为我把 slug 猜成 `hxlog/dsh-mcp-tools`，实际 slug 是 `dsh-mcp-tools`（`https://dsh.pub/en/plugins/dsh-mcp-tools/` 200）。其 `packages/catalog/src/community.generated.json`（**44.9MB**）里已有我们的条目：

```json
"id": "github:hxlog/dsh-mcp-tools", "slug": "dsh-mcp-tools", "version": "1.0.2", "license": "MIT",
"type": "bundle", "category": "client-ui", "provenance": { "status": "community-automated",
  "discoveredVia": "github-topic:dsh-plugin", "analyzedAt": "2026-10-22" },
  "checks": { publicRepository/pinnedCommit/bundleManifest/safeBundlePatch/committedRuntime/committedClient/readme/license: true },
  "method": "automated-static-contract", "status": "verified" }
```

顺带验证了它的投稿闭环：提交 `submissions/<owner>--<repo>.json`（只有 `repository` + `schemaVersion:1` 两个键）→ `plugin-submission.yml` 调 `scripts/process-plugin-submission.mjs` 校验 → **通过即自动 merge**。我按格式提了 [#156](https://github.com/dsh-pub/dsh-pub/pull/156)，CI 返回 `{"code":"already_listed","status":"invalid"}` —— 反而证明「Topic 自动同步已经收录」。PR 已关闭并说明原因。

**域名扫街结果（全部 200 在跑、但 sitemap/详情页都没有我们）**：

| 站点 | 规模（sitemap） | 数据结构 | 投稿路径 | 状态 |
| --- | --- | --- | --- | --- |
| [dsh.directory](https://dsh.directory) | 10,826 URL | `/plugins/<owner>/<repo>` | 页头「Submit Plugin」按钮 | 未收录（自动 topic 发现 + 人工提交，FAQ 说会每 30 天重扫） |
| [deepseek-plugin.org](https://deepseek-plugin.org)（注意与 deepseekplugin.org 不同域） | 13,267 URL | `/plugins/*`、`/collections` | 未发现投稿入口（自动抓） | 未收录 |
| [dsh-plugin.com](https://dsh-plugin.com) | 7,055 URL | `/plugins/<owner>/<repo>` | 未发现投稿入口（自动抓 + `/explore`） | 未收录 |
| [dshplugin.io](https://dshplugin.io) | 7,460 URL | `/plugin/<slug>` | 未发现投稿入口 | 未收录（自报 3,729 个插件） |
| [Ericwong5021/deepseek-plugin-store](https://github.com/Ericwong5021/deepseek-plugin-store)（[deepseekplugin.store](https://deepseekplugin.store)） | 23★ / 1,000+ registry 条目 | 全自动：`plugin-submission` Issue → governance-bot 校验 → 自动开 PR 写 `registry/plugins/<owner>-<repo>.json` | ✅ 已提交 2026-10-23：[Issue #315](https://github.com/Ericwong5021/deepseek-plugin-store/issues/315) 已被标注 `type:submission, gov:approved, gov:pr-open`，机器人开出 [PR #316](https://github.com/Ericwong5021/deepseek-plugin-store/pull/316)（条目含 `verifiedCommitSha: 4c310a6`、`github:hxlog/dsh-mcp-tools`、中英 summary） | 等维护者合并（其 PR 有 `action_required` 工作流待批，10-20/10-22 的几条同类 PR 也仍未合并，属批量审核节奏） |
| [cclank/dsh-plugin-hub](https://github.com/cclank/dsh-plugin-hub)（[dsh.lanshuagent.com](https://dsh.lanshuagent.com)） | 21★ / 655 条在线 registry（`/api/plugins`） | 纯自动：Cloudflare Cron 每 12h 扫 `topic:dsh-plugin` → 候选队列 → 源码/manifest 筛查 → D1；无投稿入口 | 🟡 未收录（`/api/plugins` 与 `plugins.json` 均无 `hxlog`）；其 automation `state: degraded`、`lastSuccessfulRunAt: 2026-10-07` | 只能等其 cron 恢复后自动发现（我们 topic + `dsh.bundle` 均满足其准入前提） |
| [dshlib/dshlib](https://github.com/dshlib/dshlib)（[compliancehub.cn/store](https://compliancehub.cn/store/)） | 0★ / 实验性插件商店（CHA2A L0-L4 认证徽章） | Issue 模板投稿（`Add: <plugin>`）→ 自动验签（npm 官方 hash）+ 自动安全扫描（dshlib-scan + GuardDog 3.2.0 + OSV.dev）→ 1 个工作日内上架 | ✅ 已提交 2026-10-23：[Issue #4](https://github.com/dshlib/dshlib/issues/4)（npm `dsh-mcp-tools@1.0.2` + `github:hxlog/dsh-mcp-tools`、LICENSE、`dsh.bundle`、pinned commit `4c310a6`、安全说明） | 等维护者处理（仓库 8-27 后无提交，站点仍在线；若长期无响应再降级） |
| [coeasy/dsh-go](https://github.com/coeasy/dsh-go)（[dsh-go.pages.dev](https://dsh-go.pages.dev)） | 1★ / 自建 Registry V4（当前仅 2 个包），要求 **Manifest V2 = 仓库根 `dsh-package.json`** + GitHub Release 里的 **Release Descriptor V2**（artifact 只收 `release-archive` tgz + `sha256-` digest） | 发现层自动扫 GitHub（`catalog/plugins.json` 22,435 条**已含我们**，`metadata_source: github`、category mcp）；可安装需 Manifest V2 + release descriptor；人工覆盖可 PR `catalog/overrides.json` | 🟡 已做一半：2026-10-23 已在仓库根加 `dsh-package.json`（对官方 schema 校验 0 错误，commit `f803dea`），并开 [Issue #165](https://github.com/coeasy/dsh-go/issues/165) 咨询 release-archive 规范（npm 优先的插件如何提供 tgz + descriptor） | 等维护者回复后，在下一个版本 tag 上附 `dsh-package-release.json` + tgz，其增量 sync 会自动转正 |
| [dsh-pluginmarket/metadata](https://github.com/dsh-pluginmarket/metadata)（[registry 站点](https://dsh-pluginmarket.github.io/registry/)） | 1★ / DSH Registry：元数据仓库 + 纯静态前端（GitHub Pages 直接读 `entries/*.json`），无 API/数据库 | **Issue 模板投稿**（标题必须以 `Add:` 开头）→ Actions 校验字段并自动生成 `entries/<owner>_<repo>.json` 的 PR → 维护者合并后由默认分支发布 | 🟡 [PR #6812](https://github.com/dsh-pluginmarket/metadata/pull/6812) 已由 bot 生成（`entries/github_hxlog_dsh-mcp-tools.json`，25 行），`validate-submission` **success**、`mergeable_state: clean`。**但该仓库默认分支最后提交停在 2026-08-14，仅 82 条 entries；此后 3,363 个 open PR + 3,363 个 closed-unmerged PR 全部未合并** → 维护方实质停摆，合并概率极低 | 若维护者恢复合并会自动发布；否则不计收录 |
| [dshindex.com](https://dshindex.com) | 8,316 URL | `/plugins/<slug>` | 未发现投稿入口 | 未收录（与 dshindex.dev 不是一回事） |
| [dshplugin.dev](https://dshplugin.dev) | 1,136 仓库 / 740 URL | `/plugins/<owner>-<repo>` | `/submit` 表单（**带 Cloudflare Turnstile**） | 未收录；自动抓取（「Crawled daily from GitHub」） |
| [dshhub.dev](https://dshhub.dev) | 2,000+ 插件 | `/plugins/<owner>-<repo>` | `/submit` 给文案模板，让贴到「Issue 或 PR on this repo」（仓库未公开） | 未收录 |
| [dsharness.io](https://dsharness.io) | 82 精编 | `/en/plugins/<slug>` | 明确「we index what actually exists, not what people submit」 | 未收录（自动索引） |
| [dsh.fish](https://dsh.fish) | 14 URL | 应用型（frontend/backend 仓库） | `/submit` 走 backend API | 未收录 |

**另读到两个对我们有用的「收录标准」**：

1. `dsh-plugins.net` 的 **Evidence Score 评分口径**（不是安全认证）：Source provenance 25（pinned commit / README / license / 声明的包身份）＋ Install documentation 25（可追溯到 README 或 package metadata 的安装命令）＋ Maintenance 20（近期推送、打 tag、未归档）＋ Compatibility 20（**写明具体 DSH 版本 > 只有 profile/platform 声明**；官方 core 包应放 peerDependencies）＋ Security 10（无安装脚本、可识别 license、无高危静态发现）。我们的 README 已写「已在 DSH 0.2.1-rc.2 实机验证」、license MIT、零依赖零脚本、安装命令在 README —— 按这套口径基本是满分结构；其提交方式是「表单生成结构化 markdown → 贴到 DSH Discussions」（提交邮箱 `contact@dsh-plugins.net`）。
2. `dshhub.dev` 的投稿模板要求：plugin name / GitHub URL / 安装命令（`dsh plugin --profile … add`）/ category，并**明确要求 README 有安装命令、有 license** —— 我们都满足。

### 6.36 2026-10-23 移动端精选列表（WSK-build）：收录门槛与本地复现，已提 PR #24

**来源**：npm 包 `dsh-mobile-plugin-catalog` 里读到站点 `https://wsk-build.github.io/awesome-dsh-mobile-plugins`；仓库 `WSK-build/awesome-dsh-mobile-plugins`（1★、CC0、45 条目）是「手机上用起来有意义」的插件精选，**每插件一个 `data/plugins/<owner>__<repo>.yml`**（元数据 only，代码留在作者仓库）。

**收录门槛（读源码核实，比网页说法更细）**：

- 定位：必须有**客户端界面**（侧栏/设置页/悬浮层）或手机上可用的核心能力；纯桌面/纯后端不收 —— 我们属于「设置页 UI」这一类；
- `.yml` 只允许 `url / name / category / description{t.en,zh} / tarball` 五个键（多余键会报错，因为「没有任何代码读它」）；
- `url` 必须 `https://github.com/owner/repo`；`name` 若写成 `owner/repo` 必须与 url 一致；文件名必须是 `slugFor(url)`；
- `category` 必须在 23 个 ID 里（我们选 `tools`）；`description.en` 必填且单行，`: ` 必须加引号；
- 可选 `tarball` 只接受 GitHub Releases 的 `.tgz`；
- **提交闸（pr-gate，需要有 token 的 workflow_run）**：① package.json 任意位置声明 `dsh.bundle`；② 仓库年龄 ≥ `MIN_AGE_DAYS=1`（「时间无法伪造」，已取消 commit 数门槛）；③ 仓库存在且未归档；④ 不是 DSH 本体/官方包拷贝；每个 PR 最多加 3 条。

**已提 [PR #24](https://github.com/WSK-build/awesome-dsh-mobile-plugins/pull/24)**，条目：

```yaml
url: https://github.com/hxlog/dsh-mcp-tools
name: hxlog/dsh-mcp-tools
category: tools
description:
  en: 'MCP tool manager in DSH Settings: add MCP servers, Postman-style request headers, connection test, and per-tool on/off switches — zero dependencies, no install scripts, settings-page UI.'
  zh: 'DSH 设置页里的 MCP 工具管理器：添加 MCP 服务器、Postman 式请求头、连通性测试、逐工具开关。零依赖、无安装脚本，带设置页 UI。'
```

**本地复现（与 `pr-check.yml` 同命令）**：`npm install` → `readEntries()/validateEntries()` = **46 entries, 0 problems**；`node --test scripts/{added-dates,capabilities,adopt-discussions}.test.mjs` = **18/18 pass**；`SKIP_PUBLISH_CHECKS=1 node scripts/build-site.mjs` = 通过。PR 只加一个 yml，不动生成型 README（他们的规则：README 是合并后在 main 上重新生成的）。

### 6.35 2026-10-23 npm 反查第三波：dsh.qomob.ai 已含（第 29 个市场）＋ 两个审计型站点对上了「收录条件」

**新发现 1：dsh.qomob.ai（已收录，第 29 个）** —— 从 npm 包 `@czj-git/dsh-plugin-hub` 的仓库搜索里顺带看到 `qomob/dsh`（homepage `https://dsh.qomob.ai`）。站点是 SPA，详情路由不存在，但 **4.2MB 的 `assets/index-*.js` 里内嵌了全量插件 JSON**，直接命中：

```text
{id:`hxlog/dsh-mcp-tools`, fullName:`hxlog/dsh-mcp-tools`, stars:2, language:`JavaScript`, license:`MIT`,
 topics:[…12 个我们仓库的 topics…], category:`terminal`, score:53, source:`awesome-list`,
 installCmd:`dsh plugin add "github:hxlog/dsh-mcp-tools"`, updatedAt:`2026-10-23T02:34:47Z`}
```

**新发现 2：dsh-plugin-hub.com（echo719）＝「审计大厅」，有明确的 Issue 投稿协议** —— 站点首页写着「40 plugins, four checks each；Pass=四项全绿且权限人工复核、Pending=自动检查通过待人工、Watch=有红旗」，投稿入口是 `https://github.com/echo719/dsh-plugin-hub/issues/new?labels=plugin-submit&title=[Submit] owner/repo`。已按协议提交 **echo719/dsh-plugin-hub#1**，正文含：bundle 声明、`cordis.patch.yml` 顶层数组证据、**权限与数据流逐项自述表**（无自建网络请求/无遥测/无生命周期脚本/零依赖）、本地复现的 CI 命令与输出、DSH 0.2.1-rc.2 实机验证、以及已收录站点清单供交叉核对。

**新发现 3：dshpluginhub.dev（czj-git 的 Plugin Hub，1,673 条已发布插件）** —— `@czj-git/dsh-plugin-hub` npm 客户端的数据源，公开只读 API `GET /api/v1/plugins/search`、`GET /api/v1/plugins/{owner}/{repo}`。实测：`?q=dsh-mcp-tools` → `total: 0`；`/api/v1/plugins/hxlog/dsh-mcp-tools` → 404 `PLUGIN_NOT_FOUND`，即**未收录**。其 `/zh/submit` 是「先检查，再进入插件市场」的候选雷达：只读公开元数据、不执行代码，**提交到候选雷达需要 GitHub 登录**（`submissionLoginRequired`），自动检查分 static / runtime 两档信任（「静态检查通过」vs「已在当前目录版本验证」）。→ 归入**用户手动操作**项（浏览器里用 GitHub 登录后提交）。

**其它扫到但不算市场的**：`aust24lzy/dsh-plugin-hub`（3★，静态导航页 + 浏览器端机翻，数据非独立）、`wingsky-1/dsh-plugin-hub`（29★，是插件合集本体不是市场）、`tiyanziyang/DSH-Plugin-Hub`（已 404 改名）。

### 6.34 2026-10-23 从 DSH 源码确认兼容判定语义：**不要**给 manifest 加 `engines.dsh` / dsh peerDependencies

多个市场（REALOIYO、corvus5536 的 compat 索引、dsh-plugins-mp.com 的 `dsh` 标记等）会从 manifest 推断「支持哪些 DSH 版本」，社区里也有插件用 `engines.dsh` 或 peerDependencies 声明。因此需要先弄清 **DSH 官方插件管理器到底怎么判**，再决定我们的 manifest 要不要加标记。

**证据**（本机 DSH 运行时源码，Electron asar 内）：`…\resources\app.asar\dsh\node_modules\@deepseek-ai\dsh-app-boot\lib\index.js` → `//#region lib/types/plugin-compatibility.js`，函数 `unmetRequirements()` 的逻辑：

```js
// 1) 有 engines.dsh → 只认它（peerDependencies 被忽略）
if (Object.hasOwn(engines, "dsh")) return satisfies(runtimeVersion, engines.dsh) ? {} : { "engines.dsh": range };
// 2) 没有 engines.dsh → 只看 @deepseek-ai/dsh 与 @deepseek-ai/dsh-* 的 peer 范围
if (!Object.hasOwn(fields, "peerDependencies")) return {};   // 3) 两者都没有 → 无要求
```

`evaluatePluginCompatibility()` 在 requirements 为空时直接返回 `undefined`（即**视为兼容、不告警**）；一旦有未满足的要求，则生成 `pluginCompatibilityWarning`，安装会以 `incompatible-version` 被拒，只能靠精确版本豁免（`dsh plugin allow-version`）绕过。源码注释原话：*"An own `engines.dsh` range decides alone and peerDependencies are ignored; otherwise every @deepseek-ai/dsh or @deepseek-ai/dsh-* peer must match."*

**结论（刻意不采纳社区建议）**：

- 我们**不声明** `engines.dsh`，**不声明** `@deepseek-ai/dsh*` 的 peerDependencies —— 于是 DSH 判定为「无要求 → 兼容」，在任意 0.2.x 运行时都能装、不触发豁免流程；
- 若照某些索引要求的写法声明一个具体范围，等于给所有用户的安装加一道**硬闸**（不匹配就装不上），风险远大于「兼容性索引里显示 unknown」的收益；
- 我们的兼容性事实改用**可复核的证据**表达：CI 在 Node 22.x 跑 `node scripts/ci-check.mjs` + `npm test`（10/10）+ `npm pack` 内容断言；PR 里则以「在 DSH 0.2.1-rc.2 的 web profile 实机通过 `dsh plugin --profile web add github:hxlog/dsh-mcp-tools`」为证。

这条也解释了第三方索引的一些「看起来像缺陷」的字段：dsh-plugins-mp.com 给我们 `dsh:false`、`latestVersion:null`，是它自己的推断/缓存，不是我们的 manifest 不合规；DSH 原生安装流程与它无关。

### 6.33 2026-10-23 npm 包反查第二波：dsh-plugins-mp.com（第 28 个市场）+ dshindex.dev 已停更

**方法复述**：批量搜 npm 里「market/registry/catalog/directory」类包 → 下 tarball → gunzip 后正则抽域名 → 与已知域名去重 → 逐新域名探站/探 API。本轮扫了 7 个客户端包，命中 2 个新数据源。

| npm 客户端 | 数据源 | 结论 |
| --- | --- | --- |
| `dsh-plugins-hub@0.2.1`（侧边栏市场 + `mp_search`/`mp_similar`/`mp_detail` 工具） | **`https://dsh-plugins-mp.com/api`** | ✅ 已收录我们（`verificationState: structure_ok`）→ 计入第 28 个市场 |
| `@dshindex/dsh-plugin-marketplace@0.1.0` | `https://dshindex.dev/api/marketplace/v1` | ⚪ 站点可用但 **snapshot.date = 2026-09-04**（7 周前，按 star 排序的 topic 快照），我们 10-21 才发布 → 天然收不到；仓库 `lijma/dsh-plugin-marketplace`，判定低价值，不追 |
| `dsh-plugins-store` / `@99galaxy/dsh-plugin-market` / `@mutocenew/dsh-plugin-catalog` / `dsh-plugin-store-optimized` | 分别指向 dsh-plugin.store、awesome-dsh-plugin feed、topic:dsh-plugin | 均为**已知**数据源，无需重复提交 |
| `hi-dsh` / `@lovstudio/…` / `@ruihuahe/…` / `@starpivot/…` / `dsh-plugin-marketplace` 等 | 无独立数据源（本地/GitHub 提供者或纯 UI 包） | 跳过 |

**dsh-plugins-mp.com 记录字段**（`GET /api/plugins?q=dsh-mcp-tools` 实测）：`slug: hxlog--dsh-mcp-tools`、`sourceType: github`、`npmPackage: dsh-mcp-tools`、`license: MIT`、`primaryLanguage: JavaScript`、`profiles: [web]`、`tags` 取自我们 repo topics、`categories: [tools, models]`、`stars: 2`（其缓存值）。两个可改进点：`dsh: false`（可能其解析未识别 `dsh.bundle`）、`latestVersion: null`（未回填 npm 最新版本）——不影响安装（其卡片直接用 `npmPackage`）。

### 6.32 2026-10-23 从 npm 包反查市场：deepseekplugin.org 自助 API 即时收录成功

**发现路径（新轴：npm 包反查）**：搜 npm 「dsh plugin registry」发现 `dsh-plugins@0.1.2` 与 `dshplugin-registry@0.1.0` 两个「市场客户端」包；解包 `dsh-plugins` 的 tarball（21,648 字节）后从代码里读到其数据源 `https://deepseekplugin.org/registry/v1/catalog.json` —— 顺藤发现 **deepseekplugin.org（DeepSeek Harness 插件目录）**，一个此前完全没扫到的大目录。

**为什么这条轴有效**：市场客户端插件必须把索引地址写进代码或配置，**解 npm tarball 比翻网页更容易拿到真实数据源**。

**deepseekplugin.org 的收录机制（本轮实测）**

- 站点 Next.js，`/submit` 只有一个输入框（`name="repository-url"`，按钮「自动收录」），提示「仅支持公开 GitHub 仓库；通过插件识别后会立即发布」；
- 前端 chunk 里可直接读到接口：`fetch("/api/submissions", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({url})})`；
- 实测 `POST https://deepseekplugin.org/api/submissions {"url":"https://github.com/hxlog/dsh-mcp-tools"}` → **HTTP 201**，返回：

```json
{"ok":true,"state":"published","plugin":{"name":"hxlog/dsh-mcp-tools","slug":"hxlog-2f-dsh-2d-mcp-2d-tools","title":"dsh-mcp-tools","desc":"…MCP 工具管理器…","stars":3,"install":"dsh plugin --profile web add dsh-mcp-tools","installKind":"author","installRequiresBuildApproval":false,"installable":true,"security":{"score":5},"source":"github-submission","detailUrl":"/plugins/submitted?slug=…"}}
```

- 复核：`GET /api/submissions/hxlog-2f-dsh-2d-mcp-2d-tools` → 200 且返回同一条记录；详情页为客户端渲染（`/plugins/submitted?slug=…`）；
- 注意：静态 `registry/v1/catalog.json`（2.67MB）与 sitemap（8,593 条）尚未包含我们 —— 判断为**静态快照按计划重建**，DB 侧已 published；后续例行回归会继续盯这两份产物。

**顺带核清的两个站点**

- **dshplugin.app**（`dshplugin-app/dsh-plugin-registry` 客户端插件的数据源）：sitemap 1,224 条里**没有** `dsh-mcp-tools`，即未被收录；其 `/submit` 页面是 React 表单（`POST` 走 JS server action，静态 POST 只会回显同一页面），**自动化不可行**，需用户浏览器手动提交：<https://dshplugin.app/submit>（字段：GitHub repository URL / 可选 Email / 可选 Notes）；
- **dshplugin-registry / dsh-plugins 两个 npm 客户端**：分别指向 dshplugin.app 与 deepseekplugin.org，均非独立市场，无需单列。

### 6.31 2026-10-23 索引源「爆发期」甄别：新增候选多为镜像/派生，不虚增收录数

**背景**：用 `dsh in:name created:>2026-10-22` / `dsh-plugin in:name created:>2026-10-19` / `dsh market in:name created:>2026-10-18` 扫近 5 天新仓库，发现 **十余个新建 format 1 索引/镜像仓库**（多为 0★、当天新建）。逐个抓其索引 JSON 检索后分类：

| 候选 | 结果 | 处理 |
| --- | --- | --- |
| [corvus5536-eng/dsh-market-compat](https://github.com/corvus5536-eng/dsh-market-compat) | ✅ `index.json`（5.04MB，兼容性过滤派生索引）含我们 | **不计入收录数**：仓库仅一个派生 index.json、无 README/站点/消费说明，非用户可发现的独立市场 |
| [xiaojiu190918/dsh-plugin-index](https://github.com/xiaojiu190918/dsh-plugin-index) | ❌ 主索引 1.38MB / staging 143KB / reviewed 3KB **三份都没有我们**；`data/build-report.json`（186KB）也无 `hxlog` → 未被发现（非被拒） | **不投稿**：README 无公开投稿入口；其发现面为 npm+GitHub 配额制，属对方召回覆盖问题；记录观察 |
| [shwili/dsh-plugin-market-zh](https://github.com/shwili/dsh-plugin-market-zh) | ✗ 该仓库其实是**插件本体**（内含 cordis.patch.yml），不是索引镜像 | 跳过 |
| [zjust7/dsh-plugin-market](https://github.com/zjust7/dsh-plugin-market) / [Sher-ryKarl/dsh-market-index](https://github.com/Sher-ryKarl/dsh-market-index) / [gaoyujia20071214/dsh-plugin-market](https://github.com/gaoyujia20071214/dsh-plugin-market) 等 | ✗ 无 index.json / 未部署 / 0★ 当天新建 | 跳过 |
| [crane-you/dsh-market-index](https://github.com/crane-you/dsh-market-index) | ✗ 仓库内 index.json 仅 2.6KB（自有插件目录） | 跳过 |
| [fuxi-ailabs/dsh-plugin-market](https://github.com/fuxi-ailabs/dsh-plugin-market)（fuxi-ailabs.github.io） | ✗ 1813 字节的 **Fuxi 团队自有目录**（只有自家插件），非开放市场 | 跳过 |
| [DSH-APP/DSHA](https://github.com/DSH-APP/DSHA)（2038★ 安卓 DSH） | `[插件市场收录]` issue 实为其 App 内置目录的**退役补丁**（`retired-market-catalog-patch.json`），不是对外开放投稿 | 跳过 |

**甄别标准（写死，避免虚增）**：只有同时满足 ①**用户可发现**（有站点或公开订阅地址 + 使用说明）、②**独立维护**（不是纯派生/镜像/单文件快照）、③**数据文件内实际含本插件**，才计入「已确认收录」。仅满足 ③ 的派生索引只在核验记录里提一笔。

同时把 README/README.en 的「可复核平台」数从 22 更正为 26（与本文档表一致，新增 realguan / dsplugin.app / hoyyang / XingLingQAQ 四项），并补上这 4 个 format 1 订阅索引的条目。

### 6.30 2026-10-23 又两个投稿型目录：52dsh.com 与 dsh-plugins-hub

**发现方式**：用 issue 标题检索反查投稿型渠道 —— `"Plugin submission" in:title dsh` / `【插件】 dsh in:title`，直接命中各家 `[Plugin submission]` 投稿队列，是目前最省力的渠道发现法。

| 渠道 | 形态 | 我方状态 | 动作 |
| --- | --- | --- | --- |
| [tuofangzhe/dsh-plugins](https://github.com/tuofangzhe/dsh-plugins)（[52dsh.com](https://52dsh.com/plugins)） | `registry/<owner>/<plugin>.yaml` 证据型注册表 + `candidates/` 候选区 + schema 校验 | ❌ 未收录（`registry/hxlog` 404，`candidates/discovered.json` 643KB 内也无我们） | 按其 `plugin-submission.yml` 提交 [issue #15](https://github.com/tuofangzhe/dsh-plugins/issues/15) |
| [TYEclipse/dsh-plugins-hub](https://github.com/TYEclipse/dsh-plugins-hub) | README 精选索引表（install / status / security / trial / checked-at / commit 六列） | ❌ 未收录（README 73KB 无 `dsh-mcp-tools`） | 按其模板提交 [issue #65](https://github.com/TYEclipse/dsh-plugins-hub/issues/65) |

**52dsh 投稿要点**（其 CONTRIBUTING 明确要求）：

- 必须固定 **40 位 commit**（拒绝移动分支作证据）；
- 必须给 **SPDX 许可证 + 证据 URL**；
- 必须写清**权限与数据流**（文件 / 命令 / 网络端点 / 凭据 / 会话数据），且不得声称「清单或源码审查即代表运行时安全」；
- 我们按此逐项填写：只读写 DSH profile 里的 MCP 服务器配置、不写 profile 外文件、自身不执行命令（stdio 服务器由宿主按用户配置拉起）、只连用户显式配置的 MCP 端点（无第三方目录/遥测/更新检查）、凭据仅存于用户自己的 profile 且只发往该服务器。

**dsh-plugins-hub 投稿要点**：其流水线在隔离 profile 里做「安全审查 → 安装 → **一次真实端到端工具调用**」后才收录，是最接近「CI 实机验证」的目录之一；已在 issue 里给出 npm 1.0.2 与 DSH 0.2.1-rc.2 验证边界。

**方法论沉淀**：`"Plugin submission" in:title dsh` 这类**投稿队列反查**比按名字搜仓库命中率高得多——投稿模板标题本身就是渠道清单。

### 6.29 2026-10-23 注册表/索引类渠道批量甄别：3 个已含 + 1 个漏收已报 + 契约核对

**本轮以 `dsh registry in:name` / `dsh marketplace in:name` 批量扒出候选，逐个抓其数据文件核验**（不看首页，直接检索索引 JSON）：

| 仓库/站点 | 性质 | 结果 |
| --- | --- | --- |
| [vbarter/dsh-plugin-registry](https://github.com/vbarter/dsh-plugin-registry)（dsplugin.app） | 社区注册表 + `publish.html` 发布流程 | ✅ **已含**：`data/plugins.json`（25.4MB）内有 `id: hxlog/dsh-mcp-tools`（含中英 description/icon） |
| [hoyyang/dsh-market-index](https://github.com/hoyyang/dsh-market-index) | dsh-store 的市场目录索引（`registry.json` 29.3MB） | ✅ **已含**：定时抓 `#dsh-plugin` 全量仓库 |
| [XingLingQAQ/dsh-plugin-registry](https://github.com/XingLingQAQ/dsh-plugin-registry) | 机器可读目录 `catalog.json`（451KB，每日刷新） | ✅ **已含** |
| [majiayu000/dsh-plugin-registry](https://github.com/majiayu000/dsh-plugin-registry)（[plugin.dshdesk.com](https://plugin.dshdesk.com)） | Harness Registry：`curated`（人工精选）+ `manifest_verified`（topic 自动发现）双可信等级 | ❌ **漏收**，已投稿 |
| automagik-dev/dsh-marketplace / ChasePassion / HYQL 等 0★ 仓库 | 自有插件索引或空壳 | ✗ 非公共目录，不计入 |

**majiayu000（plugin.dshdesk.com）深挖结论**

- 其治理文档（`docs/registry-governance.md`）写的自动收录契约是：**`dsh-plugin` topic + `package.json` 声明有效 `dsh.bundle` + `patch` 为单个安全相对路径或非空列表 + 每个被引用的 patch 文件必须存在且是顶层 YAML 数组**；
- 我方仓库**完全满足**：`dsh.bundle.patch: ./cordis.patch.yml`，且 `cordis.patch.yml` 顶层就是数组（首行 `- insert:`，注释在数组项之前，YAML 仍解析为 list）；
- 但抓 `public/data/registry-audit.json`（3.95MB）全文检索 **`hxlog` 0 命中** —— 说明不是被判 `pending_review`/`quarantined`，而是**发现管道根本没扫到**（覆盖率问题，非我方格式问题）；
- 已按其 `plugin_submission.yml` 模板提交 [issue #88](https://github.com/majiayu000/dsh-plugin-registry/issues/88)（`[Plugin submission]: dsh-mcp-tools`，Request type = New plugin listing），附固定 SHA `6cb6342` 的源码/许可证/README/patch 链接、npm 1.0.2 与 DSH 0.2.1-rc.2 实机验证说明、CI 门禁说明。

**方法论补充**：注册表类渠道的「收录契约」常写在 `docs/*governance*` 或 `CONTRIBUTING` 里，先读契约再投稿，能避免把「覆盖率漏抓」误判成「格式不合规」；本轮的契约核对证明我方格式本就合规，问题只在对方发现管道覆盖。

### 6.28 2026-10-23 新渠道：DSH Registry（dsh-pluginmarket/metadata）——issue 自动生成 PR

**发现路径**：搜 `"dsh-plugin-market-index" in:readme` 时命中 `dsh-pluginmarket/metadata#6252`，顺藤发现 `dsh-pluginmarket` 组织（2 个仓库：`metadata` 元数据源 + `registry` 静态前台）。

**体系结构**

- `dsh-pluginmarket/metadata`：**DSH Registry 的唯一数据源**，`entries/*.json` 共 **82 条**（plugin / skill / preset / theme 四类）；
- `dsh-pluginmarket/registry`：纯静态前端（无 API/数据库），浏览器直接读 metadata 仓库的 `entries/*.json`，部署在 <https://dsh-pluginmarket.github.io/registry/>（2026-10-23 复核 200）；
- 治理：仓库 README 明确「Registry 只发布默认分支的元数据」，合并 PR = 唯一的上架闸门。

**自动化链路（本轮实测跑通）**

1. 按 `.github/ISSUE_TEMPLATE/add-entry.yml` 提交标题以 `Add:` 开头的 issue；
2. `validate-and-pr.yml` 触发 → `scripts/issue-to-entry.mjs` 解析 issue 正文（`### Kind` / `### Name` / `### GitHub repository` / `### npm package` / `### Description` / `### Tags` / `### Submitter GitHub username`）生成 `entries/<id>.json`；
3. `pnpm validate`（`scripts/validate.mjs`：必填字段、kind/source 枚举、tags 字符串数组、github 条目必须 `owner/repo`、id 去重）→ 通过后由 `peter-evans/create-pull-request` 自动开 PR，并回评 issue；
4. 维护者合并 PR 后条目才对外可见。

**已提交**：[metadata#6809](https://github.com/dsh-pluginmarket/metadata/issues/6809)（`Add: hxlog/dsh-mcp-tools`）

- 实测结果：issue 提交后 **workflow 两次 run 均 success**（`issues` 与 `pull_request` 事件各一次），bot 回评「Metadata validated and a pull request was opened」，自动开出 **[PR #6810](https://github.com/dsh-pluginmarket/metadata/pull/6810)**（分支 `metadata/issue-6809`）；
- 生成条目字段：`id: github:hxlog/dsh-mcp-tools`、`kind: plugin`、`source: github`、`sources: [github, npm]`、`githubRepo: hxlog/dsh-mcp-tools`、`npmPackage: dsh-mcp-tools`、`tags: [mcp, tooling, settings]`、`status: active`、`official: false`、`submittedBy: hxlog`；
- 当前状态：PR 待维护者合并；合并后 `https://dsh-pluginmarket.github.io/registry/` 即出现我们的条目。

**意义**：这是**第一个「提交 issue → CI 校验 → 机器人自动开 PR → 维护者合并」全自动闭环**的渠道，与用户关心的「git ci workflow（review）＋PR 流程」完全一致，也验证了该 Registry 侧的门禁是可靠的。

### 6.27 2026-10-23 两个新索引源一正一负：realguan 已含我们 / REALOIYO 召回缺口已报

**① 新确认收录（第 23 个市场）：`realguan/dsh-plugin-market`**

- 形态：第三方 **format 1 索引源**，用户在 DSH「发现 → 添加索引源」订阅；两个等价地址——GitHub Pages `https://realguan.github.io/dsh-plugin-market/dsh-index.json`（约 10 分钟生效）与 jsDelivr `https://cdn.jsdelivr.net/gh/realguan/dsh-plugin-market@dist/dsh-index.json`（最长 12 小时）；
- 规模与更新：**4,562 个插件 / 23 分类 / 10 个能力标签**，每日 **03:17 UTC** 自动重建，索引带中英双语标题描述；
- 核验结果（2026-10-23 抓取 `dsh-index.json` 7,717,658 字节）：条目存在且正确 —— `name=dsh-mcp-tools`、`title=dsh-mcp-tools`、双语 description、`icon` 指向 `cdn.jsdelivr.net/npm/dsh-mcp-tools@1.0.2/icon.svg`、`versions[0]={version:1.0.2, source:{type:npm}}`、`metadata.category=tools`、`metadata.labels=[shell,fs-write,fs-read,network,env]`；**无需任何提交动作**。

**② 同类索引源但漏收：`REALOIYO/dsh-plugin-market`**

- 也是 format 1 索引源（`https://realoiyo.github.io/dsh-plugin-market/index.json`），**7,123 个插件 / 58,629 个版本 / 9.5MB**，每 6 小时重建（UTC 0/6/12/18）；
- 但其线上索引（9,060,175 字节，工作流 2026-10-23T10:55Z success）**全文无 `dsh-mcp-tools`**；
- 而我们的 npm packument 完全合格：`keywords` 含 `dsh-plugin`，`dsh.bundle.patch` 在 1.0.0/1.0.1/1.0.2 三个版本都存在，`dsh.client.platform=web`，仓库可访问；
- 归因：其召回 = `seeds/*.json`（种子）+ `keywords:dsh-plugin` **切片翻页**（a–z / 0–9 / 常见词，每片 250 条上限），低下载量新包容易落在切片召回之外；`seeds/dsh-so.json` 里也没有我们；
- 已提交 [REALOIYO/dsh-plugin-market#1](https://github.com/REALOIYO/dsh-plugin-market/issues/1)：附完整包侧证据 + 复现方式 + 建议补种子（该仓库此前无任何 issue/PR，故先走 issue 询问是否接受 PR）。

**方法论沉淀**：判断「某个索引源是否已收录」不能只看站点首页，要**直接抓它的索引 JSON 检索包名**；索引源类市场的收录动作往往不是 PR/Issue，而是「让你的包满足其召回条件」（关键字、`dsh.bundle` 声明）或「补它的种子名单」。

### 6.26 2026-10-23 新市场发现：DSH Hunt（dshhunt.com）+ 官方投稿表单已提交

**发现路径**：以「投稿类仓库」为线索检索 GitHub（`dsh plugin submissions in:name` / `dsh submissions in:description`），命中 [`DshHunt/community`](https://github.com/DshHunt/community)（org 仅 2 个仓库：community + .github，无源码），官网 <https://dshhunt.com>。

**站点与收录机制**

- 官网 `https://dshhunt.com` 与 `/plugins` 列表页均正常（`/plugins` 页面 HTML 约 251KB），**当前列表中没有 `dsh-mcp-tools`**（未自动收录，需投稿）；
- 社区仓库 `data/plugins/` 目前为空，`schemas/plugin-record.schema.json` 定义插件记录格式，`examples/plugin-record.{full,minimal}.json` 为样例；
- 维护者可经 PR 添加记录，**作者可用公开 Issue 表单投稿**，提供：仓库 URL、bundle path（根目录填 `.`）、npm 包名、安装命令、固定 40 位 commit SHA、插件类型、与项目的关系、许可证、公开证据；
- 其审查语义：`accepted` 只表示维护者已记录提交范围（≠ 站点已变），`published` 才表示页面已上线；「静态分析不是安全审计，收录不是安全背书」；该站**不做运行时兼容测试**，只用固定 revision 的结构证据。

**已提交**：[DshHunt/community#4](https://github.com/DshHunt/community/issues/4)（标题 `[Plugin submission]: hxlog/dsh-mcp-tools`）

按表单字段逐项填写，证据全部钉在固定 revision `6cb6342`（完整 SHA `6cb63420ef1c893cc0fe492e12915c18f5f06dc3`）：

- Bundle Path `.`（`cordis.patch.yml` 在仓库根）、npm `dsh-mcp-tools`、安装命令 `dsh plugin --profile web add dsh-mcp-tools`；
- Category Suggestion `developer-tools`、Plugin Type `DSH plugin`、Maintainer Relationship `Maintainer or owner`、License `MIT`；
- 证据链：`package.json`（`dsh.bundle.patch` / `dsh.client.platform: web` / `engines.node >=22.13` / 零依赖 / 无生命周期脚本）、`cordis.patch.yml`、`lib/index.js`、`client/client.js`、`README.md`、`.github/workflows/ci.yml`、npm registry 元数据（latest 1.0.2）、三个 release 资产；
- 三条确认项均已勾选（信息公开可核验 / 无密钥 / 理解收录非安全背书）。

**意义**：这是本轮新增的第 23 个渠道，且是**目前唯一一个「官方投稿表单 + 固定 revision 证据链」完全匹配我方仓库能力**的市场 —— 我们的 CI 产物清单、bundle 契约、release 资产命名恰好就是它要求的结构证据。

### 6.25 2026-10-23 向 dsh.so 官方投稿队列补交登记（issue #17）+ 查明其投稿/修正通道

**背景**：dsh.so 此前只靠自动抓取收录我们，`/artifact/dsh-mcp-tools/` 的一键安装串停在 `github:...#v1.0.0`（旧 tag）。本轮通过 GitLab 检索发现其完整投稿体系，走官方队列提交了登记 + 版本修正请求。

**发现的投稿体系**

- 投稿表单：<https://www.dsh.so/submit/>（客户端做仓库校验 + 文件安全扫描，然后 `POST /api/submit`，payload 含 `entry` / `repository` / `npmPackage` / `formatPass` / `headCommitSha` / `scan`）；
- 官方 intake 仓库：[`dsh-so/dsh-plugin-submissions`](https://github.com/dsh-so/dsh-plugin-submissions)（GitLab 镜像 `gitlab.com/dsh-so/dsh-plugin-submissions`），说明「通过校验的投稿由后端以 issue 形式归档，作者无需账号」；实测该仓库无文件、只收 issue，已有多个作者手工投稿（#10 明确写「Web 提交端点当前返回 token-invalid，故走此渠道」）；
- 相关配套：[`dsh-so/dsh-plugin-finder`](https://gitlab.com/dsh-so/dsh-plugin-finder)（让 Agent 检索 dsh.so 市场的一键找插件工具）、`dsh-so/dsh-code-security`（扫描器）、`dsh-so/dshvm`（18★）。

**已提交**：[dsh-so/dsh-plugin-submissions#17](https://github.com/dsh-so/dsh-plugin-submissions/issues/17)

内容按已有投稿 #15/#16 的格式（仓库 / npm / 许可证 / 简介 / DSH 兼容 / topic + **建议 registry entry** JSON + **现有条目修正请求**），要点：

- 建议 entry：`id: dsh-mcp-tools`、`category: developer`、`status: unverified`、`declaredCompatibility: ">=0.2.0"`、`verifiedVersions: ["0.2.1-rc.2"]`、`installCommand: dsh plugin --profile web add dsh-mcp-tools`、`topics: [dsh-plugin, dsh, deepseek-harness, mcp]`；
- 修正请求：详情页安装串请从 `#v1.0.0` 刷新到 **1.0.2**（npm latest 与三个 release 资产均已核对），或改用 npm 安装命令；
- 附构建卫生参考：我方 CI 校验 bundle 契约 / 产物清单 / 冒烟 / tarball 必需文件。

**状态**：issue 待维护者处理（该队列历史投稿多为手工跟进；#7 曾以同类 issue 解决「已入库但详情页 404」问题，说明修正是有效路径）。

### 6.24 2026-10-23 PR 反馈巡检（无待处理修改项）+ 新候选渠道甄别 + dshfind 陈旧版本归因

**① 17 个开放 PR 的评论/Review 全量巡检：没有任何维护者提出修改意见**

逐 PR 拉取 `comments`/`reviews`：除 `awesome-deepseekharness#186` 有 curator bot 的「✅ Verified」+ Sourcery `APPROVED` 外，其余 PR 的评论全是我们自己的补充说明（omni#3723、zhu#52、white0dew#21、Alex#162、0xsline#737、beancookie#236、keji#150），**无 CHANGES_REQUESTED、无「请修改」类回复**。即当前「PR 上有不同意或修改的返回」= 空集，格式侧无返工项。

**② 新发现候选渠道逐个甄别（结果：均非可提交对象）**

| 仓库 | 性质 | 结论 |
| --- | --- | --- |
| [NanmiCoder/dsh-plugin-market](https://github.com/NanmiCoder/dsh-plugin-market)（7★） | 自带 catalog 快照的插件市场（npm `@nanmicoder/dsh-plugin-market`） | ✗ 数据停在 **2026-08-16**（`data/v1/meta.json`: count 5908, generatedAt 2026-08-16），已停更；无收录入口 |
| [iasiv5/dsh-m](https://github.com/iasiv5/dsh-m)（9★） | 侧栏插件市场客户端（npm `dsh-m`） | ✗ 自维护 `registry.json` 为作者精选（不含我们），4k+ 社区目录运行时拉取，随上游 feed 继承，无需提交 |
| [Sivan757/dsh-agent-plugins-market](https://github.com/Sivan757/dsh-agent-plugins-market)（14★） | 可自配源的 skills/MCP/LSP 管理器 | ✗ 客户端，不维护公共目录 |
| [sliverp/dsh-hub-plugin](https://github.com/sliverp/dsh-hub-plugin)（18★） | `dsh-plugin` topic 目录浏览器 | ✗ 直接读 topic，我们已带 topic → 已覆盖 |
| [jiji262/awesome-deepseek-harness](https://github.com/jiji262/awesome-deepseek-harness)（16★） | 资源型 awesome 列表（按 ⭐ 精选） | ✗ 选择性榜单，3★ 插件不符合其收录口径 |

**③ dshfind 显示 v1.0.0 的归因（会自动恢复，不需要提 issue）**

- 其 `sync-plugins.yml` 每日 **02:17Z** 同步，`probe:install` 的规则是「新收录 + **超过 7 天未探测**的仓库重探」，并支持 `workflow_dispatch -f only=owner/repo` 强制点名重探；
- 我们是 2026-10-21 首次被收录并探测，当时最新 release 还是 v1.0.0；v1.0.2 发布于 **2026-10-21T09:56Z**（晚于首次探测）；因此页面仍显示 v1.0.0、安装串为 `releases/download/v1.0.0/dsh-mcp-tools-1.0.0.tgz`，属**探测新鲜度机制的预期行为**，约 7 天后自动重探为 1.0.2；
- 已核对我们三个 release 的资产命名均符合其模板 `dsh-mcp-tools-<version>.tgz`（v1.0.0/1.0.1/1.0.2 齐全），故重探时能正确取到 1.0.2。

**④ 官方「发现」页机制确认**

`@deepseek-ai/dsh-plugin-market` 的 `pluginMarket.indexes` 默认 `[]`（用户自行添加索引源），官方 Discover 无内置默认目录；因此「进官方发现页」= 进入可订阅索引（canonical feed 已含我们，bruc3van index 待渲染），这两条链路已分别验证。

### 6.23 2026-10-23 全量 PR 状态复核 + bruc3van 渲染闸口 + 上游 feed 数据核对

**① 17 个开放 PR 全部 `MERGEABLE`（无冲突、无格式残留）**

| 状态 | 数量 | 含义 |
| --- | --- | --- |
| `CLEAN` | 8 | 可直接合并，只等维护者点 merge（Zhiyuan-Fan#96、walkinglabs#121、like-study1#43、xianyu110#126、awesome-deepseekharness#186（已 APPROVED）、cccakeee#38、GordenSun#6、Anil-matcha#13、dshworks#184、radar#968 —— 其中 186 为 APPROVED） |
| `UNSTABLE` | 6 | 分支干净、可合并，但首次贡献者的 workflow 等待维护者点「Approve and run」 |
| `BLOCKED` | 2 | 分支干净，但仓库 ruleset 要求 ≥1 个 approve（omni#3723、zhu#52） |

另：losebird#54 刚推送后处于 `UNKNOWN`（GitHub 重算中），分支内容此前已本地校验通过。结论：**格式层面已无待修项**，剩下全是维护者动作。

**② bruc3van 市场（官方「发现」页可订阅索引）闸口确认**

- 仓库已确认是 [`bruc3van/awesome-dsh-plugin`](https://github.com/bruc3van/awesome-dsh-plugin)（458★，此前记录的 `dsh-marketplace` 已 404 —— 该仓库已改名为现在这个，matrix 引用无需再改）；
- 其对外索引为 **`https://bruc3van.com/dsh-plugins/index.json`**（1.76MB），DSH ≥ 0.2.1-rc.2 可在「发现 → 添加索引源」直接订阅；
- `data/approved.json` 已有 `"hxlog/dsh-mcp-tools": "2026-10-23"`，`data/repositories.json` 也有我们，但 **live index.json 仍无我们的条目** —— 属其 `market.json` 体积上限导致的渲染滞后；
- 其抓取工作流 `update-catalog.yml` cron = **`17 14 * * *`（14:17Z / 22:17 北京）**，最近三次运行均 success（10-22 18:31Z、10-21 18:37Z、10-20 18:27Z，为调度漂移后的实际落点）；下一次运行后需复核 index.json 是否渲染出我们。

**③ 上游 canonical feed 数据核对（权威源）**

`https://awesome-dsh-plugin.com/plugins.json`（7.47MB）中我们的条目：`version: 1.0.2`、`npm: dsh-mcp-tools`、`install: dsh plugin --profile web add dsh-mcp-tools`、`category: tools`、`added: 2026-10-22`、`page` 200 —— **数据正确**（`stars: 2` 为 feed 抓取滞后，GitHub 现为 3）。

**④ dsh.so 的 github 安装串仍钉在 `v1.0.0`（第三方缓存问题，非阻断）**

`https://dsh.so/artifact/dsh-mcp-tools/` 页面同时显示 1.0.2 版本信息，但一键安装命令为 `dsh plugin --profile web add github:hxlog/dsh-mcp-tools#v1.0.0`（钉死旧 tag）；canonical feed 给的 npm 安装串是对的，故这是 dsh.so 自身按「首次抓到的 release tag」生成且未刷新所致。该站未找到公开仓库/反馈入口，暂无法提 issue，记录为已知展示瑕疵（用户若复制该命令会装到 1.0.0）。

### 6.22 2026-10-23 剩余 PR 模板全部对齐（omni / zhu / Alex / beancookie / keji）

### ① `diegosouzapw/awesome-omni-dsh-plugins#3723` —— 16 字段「Plugin scope and source」清单

按模板逐项填全（此前只有 Summary）：Plugin ID `hxlog-dsh-mcp-tools`、专用分支 `add-hxlog-dsh-mcp-tools`（单插件/单文件）、submission type `creator`、node ID `R_kgDOVRrk5w`、**source commit 40 位** `65fc43897fec7d66d19053e21012e789dbb36dc6`、subpath `null`（仓库根插件）、kind/primaryCategory/tags、描述证据路径 `README.en.md`、SPDX 证据 `LICENSE`、精确版本包 `dsh-mcp-tools@1.0.2` + sha512 integrity、DSH 集成证据 `cordis.patch.yml`、smoke `not run`（对应 `eligible` + `smokeTest: null`）、star 证据（exact-repository，3★）、碰撞检索结果（代码检索无其他条目引用该仓库；开放 PR 检索只有本 PR）、creator PR 故 creator-mention 字段 N/A；Checklist 全部 `[x]`；结尾保留其官方免责声明。另外把 catalog yaml 的 `popularity.stars` 从 2 更新为 3 并重跑其本地校验：`node cli/dist/bin.js catalog validate --catalog .` → `3627 entries valid`。

### ② `zhu1090093659/dsh-community-plugins#52` —— Index checklist

补齐 What / Plugin（仓库 URL + 描述 + **依赖与已知限制**：零运行时依赖、DSH 0.2.x + Node ≥ 22.13、请求头明文存本地 state.json 的限制）/ Index checklist（四项逐个回应）/ Verification（命令与输出）。其中模板提到「next free `rank`」但当前 `community.json` 实际**没有 `rank` 字段**（全文 0 次出现），故如实说明「本条目按数组顺序追加为第 144 条，十个必填字段齐全」。

### ③ `Alex-Yanggg/awesome-DSH-plugin#162` —— Plugin submission checklist

五项勾选；并在本地实跑其校验器：`python scripts/generate_readmes.py --check` → **`Catalog is valid and generated pages are current.`**

### ④ `beancookie/awesome-dsh-plugin#236` —— 提交前快速自查

四项必查（`dsh.bundle` 声明、双 README 各一行、描述无营销词、`dsh-plugin` topic）+ 推荐项（已发 npm 且预构建免 `allowBuilds`；零 deps、经 `dsh.inject` 与官方包协作，故无需 peerDependencies）。

### ⑤ `kejixiaoliang/awesome-dsh-plugins#150` —— 提交前逐项确认 + 变更类型

四项确认（未重复：同类目已有他人的 `dsh-mcp-manager` 但为不同仓库/实现；分类符合 taxonomy；一句话说明；公开仓库）+ 变更类型勾「新增插件」+ 说明。

至此**所有带 PR 模板的目标仓库，其 PR 正文均已按各自模板填写**。

### 6.21 2026-10-23 发现并修正「PR 模板」类格式问题（radar #968 / white0dew #21）

检查 17 个目标仓库的 `.github/` 后，发现有 **6 个仓库带 PR 模板**（`PULL_REQUEST_TEMPLATE.md` / `pull_request_template.md`），其中两个我们此前的 PR 未按模板填写，已修正：

**AdamPlatin123/dsh-plugin-radar#968**（模板强制标题 `docs: 登记 <插件名>`，正文含「插件信息」表 + 自检清单 + 改动内容表）

- 标题由 `Register dsh-mcp-tools in single-plugin list` → **`docs: 登记 dsh-mcp-tools`**；
- 正文按模板重写：插件信息表（含**分类**字段）、自检清单逐项、自检结果（打包内容校验 / `npm test` 10/10 / DSH 0.2.1-rc.2 实机运行）、改动内容表、备注；
- 分类用其自带预归类器实测：`scripts/classify.py` → **🛠 基建部署**（命中 `mcp`），与 `docs/CATALOGING.md` 边界「MCP/模型接入 → 基建部署」一致；为此把行描述里的「连通性测试」改为「连通性检查（initialize → tools/list…）」，避免误命中「测试」被判成 💻 编码开发；
- 行内多余空行清掉（diff 变为纯 1 行增删）；`maintainerCanModify = true` 已在清单勾选。

**white0dew/awesome-dsh-plugins#21**（`CONTRIBUTING.md` 的 listing policy 明文规定安装命令必须为 `dsh plugin --profile web add github:owner/repo`；PR 模板要求 Summary / Listing checks / Local checks 三段）

- 数据源 `data/sources/reviewed-catalog-additions.json` 里 `primaryAction.command` 由 `... add dsh-mcp-tools` 改为 **`... add github:hxlog/dsh-mcp-tools`**（对齐其 listing policy），`stars` 同步为 3；
- 分支 **rebase 到最新 main** 后重跑 `node scripts/generate-content.mjs`（10777 plugins）与 `node scripts/validate-content.mjs`（exit 0），diff 收敛为 10 个文件（1 条数据 + 重新生成产物 + 两处硬编码计数断言 `records.length`/`expectedPluginCount`/唯一仓库数，均只改数字）；
- 顺手清掉误提交的临时脚本，分支只剩一个干净 commit；
- 正文改成模板三段 + 备注（说明脚本改动仅为计数、安装命令按 policy 用 `github:` 形式、如需 npm 形式可调整、lint/build 未在本地跑）。

**仍待按模板复核的 4 个**（下轮处理）：`diegosouzapw/awesome-omni-dsh-plugins#3723`（模板是 16 字段的「Plugin scope and source」清单，我们目前只有 Summary）、`zhu1090093659/dsh-community-plugins#52`（Index checklist）、`Alex-Yanggg/awesome-DSH-plugin#162`、`beancookie/awesome-dsh-plugin#236`、`kejixiaoliang/awesome-dsh-plugins#150`（后三者模板较短，补 checklist 段落即可）。

### 6.20 2026-10-23 两个 PR 的格式复核（Zhiyuan-Fan #96 / Oh-My-DSH #43）

**Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins#96**（558★）：该仓库**没有** `.github/workflows`（API 404）、也没有 CONTRIBUTING，只有 `README.md` + `README.zh-CN.md`；PR 正好各改一份（`add-dsh-mcp-tools` 分支，`mergeStateStatus = CLEAN`），只能靠人工看排版。已按仓库既有条目风格：放在 Tools & Skills 末尾、单行、含仓库链接与一句话定位，`Closes #94`。无更多可机器校验的规则。

**like-study1/Oh-My-DSH#43**（96★，4 小时同步）：按它 CONTRIBUTING 的两条路径——①给仓库打 `dsh-plugin` topic 由自动同步初筛（我们已打）②改唯一手改文件 `data/curated.json`。实测我们的 PR 分支：

- `data/curated.json` **可解析**（338 个 overrides），我们的键位于 idx 128，`prev: dsh-loop`、`next: dsh-memory-evolve`，位置符合该文件的编排；
- 字段与 CONTRIBUTING 示例一致：`repo`、`category: devtools`（属于其 11 个合法分类）、`note` 一句话中文、`keep: true`（强制收录）；
- 该仓库的 `sync-plugins.yml` 只在 `push main` 与 4 小时 cron 触发（无 PR 校验 job），合并后由脚本重生成 `PLUGINS.md`/`data/plugins.json`。

两个 PR 均无格式问题，等待人工合并。

### 6.19 2026-10-23 dshworks PR #184 按 CONTRIBUTING 逐条复核（含本地跑其校验器）

dshworks 的 CONTRIBUTING 明确「注册表是 JSON，不是 README；所有贡献都是对 `data/plugins.json` 的 PR，README 由脚本再生」，并要求 `node scripts/validate.mjs` + `node scripts/render.mjs` 后同时提交数据与渲染产物。

复核方式：clone 我们的 fork 分支 `hxlog/awesome-dsh-plugins-1@add-dsh-mcp-tools` 跑其校验器（而非只看 CI 绿）：

```text
$ node scripts/validate.mjs
validate: ok (20770 plugins, 79 candidates, 3172 rejected, 6448 npm names, 890 unpublished)
$ node scripts/render.mjs
render: wrote README.md + docs artifacts (20770 entries)
```

- 条目字段齐全：`name`/`repo`/`description`（中文）/`stars`/`starsUpdated`/`pushedAt` 等，与 schema 一致；本地校验 **ok**。
- PR 已含渲染产物（README.md、docs/index.html、docs/plugins-embed.js、docs/plugins.json、docs/stats.json、lists/bundles.md），符合「同时提交」要求。
- PR CI：`check = pass / success`（run 39930227653），`mergeStateStatus = CLEAN`。
- 已知无害差异：分支落后上游 `main` 约 204KB 新增条目（`data/plugins.json` 13.20MB vs 上游 13.40MB），但**不影响**其 validate/render CI（已实测通过）；合并时由上游 squash 处理，无需强推重建。
- 目前 dshworks 的 `data/plugins.json` 尚未含我们（PR 未合并），与其上表「待审」状态一致。

结论：格式与门禁均已符合，**唯一等待项是人工 merge**。

### 6.18 2026-10-23 新发现：dsh-plgstore（每日 13:00 聚合，当前有滞后）

经 GitHub topic 搜索（`topic:dsh-plugin-market`）发现 `YureWright/dsh-plgstore`（1★，「给 DSH 用的插件商城」，站点 `yurewright.github.io/dsh-plgstore`，2,521 条，每日 13:00 自动更新 + 每日日报）：

- 采集：GitHub + npm 多路聚合、实体去重，**只收有官方声明/依赖 DSH 核心的插件**（我们的 `dsh.bundle.patch` + npm 同名包完全符合）；
- 每条附 AI「体检报告」并分三档（放心用/留个心眼/别急着装），另提供 npm / git 两种安装口令；
- **当前未收录**：`data/plugins.json`（2.7MB，`updatedAt` 最新 2026-10-23T09:52Z）不含 `hxlog/dsh-mcp-tools`；抽查 `oil-oil/dsh-oil-ui`（137★，10-23 建仓）同样缺席 → 说明其扫描对「新仓」有系统性滞后，不是我们的条件问题。

结论：**无需提交**，等其每日 13:00 轮次；已列入待观察。

### 6.17 2026-10-23 补上仓库自身 CI（提升各市场自动评分/人工复核可信度）

发现本仓库**此前没有任何 GitHub Actions workflow**。而多个渠道的质量判据会看「构建卫生/门禁」：`dsh-plugin-certification` 的维度 B 明确检查 *lint/typecheck gates present*、`dshfind` 有质量评分、dsh.store 有安全扫描、人工 reviewer 也会看插件仓健康度。无 CI 是一个可修的真实短板。

已新增（零依赖、约 20 行 YAML + 一个纯 node 校验脚本）：

- `.github/workflows/ci.yml`：`push`/`PR`/手动触发，Node 22.x，三步——
  1. `node scripts/ci-check.mjs`：校验 `dsh.bundle.patch` 声明且文件存在、`dsh.client.platform=web`、`engines.node` 存在、**无 lifecycle 脚本**、**无 runtime/optional/bundled 依赖**、`files[]` 每项都存在、`client/client.js` 可被 `vm.Script` 解析；
  2. `npm test`（10 项 smoke）；
  3. `npm pack --dry-run --json` 断言 tarball 必含 `cordis.patch.yml`、`lib/index.js`、`client/client.js`、`icon.svg`、README、LICENSE（防止 `files` 白名单回归把运行时文件漏掉）。
- `package.json` 增加 `ci-check` 脚本；README 中英各加 CI 徽章。

首次运行结果：**success**（commit `fa0d99d`，run 2026-10-23T10:58Z）。这正是把「我们满足各市场 bundle/依赖/无 postinstall 要求」从文字自证变成**每次提交自动复验**。

### 6.16 2026-10-23 1024 目录数据修正请求（issue #678）

发现：`deepseek1024.com` 上我们的条目 `install` 被生成为 `dsh plugin --profile web add github:hxlog/dsh-mcp-tools`、`installMethods[0].kind = github`、`verification = unknown` —— 而其 CONTRIBUTING 明确写「1024 Store **只从 npm 安装**，manifest 的包发布到 npm 且带 `dsh.bundle` 声明后，目录会自动检测并给出 npm 安装命令」。同类条目（`perrylink/dsh-memento`、`dsh-github`、`dsh-auto-review`）均为 `kind: npm` + `verification: verified`。

反证我们满足条件：npm `dsh-mcp-tools@1.0.2`（10-21 发布）、`repository.url` 与 id 一致、tarball 内 `dsh.bundle.patch: ./cordis.patch.yml` 且文件存在（实装验证过）、MIT、零依赖、无 lifecycle、`engines.node >=22.13`、`dsh-plugin` topic 已打。

已开 issue **#678**（`[Catalog data] hxlog/dsh-mcp-tools: install falls back to github: though npm dsh-mcp-tools@1.0.2 declares dsh.bundle`），附三例对照与证据表，请其重跑 npm 检测，并请指出若缺某个 npm 侧信号我们会补。属数据修正，非重复投稿。

### 6.15 2026-10-23 合并落地复核（merge → listing 闭环）

已合并的 4 个 PR 逐一回到目标仓库复核「条目真的落了地」，避免「PR 显示 merged 但数据未生效」：

| 目标 | 复核证据 |
| --- | --- |
| `awesome-dsh-plugin/awesome-dsh-plugin` | 条目文件 `data/plugins/hxlog__dsh-mcp-tools.yml` 存在；站点详情页 `/p/hxlog/dsh-mcp-tools/` 200 |
| `imsai-sh/awesome-deepseek-harness-plugins` | `catalog/plugins/hxlog--dsh-mcp-tools.json` 存在；线上 `GET /api/v1/plugins/hxlog/dsh-mcp-tools` 返回条目 |
| `vvlife/awesome-deepseek-harness-plugins` | `README.md` 含 `[hxlog/dsh-mcp-tools]` 行（含 ★2 与描述） |
| `Dominic789654/awesome-deepseek-harness` | `README.md`（1.68MB）MCP Servers 分区含 `[hxlog/dsh-mcp-tools]` 行 |
| `awesome-deepseekharness/awesome-deepseek-harness` | 仍 **MISS**（PR #186 reviewDecision=APPROVED，等维护者点 merge，非数据问题） |

### 6.14 2026-10-23 新发现：dshfind.com（topic 全量自动同步，含质量分）

线索来自 `PerryLink/dsh-plugin-doctor` 的 `OUTREACH.md` §F——其中点名「`dshfind` / `dsh.market` / `dsh.directory` 各有提交规则，提交前先读 contributing」。沿此核验 `dshfind.com`：

- 站点自述「收录 GitHub 上**全部** `dsh-plugin` 主题仓库，每日同步 star、增长与质量评分」，四语言（中/EN/日/韩）。
- 我们的详情页 `/zh/plugins/hxlog/dsh-mcp-tools` **200**：分类「工具集成」、star 与近 7 天增长、语言、更新日期均展示；本仓库当前 2★（页面 +2 增长）。
- 安装命令由其探测的 GitHub Release `.tgz` 资产推导（当前显示 v1.0.0，是抓取缓存；我们 `v1.0.2` Release 已含 `dsh-mcp-tools-1.0.2.tgz`，下次同步即更新）。
- 提供可嵌入 README 的 `api/badge` 与 `api/card`，属自愿曝光，不强制。

结论：**自动收录，无需提交**；已计入已确认收录。

### 6.13 2026-10-23 新发现：dsh.directory（提交入口已失效，只能等自动爬取）

线索来自 `PerryLink/dsh-plugin-doctor` 的 `OUTREACH-dsh-directory-submissions.md`（该文档记录了 9-23 向 dsh.directory 批量提交 44 个包、#276–#319 的经过，并附提交机制说明）。核验结果：

- 站点在线：`sitemap.xml` 10,826 条 loc，其中 10,773 个 `/plugins/...` 页、15 个分类；站点声明「按 default-branch HEAD 校验 DSH bundle 契约，只展示声明仓库包」，不做打分/排序。
- 我们**未被收录**：`/plugins/hxlog/dsh-mcp-tools` → 404。
- **提交链路已断**：站点 `Submit ↗` 指向 `https://github.com/alexchenzl/dsh-plugin-directory/issues/new?template=plugin-submission.yml`，但该仓库 API 与网页均 404（仓库已删除/转私有），表单打不开。
- 爬取为选择性/疑似停滞：抽查 `Rosynb666/dsh-whale-catch` 有页（200），而高星新插件 `oil-oil/dsh-oil-ui`、`AtinyFurina/dsh-prompt-layer` 均 404。

结论：**无可用提交动作**，标记为待观察（若其数据源改为同步 awesome feed，10-22 之后应能进入）。已排除，不重复投入。

### 6.12 2026-10-23 新发现：dsh-plugin-hub 聚合站（每小时刷新）

通过 GitHub repo 搜索（`dsh in:name (market|store|index|directory|catalog) pushed:>2026-10-18`，按 updated 排序）发现 `helloHupc/dsh-plugin-hub`（22★，站点 dsh-plugin-hub.hupc.site，**每小时刷新**）。其 `data/plugins.json`（16.0MB）已含我们的条目：`id: hxlog/dsh-mcp-tools`、`status: verified`、`license: MIT`、`sources: [github_topic, dshworks]`、`category: tools`。自动收录，无需提交。

### 6.11 2026-10-23 新发现：UntR registry-backed 市场（自动 crawl）

通过 npm 搜索 `dsh-marketplace` 类关键词发现 `untr-dsh-marketplace`（repo `UntR/dsh-plugin-marketplace`，1★，8 月建仓、10-23 仍在更新）。它是**自带 registry 数据的市场**：`dsh-plugin-registry/registry/v1/index.json`（33.2MB）+ 每插件明细 JSON，由 GitHub topic 自动 crawl + enrich。

我们的明细已生成（`plugins/1427825895.json`）：bundle 探测通过（`cordis.patch.yml` 存在）、npm 安装规格 `dsh-mcp-tools@1.0.2`、`repositoryMatches=true`、`requiresBuildApproval=false`、MIT、12 个 topics 全部识别。**无需任何提交动作**。

方法论：`npm search`/registry search 用 `dsh-marketplace`、`dsh store plugin`、`dsh-plugin-index` 等词，可挖出尚未进矩阵的 registry-backed 市场；比 GitHub topic 搜索更早发现新市场。

### 6.10 2026-10-23 多渠道在线复核（第 2 批）

| 渠道 | 复核结果 |
| --- | --- |
| bradeGithub `registry.json` | ✅ 19,244,496 字节，含 `dsh-mcp-tools` |
| dsh.so `/artifact/dsh-mcp-tools/` | ✅ 200，页面含本插件（L5 / Verification） |
| dsh-plugin.store `/p/hxlog/dsh-mcp-tools` | ✅ 200，页面含本插件 |
| LivXue registry `first-seen.yml` | ✅ 含 `dsh-mcp-tools`（added 2026-10-21） |
| LivXue GitHub Pages | ❌ 已 404（项目已改为 host 插件 + registry 数据仓，矩阵链接已更正） |

### 6.62 2026-10-23 `YureWright/dsh-plgstore`：GitHub 候选缓存冻结在 8 月中旬（已开 Issue #1 报 bug，非投稿）

**`YureWright/dsh-plgstore`**（★1，[站点](https://yurewright.github.io/dsh-plgstore/)，2,521 条、每天 13:00 自动更新、带 AI「体检报告」与三档信任分级）：菜单里**不含我们**。逆向其流水线后定位到根因——不是我们的格式问题，是对方 GitHub 侧缓存冻结：

- `data/plugins.json`：2,179 条 GitHub 来源记录，`github.pushedAt` **最大值 = 2026-08-16T14:14:40Z**；9/10 月新增的 526 条 `firstSeen` 全部来自 npm 侧合并进已有 GitHub 记录
- `daily.yml` 每天只跑 `npm-scan --phase discover`（npm search 每查询词只取前 250 条）+ `--phase llm` + `process-github-candidates.mjs`；而后者只读 `data/cache/github-candidates.json`（由 `build-index.mjs --discover-only` 生成），**日常流水线没有重新生成它** → 8 月之后新建/活跃的 `dsh-plugin` 仓库永远进不来
- 能过其 `entryCheck()`：我们有 `dsh.bundle.patch` + `dsh.client` 声明；npm `dsh-mcp-tools@1.0.2` 有 `keywords: dsh-plugin` 与 `repository` 字段；同类 MCP 管理器 `hyqhyq3/dsh-mcp-manager`（08-15 pushed）在 8 月缓存里，所以被收录

已开 [Issue #1](https://github.com/YureWright/dsh-plgstore/issues/1) 作为**可复现的缓存 bug 报告**（附逐月 firstSeen 分布与 max pushedAt 证据、建议在 `process-github-candidates` 前补一步 GitHub 候选重爬），并注明若为有意冻结则把本条记作已知限制。该市场无 CONTRIBUTING/PR 通道，Issue 是唯一反馈方式。

**教训（适用于所有 npm/GitHub 自动聚合站）**：判断「为什么没收录」时先看对方**数据新鲜度**（`pushedAt`/`firstSeen` 分布）与**候选基数上限**，而不是先怀疑自己的 manifest 格式；本轮 Topic 扫描（`dsh-market`/`dsh-marketplace`/`dsh-plugin-market`）新出现的 47 个仓库里，其余为客户端/竞品/skill，不构成新市场。

### 6.63 2026-10-23 新抓 12 个 DSH 目录站：2 个有明确投稿通道已提交；其余为 star 截断型

用 `in:name,description` 搜 `dsh plugin market/registry/index/directory/catalog/store` 再逐个查数据文件是否含 `hxlog/dsh-mcp-tools`，得到 12 个此前未记录的站：

**已提交（有官方 Issue 模板，不靠 PR）**
- **`majiayu000/dsh-plugin-registry`**（★3，[plugin.dshdesk.com](https://plugin.dshdesk.com)，「Harness Registry」：curated + GitHub topic 自动发现 + `dsh.bundle` 清单校验 + 可复制安装命令）→ 按其 `.github/ISSUE_TEMPLATE/plugin_submission.yml` 提交 [Issue #91](https://github.com/majiayu000/dsh-plugin-registry/issues/91)（选了「New plugin listing」、勾满 4 条 checklist、附 pinned tag/npm/descriptor 证据）。
- **`TYEclipse/dsh-plugins-hub`**（★2，独立 curated 目录，投稿后在隔离 profile 里做「安全审查 → 安装 → 一次真实端到端工具调用」再入索引）→ 按其模板提交 [Issue #66](https://github.com/TYEclipse/dsh-plugins-hub/issues/66)（name/repo/release `v1.0.2`/MIT/install `dsh plugin --profile web add github:hxlog/dsh-mcp-tools#v1.0.2` + 验证边界说明）。

**未提交（自动聚合 + star 截断，提交无意义）**
- **`whyihaveyou/dsh-suite`**（★63，「活目录」2,105 条、每小时刷新 + 每日兼容实测，站点 whyihaveyou.github.io/dsh-suite）：`scripts/discover-plugins.mjs` 拉 `topic:dsh-plugin` **按 stars 降序最多 15 页 = 1500 个仓库**，3★ 天然在截断外；其 `data/install-audit.json`/`compat-report.json`/`compat-installed.json` 里均无我们（即根本没被发现，不是兼容失败）。
- **`dsh-plugin/dsh-plugin.github.io`**（★2，401 个文件含 `data/plugins.json` + 每插件 SEO 页，`sync-plugins.yml` 每 6h）：同步源同样是 topic 快照，未见我们。
- **`zhushaochun/dsh-plugin-index`**（★0，`index.json` 2,608 条 format-1 索引，**已含我们**）：由 awesome-* 列表派生，属镜像类，按既有规则不重复计数。
- 其余为客户端/工具/极低星原型：`wink-run/dsh-plugin-store`（★3）、`Luaphes/dsh-plugins-market`（★3，实为插件 `lib/index.js`）、`yang051211/dsh-plugin-store`（★0，人工审核型、`catalog/scan/*.json` 逐插件扫描，后续可作投稿备选）、`oa1mgo/dshplugin`、`majiayu000` 之外的 `439436269-ctrl/dsh-preview-market`、`majiayu000` 同级 `f0909172434/stellvyr/doraasn/yansuui/2759069519` 等 format-1 微索引（0★，无站点/无投稿通道）。

**经验**：本轮 12 个站里 9 个是「按 star 排序取 topic Top-N」的截断型聚合——3★ 项目在 1,500~25,000 条量级的目录里几乎不可能被自动发现；有官方 Issue 模板的站（majiayu000、TYEclipse）才是当前可推进的增量。

### 6.64 2026-10-23 复盘：2 个「已收录但我们漏算」的站（42nd / 43rd），以及一次及时止损的错误 PR

**42nd `TheYoungChen/dsh-plugin-market`**（★4，插件市场 bundle 插件：侧栏入口 + 设置内「插件市场」标签页，分页浏览 `topic:dsh-plugin` 全部插件、搜索、一键安装/更新、安装进度可终止）：`registry.json`（1.37MB，GitHub Action 每 2 小时生成、jsDelivr CDN 分发）已含本仓库条目 `type: plugin`、`stars: 3`、`updatedAt 2026-10-23T14:30:52Z`。属自动聚合型市场，无需提交。

**43rd `DPH-1121/dsh-plugins`**（★3，DSH 插件「搜集面板」：采集 GitHub 上 DSH 插件仓库并展示描述/作者/star，安装交给官方「从 GitHub 安装插件」；每 6h 采集、`catalog/index.json` 15,278 条）：索引中本仓库 `firstSeenAt 2026-10-22T01:20:18Z`，`sources: [github-repo, github-search, public-index, seed]`。**早在 10-22 就已收录**（经 public-index 源），我们此前漏算。

**本轮教训（重要，避免重复劳动）**：
1. 我按「数据文件大小 < 6~12MB」过滤后判断「不含我们」，导致 13MB 的 `catalog/index.json`、以及把数据内嵌在 JS（`assets/*.js`）里的站被误判为 false negative。**正确做法**：先看对方站点实际请求的数据端点（/index.json、/registry.json、/api/*），或对候选文件不设大小上限地抓取 grep；判断完再决定是否投稿。
2. 因此本轮一度给 `DPH-1121/dsh-plugins` 提了「加 `catalog/seed.json` include」的改动并跑了完整采集（15,278 条、527.9s），随后核对 `git show HEAD:catalog/index.json` 发现**我们本来就在索引里** → 立即 `git checkout -- .` 放弃该改动，避免给维护者送一份「无意义 + 821 条数据刷新」的噪音 PR。**投稿前先确认「你现在真的没被收录」**。

**仍未收录但有明确投稿通道（下一批候选）**：
- `oa1mgo/dshplugin`（★0，community discovery/verification registry，有 `.github/ISSUE_TEMPLATE/plugin.yml`）
- `iasiv5/dsh-m`（★9，市场插件 + `registry.json`，有 `registry.yml` 校验 workflow）
- `zjust7/dsh-plugin-market`（★1，带安全检测的市场，`data/reviews.json`）

### 6.65 2026-10-23 深夜：两个「curated registry」投稿（Issue + PR），都按对方 CI 本地预跑过

**① `iasiv5/dsh-m` → [PR #5](https://github.com/iasiv5/dsh-m/pull/5)**（★9，npm `dsh-m` 市场插件，`registry.json` 20 条 curated 清单 + `registry.yml` 五道 CI：build / typecheck / test / `validate-registry.mjs` / `npm pack` 断言）
- 条目类型：**第三方 `watchlist`**（与 dsh-mermaid / dsh-server-deck / ds-bot 同形），**不填 `verified`、不写「已适配」句式**（没实测全代际就不做兼容声明，符合对方 `docs/registry-copy-guide.md` §6「三方只做结构统一」）
- description 当量 **36.0 ≤ 60**、tags 3 个无依赖词、无全角括号尾巴 → `validate-registry.mjs` 零 warn
- **本地预跑对方 CI**：`npm ci` ✅ → `npm run build` ✅ → `node scripts/validate-registry.mjs` ✅（`✓ [dsh-mcp-tools] npm 包存在 / GitHub 仓库存在 / homepage 可达`）→ `node --test tests/registry.test.mjs` 78 pass/0 fail；并把该测试里的收录条数断言 20 → 21 一并提交（否则 CI 必挂）
- 全量 `npm test` 在 Windows 本地有 `symlink EPERM`、doctor 读本机 DSH 等**与本改动无关**的环境失败；Ubuntu CI 上应绿

**② `oa1mgo/dshplugin` → [Issue #12](https://github.com/oa1mgo/dshplugin/issues/12)**（community discovery/verification registry，`.github/ISSUE_TEMPLATE/plugin.yml` 投稿模板）
- 按模板填：canonical repo / name / type=Plugin / 功能描述 / 勾满 3 条 check；附 npm·Release·Manifest V2 证据链接

**方法论补充**：curated 型（人工清单）市场的正确姿势是「**先把对方 CI 在本地跑通再提 PR**」，尤其注意对方测试里写死的条目数断言（本轮 `21 !== 20` 就是它）；自动聚合型市场不需要提交。

### 6.66 2026-10-23 深夜：`review.lingshulab.com`（DSH 插件评测目录）—— 收录需 OAuth 登录，转为用户操作项；`zjust7` 市场确认为上游数据**已覆盖**

**新市场 `review.lingshulab.com`**（标题「DSH 插件评测」，即 `zjust7/dsh-plugin-market` 评测数据的上游）
- 形态：插件目录 + 社区评测（Next.js 站，`/plugins` 可搜索/分类/按评测筛选，`/reviews`、`/spec`），当前**仅 35 个插件**，人工/评测驱动，不是 topic 海量聚合。
- 我们**未收录**：`/plugins?q=dsh-mcp` 结果中 `dsh-mcp-tools` 出现 0 次（只有查询串回显）。
- 投稿通道：`/plugins/new`「提交插件」，表单只要求一个 **GitHub 仓库链接**；页面明示检查要求「仓库可访问、`package.json` 声明 `dsh.bundle`、且引用的配置文件存在」——**三条我们都满足**。
- **阻塞点**：`/plugins/new` 提示「提交插件需要登录。请使用页面顶部的登录入口」，登录走 GitHub OAuth（浏览器内完成）→ 属**用户操作项**，无法由脚本代提。
- 站点源码仓：`furongjun-lingshu/dsh-plugin-reviews`（★1，web + worker + **`deploy/discovery-drip.sh` 定时滴灌式自动发现**）+ 规范仓 `FuRongJun-1999/dsh-bench`（`/spec` 指向其插件评测站方案 v3.0）。即该目录除人工提交外还有自动发现 worker，3★ 新仓库可能被后续滴灌扫到；无需额外动作，隔天复查即可。

**`zjust7/dsh-plugin-market`（★1，带独立测评/安全红线的市场插件）→ 判定为「上游数据已覆盖」**
- 其 README「数据来源与新鲜度」写明：**插件目录 = `awesome-dsh-plugin.com/plugins.json`**（上游每天重建）—— 该 feed 已包含我们（PR #8407 已合并），所以这个市场的「精选目录」里我们已经可见；它额外展示的「测评判定」来自 lingshulab 快照，属可选增强，不构成独立收录计数。
- 结论：不单列计数，不投稿。

**用户操作项（累计 10 个）**：cordis.run `/submit`、dshplugin.app、dshpluginhub.dev `/zh/submit`、dshplugin.dev `/submit`、dshplugins.com、dsh.fish `/submit`、dsh-plugin.org claim、dshmarketplace.com、dshhub.dev、**review.lingshulab.com `/plugins/new`**。

### 6.67 2026-10-23 深夜：npm 生态「市场包」全量排查 —— 独立静态清单只剩 2 个且都已停更

用 `registry.npmjs.org/-/v1/search` 抓 `keywords:dsh-plugin` / `keywords:deepseek-harness` / `dsh market` / `dsh plugin store` / `dsh plugin index` / `dsh directory` 六个查询（去重 **787 个包**，其中名字/描述含 market/store/index/catalog/registry/hub/shop/discover 的 **191 个**，人工归并到约 30 个 DSH 市场实现），逐个查数据文件/数据源：

**结论：除 2 个停更的静态清单外，其余全部回源到「awesome-dsh-plugin 目录 / npm 关键词 / GitHub topic」——上游已覆盖我们。**

| 市场包 | 形态 | 数据源（实测） | 判定 |
| --- | --- | --- | --- |
| `dsh-store@0.5.2`（huguangyu666/dsh-store，★4） | 550+ 插件、npm 权威源 + awesome 精选 + 自动雷达 | 代码里直接写死 `registry.npmjs.org/-/v1/search?text=keywords:dsh-plugin`、`api.github.com/search/repositories?q=topic:dsh-plugin`、`awesome-dsh-plugin/README.md` | ✅ 上游覆盖（三源都含我们） |
| `dsh-unified-market`（jing-hy，★2） | 统一市场 | `data/catalog-snapshot.json`（119KB）的 `source` = awesome-dsh-plugin | ✅ 上游覆盖 |
| `dshmarket` / `@dsh-market/plugin` / `@gausszhou` / `aiko-dsh-market` / `@x1a0f3n9` / `@chatcode` … 同名 fork 生态 | 内嵌市场 | 社区目录来自 dsh-plugin-catalog / dshmarket.com | ✅ 上游覆盖（dshmarket.com 已在 43 收录内） |
| `@nanmicoder/dsh-plugin-market@0.2.0`（★7，Vercel 站） | **静态** `data/v1/catalog.json` 5,908 条 | `meta.generatedAt = 2026-08-16T20:08:42Z`，**冻结近 2 个月**，无我们 | ⏸ 停更静态快照，无投稿通道，暂不追 |
| `dshbase-catalog@0.3.61`（dshbase.com，`/api/plugins.json`） | 静态 103 条 + 站点宣称 2 万 | `updated: 2026-08-14`，**冻结于 8-14**，目录页也无我们；无提交入口（只有 /contact） | ⏸ 停更站点，暂不追 |
| `dsh-lumen-market`、`dsh-extension-hub`、`@max-null/dsh-plugin-center`、`dsh-plugin-market-bridge` 等 | 运行时抓取型 | 代码内无固定目录 URL（走 npm search / 宿主 API） | ✅ 视为覆盖 |
| `@iasiv5/dsh-m` | 人工 curated 20 条 | 已单独投稿 → PR #5 | 🟡 待审 |

**方法论**：npm 包名里的 market/store/index 大多是同一套代码的 fork（`dshmarket` 系 7+ 个、`dsh-market` 系 5+ 个），**真正独立的 curated 清单极少**；判断一个包值不值得投稿，看它把目录数据**写死在仓库里**（`data/*.json`）还是**运行时回源**——前者才可能有独立收录差异。

### 6.68 2026-10-23 深夜：43 收录口径的在线回归核验（20 个端点实查，含 3 个「看错自己」的坑）

为确认 43 这个数字不是旧快照，本轮直接对文档里的**机器可读端点 + 详情页**做在线复查：

**机器端点（15 个，全部 200）**
| 端点 | 状态 | 含我们 |
| --- | --- | --- |
| awesome-dsh-plugin `plugins.json`（7.47MB） | 200 | ✅ |
| npm `dsh-plugin-catalog`（unpkg index.json 2.27MB） | 200 | ✅ |
| hoyyang `registry.json`（29.6MB） | 200 | ✅ |
| XingLingQAQ `catalog.json`（451KB） | 200 | ✅ |
| vbarter `data/plugins.json`（25.5MB） | 200 | ✅ |
| dshopen.org `index.json`（1.23MB） | 200 | ✅ |
| ukinch605 `registry/plugins.json`（19.9MB） | 200 | ✅ |
| dshmarket.com `index.json`（2.27MB） | 200 | ✅ |
| dsh.pub `plugins.json`（11.8MB） | 200 | ✅ |
| realguan `dsh-index.json`（7.7MB） | 200 | ✅ |
| bruc3van `index.json`（1.76MB） | 200 | ❌（**预期**：其索引固定 Top1000，见下表说明） |
| dshmarketplace.dev `/api/v1/plugins`（分页，首页 20 条） | 200 | ❌（**分页所致**；`?q=dsh-mcp-tools` → 返回 1 条命中 ✅） |
| dsh-pluginmarket.github.io `/registry/`（186B SPA 壳） | 200 | ❌（**壳**，数据在 assets/*.js） |
| deepseekplugin.org `/registry/v1/catalog.json`（2.67MB） | 200 | ❌（**全局 catalog `generated: 2026-09-22` 已停更**；我们的收录走 `/api/submissions?slug=…`，见下） |
| hol.org `/registry/plugins` | 403 | —（Cloudflare 拦截，待明查） |

**详情页（12 个，全部 200 且含 slug）**：awesome-dsh-plugin `/p/hxlog/dsh-mcp-tools/`、dsh-plugin.org、dsh.so、dsh-plugin.store、dshfind.com、dshpluginhub.ai、dshhub.org、dshhub.co、dsh.pub、dsh-plugins-mp.com、unstone dsh-xray 能力卡、linny006 mcp-servers-live。

**3 个「差点误判下架」的坑（重要方法论）**
1. **bruc3van**：`index.json` 固定 Top1000（star/热度排序）不含 3★ 仓库——但它的 `data/approved.json` 已核准我们（2026-10-23），属「核准≠进榜」，本就不在 43 口径内（文档早已标注）。
2. **dshmarketplace.dev**：`/api/v1/plugins` 默认分页 `count: 20 / total: 13175`；必须用 **`?q=dsh-mcp-tools`**（`search=` 无效）才能查到，命中 1 条。
3. **deepseekplugin.org**：全局 `/registry/v1/catalog.json` 的 `generated` 停在 **2026-09-22**（上游生成器停了），所以「catalog 里没有」≠「没收录」；我们的自助投稿走 `/api/submissions?slug=hxlog-2f-dsh-2d-mcp-2d-tools`，该端点 `generated: 2026-10-23T15:19Z`、`source: github-submission`、`installable: true`、`security.score: 5` —— 收录有效。

**结论：43 口径维持不变**（本轮无下架、无新增计数）；另记一条待查线索 `hol.org/registry/plugins`（403，可能是又一个 registry）。

### 6.69 2026-10-23 深夜：`hol.org`（HOL AI Plugin Registry）—— 第 44 个市场的入口，恰好就是我们已提的 hashgraph PR #949

**是什么**：`hol.org` = 「AI agent and MCP plugin directory」（HOL Registry，Hedera 生态的开放 agent/plugin 基础设施），有独立站点、搜索、分类页（`/plugins/best-mcp-plugins`、`/plugins/best-deepseek-plugins`、`/plugins/best-claude-plugins`…）、`/registry/plugins` 目录与 `/registry/plugins/submit` 投稿页，现有条目里**已有大量 DSH 插件**（`dsh-memory-eternal`、`dsh-vision-router`、`dsh-config-manager`、`dsh-whale-girl-pet`…），分类明确包含 DeepSeek 系。

**投稿机制（关键）**：`/registry/plugins/submit` 页面写明「List your plugin from GitHub, free. **Connect GitHub, pick the repository, and HOL opens the listing pull request on the public `awesome-ai-plugins` list**」——即：
- 表单必须 **Connect GitHub（OAuth）** 选仓库，属浏览器内用户操作；
- 它实际开 PR 的目标列表是 **`hashgraph-online/awesome-ai-plugins`** —— 也就是**我们已经提着的 PR #949**（`docs: add dsh-mcp-tools`，5/5 检查全过，等维护者合并）。

**结论：不需要额外提交**。等 #949 合并后，HOL 会自动从该列表索引到我们（其站点即索引该 awesome 列表），届时成为第 44 个收录市场；在那之前它只能算「跟随 #949 的待生效项」。已把这条依赖关系记进 pending 清单（73）。

**顺手排除**：`dshindex.dev`（标题「DeepSeek Harness Plugins (DSH) | DSH Index」，`lijma/dsh-plugin-marketplace` ★0、仓库 2026-08-15 后未再推送）——其 `/api/marketplace/v1/plugins` 的 snapshot 停在 **`date: 2026-09-04`**，口径写明「GitHub `dsh-plugin` topic universe, **ranked by most stars**、bounded to Top 1,000」，我们 2026-10-21 才建仓、3★，结构性不可能进榜；且已 7 周未更新 → 与 NanmiCoder/dshbase 同类，归入「停更/星标截断」，不追。

### 6.70 2026-10-23 深夜：**mydsh.dev（`uluckystar/dsh-plugin-market`）已收录我们 → 第 44 个市场**（此前漏算）

在按名字搜 `dsh market` 类仓库时发现 `uluckystar/dsh-plugin-market`（★3，README：在设置页浏览 **mydsh.dev 插件大全**，catalog 5,596 / 已核验可直接启用 3,656），其数据源是站点静态 JSON，而不是仓库内文件，所以之前的仓库内 grep 全部漏掉。

**核验（2026-10-23 15:5xZ）**
- 数据端点：`https://mydsh.dev/assets/plugins.json`（`total: 25,162`、`fetched: 1,069`）、`https://mydsh.dev/assets/catalog-index.json`（同源）
- 我们的条目：`full_name: hxlog/dsh-mcp-tools`、`verified: "valid"`、`language: JavaScript`、`stars: 3`、`topics` 12 个（含 `mcp-manager` / `mcp-tools` / `dsh-plugin`）、`zh_desc` + `en_desc` 均自动生成、`updated_at: 2026-10-23T15:14:45Z`
- 站点入口：`https://mydsh.dev/plugins.html`（分类浏览 / 本地搜索 / AI 搜索）；插件本体即 `uluckystar/dsh-plugin-market`，安装后直接在 DSH 设置页内浏览、安装、启停、卸载
- 收录方式：**自动**（爬 `topic:dsh-plugin` + 校验「可直接启用」），无需提交；页面上另有 Turnstile 保护的「提交插件」通道，我们用不上

**方法论补充（第二次踩到同一个坑）**：`dsh-plugin-market` 这类**站点型市场**，数据放在站点域名下（`/assets/*.json`）而不是仓库里；判断是否收录必须**先找前端代码里的 fetch 目标**（`grep '\.json' plugins.html` / 看 `<script>` 里的 `fetch(...)`），仓库内 grep 会系统性漏判。

### 6.71 2026-10-24 凌晨：GitHub code search 反向核验（84 个文件 / 11 个仓库）——覆盖无遗漏，另记竞品情报

用 `GET /search/code?q="dsh-mcp-tools"`（84 个文件命中，归并为 11 个仓库）做**反向核验**：谁在数据/文档里引用了我们这个插件。这是「漏算市场」的另一条发现路径（正向是找市场，反向是找谁已经提到我们）。

| 仓库 | 命中数 | 归类 |
| --- | --- | --- |
| linny006/mcp-servers-live | 68 | ✅ 已收录（第 11 个，MCP 索引站） |
| fendouai/awesome-deepseek-harness | 4 | ✅ 已收录 |
| awesome-dsh-plugin/awesome-dsh-plugin | 1 | ✅ 已收录（canonical feed） |
| imsai-sh/awesome-deepseek-harness-plugins | 1 | ✅ 已收录（PR #669 已合并） |
| unStone/dsh-xray | 1 | ✅ 已收录 |
| Werewolf-Wu/awesome-dsh-plugin-status | 1 | ✅ 已收录（镜像） |
| dsh-market/dsh-market | 1 | ✅ 已收录（★8,450 站内市场 = dshmarket.com） |
| **wldxiaobai/dsh-project-mcp-manager** | 3 | ⚔️ **竞品**（★9，「基于原版 DSH 扩展，项目层/用户层 MCP 管理」）——非市场 |
| JoFe2/PANSPHAIRA、CaiZongyuan/clinmesh、wavetao2010/tessivum | 各 1-2 | 个人项目/无关仓库，非市场 |

**结论**：引用我们的仓库全部已在收录矩阵内（或已归类为非市场），无漏算；同时确认存在一个 ★9 竞品 `dsh-project-mcp-manager`，定位是「项目级 + 用户级两层 MCP 管理」——我们目前是「全局 + 设置页」路线，差异点应在 README 里保持清晰（已有：按需请求/测试/停用工具不进模型）。

**顺手状态**：`dsh-ai.org` 提交仍 `queued`（13:45Z 提交，已 2h+，其队列疑似人工/夜间跑）；`YureWright/dsh-plgstore` Issue #1 仍无回复。

### 6.72 2026-10-24 凌晨：给 dsh-go 收录核验做了个可复跑脚本（`scripts/verify-dsh-go.mjs`）

dsh-go（`coeasy/dsh-go`，官方 DSH Go 市场）的 sync 是 cron `18 0/6/12/18 * * *` UTC（= 08:18 / 14:18 / 20:18 / 02:18 +08），每轮重扫 topic 并读 `dsh-package.json`（`observeDshManifest`）。我们首次被扫到是 **`first_seen 2026-10-23T11:38:52Z`**，当轮 `verified: false / manifest_file: null`；下一轮 sync（02:18 +08 之后）应翻成 `verified: true / manifest_file: "dsh-package.json"`。

为了不再靠手翻 48MB JSON，加了脚本：

```bash
node scripts/verify-dsh-go.mjs          # 单次核验，0=已 verified / 1=尚未同步 / 2=网络或解析失败
node scripts/verify-dsh-go.mjs --wait   # 60s 轮询、最多 15 分钟，适合挂在 sync 时间点后盯
# 也可 npm run verify:dsh-go
```

输出示例（当前，sync 前）：
```
dsh-go 官方目录核验
  catalog 最近同步 : 2026-10-23T11:39:16.243Z（scanned 1310 / included 1000，共 22435 条）
  slug            : dsh-mcp-tools
  full_name       : hxlog/dsh-mcp-tools
  first_seen      : 2026-10-23T11:38:52.710Z
  stars / license : 3 / MIT
  verified        : false ⏳
  manifest_file   : null ⏳
  package_version : null
  ⏳ 尚未翻 verified：等 dsh-go 下一轮 sync（cron 18 0/6/12/18 UTC = 08:18/14:18/20:18/02:18 +08）后再跑一次
```

脚本同时核对 `catalog/meta.json` 的 `last_sync`，避免把「sync 还没跑」误判成「manifest 不合格」。

### 6.73 2026-10-24 凌晨：仓库元数据补齐（homepage / 双语 description）+ dependabot 清理 —— 都直接影响市场收录质量

聚合器/市场读取的字段里，有两项此前是空的：

| 字段 | 之前 | 现在 | 影响 |
| --- | --- | --- | --- |
| GitHub repo `homepage` | **空**（dsh-go catalog 里也是 `homepage: ""`） | `https://www.npmjs.com/package/dsh-mcp-tools` | dsh.so / dsh-plugin.store / dshfind 等多处展示「官网/主页」，空值会让详情页缺链接 |
| GitHub repo `description` | 仅中文 | **中英双语**（前半中文定位，后半 `MCP manager for DSH: …`） | dsh-go catalog、awesome feed、各种 topic 抓取站点都把 repo description 当作默认简介，单语会漏掉英文用户 |

另清理了 dependabot PR **#1**（`github-actions` 组 2 个 action 升级）：检查 `smoke + manifest contract` 通过后 squash 合并，main 头提交 `dcc79ad`，CI **success**（保持市场侧「CI 绿色」的观感与 badge 真实性）。

**为什么这类改动算收录工作**：多份市场文档明确把 repo description / homepage / CI 状态作为列表展示字段或可信度信号（如 dsh-go catalog 的 `description`/`homepage`/`has_readme`，awesome feed 的 `desc`），字段为空会在这些站点上表现为「信息缺失」，属于「格式不对」的一种。

### 6.74 2026-10-24 凌晨：`scripts/verify-listings.mjs` —— 一条命令复核全部收录证据（轻量 19 项 / 全量 26 项）

把 44 个收录口径里**可在线访问的证据**固化成脚本，避免「文档说收录、实际已下架」的漂移：

```bash
npm run verify:listings           # 轻量集：19 项（详情页 + 小数据端点，~10s）
npm run verify:listings -- --full # 全量：26 项（含 47MB dsh-go catalog、7.3MB canonical feed 等）
node scripts/verify-listings.mjs --json  # 机器可读输出（CI/审计用）
```

判定：每个市场登记「证据 URL + 期望出现 `dsh-mcp-tools` 或 `hxlog/dsh-mcp-tools`」；HTTP 网络偶发失败自动重试 2 次（本轮实测 deepseekplugin.org 第一次 status 0、重试即 200）；退出码 0=全通过、1=有失败。

**本轮实跑结果**：轻量 **19/19 ✅**、全量 **26/26 ✅**（含 awesome canonical feed 7.3MB、hoyyang 28.9MB、vbarter 24.9MB、ukinch605 19.5MB、dsh.pub 11.5MB、realguan 7.5MB、dsh-go 47.5MB）。

覆盖的市场（按脚本顺序）：awesome 详情/canonical、dsh-plugin.org、dsh.so、dsh-plugin.store、dshfind、dshpluginhub.ai、dshhub.org、dshhub.co、dsh.pub、dsh-plugins-mp、unStone、linny006、mydsh.dev、dshmarketplace.dev、deepseekplugin.org、XingLingQAQ、dshopen、dshmarket.com、npm dsh-plugin-catalog、hoyyang、vbarter、ukinch605、realguan、dsh-go。

这套脚本也是「目标达成度」的机器判据之一：只要它保持绿色，说明这些市场**此刻**确实收录着我们；若某项转红，先按 §6.68 的三个假阴性陷阱排查再下结论。

### 6.75 2026-10-24 凌晨：换搜索维度又挖到 2 个（第 45 个市场在架 + 1 条新 PR 通道），并排除 3 个假市场

之前一直是「按仓库名 / topic / npm 关键词」找市场；这轮换用 **`in:description`**（`"deepseek harness" in:description pushed:>2026-10-20` 两页共 216 个仓库，筛出 39 个 market-ish），立刻捞到此前完全没出现在视野里的两个：

**① 第 45 个市场：`xrj/dsh-market-site` → https://dsh-market.pages.dev/（DSH 插件集市）**
- 站点标题「DSH 插件集市 | DeepSeek Harness 非官方插件集市」，Cloudflare Pages 静态站，仓库 `xrj/dsh-market-site`（★1）
- 数据端点 `https://dsh-market.pages.dev/data.json`（**14.25MB / 18,603 条**）含我们：`name: dsh-mcp-tools`、`fullName: hxlog/dsh-mcp-tools`、topics 12 个、license MIT、`slug: 1427825895`（该快照里 stars 还是 2，说明是若干天前的抓取）
- 收录方式：自动（爬 `topic:dsh-plugin`）；详情页是 SPA（路由一律返回 5.3KB 壳），**证据只看 data.json**
- 已加入 `scripts/verify-listings.mjs` 全量集

**② 新 PR 通道：`Britneycode/dsh-update-center`（★2）→ 已开 PR #3**
- 它是「DSH 本地更新中心 + 内置插件市场」，注册表读本仓库 `plugins.json`（998 条，日更自动刷新）；扫描窗口是 `topic:dsh-plugin` **星标前 500**，我们 3★ 进不去
- 但 README 明确写了后门：**`data/extra-plugins.json` 是常驻条目，「加载时无条件合并，保证 0 星新插件始终可见」**，且刷新脚本把该文件读入 `pinnedRepos` **原样重写**（不会被每日自动刷新冲掉）
- 按此开 PR：[Britneycode/dsh-update-center#3](https://github.com/Britneycode/dsh-update-center/pull/3)（`data/extra-plugins.json` +15 行，3→4 条）
- 格式对齐细节：`githubRepoToEntry()` 转换后 `category` 由关键词决定；初版描述含 `server` / `test` 命中了 **dev** 规则（规则顺序里 dev 在 tools 之前），改写为「connect streamable-HTTP or stdio MCP **endpoints**… **probe** connectivity…」后落到 **`tools`（Tools & Capabilities）**；`install` 自动生成 `dsh plugin --profile web add github:hxlog/dsh-mcp-tools`，npm 映射等下次 refresh 自动补
- 本地验证：JSON 合法、`node --test tests/github-topic.test.mjs` **7/7 pass**

**③ 排除的 3 个（不是真市场 / 结构性进不去）**
| 仓库 | 结论 |
| --- | --- |
| `tanle-mtr/dsh-plogin-plugin-recommender`（★2，200 条 AI 策展清单） | 每小时 Actions 用 7 个搜索词各取 **stars 排序 top-50** 重建 `plugins.json` → 3★ 结构性进不去；手工 issue 建议也会被下一轮覆盖，不追 |
| `439436269-ctrl/dsh-preview-market`（★0） | 只收 **预览渲染类**插件（media/blender/stl），明确声明「not a general plugin market」 |
| `crane-you/dsh-plugin-index`、`TuWeiZhi`、`gitMFQ`、`zhchzh11-tech` 等 format-1 索引 | 自动派生/个人索引，非独立市场（按 §6.64 口径不计） |

**方法论更新**：找市场别只看名字——`in:description` 能捞到站点名与仓库名完全不同名的项目（`dsh-market-site` 就是这么来的）；判定收录则必须打到**站点自己的数据端点**（§6.70 / §6.74 同样的坑）。

### 6.76 2026-10-24 凌晨：第 46 个市场 dpharness.com（**自助提交 API 直接上架**）+ 第 47 个 DSH-Plugin-Hub（数据含我们、域名被污染）

顺着 §6.75 的 `in:description` 扫描继续挖，这轮新增 2 个、排除 3 个：

**① 第 46 个市场：`dpharness.com`（DeepSeek Harness Hub · DSH 实装验证与中文汉化）**
- 站点自己就是市场：插件库 `/api/plugins`、严选榜 `/api/best`、套装 `/api/sets`、每插件页 `/plugin/<owner>/<repo>`
- **有自助提交入口 `https://dpharness.com/submit`**：支持「GitHub 链接 / 上传 zip / 粘贴 README」三种方式，提交后由 DeepSeek 最新模型汉化 + 评分
- 提交 API 是纯 JSON POST（无需登录）：`POST /api/submit`，body `{"mode":"github","githubUrl":"https://github.com/hxlog/dsh-mcp-tools","submitter":"hxlog","note":"..."}` → 返回 `ok:true` + `plugin.id: cmvib7vmz02g0sr2tsy05vebe`
- **提交后立即上架**：[dpharness.com/plugin/hxlog/dsh-mcp-tools](https://dpharness.com/plugin/hxlog/dsh-mcp-tools) 返回 200，页面显示：
  - 中文名「MCP 工具管家」，标签「MCP」，`hxlog · 0 天前有提交 · 已提供中文文档 · 扫描：未发现敏感能力`
  - **实装验证 L4 · 真实安装**：「本站已在 dsh 0.2.1-rc.2 下真实安装成功（非静态推断）」
  - 静态扫描 🟢：「最多只发网络请求、读取自身元数据或只读文件，未发现执行命令、文件写入或敏感信息读取」；证据 2 处（`client/client.js` 的 fetch 与 clipboard）
  - 综合分 32.3/100（星标 3 + 活跃度 + 兼容性合成；星少所以分低，但**收录≠评分**）
- 注意：`/api/plugins` 全量目录有缓存延迟，新提交先出详情页、后进列表（审核/重算时才刷新 catalog），所以判定收录看**详情页 200** 而不是列表

**② 第 47 个市场：`usertianziyang/DSH-Plugin-Hub`（客户端静态索引站，按 stars 排序）**
- 数据源 `public/plugins.json`（**14.8MB**）**含我们**；站点部署在 `https://dsh-plugin-hub-zeta.vercel.app`（README 与 GitHub homepage 都指向它）
- 但本机 `dsh-plugin-hub-zeta.vercel.app` **DNS 被污染**（解析到 `31.13.84.2`，Vercel/静态托管在本地不可达，curl `000`）→ 站点可用性无法从这台机器证明
- 仓库 README 的数据边界声明：「every public repository carrying the exact `dsh-plugin` topic that the GitHub REST Search API could return」→ 收录是**全量自动**的，不是人工策展，我们必然在列
- 口径：数据源 = 站点部署产物（`public/` 即静态站根目录），**计入收录**，证据用仓库 `public/plugins.json`；站点本身列为「本地不可达，待境外网络复核」

**③ 排除 3 个**
| 仓库 | 结论 |
| --- | --- |
| `SCP-008-1/dshop`（★4，https://dsh-marketplace.laoba.me/） | 同步脚本只取 `topic:dsh-plugin&sort=stars` **单页 top-100**，3★ 结构性进不去；站点 200 但数据无我们 |
| `tanle-mtr/dsh-plogin-plugin-recommender` | 见 §6.75，每小时 7 查询各取 stars top-50，结构性排除 |
| `439436269-ctrl/dsh-preview-market` | 预览渲染类专用，非通用市场 |

**方法论补充**：市场除了「提交 PR / 提交 issue / 等自动抓取」外，还有 **「自助提交 → 自动上架」** 这一类（dpharness）；还有 **「客户端静态索引」** 这类没有服务端、数据源就是仓库里的 json（DSH-Plugin-Hub）。前者要去找 `/submit` 页面背后的 API（Next.js chunk 里 grep `/api/` 即可），后者要认「仓库 public/*.json 就是站点数据」。
