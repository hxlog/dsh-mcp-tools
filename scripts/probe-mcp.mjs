#!/usr/bin/env node
/**
 * probe-mcp.mjs — DSH「自定义 MCP 管理器」连通性探针（可复跑）
 * ---------------------------------------------------------------------------
 * 用途：
 *   对指定 MCP 服务器走 Streamable HTTP 做一次完整真实探测：
 *     initialize  → notifications/initialized → tools/list（分页） → tools/call（只读工具）
 *   记录协商协议版本、serverInfo、工具清单与 required、真实调用结果、HTTP 状态码、
 *   mcp-session-id 处理、首包延迟与各阶段耗时。
 *
 * 依赖：
 *   优先复用 DSH profile 里已安装的 @modelcontextprotocol/client（v2.2.0）。
 *   SDK 不可用时自动降级为原生 fetch 手写 JSON-RPC（--raw 可强制）。
 *
 * 安全：
 *   API key / Bearer 一律从环境变量读取，不落盘；输出中对密钥和敏感 header 打码
 *   （保留前 6 位 + 后 4 位）。
 *
 * 用法：
 *   # PowerShell
 *   $env:MCP_KEY="cm_xxx"; $env:PHARMCUBE_TOKEN="xxx"
 *   node scripts/probe-mcp.mjs                       # 探测全部目标
 *   node scripts/probe-mcp.mjs --target=comein       # 只探一个
 *   node scripts/probe-mcp.mjs --no-call             # 只做 initialize + tools/list
 *   node scripts/probe-mcp.mjs --raw                 # 强制原生 fetch 手写 JSON-RPC
 *   node scripts/probe-mcp.mjs --json-out=docs/recon/raw/probe.json
 *
 * 可选环境变量：
 *   MCP_KEY            目标 1（comein-mcp-all）的 x-mcp-key
 *   PHARMCUBE_TOKEN    目标 2（pharmcube）的 Bearer token
 *   MCP_SDK_PATH       覆盖 @modelcontextprotocol/client 的 dist/index.mjs 绝对路径
 *   MCP_PROTOCOL_VERSION  原生 fetch 模式下 initialize 首选的协议版本
 *
 * 退出码：0 全部目标可用；1 有目标失败；2 参数/环境错误。
 */

import { pathToFileURL } from "node:url";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const PROBE_VERSION = "0.1.0";
const CLIENT_INFO = { name: "dsh-mcp-probe", version: PROBE_VERSION };
const DEFAULT_MAX_TOOLS = 200;
const DEFAULT_TIMEOUT_MS = Number(process.env.MCP_CALL_TIMEOUT_MS || 60000);

// ---------------------------------------------------------------------------
// 目标定义（URL 不是秘密；密钥只从环境变量取）
// ---------------------------------------------------------------------------
const TARGETS = {
  comein: {
    key: "comein",
    label: "comein-mcp-all",
    url: "https://mcp-server-global.comein.cn/mcp-servers/mcp-server-brm",
    transport: "streamable-http",
    envName: "MCP_KEY",
    headers: () => ({ "x-mcp-key": process.env.MCP_KEY }),
    secretEnvNames: ["MCP_KEY"],
  },
  pharmcube: {
    key: "pharmcube",
    label: "pharmcube",
    url: "https://mcp-openapi.pharmcube.com/mcp",
    transport: "streamable-http",
    envName: "PHARMCUBE_TOKEN",
    headers: () => ({ Authorization: "Bearer " + process.env.PHARMCUBE_TOKEN }),
    secretEnvNames: ["PHARMCUBE_TOKEN"],
  },
};

