# 插件市场收录矩阵 / Marketplace Listings

> 最后核验：2026-10-23（已收录 18 个市场 + 34 个待审/待跟进 PR/Issue/目录站（bruc3van 已 approved 2026-10-23，受 market.json 体积上限暂未渲染）；dshmk 条目待重新采集）。状态说明：✅ 已确认收录 · 🟢 PR 已合并 · 🟡 PR/Issue 待审 · ⏳ 自动采集待生效 · ⚪ 未提交。

## 一、已确认收录

| 市场 | 规模 | 收录方式 | 状态 | 链接 |
| --- | --- | --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 20k★ | 人工 PR | ✅ 已合并（PR #8407，2026-10-22） | https://awesome-dsh-plugin.com/p/hxlog/dsh-mcp-tools/ |
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
| [LivXue/dsh-plugin-shop](https://github.com/LivXue/dsh-plugin-shop) | 656★ / 18,276 插件（每日刷新） | npm 关键词自动采集（`dsh-plugin`/`deepseek-harness`） | ✅ 已收录：目录条目 `dsh-mcp-tools@1.0.2`（2026-10-21 加入，category tool；仓库因 npm 同名被标 shadowed-by-npm 属正常） | https://LivXue.github.io/dsh-plugin-shop/ |
| [dsh.so](https://www.dsh.so)（ihuajiu/dsh.so） | 21,303 插件验证注册表 | npm/GitHub 自动收录 + L1–L5 扫描 | ✅ 已收录：<https://www.dsh.so/artifact/dsh-mcp-tools/>（**Verification L5 · Run tested**，LowRisk / Trust Gold，2026-10-21 复检）（2026-10-21 发布） | 自动抓取，无需提交 |
| [DshMarketPlace/dshmarketplace](https://github.com/DshMarketPlace/dshmarketplace)（dshmarketplace.dev） | 3★ / 3,420 listing + **13,175 条 API 索引** | GitHub topic 自动 ingest + 沙箱验证安装命令 | ✅ 已收录：`/api/v1/index` 含 `hxlog/dsh-mcp-tools`（`category: tools` + install 命令；2026-10-23 复核，`generated` 10:38Z，`count: 13175`）；`path` 为 null（暂无人工精选详情页，非必需）。曾开 Issue #7 申请，复核后自行关闭并说明 |

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
| [dsh-plugin.store](https://dsh-plugin.store) | 14,082 个 GitHub 真实插件目录（Next.js） | 直接消费 `awesome-dsh-plugin.com/plugins.json` | ✅ 已收录：`/p/hxlog/dsh-mcp-tools` 详情页 200 | https://dsh-plugin.store/p/hxlog/dsh-mcp-tools |
| [YELEBAI/dsh-plugin-marketplace](https://github.com/YELEBAI/dsh-plugin-marketplace)（21★） | 每日扫描 `dsh-plugin` topic 进中心 Registry | ⏳ topic 已打，下轮扫描自动进候选 |
| [w2112515/dsh-plugin-marketplace](https://github.com/w2112515/dsh-plugin-marketplace)（17★） | 扫描 topic 后逐个证明可安装，再进入市场 | ⏳ 同上 |

## 五、新发现目录站（2026-10-23 扫描域名确认）

| 站点 | 规模/形态 | 收录机制 | 状态 |
| --- | --- | --- | --- |
| [dshplugins.com](https://dshplugins.com) | 审核制目录（含 /submit 页） | 需 GitHub 登录由管理员审核；提交需在 README 写清安装步骤 | 🟡 待人工 OAuth 提交 |
| [dsh-plugins.net](https://dsh-plugins.net) | 带验证方法论的社区目录 | 表单生成 Markdown，发到 deepseek-harness GitHub Discussions 由维护者审核 | 🟡 已发 [Discussion #10768](https://github.com/deepseek-ai/deepseek-harness/discussions/10768)（Show Your Plugins! 分类） |
| [dshplugin.net](https://dshplugin.net)（coolbat/awesome-dsh-plugins） | 1★ / 双语证据式目录 | GitHub Issue `plugin-submission` 模板（需固定 commit） | 🟡 已提交 Issue #34 · 仓库已改名 `coolbat/awesome-dsh-plugins`（1★，证据型双语目录，数据源 `data/plugins.json`，1709 条）；issue #34 仍在；**已按 CONTRIBUTING 逐条提交证据 + 拟好的 JSON 条目**（2026-10-23，含 40 位 SHA / manifest / patch / 双 license / lifecycle none / 能力信号；分类对齐已有先例 `Discovery & Management`） |
| [dsh.store](https://dsh.store)（AI-Scarlett/DSH-Store） | 5★ / 第三方市场 + 生命周期管理 | 每 8 小时自动 radar 扫描写入 `registry/catalog.json` | 🟡 机器人预检**已通过**（固定 commit `f245bca`、识别 `dsh-mcp-tools@1.0.2`、入口 `mcp-tools`、无生命周期脚本、13/13 文件扫描完整、1 条 shell 警告来自 `scripts/smoke.mjs`），等 8 小时 Catalog 策略复核 |
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