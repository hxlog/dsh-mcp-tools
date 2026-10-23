# 插件市场收录矩阵 / Marketplace Listings

> 最后核验：2026-10-23（已收录 9 个市场 + 21 个待审 PR/Issue）。状态说明：✅ 已确认收录 · 🟢 PR 已合并 · 🟡 PR/Issue 待审 · ⏳ 自动采集待生效 · ⚪ 未提交。

## 一、已确认收录

| 市场 | 规模 | 收录方式 | 状态 | 链接 |
| --- | --- | --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 20k★ | 人工 PR | ✅ 已合并（PR #8407，2026-10-22） | https://awesome-dsh-plugin.com/p/hxlog/dsh-mcp-tools/ |
| [dsh-plugin-catalog](https://www.npmjs.com/package/dsh-plugin-catalog)（npm 目录包） | 3.2k 条 | 随主市场上游自动生成 | ✅ 0.1022 版含本插件 | https://unpkg.com/dsh-plugin-catalog/index.json |
| [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 188★ / 19.6k 仓库 | GitHub topic 自动索引（2h） | ✅ registry.json 已含 | https://github.com/bradeGithub/DSH-Plugins-Marketplace |
| [ZASENJC/dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store)（dshmk.com） | 72★ / 2500 验证 | topic 自动采集（30min） | ✅ API 全量含本插件 | https://dshmk.com/ |
| [imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)（deepseek1024.com） | 312★ | 人工 PR（catalog JSON，CI 自动合并） | 🟢 已合并（PR #669） | https://deepseek1024.com/ |
| [fendouai/awesome-deepseek-harness](https://github.com/fendouai/awesome-deepseek-harness) | 41★ | 定时 discover workflow 自动写入 data/plugins.json | ✅ 已含（README 搜索到 hxlog/dsh-mcp-tools） | https://github.com/fendouai/awesome-deepseek-harness |
| [vvlife/awesome-deepseek-harness-plugins](https://github.com/vvlife/awesome-deepseek-harness-plugins) | 10★ | PR #168（README.md Tools & Editor UX，机器人规则审核通过后自动 squash-merge） | 🟢 已合并（2026-10-23，commit c337c46） | https://github.com/vvlife/awesome-deepseek-harness-plugins |
| [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | 453★ | 每日抓取 `dsh-plugin` topic + 人工/规则复核，写入 data/approved.json | ✅ 已通过复核（approved.json 记录 `hxlog/dsh-mcp-tools: 2026-10-23`），README/feed 待下一轮渲染 | https://github.com/bruc3van/awesome-dsh-plugin |
| [2BingLing/dsh-market](https://github.com/2BingLing/dsh-market)（dsh.market） | 168★ / 6000+ | topic 自动扫描写入 data/plugins.json | ✅ 已含（`sources: [topic]`，cordis-plugin，已生成中文简介） | https://dsh.market/ |
| [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins)（dsh.works） | 24★ / 20.7k | PR 到 data/plugins.json | 🟡 PR #184 待审 | https://dsh.works/awesome-dsh-plugins/ |

## 二、待审提交

| 市场 | 规模 | 提交 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | 1.2k★ | PR #737（README + README.zh-CN 的 Tools & Utilities） | 🟡 待审 | 手选列表；CATALOG 由 topic 自动生成，后续可能自动出现 |
| [AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar) | 1.5k★ | PR #968（PLUGINS.md 单插件表登记） | 🟡 待审 | 未登记也会每日 02:00 扫 topic 自动收录 |
| [kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins) | 64★ | PR #150（plugins/mcp.md） | 🟡 待审 | 14 类目录，归 mcp 分类 |
| [beancookie/awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) | 171★ | PR #236（README + README.en 的工具与能力） | 🟡 待审 | 504 个插件的中文目录 |
| [dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)（dsh-plugin.org） | 310★ / 16.5k | Issue #391（官方提交模板） | 🟡 待审核 | 收录后自动生成详情页，可用站点徽章 |
| [Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins) | 558★ | Issue #94（目录无 PR 入口，请求收录） | 🟡 待回复 | 纯生成式目录 |
| [losebird/dsh-plugin-market](https://github.com/losebird/dsh-plugin-market) | 16★ | PR #54（registry/curated） | 🟡 待审 | 合并后数秒内上架 |
| [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | 103★ | PR #162（catalog/plugins.json + 生成的中文镜像） | 🟡 待审（CI 需维护者批准首跑） | 双语 JSON 目录，developer-tools 分类；本地 `generate_readmes.py --check` 通过 |
| [Anil-matcha/awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) | 13★ | PR #13（Tools & Capabilities） | 🟡 待审 | 单行条目，格式与相邻条目一致 |
| [GordenSun/awesome-dsh-plugins](https://github.com/GordenSun/awesome-dsh-plugins) | 10★ | PR #6（生态基建与开发 + 英文镜像） | 🟡 待审 | 审核会看「解决什么问题 / 为何有代表性 / 如何安装」 |
| [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins) | 7★ | PR #38（verified-plugins.csv 的 mcp 分类 + 重新生成文档） | 🟡 待审 | 要求加载证据、许可证、权限与数据流披露；已按模板填写 |
| [white0dew/awesome-dsh-plugins](https://github.com/white0dew/awesome-dsh-plugins) | 12★ | PR #21（data/sources/reviewed-catalog-additions.json + 重新生成内容） | 🟡 待审 | 生成器硬编码计数已同步（11→12、8561→8562、10776→10777） |
| [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | 397★ | PR #671（README.md + README.zh-CN.md 的 MCP Servers 分类） | 🟡 待审（CI validate/check 均 SUCCESS，mergeable） | 纯插入、中英同步、带 `#dsh` topic；分类参照已有 dsh-mcp-switch / dsh-tui-mcp-manager |
| [awesome-deepseekharness/awesome-deepseek-harness](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) | 25★ | PR #186（README.md + README.zh.md 的 Tools 表格） | 🟡 待审（submission-guard 通过，人工审核） | 机器人在 PR 里提示「14 天内第 4 个自荐会自动关闭」，本仓库只投 1 个，暂不再追加 |
| [walkinglabs/awesome-deepseek-harness-plugins](https://github.com/walkinglabs/awesome-deepseek-harness-plugins) | 48★ | Issue #120（submit-plugin 表单） | 🟡 待审核 | 该仓库只收 Issue，不接受直接 PR |
| [xianyu110/awesome-deepseek-harness](https://github.com/xianyu110/awesome-deepseek-harness) | 11★ | PR #126（README.md 工作流与开发集成） | 🟡 待审 | 手动精选区；自动发现区不动 |
| [leenkcool/Blue-Whale-Harness](https://github.com/leenkcool/Blue-Whale-Harness) | 196★ / 1819 真插件 | Issue #181（catalog-intake 模板） | 🟡 待审核 | 维护者核对 `cordis.patch.yml` 后写入 catalog/intents.json 并重建站点 |
| [like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | 96★ | PR #43（data/curated.json override，`keep: true` 绕过 min_stars=3 初筛） | 🟡 待审 | 4 小时自动同步，2★ 低于门槛，按 CONTRIBUTING 走人工 override |
| [whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 44★ / 2103 | Issue #76（plugin-submission 模板） | 🟡 待审核 | 目录按 topic 抓取但只收 top-N，需人工提名；目录每小时刷新 |
| [zp-home/dsh-recommend](https://github.com/zp-home/dsh-recommend) | 19★ | Issue #41（submit-plugin 模板 + 精选认证申请） | 🟡 待审核 | 每日同步 topic；`dsh.bundle` 可安装，申请 🏅 精选认证 |
| [zhu1090093659/dsh-community-plugins](https://github.com/zhu1090093659/dsh-community-plugins) | 1★（dsh-market.com 创意工坊数据源） | PR（community.json 追加 1 条，gate `community-index: OK (144 entries)`） | 🟡 待提交（GitHub fork 限流，稍后重试） | community.json 同时供 dsh-market.com 插件清单 |

## 三、暂不提交

| 市场 | 原因 |
| --- | --- |
| bruc3van/awesome-dsh-plugin（453★） | 作者自荐区要求 star > 10；等 star 增长后提交 SHOWCASE.md |
| dsh-external/hub | 仓库私有/404，是其手选目录上游，无公开入口 |
| walkinglabs / diegosouzapw / vvlife 等小列表 | 格式更重、收益有限，作为第二梯队按需再投 |
| billLiao/awesome-dsh-plugin（15★） | 目录由 topic 自动生成（21k 条），本仓库已在 topic 内，等待下一轮刷新即可 |

## 四、经主市场分发的下游（无需单独提交）

| 下游 | 分发方式 | 状态 |
| --- | --- | --- |
| [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)（8.3k★，应用内市场） | 直接读 awesome-dsh-plugin.com 的 index.json | ✅ index.json 已含本插件 |
| [Sanqi-normal/dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin)（104★） | 浏览 awesome-dsh-plugin.com 目录 | ✅ 同上 |
| [YELEBAI/dsh-plugin-marketplace](https://github.com/YELEBAI/dsh-plugin-marketplace)（21★） | 每日扫描 `dsh-plugin` topic 进中心 Registry | ⏳ topic 已打，下轮扫描自动进候选 |
| [w2112515/dsh-plugin-marketplace](https://github.com/w2112515/dsh-plugin-marketplace)（17★） | 扫描 topic 后逐个证明可安装，再进入市场 | ⏳ 同上 |

## 五、自动采集节奏（无需操作，仅回查）

| 来源 | 频率 | 预计出现 |
| --- | --- | --- |
| DSH-Plugins-Marketplace registry | 2 小时增量 | 已收录 |
| dshmk.com API | 30 分钟 | 已收录 |
| dsh-plugin-radar 快照 | 每日 02:00 | PR 合并或下一次扫描 |
| 0xsline CATALOG（topic） | 每次快照生成 | 下一轮 |
| dsh-plugin.org | 每周/按审核队列 | Issue 处理前后 |

## 六、后续动作

1. 每天回查一次待审 PR/Issue；合并后把状态改为 ✅ 并补链接（当前共 10 个待审 PR + 2 个 Issue）。
5. 首跑 CI 处于 `action_required` 的 PR（Alex #162、beancookie、keji、losebird、0xsline）只有维护者能批准，保持内容正确、必要时礼貌留言即可。
2. dsh-plugin.org 收录后，可在 README 加其官方徽章（`https://dsh-plugin.org/badges/listed.svg`）。
3. 待 star > 10 后提交 bruc3van SHOWCASE.md。
4. 如需把这些收录徽章同步到 npm 页面，需要发一个新版本（README 改动才会进 npm 包）。