// ---------------------------------------------------------------------------
// 小工具：解析参数 / 打码 / 计时 / 文本摘要
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const out = { targets: [], call: true, raw: false, jsonOut: null, maxTools: DEFAULT_MAX_TOOLS, timeoutMs: DEFAULT_TIMEOUT_MS, callPlan: [] };
  for (const a of argv) {
    if (a === "--no-call") out.call = false;
    else if (a === "--raw") out.raw = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (a.startsWith("--target=")) out.targets.push(...a.slice(9).split(",").map((s) => s.trim()).filter(Boolean));
    else if (a.startsWith("--json-out=")) out.jsonOut = a.slice(11);
    else if (a.startsWith("--max-tools=")) out.maxTools = Math.max(1, Number(a.slice(12)) || DEFAULT_MAX_TOOLS);
    else if (a.startsWith("--timeout-ms=")) out.timeoutMs = Math.max(1000, Number(a.slice(13)) || DEFAULT_TIMEOUT_MS);
    else if (a.startsWith("--call=")) out.callPlan.push(a.slice(7)); // name:{"json":"args"}
    else if (a.startsWith("--")) throw new Error("未知参数: " + a);
  }
  return out;
}

const SECRETS = [];
function collectSecrets() {
  for (const t of Object.values(TARGETS)) {
    for (const n of t.secretEnvNames) if (process.env[n]) SECRETS.push(process.env[n]);
  }
}
function maskSecret(s) {
  if (typeof s !== "string" || s.length === 0) return s;
  if (s.length <= 12) return s.slice(0, 2) + "***" + s.slice(-2);
  return s.slice(0, 6) + "***" + s.slice(-4);
}
function redact(text) {
  if (text == null) return text;
  let s = String(text);
  for (const secret of SECRETS) {
    if (!secret) continue;
    const masked = maskSecret(secret);
    s = s.split(secret).join(masked);
    // Bearer / 前缀空格场景
    s = s.split("Bearer " + secret).join("Bearer " + masked);
  }
  return s;
}
function maskHeaderValue(name, value) {
  if (typeof value !== "string") return value;
  if (/authorization|key|token|secret|cookie/i.test(name)) {
    const m = /^Bearer\s+(.+)$/i.exec(value);
    return m ? "Bearer " + maskSecret(m[1]) : maskSecret(value);
  }
  return value;
}
function maskHeaders(headers) {
  const out = {};
  if (!headers) return out;
  const entries = headers instanceof Headers ? Array.from(headers.entries()) : Object.entries(headers);
  for (const [k, v] of entries) out[k] = Array.isArray(v) ? v.map((x) => maskHeaderValue(k, x)) : maskHeaderValue(k, v);
  return out;
}
function ms(n) {
  return Math.round(n * 10) / 10;
}
function truncate(s, n) {
  s = String(s ?? "");
  return s.length > n ? s.slice(0, n) + "…(+'" + (s.length - n) + " chars)" : s;
}
function errText(e) {
  if (e == null) return "unknown error";
  const parts = [e.name || "Error", e.message || String(e)];
  if (e.code) parts.push("code=" + e.code);
  if (e.statusCode) parts.push("status=" + e.statusCode);
  return redact(parts.join(": "));
}

// ---------------------------------------------------------------------------
// HTTP 追踪：记录每次请求的状态码 / 关键 header / 首包耗时
// ---------------------------------------------------------------------------
function createTracedFetch() {
  const log = [];
  const fetchImpl = async (input, init = {}) => {
    const method = (init.method || "GET").toUpperCase();
    const url = typeof input === "string" ? input : input.url ?? String(input);
    const t0 = performance.now();
    let res;
    try {
      res = await fetch(input, init);
    } catch (e) {
      log.push({ seq: log.length + 1, method, url, status: 0, error: errText(e), headersMs: ms(performance.now() - t0), requestHeaders: maskHeaders(init.headers) });
      throw e;
    }
    const headersMs = performance.now() - t0;
    let rpcMethod = null;
    try {
      if (typeof init.body === "string") {
        const parsed = JSON.parse(init.body);
        rpcMethod = Array.isArray(parsed) ? parsed[0]?.method ?? null : parsed?.method ?? null;
      }
    } catch { /* 非 JSON body：忽略 */ }
    const respHeaders = {};
    for (const k of ["content-type", "mcp-session-id", "mcp-protocol-version", "www-authenticate", "retry-after", "location"]) {
      const v = res.headers.get(k);
      if (v != null) respHeaders[k] = k === "www-authenticate" ? redact(v) : v;
    }
    log.push({
      seq: log.length + 1,
      method,
      rpcMethod,
      url,
      status: res.status,
      statusText: res.statusText,
      headersMs: ms(headersMs),
      requestHeaders: maskHeaders(init.headers),
      responseHeaders: respHeaders,
    });
    return res;
  };
  return { fetchImpl, log };
}

