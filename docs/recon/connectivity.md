# MCP 连通性实测报告：demo-mcp / pharmcube

> 目的：为「DSH 自定义 MCP 管理器」插件提供**真实**连通性证据——能否连上、协商到哪个协议版本、有多少工具、真实调用是否可用、以及开关服务器/工具时插件必须处理哪些协议细节。
> 探测时间：2026-10-20 19:49–19:56（Asia/Shanghai）　探测机：Windows / Node v24.16.0
> 探针脚本：`scripts/probe-mcp.mjs`（可复跑）；原始 JSON 产物：`docs/recon/raw/`
> 执行：DSH Agent Teams 调研任务 `task-3`（只读调研，未改动 `C:\Users\Xingy\.dsh` 下任何文件、未重启任何进程）。

---

## 0. 结论速览

| 目标 | 连通 | 协商协议版本 | serverInfo | mcp-session-id | 工具数 | 首包 TTFB（均值） | initialize（均值） | tools/list（均值） | 整轮探测耗时（均值） | 真实 tools/call |
|---|---|---|---|---|---:|---:|---:|---:|---:|---|
| **demo-mcp** | ✅ 可用 | `2025-06-18` | `{"name":"mcp-server-brm","version":"1.0.0"}` | 未下发 | `95` | `193.6` ms | `267` ms | `368.5` ms | `1529.4` ms | 3 次（2 成功 + 1 服务端 isError） |
| **pharmcube** | ✅ 可用 | `2025-11-25` | `{"name":"pharmcube_openapi_mcp_server","version":"1.0.0"}` | 未下发 | `36` | `155.8` ms | `204.4` ms | `197.4` ms | `1102` ms | 2 次（2 成功） |

两个目标均**真实连通**、`tools/list` 正常、`tools/call` 能拿到业务数据；两端都**不下发** `mcp-session-id`（无状态模式），也都**不返回** `annotations` / `outputSchema`。

---

## 1. 探针脚本与复跑方式

脚本：`scripts/probe-mcp.mjs`，优先复用 DSH web profile 里已安装的 **@modelcontextprotocol/client 2.2.0**（`C:\Users\Xingy\.dsh\profiles\web\node_modules\@modelcontextprotocol\client`），走 `StreamableHTTPClientTransport`；SDK 不可用或加 `--raw` 时降级为**原生 fetch 手写 JSON-RPC**（initialize → notifications/initialized → tools/list 显式 cursor 分页 → tools/call）。

```powershell
# 1) 环境变量（明文 key 只在环境变量里，脚本与产物均打码：前 6 + 后 4）
$env:MCP_KEY='<demo 的 x-mcp-key>'
$env:PHARMCUBE_TOKEN='<pharmcube 的 Bearer token>'

# 2) 全量探测（结尾打印汇总，并按 --json-out 落原始 JSON）
node scripts/probe-mcp.mjs --json-out=docs/recon/raw/probe-run1.json

# 其他常用姿势
node scripts/probe-mcp.mjs --target=demo                 # 只探一个
node scripts/probe-mcp.mjs --no-call                        # 只到 tools/list，不调用工具（最安全的“测连通性”）
node scripts/probe-mcp.mjs --raw                            # 强制原生 fetch（验证不依赖 SDK 也能连）
node scripts/probe-mcp.mjs --call=document_search:{}        # 指定工具与参数（可重复）
```

| 参数 / 环境变量 | 作用 |
|---|---|
| `--target=demo,pharmcube` | 选择目标（缺省全部） |
| `--no-call` | 跳过 tools/call（建议插件「测试连通性」按钮就用这个语义） |
| `--raw` | 强制原生 fetch 模式 |
| `--json-out=<path>` | 落完整结构化结果（含每条 HTTP 状态码/耗时/脱敏 header） |
| `--max-tools=<n>` | 控制台打印的工具名上限（默认 200） |
| `--timeout-ms=<n>` | 单次 tools/call 超时（默认 60000） |
| `MCP_SDK_PATH` | 覆盖 @modelcontextprotocol/client 的 dist/index.mjs 路径 |

