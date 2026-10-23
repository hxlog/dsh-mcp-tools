#!/usr/bin/env node
/**
 * verify-dsh-go.mjs — 核验 dsh-go（coeasy/dsh-go）官方目录里本插件的收录状态。
 *
 * 背景：dsh-go 每 6 小时跑一次 sync（cron: 18 0/6/12/18 * * * UTC），
 * 从 GitHub topic + dsh-package.json manifest 观测（observeDshManifest）刷新 catalog/plugins.json。
 * 我们首次被扫到时 verified=false、manifest_file=null；等它跑完下一轮 sync 才应翻成 verified=true。
 *
 * 用法：node scripts/verify-dsh-go.mjs [--wait]
 *   --wait  若尚未翻 verified，每 60s 轮询一次，最多 15 分钟（适合挂到 sync 之后自动盯）
 *
 * 退出码：0 = 已 verified；1 = 尚未同步/字段不符；2 = 网络或解析失败。
 */
const OWNER = "hxlog";
const NAME = "dsh-mcp-tools";
const EXPECTED = { verified: true, manifest_file: "dsh-package.json", package_version: "1.0.2" };
const RAW = "https://raw.githubusercontent.com/coeasy/dsh-go/main/catalog";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "dsh-mcp-tools verify" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function snapshot() {
  const [meta, catalog] = await Promise.all([
    fetchJson(`${RAW}/meta.json`),
    fetchJson(`${RAW}/plugins.json`),
  ]);
  const entries = Array.isArray(catalog) ? catalog : (catalog.plugins || catalog.items || []);
  const entry = entries.find((e) => e.full_name === `${OWNER}/${NAME}` || e.slug === NAME);
  return { lastSync: meta?.last_sync?.at, scanned: meta?.last_sync?.scanned, included: meta?.last_sync?.included, total: entries.length, entry };
}

function report(snap) {
  const e = snap.entry;
  console.log("dsh-go 官方目录核验");
  console.log(`  catalog 最近同步 : ${snap.lastSync || "?"}（scanned ${snap.scanned ?? "?"} / included ${snap.included ?? "?"}，共 ${snap.total} 条）`);
  if (!e) {
    console.log("  ❌ 目录中还没有本插件条目（可能尚未被扫到）");
    return false;
  }
  console.log(`  slug            : ${e.slug}`);
  console.log(`  full_name       : ${e.full_name}`);
  console.log(`  first_seen      : ${e.first_seen}`);
  console.log(`  stars / license : ${e.stars} / ${e.license}`);
  console.log(`  verified        : ${e.verified}${e.verified === EXPECTED.verified ? " ✅" : " ⏳"}`);
  console.log(`  manifest_file   : ${e.manifest_file ?? "null"}${e.manifest_file === EXPECTED.manifest_file ? " ✅" : " ⏳"}`);
  console.log(`  package_version : ${e.package_version ?? "null"}${e.package_version === EXPECTED.package_version ? " ✅" : ""}`);
  if (e.capabilities?.length) console.log(`  capabilities    : ${e.capabilities.join(", ")}`);
  if (e.install_cmd) console.log(`  install_cmd     : ${e.install_cmd}`);
  const ok = e.verified === EXPECTED.verified && e.manifest_file === EXPECTED.manifest_file;
  console.log(ok
    ? "  ✅ 已按 dsh-package.json 通过 manifest 校验（verified=true）"
    : "  ⏳ 尚未翻 verified：等 dsh-go 下一轮 sync（cron 18 0/6/12/18 UTC = 08:18/14:18/20:18/02:18 +08）后再跑一次");
  return ok;
}

const wait = process.argv.includes("--wait");
const deadline = Date.now() + 15 * 60 * 1000;
(async () => {
  for (;;) {
    let snap;
    try { snap = await snapshot(); } catch (err) { console.error(`  ❌ ${err.message}`); process.exit(2); }
    const ok = report(snap);
    if (ok) process.exit(0);
    if (!wait || Date.now() > deadline) process.exit(1);
    console.log("  … 60s 后重试");
    await sleep(60_000);
  }
})();