// ---------------------------------------------------------------------------
// SDK 模式
// ---------------------------------------------------------------------------
const SDK_CANDIDATES = [
  process.env.MCP_SDK_PATH,
  "C:/Users/Xingy/.dsh/profiles/web/node_modules/@modelcontextprotocol/client/dist/index.mjs",
  "C:/Users/Xingy/AppData/Roaming/npm/node_modules/@deepseek-ai/dsh/node_modules/@modelcontextprotocol/client/dist/index.mjs",
].filter(Boolean);

async function loadSdk() {
  const errors = [];
  for (const p of SDK_CANDIDATES) {
    try {
      const mod = await import(pathToFileURL(resolve(p)).href);
      if (mod.Client && mod.StreamableHTTPClientTransport) {
        return { mod, path: p, errors };
      }
      errors.push(p + " => 缺少 Client / StreamableHTTPClientTransport 导出");
    } catch (e) {
      errors.push(p + " => " + e.message);
    }
  }
  return { mod: null, path: null, errors };
}

async function sdkProbe(target, opts, traced) {
  const { mod, path } = await loadSdk();
  const result = {
    target: target.key,
    label: target.label,
    url: target.url,
    transport: target.transport,
    mode: "sdk",
    sdkPath: path,
    sdkVersion: null,
    ok: false,
    stages: {},
    tools: [],
    toolCalls: [],
    http: traced.log,
    errors: [],
    secretsMasked: true,
  };
  const sdkPkg = await import("node:fs").then((fs) => {
    try {
      const p = path.replace(/dist[\/\\]index\.mjs$/, "package.json");
      return JSON.parse(fs.readFileSync(p, "utf8")).version;
    } catch {
      return null;
    }
  });
  result.sdkVersion = sdkPkg;

  const headers = target.headers();
  const client = new mod.Client(CLIENT_INFO, { capabilities: {} });
  const transport = new mod.StreamableHTTPClientTransport(new URL(target.url), {
    requestInit: { headers },
    fetch: traced.fetchImpl,
    sessionId: undefined,
  });

  const tStart = performance.now();
  try {
    const tInit = performance.now();
    await client.connect(transport);
    result.stages.initialize = { ok: true, ms: ms(performance.now() - tInit) };
    result.initLatencyMs = ms(traced.log[0]?.headersMs ?? NaN);
    result.protocolVersion = client.getNegotiatedProtocolVersion() ?? transport.protocolVersion ?? null;
    result.serverInfo = redact(JSON.stringify(client.getServerVersion() ?? null));
    result.serverCapabilities = client.getServerCapabilities() ?? null;
    const instructions = client.getInstructions();
    if (instructions) result.instructions = truncate(redact(instructions), 2000);
    result.supportedClientProtocolVersions = mod.SUPPORTED_PROTOCOL_VERSIONS;
    result.clientLatestProtocolVersion = mod.LATEST_PROTOCOL_VERSION;
    result.sessionId = transport.sessionId ?? null;

    if (!client.getServerCapabilities()?.tools) {
      result.errors.push("server 未声明 tools capability，跳过 tools/list");
      result.ok = true;
      return result;
    }

    // tools/list（SDK 内部自动翻页）
    const tList = performance.now();
    const listed = await client.listTools();
    result.stages.toolsList = { ok: true, ms: ms(performance.now() - tList), pages: countToolsListPosts(traced.log) };
    result.toolsTotal = listed.tools.length;
    result.listCursor = listed.nextCursor ?? null;
    result.tools = listed.tools.map((t) => ({
      name: t.name,
      title: t.title ?? null,
      description: truncate(redact(t.description ?? ""), 160),
      inputSchemaType: t.inputSchema?.type ?? null,
      required: Array.isArray(t.inputSchema?.required) ? t.inputSchema.required : [],
      properties: t.inputSchema?.properties ? Object.keys(t.inputSchema.properties) : [],
      annotations: t.annotations ?? null,
      hasOutputSchema: !!t.outputSchema,
    }));
    result.sessionIdAfterList = transport.sessionId ?? null;

    // tools/call：按只读启发式挑选 1-2 个工具
    if (opts.call) {
      const explicit = parseCallPlan(opts.callPlan, target.key);
      const candidates = explicit.length ? explicit : pickReadonlyCandidates(result.tools, 3);
      if (!candidates.length) result.errors.push("未找到可自动安全调用的只读工具（无显式 --call），跳过真实调用");
      let successes = 0;
      for (const cand of candidates) {
        if (successes >= 2) break;
        const def = result.tools.find((t) => t.name === cand.name);
        const args = cand.args ?? synthesizeArgs(def);
        if (args == null) {
          result.toolCalls.push({ tool: cand.name, skipped: true, reason: "required 参数无法安全自动填充（--call 可显式指定）" });
          continue;
        }
        const call = await doSdkCall(client, target, cand.name, args, opts.timeoutMs);
        result.toolCalls.push(call);
        if (call.ok && !call.isError) successes++;
      }
    }

    // 会话清理（MCP 规范：DELETE + mcp-session-id；服务端可返回 405）
    if (transport.sessionId) {
      const tTerm = performance.now();
      try {
        await transport.terminateSession();
        result.stages.terminateSession = { ok: true, ms: ms(performance.now() - tTerm) };
      } catch (e) {
        result.stages.terminateSession = { ok: false, ms: ms(performance.now() - tTerm), error: errText(e) };
      }
    }
    result.ok = true;
  } catch (e) {
    result.errors.push(errText(e));
    result.errorStack = truncate(redact(e?.stack || ""), 4000);
    result.initLatencyMs = traced.log.length ? ms(traced.log[0].headersMs) : null;
    // 尽力从 SDK 内部状态读取信息
    try {
      result.protocolVersion = client.getNegotiatedProtocolVersion() ?? null;
      result.serverInfo = redact(JSON.stringify(client.getServerVersion() ?? null));
      result.sessionId = transport.sessionId ?? null;
    } catch { /* ignore */ }
    result.stages.initialize = { ok: false, error: errText(e) };
  } finally {
    result.totalMs = ms(performance.now() - tStart);
    result.http = traced.log;
    try {
      await client.close();
    } catch { /* ignore */ }
  }
  return result;
}