脚本行为：对每个目标记录 **HTTP 流水**（method、JSON-RPC method、状态码、首包响应头耗时、脱敏后的请求/响应头、mcp-session-id）；连接失败时会自动用原生 fetch 复验一次，以便区分「SDK 侧问题」和「服务端问题」。

---

## 2. 目标 1：demo-mcp（用户新提供）

### 2.1 配置（脱敏）

```yaml
serverName: demo-mcp
transport: streamable-http
url: https://mcp.example.com/mcp
headers:
  x-mcp-key: cm_***        # 原始值只在环境变量 MCP_KEY / profile 配置里
```

### 2.2 握手结果（initialize）

| 项目 | 实测值 |
|---|---|
| 协商协议版本 | `2025-06-18`（客户端最高支持 2025-11-25，**服务端回落到 2025-06-18**） |
| serverInfo | `{"name":"mcp-server-brm","version":"1.0.0"}` |
| instructions | 未返回 |
| mcp-session-id | **无**。7 次请求的响应头里都没有 `mcp-session-id` → 服务端为无状态模式 |
| 首包（initialize 响应头） | `175.6 / 166.4 / 238.9` ms（3 次），均值 `193.6` ms |

### 2.3 HTTP 流水（一次完整探测：initialize + tools/list + 3 次 tools/call）

| # | 方法 | JSON-RPC method | HTTP 状态 | 首包耗时 | 响应 content-type | mcp-session-id |
|---:|---|---|---:|---:|---|---|
| 1 | POST | initialize | 200 | 175.6 ms | application/json; charset=utf-8 | — |
| 2 | POST | notifications/initialized | 202 | 36.9 ms | — | — |
| 3 | GET | （SSE 探测） | 405 | 140 ms | — | — |
| 4 | POST | tools/list | 200 | 207.9 ms | application/json; charset=utf-8 | — |
| 5 | POST | tools/call | 200 | 145.8 ms | application/json; charset=utf-8 | — |
| 6 | POST | tools/call | 200 | 365.8 ms | application/json; charset=utf-8 | — |
| 7 | POST | tools/call | 200 | 316.1 ms | application/json; charset=utf-8 | — |

要点：

- `notifications/initialized` 返回 **202 Accepted**（正常，无 body）。
- 第 3 条是 SDK 在 initialize 之后发起的 **GET SSE 长连接探测**，服务端回 **405 Method Not Allowed**；这是 Streamable HTTP 服务端“不支持独立 SSE 流”的正常表现，SDK 容忍并继续，**不能把 GET 405 当成连接失败**。
- initialize 之后的所有请求都带 `MCP-Protocol-Version: 2025-06-18`（SDK 自动加），鉴权靠 `x-mcp-key` header，全程 HTTPS 直连、无需代理。

### 2.4 工具清单（共 95 个，单页返回，`nextCursor` 为空）

> ⚠️ **工具顺序不稳定**：3 次探测中 demo 每次返回的工具顺序都不同（服务端哈希/集合序），工具**集合**则完全一致。插件里做工具开关时必须以 `tool.name` 为键，绝不能存 index/下标。下表按名称排序便于查阅。

前 10 个（按名称排序）：`add_stocks_to_portfolio_group`、`backtest_auto_event_submit`、`backtest_event_submit`、`backtest_submit`、`backtest_task_list`、`backtest_tasks_status`、`company_finance_search`、`company_report_date_search`、`create_portfolio_group`、`document_access`

