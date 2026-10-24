#!/usr/bin/env node
/**
 * verify-listings.mjs — 一条命令核验「本插件被哪些市场收录」的可复核证据。
 *
 * 每个市场登记一条可在线访问的证据 URL（数据端点或详情页）与期望出现的标记。
 * 默认只跑轻量集（< 5MB），--full 追加大文件端点（20~50MB，慢但更全）。
 *
 * 用法：
 *   node scripts/verify-listings.mjs           # 轻量核验
 *   node scripts/verify-listings.mjs --full    # 含大文件端点
 *   node scripts/verify-listings.mjs --json    # 输出机器可读结果
 *
 * 退出码：0 = 全部通过；1 = 有失败项；2 = 运行时错误。
 */
const MARK = "dsh-mcp-tools";
const SLUG = "hxlog/dsh-mcp-tools";

const LIGHT = [
  ["awesome-dsh-plugin 详情页", "https://awesome-dsh-plugin.com/p/hxlog/dsh-mcp-tools/"],
  ["dsh-plugin.org 详情页", "https://dsh-plugin.org/plugins/hxlog/dsh-mcp-tools"],
  ["dsh.so 详情页", "https://www.dsh.so/artifact/dsh-mcp-tools/"],
  ["dsh-plugin.store 详情页", "https://dsh-plugin.store/p/hxlog/dsh-mcp-tools"],
  ["dshfind.com 详情页", "https://dshfind.com/zh/plugins/hxlog/dsh-mcp-tools"],
  ["dshpluginhub.ai 详情页", "https://dshpluginhub.ai/plugins/dsh-mcp-tools"],
  ["dshhub.org 详情页", "https://dshhub.org/plugins/hxlog/dsh-mcp-tools"],
  ["dshhub.co 详情页", "https://www.dshhub.co/en/plugin/hxlog/dsh-mcp-tools"],
  ["dsh.pub 详情页", "https://dsh.pub/en/plugins/dsh-mcp-tools/"],
  ["dsh-plugins-mp.com 详情页", "https://dsh-plugins-mp.com/plugins/hxlog--dsh-mcp-tools"],
  ["unStone dsh-xray 能力卡", "https://unstone.github.io/dsh-xray/p/hxlog__dsh-mcp-tools.html"],
  ["linny006 MCP 索引", "https://linny006.github.io/mcp-servers-live/r/hxlog/dsh-mcp-tools/index.html"],
  ["mydsh.dev 目录数据", "https://mydsh.dev/assets/catalog-index.json"],
  ["dpharness 详情页", "https://dpharness.com/plugin/hxlog/dsh-mcp-tools"],
  ["dshmk.com 插件详情页", "https://dshmk.com/plugins/1427825895"],
  ["hashgraph awesome-ai-plugins README", "https://raw.githubusercontent.com/hashgraph-online/awesome-ai-plugins/main/README.md"],
  ["dsh-plugin.market 详情 API", "https://dsh-plugin.market/api/plugins/hxlog/dsh-mcp-tools"],
  ["dshmarketplace.dev 搜索 API", "https://dshmarketplace.dev/api/v1/plugins?q=dsh-mcp-tools"],
  ["deepseekplugin.org 投稿 API", "https://deepseekplugin.org/api/submissions?slug=hxlog-2f-dsh-2d-mcp-2d-tools"],
  ["XingLingQAQ catalog", "https://raw.githubusercontent.com/XingLingQAQ/dsh-plugin-registry/main/catalog.json"],
  ["dshopen.org index", "https://dshopen.org/index.json"],
  ["dshmarket.com index", "https://dshmarket.com/index.json"],
  ["npm dsh-plugin-catalog", "https://unpkg.com/dsh-plugin-catalog/index.json"],
];

const FULL = [
  ["awesome-dsh-plugin canonical feed", "https://awesome-dsh-plugin.com/plugins.json"],
  ["hoyyang registry", "https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/registry.json"],
  ["vbarter registry", "https://raw.githubusercontent.com/vbarter/dsh-plugin-registry/main/data/plugins.json"],
  ["ukinch605 hub registry", "https://raw.githubusercontent.com/ukinch605/awesome-dsh-hub/main/registry/plugins.json"],
  ["dsh.pub plugins.json", "https://dsh.pub/plugins.json"],
  ["realguan dsh-index", "https://realguan.github.io/dsh-plugin-market/dsh-index.json"],
  ["dsh-go catalog", "https://raw.githubusercontent.com/coeasy/dsh-go/main/catalog/plugins.json"],
  ["dsh-go registry-v4", "https://raw.githubusercontent.com/coeasy/dsh-go/main/catalog/registry-v4.json"],
  ["xrj dsh-market 集市数据", "https://dsh-market.pages.dev/data.json"],
  ["DSH-Plugin-Hub 静态索引数据", "https://raw.githubusercontent.com/usertianziyang/DSH-Plugin-Hub/main/public/plugins.json"],
];

const args = new Set(process.argv.slice(2));
const jsonOut = args.has("--json");
const targets = args.has("--full") ? [...LIGHT, ...FULL] : LIGHT;

async function attempt(url) {
  const res = await fetch(url, { headers: { "user-agent": "dsh-mcp-tools verify-listings" } });
  const text = res.ok ? await res.text() : "";
  return { status: res.status, text };
}

async function check([name, url]) {
  const started = Date.now();
  // 网络偶发失败（status 0）重试两次；HTTP 错误码不重试，直接报出来。
  for (let i = 0; i < 3; i++) {
    try {
      const { status, text } = await attempt(url);
      const hit = text.includes(MARK) || text.includes(SLUG);
      return { name, url, status, bytes: text.length, hit, ms: Date.now() - started, attempts: i + 1 };
    } catch (err) {
      if (i === 2) {
        return { name, url, status: 0, bytes: 0, hit: false, ms: Date.now() - started, attempts: i + 1, error: String(err && err.message || err) };
      }
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

(async () => {
  const results = [];
  for (const t of targets) {
    const r = await check(t);
    results.push(r);
    if (!jsonOut) console.log((r.hit ? "✅" : "❌") + " " + r.name.padEnd(30) + " " + String(r.status).padEnd(4) + " " + (r.bytes / 1024).toFixed(0).padStart(6) + "KB " + String(r.ms).padStart(5) + "ms " + r.url);
  }
  const pass = results.filter((r) => r.hit).length;
  if (jsonOut) console.log(JSON.stringify({ generatedAt: new Date().toISOString(), pass, total: results.length, results }, null, 2));
  else console.log("\n收录证据核验: " + pass + "/" + results.length + " 通过" + (pass === results.length ? " ✅" : " ⚠️ 见上方 ❌ 行"));
  process.exit(pass === results.length ? 0 : 1);
})();