function countToolsListPosts(log) {
  // 统计 tools/list 请求次数（SDK 内部自动翻页时每页一次）
  return log.filter((e) => e.rpcMethod === "tools/list").length;
}

async function doSdkCall(client, target, name, args, timeoutMs) {
  const t0 = performance.now();
  try {
    const res = await client.callTool({ name, arguments: args }, { timeout: timeoutMs });
    return {
      tool: name,
      args,
      ok: true,
      isError: !!res.isError,
      ms: ms(performance.now() - t0),
      contentBlocks: Array.isArray(res.content) ? res.content.length : 0,
      textPreview: summarizeCallResult(res),
      structuredKeys: res.structuredContent && typeof res.structuredContent === "object" ? Object.keys(res.structuredContent).slice(0, 20) : [],
    };
  } catch (e) {
    return { tool: name, args, ok: false, isError: true, ms: ms(performance.now() - t0), error: errText(e) };
  }
}

function summarizeCallResult(res) {
  const blocks = Array.isArray(res.content) ? res.content : [];
  const texts = blocks.filter((b) => b && b.type === "text").map((b) => b.text);
  if (texts.length) return truncate(redact(texts.join("\n---\n")), 1200);
  if (res.structuredContent) return truncate(redact(JSON.stringify(res.structuredContent)), 1200);
  return truncate(redact(JSON.stringify(blocks)), 800);
}