| # | 工具名 | required（inputSchema 顶层必填） |
|---:|---|---|
| 1 | `add_stocks_to_portfolio_group` | `stockNames` |
| 2 | `backtest_auto_event_submit` | `prompt` |
| 3 | `backtest_event_submit` | `event_rules` |
| 4 | `backtest_submit` | `prompt` |
| 5 | `backtest_task_list` | — |
| 6 | `backtest_tasks_status` | `taskId` |
| 7 | `company_finance_search` | `querys`, `reportDates`, `searchData` |
| 8 | `company_report_date_search` | `companyInfos` |
| 9 | `create_portfolio_group` | `groupName` |
| 10 | `document_access` | `documentId` |
| 11 | `document_path` | `documentId` |
| 12 | `document_search` | — |
| 13 | `document_tag_list` | — |
| 14 | `document_tag_update` | `documentId` |
| 15 | `document_tree` | — |
| 16 | `document_update` | — |
| 17 | `document_upload` | — |
| 18 | `futures_contracts` | `market`, `symbol` |
| 19 | `futures_kline` | `market`, `symbol`, `type` |
| 20 | `futures_price` | `market`, `symbol` |
| 21 | `get_bond_basic_info` | `query` |
| 22 | `get_bond_financial_data` | `query` |
| 23 | `get_bond_highfreq_quotes` | `symbols`, `indicators`, `data_mode` |
| 24 | `get_bond_market_data` | `query` |
| 25 | `get_bond_special_data` | `query` |
| 26 | `get_company_events` | — |
| 27 | `get_economic_indicator_data` | `index_name` |
| 28 | `get_etf_fund_flow_aggregate` | `group_by` |
| 29 | `get_etf_fund_flow_detail` | — |
| 30 | `get_exchange_fund_quote_history` | `query_text`, `start_date`, `end_date` |
| 31 | `get_financial_snapshot` | `queries` |
| 32 | `get_fund_holdings` | `query_text` |
| 33 | `get_fund_share_perf_risk` | `query_text` |
| 34 | `get_fund_snapshot` | `query_text` |
| 35 | `get_index_kline` | `query`, `period_type`, `start_datetime`, `end_datetime` |
| 36 | `get_industry_indicator_data` | `query` |
| 37 | `get_main_business_segments` | `companyInfos`, `reportDates`, `searchData`, `itemClassify` |
| 38 | `get_manager_detail` | `query_text` |
| 39 | `get_manager_tenure_perf` | `query_pm` |
| 40 | `get_north_south_capital` | `info_type` |
| 41 | `get_overseas_index_data` | `symbols` |
| 42 | `get_stock_details` | `queries` |
| 43 | `get_stock_fund_picks` | `stock_list`, `fund_type` |
| 44 | `get_stock_industry_fund_holders` | `market`, `query_dimension` |
| 45 | `get_stock_kline` | `query`, `freq` |
| 46 | `getStockProfitForecast` | `queries` |
| 47 | `indicatorCalendarRetrieve` | — |
| 48 | `indicatorDataRetrieve` | — |
| 49 | `indicatorInfoRetrieve` | `indicatorId` |
| 50 | `indicatorNameRetrieve` | — |
| 51 | `meeting_activity_list` | — |
| 52 | `meeting_recording_delete` | `meetingRecordingId` |
| 53 | `meeting_recording_list` | — |
| 54 | `meeting_recording_submit` | `meetingInfo` |
| 55 | `official_account_subscription` | — |
| 56 | `official_account_subscription_list` | — |
| 57 | `parseFile` | `fileUrl` |
| 58 | `pricePerformance` | `queries` |
| 59 | `rename_portfolio_group` | `oldName`, `newName` |
| 60 | `research_activity_list` | — |
| 61 | `research_hot_data_query` | `contentType`, `startTime`, `endTime` |
| 62 | `research_query` | `type` |
| 63 | `screen_funds` | — |
| 64 | `screenerStock` | `page`, `size`, `sort` |
| 65 | `search_economic_indicators` | `topic` |
| 66 | `search_industry_indicators` | `query` |
| 67 | `search_popular_roadshow` | `popularStartTime`, `popularEndTime` |
| 68 | `searchAnalystComments` | `query` |
| 69 | `searchAnnouncementReport` | `query` |
| 70 | `searchChart` | `query` |
| 71 | `searchdemoResource` | `query`, `filterImage` |
| 72 | `searchCompanyOperatingData` | `query` |
| 73 | `searchDocChunks` | — |
| 74 | `searchDomesticReports` | `query`, `filterImage` |
| 75 | `searchForeignReports` | `query`, `filterImage` |
| 76 | `searchFundAnnouncement` | `query` |
| 77 | `searchIndexConstituents` | `queries` |
| 78 | `searchIndexQuotation` | — |
| 79 | `searchMyDoc` | `query` |
| 80 | `searchMyKnowledge` | `query` |
| 81 | `searchMySummary` | `query` |
| 82 | `searchRoadshowSummary` | `query` |
| 83 | `self_meeting_create` | `subject`, `stime`, `etime` |
| 84 | `self_meeting_list` | — |
| 85 | `shareholder_details` | `stockKeywords`, `holderType` |
| 86 | `stock_analyze_result` | `taskId` |
| 87 | `stock_analyze_submit` | `prompt` |
| 88 | `stock_group_list` | — |
| 89 | `strategy_list` | — |
| 90 | `tencent_vod_create_image_task` | — |
| 91 | `tencent_vod_query_image_task` | `taskId` |
| 92 | `tencent_vod_upload_ref_image` | `ossUrl` |
| 93 | `watchlist_stock_list` | — |
| 94 | `wechat_article_query` | `wechatArticleScope` |
| 95 | `wechat_opinion_list` | — |

