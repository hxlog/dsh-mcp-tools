# 插件市场收录矩阵 / Marketplace Listings

> 最后核验：2026-10-23。状态说明：✅ 已确认收录 · 🟢 PR 已合并 · 🟡 PR/Issue 待审 · ⏳ 自动采集待生效 · ⚪ 未提交。

## 一、已确认收录

| 市场 | 规模 | 收录方式 | 状态 | 链接 |
| --- | --- | --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 20k★ | 人工 PR | ✅ 已合并（PR #8407，2026-10-22） | https://awesome-dsh-plugin.com/p/hxlog/dsh-mcp-tools/ |
| [dsh-plugin-catalog](https://www.npmjs.com/package/dsh-plugin-catalog)（npm 目录包） | 3.2k 条 | 随主市场上游自动生成 | ✅ 0.1022 版含本插件 | https://unpkg.com/dsh-plugin-catalog/index.json |
| [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 188★ / 19.6k 仓库 | GitHub topic 自动索引（2h） | ✅ registry.json 已含 | https://github.com/bradeGithub/DSH-Plugins-Marketplace |
| [ZASENJC/dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store)（dshmk.com） | 72★ / 2500 验证 | topic 自动采集（30min） | ✅ API 全量含本插件 | https://dshmk.com/ |
| [imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)（deepseek1024.com） | 312★ | 人工 PR（catalog JSON，CI 自动合并） | 🟢 已合并（PR #669） | https://deepseek1024.com/ |
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

## 三、暂不提交

| 市场 | 原因 |
| --- | --- |
| bruc3van/awesome-dsh-plugin（453★） | 作者自荐区要求 star > 10；等 star 增长后提交 SHOWCASE.md |
| dsh-external/hub | 仓库私有/404，是其手选目录上游，无公开入口 |
| walkinglabs / diegosouzapw / vvlife / billLiao 等小列表 | 格式更重、收益有限，作为第二梯队按需再投 |

## 四、自动采集节奏（无需操作，仅回查）

| 来源 | 频率 | 预计出现 |
| --- | --- | --- |
| DSH-Plugins-Marketplace registry | 2 小时增量 | 已收录 |
| dshmk.com API | 30 分钟 | 已收录 |
| dsh-plugin-radar 快照 | 每日 02:00 | PR 合并或下一次扫描 |
| 0xsline CATALOG（topic） | 每次快照生成 | 下一轮 |
| dsh-plugin.org | 每周/按审核队列 | Issue 处理前后 |

## 五、后续动作

1. 每天回查一次待审 PR/Issue；合并后把状态改为 ✅ 并补链接。
2. dsh-plugin.org 收录后，可在 README 加其官方徽章（`https://dsh-plugin.org/badges/listed.svg`）。
3. 待 star > 10 后提交 bruc3van SHOWCASE.md。
4. 如需把这些收录徽章同步到 npm 页面，需要发一个新版本（README 改动才会进 npm 包）。