// ---------------------------------------------------------------------------
// 只读工具挑选 + 参数合成（安全性：不猜未知的必填字符串）
// ---------------------------------------------------------------------------
const READ_PATTERNS = [
  /(^|_)(list|ls|search|query|find|lookup|get|fetch|describe|info|detail|status|health|ping|overview|summary)(_|$)/i,
];
const WRITE_PATTERNS = /(create|update|delete|remove|insert|write|execute|run|submit|upload|modify|edit|set|post|put|patch|drop|truncate|publish|send|pay|order)/i;

function pickReadonlyCandidates(tools, limit) {
  const scored = [];
  for (const t of tools) {
    const args = synthesizeArgs(t);
    if (args == null) continue;
    let score = 0;
    if (READ_PATTERNS.some((r) => r.test(t.name))) score += 10;
    if (WRITE_PATTERNS.test(t.name)) score -= 20;
    if (t.required.length === 0) score += 5;
    if (t.description && /(list|search|query|查询|列表|搜索)/i.test(t.description)) score += 3;
    scored.push({ name: t.name, score, args });
  }
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.filter((x) => x.score > 0).slice(0, limit);
}

function synthesizeArgs(tool) {
  if (!tool) return null;
  const schema = tool.inputSchema || {};
  const required = Array.isArray(schema.required) ? schema.required : [];
  const props = schema.properties || {};
  const args = {};
  for (const key of required) {
    const p = props[key] || {};
    if (Array.isArray(p.enum) && p.enum.length) args[key] = p.enum[0];
    else if (p.default !== undefined) args[key] = p.default;
    else if (p.type === "integer" || p.type === "number") args[key] = p.minimum ?? 1;
    else if (p.type === "boolean") args[key] = false;
    else if (p.type === "array") args[key] = [];
    else if (p.type === "object") args[key] = {};
    else return null; // 未知必填字符串：不猜，避免误触发业务
  }
  return args;
}