统计：95 个工具中 **25 个零必填参数**（如 `document_search`、`document_tree`、`stock_group_list`）；**0 个**声明 `annotations`，**0 个**声明 `outputSchema`。

### 2.5 真实 tools/call（3 次，均为只读类）

| # | 工具 | 入参 | 结果 | 耗时 | 返回摘要 |
|---:|---|---|---|---:|---|
| 1 | `backtest_task_list` | `{}` | ⚠️ isError | 148.2 ms | 服务端返回 isError：call failed, status: 500 → “当前接口为 GET 请求，仅支持 URL query string 传参，不接受 JSON 请求体” |
| 2 | `document_search` | `{}` | ✅ 成功 | 366.8 ms | 成功：云文档查询结果，共 1894 条，当前第 1 页，每页 10 条 + markdown 表格（文档 ID、标题、标签、类型、更新时间、链接） |
| 3 | `document_tag_list` | `{}` | ✅ 成功 | 317.3 ms | 成功：共 1065 个标签 + 标签表（标签 ID、标签名、类型=industry/stock、关联文档数） |

说明：

- `document_search` / `document_tag_list` 是零参只读工具，适合作为**开关验证的 canary**：能查到 1894 条云文档 / 1065 个标签，返回内容有业务语义、无副作用。
- `backtest_task_list` 暴露了一个**服务端实现坑**：tools/call 的 HTTP 是 200，但 **MCP 结果 isError=true**（服务端工具内部报 500）。可见“服务器连通 + 工具在列表里”≠“该工具能跑”；插件的连接测试不要用任意业务工具当探针，否则会误报。

### 2.6 负向测试（错误 key）

- 用一条伪造的 key 请求：`HTTP 401 Unauthorized`，响应体 `{"allowed":false,"code":401,"reason":"MCP Key 无效或已失效"}`；SDK 侧抛 `Error: HTTP 401 Unauthorized`。
- 脚本随后降级 fetch 复验：对 3 个历史协议版本各发一次 `initialize`，**全部 401**（`401/119.2ms、401/36.1ms、401/36.5ms`）。
- 结论：demo 在 **initialize 阶段**就做鉴权，401 + 中文 reason 很适合直接回显给用户。

---

## 3. 目标 2：pharmcube（profile 里已配置但 `disabled: true`）

### 3.1 配置（脱敏，取自 `cordis.patch.yml`）

```yaml
- id: mcp-pharmcube
  name: '@deepseek-ai/dsh-mcp-client'
  disabled: true            # 当前被停用
  config:
    serverName: pharmcube
    transport: streamable-http
    url: https://mcp-openapi.pharmcube.com/mcp
    headers:
      Authorization: 'Bearer <redacted>'      # 明文只在环境变量 PHARMCUBE_TOKEN
    toolCallTimeoutMs: 120000
    failOnStartupError: false
```

### 3.2 握手结果（initialize）

| 项目 | 实测值 |
|---|---|
| 协商协议版本 | `2025-11-25`（服务端接受客户端最高版本 2025-11-25） |
| serverInfo | `{"name":"pharmcube_openapi_mcp_server","version":"1.0.0"}` |
| mcp-session-id | **无**（响应头未下发） |
| 首包（initialize 响应头） | `185.1 / 142.1 / 140.2` ms（3 次），均值 `155.8` ms |

