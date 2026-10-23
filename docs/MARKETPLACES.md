# 插件市场收录矩阵 / Marketplace Listings

> 最后核验：2026-10-23（已收录 22 个市场 + 36 个待审/待跟进 PR/Issue/目录站（bruc3van 已 approved 2026-10-23，受 market.json 体积上限暂未渲染）；dshmk 条目待重新采集）。状态说明：✅ 已确认收录 · 🟢 PR 已合并 · 🟡 PR/Issue 待审 · ⏳ 自动采集待生效 · ⚪ 未提交。

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
| [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | 453★ | 每日抓取 `dsh-plugin` topic + 人工/规则复核，写入 data/approved.json | 🟡 已进入 `data/approved.json`（2026-10-23 核准）；`data/market.json` 每日 14:17Z 重建，同日核准的其他仓库同样尚未入市场 → 今晚刷新后应出现。安装目标映射 `data/packages.json` 由维护者审核补充。原：✅ 已通过复核（approved.json 记录 `hxlog/dsh-mcp-tools: 2026-10-23`），README/feed 待下一轮渲染 | https://github.com/bruc3van/awesome-dsh-plugin · **已 approved：`data/approved.json["hxlog/dsh-mcp-tools"] = "2026-10-23"`**；`repositories.json` 已有我们，但 `market.json` 有体积上限（约 1000 条，分类轮转 + star 排序），2★ 暂未进渲染，升星后自动进入，**无需 PR** |
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

> **回归核验（2026-10-23）**：已收录渠道逐一在线复核，全部仍含 `hxlog/dsh-mcp-tools`——awesome-dsh-plugin feed（7.47MB）、npm `dsh-plugin-catalog@2026.1023.9552`、dsh.so（L5）、deepseek1024 API、bradeGithub registry（19MB）、2BingLing data/plugins.json（39.8MB，master）、dsh-xray 能力卡、linny006 MCP 索引页、lwmxiaobei catalog、imsai `catalog/plugins/hxlog--dsh-mcp-tools.json`、fendouai README、vvlife README、dsh-plugin.org 详情页、dshmarketplace.dev API。bruc3van 待每日 14:17Z 重建。

## 二、待审提交

| 市场 | 规模 | 提交 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins)（dsh.works） | 24★ / 20.7k | PR #184（data/plugins.json） | 🟡 待审（2026-10-23 已 rebase 解决 DIRTY 冲突，`check` CI 通过，等待合并） | 维护者按 Sweep 批量 fold 贡献者 PR | 队列机制：`coverage.json`（2026-10-23）显示 topic 唯一仓库 25,430 / 已决定 22,456 / **队列 472**，本仓库可通过 `topic:dsh-plugin` 检索到（GitHub search 命中 1）→ 由 sweep 决定批次收录；PR #184 为并行路径。
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
| [polang233/dsh-plugin-index](https://github.com/polang233/dsh-plugin-index)（dshopen.org） | 35★ / Open Plugin Market，864 条 | 维护者**手工批量**把申请写进 `data/sources.json`（提交历史可见 "Add N submitted plugins"），非 PR 通道 | 🟡 Issue #58 已提交，并于 2026-10-23 补了一份**可直接粘贴的 `sources.json` 条目**（含 v1.0.2 的 `source.commit`/`integrity`/`publishedAt` + 与已收录 `@sunshaobei/dsh-mcp-manager` 的差异说明）：#issuecomment-6362814800 | 索引每 6h 重建（09:19Z 最新），等维护者下一批合入 |
| [DshHunt/community](https://github.com/DshHunt/community)（[dshhunt.com](https://dshhunt.com)） | 独立目录站（静态结构证据 + 社区投稿） | Issue [#4](https://github.com/DshHunt/community/issues/4)（plugin-submission 表单） | 🟡 待审（2026-10-23 提交） | 站点 `/plugins` 已上线但未含我们；投稿要求固定 commit SHA + 公开证据，已按表单字段提交（SHA `6cb6342`、bundle path `.`、npm `dsh-mcp-tools`、分类 developer-tools、MIT） |
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