function parseCallPlan(list, targetKey) {
  const out = [];
  for (const raw of list) {
    const idx = raw.indexOf(":");
    const name = idx >= 0 ? raw.slice(0, idx) : raw;
    const json = idx >= 0 ? raw.slice(idx + 1) : "{}";
    try {
      out.push({ name, args: JSON.parse(json) });
    } catch (e) {
      throw new Error("--call 参数不是合法 JSON: " + raw);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 原生 fetch 模式（SDK 不可用时的降级路径；手写 JSON-RPC）
// ---------------------------------------------------------------------------
function parseSseMessages(text) {
  const messages = [];
  for (const chunk of String(text).split(/\r?\n\r?\n/)) {
    const data = chunk
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trimStart())
      .join("\n");
    if (!data) continue;
    try {
      messages.push(JSON.parse(data));
    } catch { /* 忽略非 JSON data 行 */ }
  }
  return messages;
}

async function rawProbe(target, opts, traced) {
  const result = {
    target: target.key,
    label: target.label,
    url: target.url,
    transport: target.transport,
    mode: "raw-fetch",
    ok: false,
    stages: {},
    tools: [],
    toolCalls: [],
    http: traced.log,
    errors: [],
    sessionId: null,
    protocolVersion: null,
  };
  const headersBase = () => {
    const h = { "content-type": "application/json", accept: "application/json, text/event-stream", ...target.headers() };
    if (result.sessionId) h["mcp-session-id"] = result.sessionId;
    if (result.protocolVersion) h["mcp-protocol-version"] = result.protocolVersion;
    return h;
  };
  const post = async (body) => {
    const res = await traced.fetchImpl(target.url, { method: "POST", headers: headersBase(), body: JSON.stringify(body) });
    const sid = res.headers.get("mcp-session-id");
    if (sid) result.sessionId = sid;
    if (res.status === 202) return { status: res.status, json: null, text: "" };
    if (!res.ok) {
      const text = await res.text();
      throw new Error("HTTP " + res.status + " " + res.statusText + ": " + truncate(redact(text), 600));
    }
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    if (ct.includes("text/event-stream")) {
      const msgs = parseSseMessages(text);
      const resp = msgs.find((m) => m && m.id != null && (m.result !== undefined || m.error !== undefined)) || msgs[msgs.length - 1];
      return { status: res.status, json: resp ?? null, text };
    }
    try {
      return { status: res.status, json: JSON.parse(text), text };
    } catch {
      throw new Error("非 JSON 响应（content-type=" + ct + "）: " + truncate(redact(text), 600));
    }
  };
  const rpc = async (id, method, params) => {
    const r = await post({ jsonrpc: "2.0", id, method, params });
    if (!r.json) throw new Error(method + ": 空响应");
    if (r.json.error) throw new Error(method + ": JSON-RPC error " + JSON.stringify(r.json.error));
    return r.json.result;
  };

  const tStart = performance.now();
  try {
    // 1) initialize（协议版本按候选降级重试）
    const versions = [process.env.MCP_PROTOCOL_VERSION, "2025-06-18", "2025-03-26", "2024-11-05"].filter(Boolean);
    let init = null;
    let lastErr = null;
    const tInit = performance.now();
    for (const v of versions) {
      try {
        init = await rpc(1, "initialize", { protocolVersion: v, capabilities: {}, clientInfo: CLIENT_INFO });
        result.requestedProtocolVersion = v;
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!init) throw lastErr ?? new Error("initialize 失败");
    result.stages.initialize = { ok: true, ms: ms(performance.now() - tInit) };
    result.initLatencyMs = ms(traced.log[0]?.headersMs ?? NaN);
    result.protocolVersion = init.protocolVersion ?? null;
    result.serverInfo = redact(JSON.stringify(init.serverInfo ?? null));
    result.serverCapabilities = init.capabilities ?? null;
    if (init.instructions) result.instructions = truncate(redact(init.instructions), 2000);

    // 2) notifications/initialized
    await post({ jsonrpc: "2.0", method: "notifications/initialized" });

    // 3) tools/list（显式 cursor 分页）
    const tList = performance.now();
    const tools = [];
    let cursor;
    let pages = 0;
    do {
      const params = cursor ? { cursor } : {};
      const page = await rpc(100 + pages, "tools/list", params);
      pages++;
      for (const t of page.tools ?? []) {
        tools.push({
          name: t.name,
          title: t.title ?? null,
          description: truncate(redact(t.description ?? ""), 160),
          inputSchemaType: t.inputSchema?.type ?? null,
          required: Array.isArray(t.inputSchema?.required) ? t.inputSchema.required : [],
          properties: t.inputSchema?.properties ? Object.keys(t.inputSchema.properties) : [],
          annotations: t.annotations ?? null,
          hasOutputSchema: !!t.outputSchema,
        });
      }
      cursor = page.nextCursor;
    } while (cursor && pages < 50);
    result.stages.toolsList = { ok: true, ms: ms(performance.now() - tList), pages };
    result.toolsTotal = tools.length;
    result.tools = tools;

    // 4) tools/call
    if (opts.call) {
      const explicit = parseCallPlan(opts.callPlan, target.key);
      const candidates = explicit.length ? explicit : pickReadonlyCandidates(tools, 3);
      if (!candidates.length) result.errors.push("未找到可自动安全调用的只读工具（无显式 --call），跳过真实调用");
      let callId = 1000;
      let successes = 0;
      for (const cand of candidates) {
        if (successes >= 2) break;
        const def = tools.find((t) => t.name === cand.name);
        const args = cand.args ?? synthesizeArgs(def);
        if (args == null) {
          result.toolCalls.push({ tool: cand.name, skipped: true, reason: "required 参数无法安全自动填充" });
          continue;
        }
        const t0 = performance.now();
        try {
          const res = await rpc(callId++, "tools/call", { name: cand.name, arguments: args });
          result.toolCalls.push({
            tool: cand.name,
            args,
            ok: true,
            isError: !!res.isError,
            ms: ms(performance.now() - t0),
            contentBlocks: Array.isArray(res.content) ? res.content.length : 0,
            textPreview: summarizeCallResult(res),
          });
          if (!res.isError) successes++;
        } catch (e) {
          result.toolCalls.push({ tool: cand.name, args, ok: false, isError: true, ms: ms(performance.now() - t0), error: errText(e) });
        }
      }
    }

    // 5) 会话清理
    if (result.sessionId) {
      const tTerm = performance.now();
      try {
        const res = await traced.fetchImpl(target.url, { method: "DELETE", headers: headersBase() });
        result.stages.terminateSession = { ok: res.ok || res.status === 405, status: res.status, ms: ms(performance.now() - tTerm) };
      } catch (e) {
        result.stages.terminateSession = { ok: false, ms: ms(performance.now() - tTerm), error: errText(e) };
      }
    }
    result.ok = true;
  } catch (e) {
    result.errors.push(errText(e));
    result.errorStack = truncate(redact(e?.stack || ""), 4000);
    result.initLatencyMs = traced.log.length ? ms(traced.log[0].headersMs) : null;
  } finally {
    result.totalMs = ms(performance.now() - tStart);
    result.http = traced.log;
  }
  return result;
}

// ---------------------------------------------------------------------------
// 输出
// ---------------------------------------------------------------------------
function printTarget(r) {
  const line = "=".repeat(78);
  console.log("\n" + line);
  console.log("目标: " + r.label + "  [" + r.target + "]");
  console.log("URL : " + r.url);
  console.log("模式: " + r.mode + (r.sdkVersion ? "（@modelcontextprotocol/client " + r.sdkVersion + "）" : ""));
  console.log(line);
  if (!r.ok) {
    console.log("结果: ❌ 不可用");
    for (const e of r.errors) console.log("  错误: " + e);
  } else {
    console.log("结果: ✅ 可用");
    console.log("serverInfo: " + r.serverInfo);
    console.log("协商协议版本: " + (r.protocolVersion ?? "(未知)"));
    console.log("会话 sessionId: " + (r.sessionId ?? "(无，服务端未下发 mcp-session-id)"));
    console.log("首包延迟(响应头): " + (r.initLatencyMs != null ? r.initLatencyMs + " ms" : "n/a"));
    console.log("总耗时: " + r.totalMs + " ms");
    for (const [stage, info] of Object.entries(r.stages)) {
      console.log("  阶段 " + stage + ": " + (info.ok ? "ok" : "FAIL") + "  " + (info.ms != null ? info.ms + " ms" : "") + (info.pages ? "  pages=" + info.pages : "") + (info.status ? "  status=" + info.status : "") + (info.error ? "  error=" + info.error : ""));
    }
    if (r.instructions) console.log("instructions: " + r.instructions);
    if (r.toolsTotal != null) {
      console.log("工具总数: " + r.toolsTotal);
      const shown = r.tools.slice(0, DEFAULT_MAX_TOOLS);
      if (r.tools.length > shown.length) console.log("（以下仅显示前 " + shown.length + " 个）");
      shown.forEach((t, i) => console.log("  " + String(i + 1).padStart(3) + ". " + t.name + "  required=[" + t.required.join(", ") + "]"));
    }
    if (r.toolCalls.length) {
      console.log("真实调用:");
      for (const c of r.toolCalls) {
        if (c.skipped) {
          console.log("  - " + c.tool + " 跳过: " + c.reason);
          continue;
        }
        console.log("  - " + c.tool + "  args=" + JSON.stringify(c.args) + "  " + (c.ok ? (c.isError ? "server isError" : "成功") : "失败") + "  " + c.ms + " ms");
        if (c.textPreview) console.log("      返回摘要: " + c.textPreview.replace(/\n/g, "\n      "));
        if (c.error) console.log("      错误: " + c.error);
      }
    }
  }
  console.log("HTTP 流水: " + r.http.length + " 次请求");
  for (const h of r.http) {
    console.log("  #" + h.seq + " " + h.method + " " + h.status + "  " + h.headersMs + "ms  " + (h.rpcMethod ?? "") + "  " + (h.responseHeaders?.["content-type"] ?? "") + "  session=" + (h.responseHeaders?.["mcp-session-id"] ?? "-") + (h.error ? "  error=" + h.error : ""));
  }
  if (r.errors?.length) for (const e of r.errors) console.log("  备注/错误: " + e);
}

// ---------------------------------------------------------------------------
function pickTargets(argTargets) {
  const keys = argTargets.length ? argTargets : Object.keys(TARGETS);
  const out = [];
  for (const k of keys) {
    if (!TARGETS[k]) throw new Error("未知目标: " + k + "（可用: " + Object.keys(TARGETS).join(", ") + "）");
    out.push(TARGETS[k]);
  }
  return out;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log("用法: node scripts/probe-mcp.mjs [--target=comein,pharmcube] [--no-call] [--raw] [--json-out=path] [--call=name:{json}]");
    return 0;
  }
  collectSecrets();
  const targets = pickTargets(opts.targets);
  const missing = targets.filter((t) => !process.env[t.envName]);
  if (missing.length) {
    console.error("缺少环境变量: " + missing.map((t) => t.envName + " (" + t.label + ")").join(", "));
    return 2;
  }
  console.log("DSH MCP 连通性探针 v" + PROBE_VERSION + "  " + new Date().toISOString());
  console.log("Node " + process.version + "  targets=" + targets.map((t) => t.key).join(",") + "  call=" + opts.call + "  raw=" + opts.raw);

  const sdk = await loadSdk();
  if (!sdk.mod) {
    console.log("SDK 不可用，降级为原生 fetch 模式。加载尝试:");
    for (const e of sdk.errors) console.log("  - " + e);
  } else {
    console.log("SDK: " + sdk.path + " (@modelcontextprotocol/client)");
  }

  const all = [];
  for (const target of targets) {
    const traced = createTracedFetch();
    let result;
    try {
      if (opts.raw || !sdk.mod) result = await rawProbe(target, opts, traced);
      else result = await sdkProbe(target, opts, traced);
      if (!result.ok && !opts.raw && sdk.mod) {
        // SDK 路径失败：保留 SDK 错误，再用原生 fetch 复验一次，便于区分「SDK 问题」与「服务端问题」
        const traced2 = createTracedFetch();
        const raw = await rawProbe(target, opts, traced2);
        raw.sdkFallback = { used: true, sdkErrors: result.errors, sdkStages: result.stages, sdkHttp: result.http };
        result = raw;
      }
    } catch (e) {
      result = { target: target.key, label: target.label, url: target.url, mode: opts.raw ? "raw-fetch" : "sdk", ok: false, errors: [errText(e)], tools: [], toolCalls: [], http: traced.log, totalMs: null, stages: {} };
    }
    printTarget(result);
    all.push(result);
  }

  const summary = {
    probedAt: new Date().toISOString(),
    node: process.version,
    probeVersion: PROBE_VERSION,
    sdk: sdk.path,
    sdkVersion: all.find((r) => r.sdkVersion)?.sdkVersion ?? null,
    targets: all.map((r) => ({
      target: r.target,
      label: r.label,
      url: r.url,
      mode: r.mode,
      ok: r.ok,
      protocolVersion: r.protocolVersion ?? null,
      serverInfo: r.serverInfo ?? null,
      sessionId: r.sessionId ?? null,
      initLatencyMs: r.initLatencyMs ?? null,
      totalMs: r.totalMs ?? null,
      toolsTotal: r.toolsTotal ?? null,
      toolNames: (r.tools ?? []).map((t) => t.name),
      toolsRequired: Object.fromEntries((r.tools ?? []).map((t) => [t.name, t.required])),
      tools: (r.tools ?? []).map((t) => ({ name: t.name, required: t.required, annotations: t.annotations ?? null, hasOutputSchema: !!t.hasOutputSchema })),
      toolCalls: r.toolCalls ?? [],
      stages: r.stages ?? {},
      http: r.http ?? [],
      errors: r.errors ?? [],
    })),
  };
  if (opts.jsonOut) {
    const p = resolve(opts.jsonOut);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, JSON.stringify(summary, null, 2), "utf8");
    console.log("\n原始结果已写入: " + p);
  }
  const failed = all.filter((r) => !r.ok);
  console.log("\n汇总: " + all.filter((r) => r.ok).length + "/" + all.length + " 个目标可用" + (failed.length ? "；失败: " + failed.map((r) => r.label).join(", ") : ""));
  return failed.length ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error("探针崩溃: " + (e?.stack || e));
    process.exit(1);
  });