### 3.3 HTTP 流水

| # | 方法 | JSON-RPC method | HTTP 状态 | 首包耗时 | 响应 content-type | mcp-session-id |
|---:|---|---|---:|---:|---|---|
| 1 | POST | initialize | 200 | 185.1 ms | application/json;charset=UTF-8 | — |
| 2 | POST | notifications/initialized | 202 | 44.7 ms | — | — |
| 3 | GET | （SSE 探测） | 405 | 139.1 ms | — | — |
| 4 | POST | tools/list | 200 | 196.8 ms | application/json;charset=UTF-8 | — |
| 5 | POST | tools/call | 200 | 134.2 ms | application/json;charset=UTF-8 | — |
| 6 | POST | tools/call | 200 | 574.7 ms | application/json;charset=UTF-8 | — |

同样：notifications 202、GET SSE 405 被容忍、无 session id。

### 3.4 工具清单（共 36 个，单页返回）

> pharmcube 的工具顺序 3 次探测完全一致（稳定），但仍建议以 name 为键。

前 10 个（服务端返回顺序）：`pharmcube-mcp-companyMA`、`pharmcube-mcp-clinicalTrialTopic`、`pharmcube-mcp-drugBaseLiteCN`、`pharmcube-mcp-epidemiology`、`pharmcube-mcp-diseaseDetail`、`pharmcube-mcp-drugBaseCountCN`、`pharmcube-mcp-drugDeal`、`pharmcube-mcp-drugPatent`、`pharmcube-mcp-drugClinicalPaper`、`pharmcube-mcp-applicationCN`

| # | 工具名 | required（inputSchema 顶层必填） |
|---:|---|---|
| 1 | `pharmcube-mcp-companyMA` | `pageNo` |
| 2 | `pharmcube-mcp-clinicalTrialTopic` | `pageNo` |
| 3 | `pharmcube-mcp-drugBaseLiteCN` | `pageNo`, `pageSize` |
| 4 | `pharmcube-mcp-epidemiology` | `pageNo` |
| 5 | `pharmcube-mcp-diseaseDetail` | `disease`, `pageNo` |
| 6 | `pharmcube-mcp-drugBaseCountCN` | — |
| 7 | `pharmcube-mcp-drugDeal` | `dateFrom`, `dateTo`, `pageNo` |
| 8 | `pharmcube-mcp-drugPatent` | `pageNo` |
| 9 | `pharmcube-mcp-drugClinicalPaper` | `drugUID`, `pageNo` |
| 10 | `pharmcube-mcp-applicationCN` | `pageNo` |
| 11 | `pharmcube-mcp-trialResultTC` | `nctId`, `pageNo` |
| 12 | `pharmcube-mcp-drugClinicalResult` | `pageSize`, `pageNo` |
| 13 | `pharmcube-mcp-targetDetail` | `target`, `pageNo` |
| 14 | `pharmcube-mcp-investEvent` | `dateFrom`, `dateTo`, `pageNo` |
| 15 | `pharmcube-mcp-drugBaseCN` | `pageSize`, `pageNo` |
| 16 | `pharmcube-mcp-drugApprDisease` | `drugUIDList`, `pageNo` |
| 17 | `pharmcube-mcp-guidelineRegimen` | `pageNo` |
| 18 | `pharmcube-mcp-drugNonClinicalPaper` | `drugUID`, `pageNo` |
| 19 | `pharmcube-mcp-medicalMeeting` | `pageNo` |
| 20 | `pharmcube-mcp-newsSearch` | `query`, `diseases`, `targets`, `drugs`, `companies`, `primary_type`, `max_results`, `offset`, `published_after`, `published_before`, `entity_match_mode` |
| 21 | `pharmcube-mcp-drugDisease` | `drugUIDList`, `pageNo` |
| 22 | `pharmcube-mcp-translMed` | `pageNo` |
| 23 | `pharmcube-mcp-drugLabelAndReviewDocument` | `pageNo` |
| 24 | `pharmcube-mcp-healthInsurance` | `pageNo` |
| 25 | `pharmcube-mcp-drugApprovedCN` | `pageNo` |
| 26 | `pharmcube-mcp-drugTrace` | `pageNo` |
| 27 | `pharmcube-mcp-frontierPatent` | `pageNo` |
| 28 | `pharmcube-mcp-drugPriceCN` | `pageNo` |
| 29 | `pharmcube-mcp-drugRightsTerritory` | `pageNo` |
| 30 | `pharmcube-mcp-clinicalPI` | `pageNo` |
| 31 | `pharmcube-mcp-clinicalSite` | `pageNo` |
| 32 | `pharmcube-mcp-companies` | `pageSize`, `pageNo` |
| 33 | `pharmcube-mcp-mcpAccountBalanceQuery` | — |
| 34 | `pharmcube-mcp-mcpAccountOrderQuery` | `startTime`, `endTime`, `pageNo` |
| 35 | `pharmcube-mcp-mcpAccountCollectedDataPercentQuery` | — |
| 36 | `pharmcube-mcp-mcpAccountPlanQuery` | — |

统计：36 个工具中 **4 个零必填参数**（`pharmcube-mcp-drugBaseCountCN`、`pharmcube-mcp-mcpAccountBalanceQuery`、`pharmcube-mcp-mcpAccountCollectedDataPercentQuery`、`pharmcube-mcp-mcpAccountPlanQuery`）；**0 个**声明 `annotations`，**0 个**声明 `outputSchema`。绝大多数工具必填 `pageNo`（分页）。

### 3.5 真实 tools/call（2 次）

| # | 工具 | 入参 | 结果 | 耗时 | 返回摘要 |
|---:|---|---|---|---:|---|
| 1 | `pharmcube-mcp-mcpAccountBalanceQuery` | `{}` | ✅ 成功 | 136 ms | 返回账户余额数值 `18707`（纯文本 content） |
| 2 | `pharmcube-mcp-mcpAccountCollectedDataPercentQuery` | `{}` | ✅ 成功 | 576.4 ms | 返回 36 个工具的采集配额数组（mcpToolName / collectedPercent / maxPercent，如 companyMA 0.0%/50%、epidemiology 0.17%/70%） |

两次都是零参只读工具、无副作用；第二次（配额查询）首轮 1.4 s、后续两轮约 0.56 s，属**首调偏慢**的典型，插件的调用超时不要小于 10 s（profile 里配的 120 s 很宽裕）。

### 3.6 负向测试（错误 token）——**最重要的坑**

- 用伪 token 请求：`initialize` 返回 **HTTP 200 且照常完成握手**（`2025-06-18`），`notifications/initialized` 返回 202；直到 `tools/list` 才返回 HTTP 200 + JSON-RPC error `{"code":-32001,"message":"Unauthorized"}`。
- 即：**pharmcube 的鉴权发生在 tools/list 阶段，而不是 initialize**。插件“测试连通性”如果只测 TCP / 只发 initialize，会把坏 token 误报成「连接成功」。**必须把 tools/list 成功作为连通性判定条件**。

---

## 4. 耗时统计（3 轮采样）

| 指标 | demo-mcp | pharmcube |
|---|---:|---:|
| initialize 响应头（TTFB） | 175.6 / 166.4 / 238.9 ms → 均值 **193.6 ms** | 185.1 / 142.1 / 140.2 ms → 均值 **155.8 ms** |
| initialize 阶段（SDK 计时） | 均值 **267.0 ms** | 均值 **204.4 ms** |
| tools/list（95 / 36 工具，各 1 页） | 均值 **368.5 ms** | 均值 **197.4 ms** |
| 单次 tools/call | 148.2 ms（isError）/ 366.8 ms / 317.3 ms | 136 ms / 576.4 ms |
| 整轮探测（initialize + list + 2~3 次调用） | 均值 **1529.4 ms** | 均值 **1102 ms** |

体感：**“连接 + 列工具”稳定在 0.6–1.2 s 量级**（不含业务调用），跨公网直连无代理。插件「测试连通性」按钮超时建议 ≥15 s（留足 TLS 握手 + 网络抖动），并显示分阶段耗时（initialize / tools-list / 总耗时）便于排障。

---

## 5. 原生 fetch 降级路径验证（不依赖 SDK）

`node scripts/probe-mcp.mjs --raw --no-call` 实测：`raw-fetch` 模式、协议 `2025-06-18`、工具 **95 个**，HTTP 流水 `POST 200 → POST 202 → POST 200`。

说明：手写 JSON-RPC 需要 `Accept: application/json, text/event-stream`、POST `initialize` → POST `notifications/initialized`（202）→ POST `tools/list`（按 `nextCursor` 翻页）→ POST `tools/call`；initialize 后要带 `MCP-Protocol-Version`，若有 `mcp-session-id` 则后续请求要回传。两个目标都无 session，故降级路径实现更简单。

---

## 6. 对「自定义 MCP 管理器」插件的直接启示（关键坑）

1. **连通性判定必须跑到 tools/list**。pharmcube 的错误 token 在 initialize 阶段返回 200；只测握手/只测端口一定误报。建议“测试连通性”= initialize + tools/list（即 `--no-call` 语义），并把服务器错误体原样回显（demo 会给中文 reason）。
2. **GET SSE 405 不是失败**。两个服务端都不支持独立 SSE 流（GET 405），Streamable HTTP 单次 POST 足以完成全部交互。插件不要以 GET 405 / 无 mcp-session-id 判失败。
3. **两端都是无状态（无 mcp-session-id）**：插件不需要持久化 session；但要实现“有 session 时回传”的分支，以兼容其他 MCP 服务端。
4. **工具顺序不稳定**（demo 每轮都变、pharmcube 稳定）：工具开关的持久化键必须是 `serverName + tool.name`，UI 列表建议按 name 排序，避免每次刷新顺序乱跳。
5. **没有 annotations / outputSchema**：无法用 readOnlyHint 自动识别只读工具；“默认全开”可行，但“按只读/写分类”“危险工具二次确认”只能按名称/描述启发式，且不能承诺准确。
6. **工具名映射**：DSH 侧统一为 `mcp__<serverName>__<rawName>`（如 `mcp__pharmcube__pharmcube-mcp-companyMA`），由 @deepseek-ai/dsh-mcp-client 生成；管理器的工具开关必须基于这个 namespace 规则，不能改原始名（tools/call 必须发 rawName）。
7. **@deepseek-ai/dsh-mcp-client 本身没有 per-tool 开关配置**（只有整条服务器配置 + disabled）。因此「关掉某些工具」必须在管理器插件内自行实现：在服务器 tools/list 结果上做过滤后再注册，或对已注册工具做调用拦截；仅靠改 profile 的 `cordis.patch.yml` 只能做到“整台服务器开关”。
8. **整台服务器开关有两条路**：(a) profile 的 `cordis.patch.yml` 里给该条设置 `disabled: true` 并重启 dsh web（当前 pharmcube 就是这么停用的，注释还写明“取消下一行注释，然后重启 dsh web”）；(b) 由插件自己控制连接/注册生命周期（不重启）。插件想做到“点一下开关即时生效”，必须走 (b) 或依赖 DSH 的 HMR/config 重载能力，不能指望改 YAML 立刻生效。
9. **服务端工具可能自身报错**（`backtest_task_list` 空参 500 且以 isError 返回）：连接测试不要拿业务工具当探针，避免把“某工具坏了”误报成“服务器连不上”。
10. **协议版本不要硬编码**：客户端最高 2025-11-25，demo 回落到 2025-06-18、pharmcube 用 2025-11-25。以 initialize 返回值作为真实版本记录/展示即可。

---

## 7. 当前 3080 端口 dsh web 进程调查（只读）

| 项目 | 实测值 |
|---|---|
| 监听 | `127.0.0.1:3080`（仅回环地址），OwningProcess = **23280** |
| 进程 | `node.exe`（`D:\Program Files\nodejs\node.exe`），起始 **2026-10-20 19:28:32 (+08:00)** |
| 命令行 | `“D:\Program Files\nodejs\node.exe” C:\Users\Xingy\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\lib\bin.js web` |
| 父进程 | PPID **26048**，该 PID 已不存在（启动它的终端/父进程已退出，进程被孤儿化） |
| 启动方式 | **npm global 安装包直接跑**：`C:\Users\Xingy\AppData\Roaming\npm\dsh.cmd` → `bin.js web`；`dsh --version` = `0.2.1-rc.2` |
| profile | `web`（`C:\Users\Xingy\.dsh\profiles\web`），即 `dsh --profile web` 的默认 web 配方 |
| pm2 | **未托管**。本机装了 pm2（全局 `pm2.ps1`），pm2 daemon（PID 6948）在跑，但 `pm2 list` 没有任何应用；dsh web 也不在其进程树里 |
| 子进程 | 多个 Playwright MCP（每会话一个浏览器）与 `dsh-subprocess-local` runner / `dsh-ptc-runtime-node` 子进程，均以 23280 为父 |
| 日志 | `C:\Users\Xingy\.dsh\logs\startup-2026-10-20T11-29-42.094Z-*.log`：记录的是 19:29:42 **另一次** dsh web 启动失败（`listen EADDRINUSE: address already in use 127.0.0.1:3080`），可反证当前实例是 19:28:32 那次成功启动的 |

**结论：这不是 Windows 服务、不是 pm2 守护进程，而是普通 node 进程，父进程已退出 → 一旦杀掉不会自动拉起，必须手动重启。**

### 7.1 重启加载插件/配置的参考流程（本次**未执行**，交由 lead/用户操作）

```powershell
# 0) 前置：确认改的是 C:\Users\Xingy\.dsh\profiles\web\cordis.patch.yml（profile 补丁层），改完才需要重启
# 1) 停止当前实例（PID 23280；其父进程已退出，没有可用的控制台 Ctrl+C）
Stop-Process -Id 23280
# 2) 确认端口释放（应无输出）
Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue
# 3) 重新启动（建议加 --no-open 避免又弹一个浏览器标签；用持久终端或 Start-Process，勿挂在会被关闭的 shell 上）
dsh web --no-open          # 等价于 dsh --profile web --no-open
# 或后台方式：
Start-Process -FilePath 'C:\Users\Xingy\AppData\Roaming\npm\dsh.cmd' -ArgumentList 'web','--no-open' -WindowStyle Hidden
# 4) 等待并验证
Invoke-WebRequest http://127.0.0.1:3080 -UseBasicParsing | Select-Object StatusCode
```

注意事项：

- **不要**在旧进程还活着时直接 `dsh web`：会 EADDRINUSE 启动失败（上面的日志就是实例）。
- **不要**用 pm2 管理/重启它（当前未托管；pm2 强行接管会改变用户现有会话/进程模型）。
- 重启会中断用户当前 GUI 会话（会话数据在 `~/.dsh/sessions` 持久化，但页面需刷新），因此**必须由用户/lead 决定时机**；本次调研全程未动它。
- `cordis.patch.yml` 顶部注释明确写了“改完需重启 dsh web 生效”；插件（第三方包）安装到 profile 后同理。

---

## 8. 产物清单

| 文件 | 说明 |
|---|---|
| `scripts/probe-mcp.mjs` | 可复跑探针（SDK 优先 + 原生 fetch 降级 + 密钥打码 + HTTP/耗时/工具清单/真实调用） |
| `docs/recon/connectivity.md` | 本报告 |
| `docs/recon/raw/probe-run1.json` / `probe-run2.json` / `probe-run3.json` | 3 轮完整探测（含调用）结构化结果，用于耗时统计 |
| `docs/recon/raw/probe-inspect.json` | initialize + tools/list 明细（含全部工具 required / annotations 字段） |
| `docs/recon/raw/probe-rawmode.json` | 原生 fetch 降级路径验证 |
| `docs/recon/raw/probe-negative-demo.json` / `probe-negative-pharmcube.json` | 错误凭据负向测试 |

> 所有 JSON 中 `x-mcp-key` / `Authorization` 均已打码（前 6 后 4），可直接分享；明文只存在于运行时的环境变量与用户 profile 配置中。
