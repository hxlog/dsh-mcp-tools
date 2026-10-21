/* dsh-mcp-workbench — browser half of the plugin (classic script bundle).
 *
 * Serves the "MCP" section in Settings (settings.section, id "mcp", order 18).
 * No module syntax on purpose: the DSH web loader evaluates this file as a
 * classic script through window.__ModuleLoader__.load({ id, factory }).
 *
 * Only baseline shared modules are required: "react" and the official UI
 * primitives package. Every primitive and icon is resolved defensively — a
 * missing export falls back to a token-styled local implementation, so a
 * version skew can never blank the settings panel.
 */
window.__ModuleLoader__.load({
  id: "dsh-mcp-workbench",
  factory: (require) => {
    "use strict";
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    var NS = "mcpManager";
    var API_BASE = "/mcp-manager/api";
    var POLL_INTERVAL_MS = 5000;
    var LOG_LIMIT = 50;
    var SERVER_NAME_RE = /^[A-Za-z0-9_-]{1,32}$/;
    var HTTP_URL_RE = /^https?:\/\//i;
    var CHIP_SCROLL_THRESHOLD = 200;
    var STYLE_ID = "dsh-mcp-workbench/McpManager.module.css";

    var React = require("react");
    var h = React.createElement;
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useMemo = React.useMemo;
    var useCallback = React.useCallback;
    var useRef = React.useRef;

    var P = (function () {
      try {
        return require("@deepseek-ai/dsh-client-ui-primitives") || {};
      } catch (error) {
        return {};
      }
    })();

    function pick(name, fallback) {
      var value = P ? P[name] : undefined;
      return value != null ? value : fallback;
    }

    function cx() {
      var out = [];
      for (var i = 0; i < arguments.length; i += 1) {
        var value = arguments[i];
        if (typeof value === "string" && value !== "") out.push(value);
      }
      return out.join(" ");
    }

    function copyProps(source) {
      var out = {};
      if (!source) return out;
      Object.keys(source).forEach(function (key) {
        out[key] = source[key];
      });
      return out;
    }

    function numOr(value, fallback) {
      return typeof value === "number" && isFinite(value) ? value : fallback;
    }

    function asArray(value) {
      return Array.isArray(value) ? value : [];
    }

    // ── Dictionaries (zh is the source of truth, en mirrors every key) ──────
    var DICT = {
      zh: {
        nav: "MCP",
        title: "MCP 服务器",
        intro: "接入外部 MCP 服务器，并按工具控制可用范围",
        summary: "已启用 {on} / 共 {total}",
        refresh: "刷新",
        refreshing: "正在刷新…",
        add: "添加服务器",
        loading: "正在读取 MCP 服务器…",
        empty: "还没有添加 MCP 服务器。",
        readFailed: "无法读取 MCP 服务器，请检查网络后重试。",
        sessionExpired: "登录状态已失效，请刷新页面后重试",
        refreshFailed: "刷新失败，请重试",
        recentEvents: "最近事件",
        recentEventsEmpty: "暂无事件",
        recentEventsFailed: "无法读取事件",
        unavailable: "本部署没有可管理的 profile，无法管理 MCP 服务器。",
        retry: "重试",
        test: "测试连接",
        testing: "测试中…",
        connected: "已连接 · {count} 个工具",
        connectedPartial: "已连接 · {count} 个工具 · {off} 个已停用",
        connectedShort: "已连接",
        connectFailed: "连接失败：{reason}",
        connectFailedShort: "连接失败",
        timeout: "连接超时，请检查 URL 或网络",
        enabled: "已启用",
        disabled: "已停用",
        connecting: "连接中…",
        configInvalid: "配置有误：{message}",
        configErrorShort: "配置有误",
        enableServer: "启用 {name}",
        tools: "工具",
        toolsSummary: "已启用 {on}/{total} 个工具",
        toolsTotal: "共 {count} 个",
        toolsOff: "{count} 个已停用",
        selectAll: "全选",
        invert: "反选",
        disableAll: "全部停用",
        searchTools: "搜索工具",
        noToolMatch: "没有匹配的工具。",
        noTools: "这个服务器没有提供任何工具。",
        enableTool: "启用工具 {name}",
        disableTool: "停用工具 {name}",
        addTitle: "添加 MCP 服务器",
        editTitle: "编辑 MCP 服务器",
        tabJson: "粘贴 JSON",
        tabFields: "分字段填写",
        fieldName: "名称",
        fieldNameHint: "1–32 个字符，只能包含字母、数字、下划线和连字符",
        fieldTransport: "传输方式",
        fieldUrl: "URL",
        fieldHeaders: "请求头",
        fieldHeadersHint: "每行一个请求头，密钥只保存在本机",
        addHeader: "添加请求头",
        removeHeader: "删除该行",
        headerKey: "名称",
        headerValue: "值",
        headerKeyPlaceholder: "x-mcp-key",
        headerValuePlaceholder: "粘贴密钥或值",
        showSecret: "显示",
        hideSecret: "隐藏",
        duplicateHeader: "请求头名称重复",
        headerHint: "每行一个请求头，密钥只保存在本机",
        fieldCommand: "命令",
        fieldCommandHint: "例如 npx 或 python",
        fieldArgs: "参数",
        fieldArgsHint: "每行一个参数",
        fieldEnv: "环境变量",
        fieldEnvHint: "每行一条，格式「名称=值」",
        fieldNote: "备注（可选）",
        fieldNoteHint: "只用于你自己识别，不会发送给模型",
        jsonPlaceholder: '{ "mcpServers": { "example": { "url": "https://…" } } }',
        jsonHint: "支持 mcpServers 批量配置，或单个服务器对象",
        preview: "预览",
        jsonInvalid: "无法识别的 JSON：{reason}",
        nameRequired: "请填写名称",
        nameFormat: "名称只能包含字母、数字、下划线和连字符，长度 1–32",
        nameDuplicated: "已有同名服务器",
        urlInvalid: "URL 必须以 http:// 或 https:// 开头",
        headersInvalid: "请求头需要「名称: 值」的格式",
        commandRequired: "请填写命令",
        envInvalid: "环境变量需要「名称=值」的格式",
        save: "保存",
        saving: "保存中…",
        saveFailed: "没有保存成功，请重试",
        saved: "已保存",
        cancel: "取消",
        delete: "删除",
        deleting: "删除中…",
        deleteTitle: "删除 MCP 服务器",
        deleteDescription: "删除后，{name} 上的全部工具都会从会话中移除，且无法恢复。",
        deleteFailed: "删除失败，请重试",
        edit: "编辑",
        copyConfig: "复制配置",
        copied: "已复制",
        copyFailed: "无法复制配置，请重试",
        more: "更多操作",
        expand: "展开工具",
        collapse: "收起工具",
        close: "关闭",
        importFailed: "无法导入配置，请检查 JSON 后重试",
        imported: "已导入 {count} 个服务器",
        importUpdated: "已更新 {count} 个同名服务器",
        testFailedNetwork: "无法完成连接测试，请检查网络后重试",
        toggleFailed: "没有切换成功，请重试",
        failedWith: "未能完成操作：{reason}，请重试",
        bulkFailed: "未能批量更新工具，请重试",
        toolToggleFailed: "未能切换工具，请重试",
        loadFailedShort: "读取失败"
      },
      en: {
        nav: "MCP",
        title: "MCP servers",
        intro: "Connect external MCP servers and control which tools are available",
        summary: "Enabled {on} of {total}",
        refresh: "Refresh",
        refreshing: "Refreshing…",
        add: "Add server",
        loading: "Reading MCP servers…",
        empty: "No MCP servers yet.",
        readFailed: "Couldn't read MCP servers. Check your network and try again.",
        sessionExpired: "Your session has expired. Refresh the page and try again",
        refreshFailed: "Couldn't refresh. Please try again",
        recentEvents: "Recent events",
        recentEventsEmpty: "No events yet",
        recentEventsFailed: "Couldn't read events",
        unavailable: "This deployment has no manageable profile, so MCP servers can't be managed.",
        retry: "Retry",
        test: "Test connection",
        testing: "Testing…",
        connected: "Connected · {count} tools",
        connectedPartial: "Connected · {count} tools · {off} disabled",
        connectedShort: "Connected",
        connectFailed: "Connection failed: {reason}",
        connectFailedShort: "Connection failed",
        timeout: "Connection timed out. Check the URL or your network",
        enabled: "Enabled",
        disabled: "Disabled",
        connecting: "Connecting…",
        configInvalid: "Invalid configuration: {message}",
        configErrorShort: "Invalid config",
        enableServer: "Enable {name}",
        tools: "Tools",
        toolsSummary: "Enabled {on}/{total} tools",
        toolsTotal: "{count} total",
        toolsOff: "{count} disabled",
        selectAll: "Select all",
        invert: "Invert",
        disableAll: "Disable all",
        searchTools: "Search tools",
        noToolMatch: "No matching tools.",
        noTools: "This server exposes no tools.",
        enableTool: "Enable tool {name}",
        disableTool: "Disable tool {name}",
        addTitle: "Add MCP server",
        editTitle: "Edit MCP server",
        tabJson: "Paste JSON",
        tabFields: "Fill in fields",
        fieldName: "Name",
        fieldNameHint: "1–32 characters: letters, digits, underscore and hyphen only",
        fieldTransport: "Transport",
        fieldUrl: "URL",
        fieldHeaders: "Headers",
        fieldHeadersHint: "One header per row; secrets stay on this machine",
        addHeader: "Add header",
        removeHeader: "Remove this row",
        headerKey: "Name",
        headerValue: "Value",
        headerKeyPlaceholder: "x-mcp-key",
        headerValuePlaceholder: "Paste a key or value",
        showSecret: "Show",
        hideSecret: "Hide",
        duplicateHeader: "Duplicate header name",
        headerHint: "One header per row; secrets stay on this machine",
        fieldCommand: "Command",
        fieldCommandHint: "For example npx or python",
        fieldArgs: "Arguments",
        fieldArgsHint: "One argument per line",
        fieldEnv: "Environment",
        fieldEnvHint: "One per line, in the form NAME=value",
        fieldNote: "Note (optional)",
        fieldNoteHint: "Only for your own reference; never sent to the model",
        jsonPlaceholder: '{ "mcpServers": { "example": { "url": "https://…" } } }',
        jsonHint: "Paste an mcpServers bundle or a single server object",
        preview: "Preview",
        jsonInvalid: "Unrecognized JSON: {reason}",
        nameRequired: "Enter a name",
        nameFormat: "Name must be 1–32 characters: letters, digits, underscore and hyphen only",
        nameDuplicated: "A server with this name already exists",
        urlInvalid: "URL must start with http:// or https://",
        headersInvalid: "Headers must use the form Name: value",
        commandRequired: "Enter a command",
        envInvalid: "Environment variables must use the form NAME=value",
        save: "Save",
        saving: "Saving…",
        saveFailed: "Couldn't save. Please try again",
        saved: "Saved",
        cancel: "Cancel",
        delete: "Delete",
        deleting: "Deleting…",
        deleteTitle: "Delete MCP server",
        deleteDescription: "Deleting removes every tool on {name} from the conversation. This can't be undone.",
        deleteFailed: "Couldn't delete. Please try again",
        edit: "Edit",
        copyConfig: "Copy configuration",
        copied: "Copied",
        copyFailed: "Couldn't copy the configuration. Please try again",
        more: "More actions",
        expand: "Expand tools",
        collapse: "Collapse tools",
        close: "Close",
        importFailed: "Couldn't import the configuration. Check the JSON and try again",
        imported: "Imported {count} server(s)",
        importUpdated: "Updated {count} existing server(s)",
        testFailedNetwork: "Couldn't run the connection test. Check your network and try again",
        toggleFailed: "Couldn't switch it. Please try again",
        failedWith: "Couldn't finish: {reason}. Please try again",
        bulkFailed: "Couldn't update the tools in bulk. Please try again",
        toolToggleFailed: "Couldn't switch the tool. Please try again",
        loadFailedShort: "Read failed"
      }
    };

    (function verifyDictionaries() {
      try {
        var zhKeys = Object.keys(DICT.zh);
        var enKeys = Object.keys(DICT.en);
        var missingEn = zhKeys.filter(function (key) {
          return DICT.en[key] === undefined;
        });
        var missingZh = enKeys.filter(function (key) {
          return DICT.zh[key] === undefined;
        });
        if (missingEn.length || missingZh.length) {
          console.warn("[dsh-mcp-workbench] dictionary key mismatch", missingEn, missingZh);
        }
      } catch (error) {
        /* dictionary parity is a development aid, never fatal */
      }
    })();

    function format(template, params) {
      if (typeof template !== "string") return "";
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, function (match, name) {
        return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
      });
    }

    // Accepts the locale-bound translator; keys the active language is missing
    // fall back to the built-in zh dictionary so the panel is never key soup.
    function makeTranslator(bound) {
      return function t(key, params) {
        var template;
        if (typeof bound === "function") {
          try {
            template = bound(key, params);
          } catch (error) {
            template = undefined;
          }
        }
        if (typeof template !== "string" || template === "" || template === key) {
          template = Object.prototype.hasOwnProperty.call(DICT.zh, key) ? DICT.zh[key] : String(key);
        }
        return format(template, params);
      };
    }

    // ── Styles: one injected <style>, tokens only ──────────────────────────
    var CSS_TEXT = `
/* Shared scale tokens. The dialog is portalled outside .mcpm-root by the
   primitives Modal, so .mcpm-modalContent must resolve the same variables and
   inherit the same base typography. */
.mcpm-root, .mcpm-modalContent {
  --mcpm-fs-title: 18px;
  --mcpm-fs-body: 14px;
  --mcpm-fs-desc: 13px;
  --mcpm-fs-caption: 12px;
  --mcpm-fs-tiny: 11px;
  --mcpm-fs-tag: 10px;
  --mcpm-line-title: 26px;
  --mcpm-line-body: 20px;
  --mcpm-line-desc: 18px;
  --mcpm-line-tiny: 16px;
  --mcpm-gap: 12px;
  --mcpm-gap-sm: 8px;
  --mcpm-gap-xs: 6px;
  --mcpm-hairline: .5px;
  --mcpm-focus: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family, inherit);
  font-size: var(--mcpm-fs-body);
  line-height: var(--mcpm-line-body);
}
.mcpm-root {
  display: flex;
  flex-direction: column;
  gap: var(--mcpm-gap);
  max-width: 760px;
  padding-top: 16px;
}
.mcpm-root *, .mcpm-root *::before, .mcpm-root *::after,
.mcpm-modalContent *, .mcpm-modalContent *::before, .mcpm-modalContent *::after { box-sizing: border-box; }
.mcpm-heading { margin: 0; font-size: var(--mcpm-fs-title); font-weight: 600; line-height: var(--mcpm-line-title); }
.mcpm-intro { margin: 0; color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body); }
.mcpm-headRow { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--mcpm-gap); flex-wrap: wrap; }
.mcpm-headText { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.mcpm-headActions { flex: none; display: flex; align-items: center; gap: var(--mcpm-gap-sm); margin-left: auto; }
.mcpm-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--mcpm-gap); flex-wrap: wrap; margin-top: 2px; }
.mcpm-summary { color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-tiny); white-space: nowrap; }
.mcpm-toolbarActions { display: flex; align-items: center; gap: var(--mcpm-gap-sm); }
.mcpm-notice { margin: 0; color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-desc); }
.mcpm-cards { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }

/* server rows: flat, no card frame — a settings row */
.mcpm-row {
  display: flex;
  flex-direction: column;
  padding: 14px 0;
  border-bottom: var(--mcpm-hairline) solid var(--dsw-alias-border-l1);
}
.mcpm-cards > .mcpm-row:last-child { border-bottom: 0; }
.mcpm-row[data-off="true"] .mcpm-nameText { color: var(--dsw-alias-label-secondary); }
.mcpm-rowHead { display: flex; align-items: flex-start; gap: 10px; }
.mcpm-dotWrap { flex: none; display: flex; align-items: center; justify-content: center; width: 14px; height: 20px; }
.mcpm-rowMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.mcpm-titleRow { display: flex; align-items: center; gap: var(--mcpm-gap-sm); min-width: 0; }
.mcpm-nameButton {
  display: inline-flex; align-items: center; gap: 4px;
  min-width: 0; padding: 0; border: 0; background: none;
  color: inherit; font: inherit; font-size: var(--mcpm-fs-body); font-weight: 500;
  line-height: var(--mcpm-line-body); text-align: left; cursor: pointer;
  transition: color 120ms ease;
}
.mcpm-nameButton:hover { color: var(--dsw-alias-label-secondary); }
.mcpm-nameText { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mcpm-chevron { flex: none; display: inline-flex; color: var(--dsw-alias-label-tertiary); transition: transform 120ms ease; }
.mcpm-chevron[data-open="true"] { transform: rotate(90deg); }
.mcpm-status { margin: 0; color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); overflow-wrap: anywhere; }
.mcpm-status[data-tone="error"] { color: var(--dsw-alias-state-error-primary); }
.mcpm-status[data-tone="muted"] { color: var(--dsw-alias-label-tertiary); }
.mcpm-desc { margin: 0; color: var(--dsw-alias-label-caption); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mcpm-errorLine { margin: 0; color: var(--dsw-alias-state-error-primary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); overflow-wrap: anywhere; }
.mcpm-rowActions { flex: none; display: flex; align-items: center; gap: 4px; }
.mcpm-root .mcpm-tag { height: 18px; padding: 0 7px; font-size: var(--mcpm-fs-tag); line-height: 18px; border-radius: var(--dsw-radius-xs); }
.mcpm-root .mcpm-iconButton, .mcpm-modalContent .mcpm-iconButton {
  width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center;
  border: 0; border-radius: 6px; background: none;
  color: var(--dsw-alias-label-caption); cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.mcpm-root .mcpm-iconButton:hover, .mcpm-modalContent .mcpm-iconButton:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); }
.mcpm-root .mcpm-iconButton[aria-disabled="true"], .mcpm-modalContent .mcpm-iconButton[aria-disabled="true"] { opacity: .4; cursor: not-allowed; }
.mcpm-root .mcpm-iconButton[aria-disabled="true"]:hover, .mcpm-modalContent .mcpm-iconButton[aria-disabled="true"]:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-caption); }
.mcpm-spin { animation: mcpm-spin 900ms linear infinite; }
@keyframes mcpm-spin { to { transform: rotate(360deg); } }

/* expanded tools: one soft well instead of nested boxes */
.mcpm-tools {
  display: flex; flex-direction: column; gap: var(--mcpm-gap-sm);
  padding: 12px 12px 10px;
  margin: 10px 0 4px;
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 8px;
}
.mcpm-toolsHead { display: flex; align-items: center; justify-content: space-between; gap: var(--mcpm-gap-sm); flex-wrap: wrap; }
.mcpm-toolsSummary { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; color: var(--dsw-alias-label-secondary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); }
.mcpm-toolsCount { color: var(--dsw-alias-label-tertiary); }
.mcpm-toolsActions { display: flex; align-items: center; gap: var(--mcpm-gap-sm); }
.mcpm-textButton {
  display: inline-flex; align-items: center; height: 20px; padding: 0;
  border: 0; background: none;
  color: var(--dsw-alias-label-tertiary);
  font: inherit; font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-tiny);
  cursor: pointer; white-space: nowrap; transition: color 120ms ease;
}
.mcpm-textButton:hover { color: var(--dsw-alias-label-primary); }
.mcpm-textButton[aria-disabled="true"] { opacity: .4; cursor: not-allowed; }
.mcpm-search { display: flex; align-items: center; gap: 6px; height: 28px; max-width: 260px; border-bottom: var(--mcpm-hairline) solid var(--dsw-alias-border-l1); }
.mcpm-search:focus-within { border-bottom-color: var(--dsw-alias-border-l3); }
.mcpm-searchIcon { flex: none; display: inline-flex; color: var(--dsw-alias-label-caption); }
.mcpm-searchInput {
  flex: 1 1 auto; min-width: 0; height: 100%; padding: 0;
  border: 0; background: transparent; color: var(--dsw-alias-label-primary);
  font: inherit; font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc);
  outline: none;
}
.mcpm-searchInput::placeholder { color: var(--dsw-alias-label-caption); }
.mcpm-searchInput:focus-visible { outline: var(--mcpm-focus); outline-offset: 2px; border-radius: var(--dsw-radius-xs); }
.mcpm-chips { display: flex; flex-wrap: wrap; gap: 6px 6px; padding-top: 2px; }
.mcpm-chipsScroll {
  max-height: 240px; overflow-y: auto; padding-right: 2px;
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 8px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 8px), transparent);
}
.mcpm-chipWrap { position: relative; display: inline-flex; max-width: 100%; }

/* tool chips: flat text + dot, no boxes */
.mcpm-chip {
  display: inline-flex; align-items: center; gap: 6px;
  max-width: 280px; padding: 3px 8px;
  border: 0; border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  font: inherit; font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-tiny);
  cursor: pointer; transition: background 120ms ease, color 120ms ease;
}
.mcpm-chip:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.mcpm-chipDot { flex: none; width: 4px; height: 4px; border-radius: 50%; background: var(--dsw-alias-state-business-primary); }
.mcpm-chipDot[data-on="false"] { background: transparent; box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l3); }
.mcpm-chipOff { color: var(--dsw-alias-label-caption); opacity: .55; }
.mcpm-chipOff:hover { color: var(--dsw-alias-label-secondary); opacity: 1; }
.mcpm-chipLocked { opacity: .4; cursor: not-allowed; }
.mcpm-chipLocked:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-caption); }
.mcpm-chipName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* self-drawn tooltip */
.mcpm-tipWrap { position: relative; display: inline-flex; max-width: 100%; }
.mcpm-tip {
  position: absolute; z-index: 60; box-sizing: border-box;
  width: 320px; max-width: calc(100vw - 16px); max-height: 220px; overflow: hidden;
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-secondary);
  border: var(--mcpm-hairline, .5px) solid var(--dsw-alias-border-l2);
  border-radius: 8px; padding: 8px 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
  font-size: var(--mcpm-fs-caption, 12px); line-height: var(--mcpm-line-desc, 18px);
  pointer-events: none; white-space: normal; word-break: break-word; text-align: left;
}
/* Body-level portal: fixed to the viewport so the settings panel's overflow
   and mask can never clip the tooltip (panel mask sits at z-index 1000). */
.mcpm-tipFixed { position: fixed; z-index: 2000; }
.mcpm-tipName { display: block; color: var(--dsw-alias-label-primary); font-size: var(--mcpm-fs-caption); font-weight: 600; line-height: var(--mcpm-line-desc); }
.mcpm-tipDesc {
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 8;
  overflow: hidden; margin-top: 2px;
}
.mcpm-empty { margin: 0; color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body); }
.mcpm-errorBox {
  display: flex; flex-direction: column; align-items: flex-start; gap: var(--mcpm-gap-sm);
  padding: 16px 14px;
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-lg);
  color: var(--dsw-alias-label-secondary);
  font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body);
}
.mcpm-errorBox p { margin: 0; }
.mcpm-skeletonCard {
  display: flex; align-items: center; gap: var(--mcpm-gap);
  padding: 14px 0;
  border-bottom: var(--mcpm-hairline) solid var(--dsw-alias-border-l1);
}
.mcpm-skeletonBlock { background: var(--dsw-alias-bg-skeleton); border-radius: var(--dsw-radius-xs); animation: mcpm-breathe 2s cubic-bezier(.36, 0, .64, 1) infinite; }
.mcpm-skeletonDot { flex: none; width: 10px; height: 10px; border-radius: 50%; }
.mcpm-skeletonStack { flex: 1 1 auto; display: flex; flex-direction: column; gap: var(--mcpm-gap-sm); }
.mcpm-skeletonLine { height: 10px; }
.mcpm-skeletonLineShort { width: 38%; }
.mcpm-skeletonLineWide { width: 64%; }
@keyframes mcpm-breathe { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes mcpm-spin { to { transform: rotate(360deg); } }
.mcpm-srOnly {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

/* form + dialog (portalled: all sizes below rely on the shared --mcpm-* tokens) */
.mcpm-modalContent {
  display: flex; flex-direction: column; min-height: 0;
  width: min(560px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
}
/* Structural dialog flex, without relying on primitives' hashed class names.
   Actual DOM shape (measured):
     dialog.mcpm-modalContent > [content.mcpm-modalContent, footer]
     content.mcpm-modalContent > [header, body]
   So inside the content the body is BOTH :nth-child(2) and :last-child, and in
   the dialog the footer is BOTH :nth-child(2) and :last-child. Declarations
   below are ordered so the later, more specific intent wins:
   1) default: first/last keep intrinsic size;
   2) then the 2nd child flexes/scrolls (content's body);
   3) then dialog > content may shrink inside the dialog's padded box;
   4) finally the footer sibling AFTER content is pinned back to intrinsic size
      (undoing the 2nd-child stretch it also matched). */
.mcpm-modalContent > :first-child { flex: 0 0 auto; }
.mcpm-modalContent > :last-child { flex: 0 0 auto; }
.mcpm-modalContent > :nth-child(2) { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-bottom: 12px; }
.mcpm-modalContent > .mcpm-modalContent { flex: 1 1 auto; min-height: 0; }
.mcpm-modalContent > .mcpm-modalContent ~ * { flex: 0 0 auto; min-height: auto; overflow: visible; padding-bottom: 0; }
.mcpm-form { display: flex; flex-direction: column; gap: 16px; padding-top: 16px; }
.mcpm-form .mcpm-form { padding-top: 0; }
.mcpm-field { display: flex; flex-direction: column; gap: 6px; }
.mcpm-label { color: var(--dsw-alias-label-secondary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body); font-weight: 500; }
.mcpm-hint { color: var(--dsw-alias-label-caption); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); }
.mcpm-fieldError { color: var(--dsw-alias-state-error-primary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); }
.mcpm-formError { margin: 0; color: var(--dsw-alias-state-error-primary); font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc); overflow-wrap: anywhere; }
/* Postman-style header rows: two flexible columns + trailing delete button */
.mcpm-headerRows { display: flex; flex-direction: column; gap: 8px; }
.mcpm-headerRow { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 8px; align-items: center; }
.mcpm-headerKeyWrap, .mcpm-headerValueWrap { width: 100%; }
.mcpm-headerValueWrap { padding-right: 2px; }
.mcpm-headerField {
  flex: 1 1 auto; min-width: 0; height: 30px; padding: 0;
  border: 0; outline: none; background: transparent;
  color: var(--dsw-alias-label-primary); font: inherit;
  font-size: var(--mcpm-fs-body); line-height: var(--mcpm-line-body);
}
.mcpm-headerField::placeholder { color: var(--dsw-alias-label-caption); }
.mcpm-modalContent .mcpm-headerToggle { flex: none; width: 24px; height: 24px; }
.mcpm-headerAdd {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 4px;
  height: 28px; padding: 0 8px; border: 0; border-radius: 6px; background: none;
  color: var(--dsw-alias-state-business-primary); font: inherit;
  font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body); cursor: pointer;
}
.mcpm-headerAdd:hover { background: var(--dsw-alias-interactive-bg-hover); }
.mcpm-headerAdd:focus-visible { outline: var(--mcpm-focus); outline-offset: 2px; }

/* native DSH input metrics: 32px tall, border-l4, layer-3 fill, 14/20 text */
.mcpm-inputWrap {
  display: flex; align-items: center; gap: var(--mcpm-gap-xs);
  width: 100%; min-height: 32px; padding: 0 10px;
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-3);
}
.mcpm-inputWrap:focus-within { outline: var(--mcpm-focus); outline-offset: 2px; }
.mcpm-inputIcon { display: inline-flex; flex: none; color: var(--dsw-alias-label-tertiary); }
.mcpm-inputWrap input {
  flex: 1 1 auto; min-width: 0; height: 30px; padding: 0;
  border: 0; outline: none; background: transparent;
  color: var(--dsw-alias-label-primary); font: inherit;
  font-size: var(--mcpm-fs-body); line-height: var(--mcpm-line-body);
}
.mcpm-inputWrap input::placeholder { color: var(--dsw-alias-label-caption); }
/* primitives Input renders its own element; keep its typography on-scale too */
.mcpm-modalContent input { font: inherit; font-size: var(--mcpm-fs-body); line-height: var(--mcpm-line-body); }
.mcpm-textarea {
  width: 100%; min-height: 64px; padding: 8px 10px; resize: vertical;
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
  font: inherit; font-size: var(--mcpm-fs-body); line-height: 22px;
}
.mcpm-textarea:focus-visible { outline: var(--mcpm-focus); outline-offset: 2px; }
.mcpm-textarea::placeholder { color: var(--dsw-alias-label-caption); }
.mcpm-code {
  min-height: 168px; white-space: pre; overflow: auto;
  font-family: var(--ds-font-family-code, var(--dsw-font-family, monospace));
  font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body);
}
.mcpm-code:disabled { opacity: .6; }
.mcpm-jsonPreview {
  min-height: 0; max-height: 160px; margin: 0; padding: 8px 10px;
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-interactive-bg-hover));
}
.mcpm-modalFooter { display: flex; align-items: center; justify-content: space-between; gap: var(--mcpm-gap-sm, 8px); width: 100%; }
.mcpm-modalFooterEnd { display: flex; align-items: center; gap: var(--mcpm-gap-sm, 8px); margin-left: auto; }
.mcpm-root .mcpm-danger { color: var(--dsw-alias-state-error-primary); }
.mcpm-dangerText { color: var(--dsw-alias-state-error-primary); }

/* compact self-drawn segmented control: content-sized, never stretched */
.mcpm-tabs {
  align-self: flex-start; display: inline-flex; gap: 4px; padding: 2px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-interactive-bg-hover));
}
.mcpm-tab {
  flex: 0 0 auto; min-width: 0; height: 28px; padding: 0 12px;
  border: 0; border-radius: var(--dsw-radius-sm); background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font: inherit; font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body);
  cursor: pointer;
}
.mcpm-tab:hover { color: var(--dsw-alias-label-secondary); }
.mcpm-tabActive, .mcpm-tabActive:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-layer-2)); }
.mcpm-tab:focus-visible { outline: var(--mcpm-focus); outline-offset: 2px; }

/* more menu */
.mcpm-menuWrap { position: relative; display: inline-flex; }
.mcpm-menu {
  position: absolute; right: 0; top: calc(100% + 4px); z-index: 30;
  min-width: 168px; padding: 4px;
  display: flex; flex-direction: column; gap: 2px;
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-md);
  box-shadow: var(--dsw-elevation-prominent, 0 3px 8px rgba(0, 0, 0, .08));
}
.mcpm-menuItem {
  display: flex; align-items: center; gap: var(--mcpm-gap-sm);
  width: 100%; height: 30px; padding: 0 8px;
  border: 0; border-radius: var(--dsw-radius-sm); background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit; font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body);
  text-align: left; cursor: pointer;
}
.mcpm-menuItem:hover { background: var(--dsw-alias-interactive-bg-hover); }
.mcpm-menuItem[data-danger="true"] { color: var(--dsw-alias-state-error-primary); }
.mcpm-menuIcon { display: inline-flex; flex: none; color: var(--dsw-alias-label-tertiary); }
.mcpm-menuItem[data-danger="true"] .mcpm-menuIcon { color: var(--dsw-alias-state-error-primary); }

/* recent events (log) panel */
.mcpm-events {
  display: flex; flex-direction: column; gap: 6px;
  padding-top: 12px;
  border-top: var(--mcpm-hairline) solid var(--dsw-alias-border-l1);
}
.mcpm-eventsToggle {
  display: inline-flex; align-items: center; gap: 4px; align-self: flex-start;
  padding: 4px 6px; margin-left: -6px;
  border: 0; border-radius: 6px; background: none;
  color: var(--dsw-alias-label-tertiary);
  font: inherit; font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc);
  cursor: pointer; transition: background 120ms ease, color 120ms ease;
}
.mcpm-eventsToggle:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.mcpm-eventsChevron {
  display: inline-flex; color: var(--dsw-alias-label-tertiary);
  transition: transform 120ms ease;
}
.mcpm-eventsChevron[data-open="true"] { transform: rotate(90deg); }
.mcpm-eventsList {
  list-style: none; margin: 0; padding: 0;
  max-height: 240px; overflow-y: auto;
}
.mcpm-event {
  display: flex; align-items: center; gap: 8px;
  min-height: 28px; padding: 0 4px;
  border-bottom: var(--mcpm-hairline) solid var(--dsw-alias-border-l1);
  font-size: var(--mcpm-fs-caption); line-height: var(--mcpm-line-desc);
}
.mcpm-event:last-child { border-bottom: 0; }
.mcpm-eventLevel {
  flex: none; width: 6px; height: 6px; border-radius: 50%;
  background: var(--dsw-alias-label-tertiary);
}
.mcpm-eventLevel[data-level="warn"] { background: var(--dsw-alias-state-warn-primary); }
.mcpm-eventLevel[data-level="error"] { background: var(--dsw-alias-state-error-primary); }
.mcpm-eventTime { flex: none; color: var(--dsw-alias-label-caption); font-size: var(--mcpm-fs-tiny); font-variant-numeric: tabular-nums; }
.mcpm-eventServer { flex: none; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); }
.mcpm-eventMessage { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-secondary); }
.mcpm-eventsError { color: var(--dsw-alias-state-error-primary); }
.mcpm-eventsList::-webkit-scrollbar { width: var(--dsh-scrollbar-width, 5px); }
.mcpm-eventsList::-webkit-scrollbar-thumb { background: var(--dsh-scrollbar-thumb, var(--dsw-alias-border-l4)); border-radius: 3px; }

/* primitives fallbacks */
.mcpm-root .mcpm-fbtn {
  display: inline-flex; align-items: center; gap: var(--mcpm-gap-xs);
  height: 36px; padding: 0 14px;
  border: var(--mcpm-hairline) solid transparent;
  border-radius: var(--dsw-radius-md); background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit; font-size: var(--mcpm-fs-body); line-height: var(--mcpm-line-body);
  cursor: pointer;
}
.mcpm-root .mcpm-fbtn-sm { height: 28px; padding: 0 10px; border-radius: var(--dsw-radius-sm); font-size: var(--mcpm-fs-desc); }
.mcpm-root .mcpm-fbtn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.mcpm-root .mcpm-fbtn-primary { background: var(--dsw-alias-state-business-primary); border-color: transparent; color: var(--dsw-alias-bg-layer-1); }
.mcpm-root .mcpm-fbtn-primary:hover { background: var(--dsw-alias-state-business-primary); opacity: .9; }
.mcpm-root .mcpm-fbtn-outline { border-color: var(--dsw-alias-border-l3); }
.mcpm-root .mcpm-fbtn:disabled { opacity: .5; cursor: default; }
.mcpm-fbtnIcon { display: inline-flex; flex: none; }
.mcpm-root .mcpm-fswitch {
  position: relative; flex: none; width: 32px; height: 18px; padding: 0;
  border: 0; border-radius: 9px;
  background: var(--dsw-alias-border-l4, var(--dsw-alias-border-l3));
  cursor: pointer; transition: background var(--ds-transition-duration-fast, .1s) var(--ds-ease-in-out, ease);
}
.mcpm-root .mcpm-fswitchOn { background: var(--dsw-alias-state-business-primary); }
.mcpm-root .mcpm-fswitch:disabled { opacity: .5; cursor: default; }
.mcpm-fswitchThumb {
  position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
  background: var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-base));
  transition: transform var(--ds-transition-duration-fast, .1s) var(--ds-ease-in-out, ease);
}
.mcpm-root .mcpm-fswitchOn .mcpm-fswitchThumb { transform: translateX(14px); }
.mcpm-root .mcpm-ftag {
  display: inline-flex; align-items: center; height: 18px; padding: 0 7px;
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-xs);
  color: var(--dsw-alias-label-secondary);
  font-size: var(--mcpm-fs-tag); line-height: 18px; white-space: nowrap;
}
.mcpm-root .mcpm-ftag[data-tone="success"] { color: var(--dsw-alias-state-success-primary); border-color: var(--dsw-alias-state-success-primary); }
.mcpm-root .mcpm-ftag[data-tone="danger"] { color: var(--dsw-alias-state-error-primary); border-color: var(--dsw-alias-state-error-primary); }
.mcpm-root .mcpm-ftag[data-tone="warning"] { color: var(--dsw-alias-state-warn-primary); border-color: var(--dsw-alias-state-warn-primary); }
.mcpm-root .mcpm-ftag[data-tone="info"] { color: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); }
.mcpm-root .mcpm-ftag[data-tone="neutral"] { color: var(--dsw-alias-label-tertiary); }
.mcpm-root .mcpm-fdot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary); }
.mcpm-root .mcpm-fdot[data-state="done"] { background: var(--dsw-alias-state-success-primary); }
.mcpm-root .mcpm-fdot[data-state="error"] { background: var(--dsw-alias-state-error-primary); }
.mcpm-root .mcpm-fdot[data-state="warning"], .mcpm-root .mcpm-fdot[data-state="ongoing"] { background: var(--dsw-alias-state-warn-primary); }
.mcpm-fmodalRoot { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
.mcpm-fmodalMask { position: absolute; inset: 0; background: var(--dsw-alias-bg-mask-1); }
.mcpm-fmodal {
  position: relative; width: min(560px, calc(100vw - 48px)); max-height: 80vh; overflow: auto;
  padding: 20px; display: flex; flex-direction: column; gap: var(--mcpm-gap);
  background: var(--dsw-alias-bg-layer-2); border-radius: var(--dsw-radius-xl);
  box-shadow: var(--dsw-elevation-prominent, 0 3px 8px rgba(0, 0, 0, .08));
  color: var(--dsw-alias-label-primary);
}
.mcpm-fmodalHead { display: flex; align-items: center; justify-content: space-between; gap: var(--mcpm-gap-sm); }
.mcpm-fmodalTitle { margin: 0; font-size: var(--mcpm-fs-body); font-weight: 600; line-height: var(--mcpm-line-body); }
.mcpm-fmodalDesc { margin: 0; color: var(--dsw-alias-label-tertiary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-desc); }
.mcpm-fmodalBody { display: flex; flex-direction: column; gap: var(--mcpm-gap); }
.mcpm-fmodalFooter { display: flex; align-items: center; justify-content: flex-end; gap: var(--mcpm-gap-sm); }
.mcpm-toast {
  position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 1100;
  max-width: min(420px, calc(100vw - 48px)); padding: 10px 14px;
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  border: var(--mcpm-hairline) solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-md);
  box-shadow: var(--dsw-elevation-prominent, 0 3px 8px rgba(0, 0, 0, .08));
  color: var(--dsw-alias-label-primary); font-size: var(--mcpm-fs-desc); line-height: var(--mcpm-line-body);
}

/* interaction */
.mcpm-root button:focus-visible,
.mcpm-root [role="tab"]:focus-visible,
.mcpm-root [role="switch"]:focus-visible,
.mcpm-root [role="menuitem"]:focus-visible,
.mcpm-root a:focus-visible {
  outline: var(--mcpm-focus);
  outline-offset: 2px;
}
.mcpm-fmodal button:focus-visible, .mcpm-fmodal input:focus-visible, .mcpm-fmodal textarea:focus-visible {
  outline: var(--mcpm-focus);
  outline-offset: 2px;
}
.mcpm-chipsScroll::-webkit-scrollbar { width: var(--dsh-scrollbar-width, 5px); }
.mcpm-chipsScroll::-webkit-scrollbar-thumb { background: var(--dsh-scrollbar-thumb, var(--dsw-alias-border-l4)); border-radius: 3px; }
@media (prefers-reduced-motion: reduce) {
  .mcpm-root *, .mcpm-fmodal *, .mcpm-toast { animation: none !important; transition: none !important; }
}
`;


    // ── Icons: prefer the primitive set, keep an SVG fallback per icon ─────
    function svgIcon(inner) {
      return function Icon(props) {
        var size = props && typeof props.size === "number" ? props.size : 16;
        return h("svg", {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          focusable: "false",
          className: props ? props.className : undefined
        }, inner);
      };
    }
    function pathIcon(d) {
      return svgIcon(h("path", { d: d }));
    }

    var IconPlus = pick("IconPlusOutlineRegular", pathIcon("M12 5v14M5 12h14"));
    var IconRefresh = pick("IconRefreshOutlineRegular", pathIcon("M20 11a8 8 0 1 0-2.35 5.65M20 5v6h-6"));
    var IconLoading = pick("IconLoadingOutlineRegular", pathIcon("M12 3a9 9 0 1 0 9 9"));
    var IconSearch = pick("IconSearchOutlineRegular", pathIcon("M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16.5 16.5 21 21"));
    var IconEllipsis = pick("IconEllipsisOutlineRegular", svgIcon(h("path", { d: "M6 12h.01M12 12h.01M18 12h.01", strokeWidth: 2.4 })));
    var IconTrash = pick("IconTrashOutlineRegular", pathIcon("M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V5h6v2"));
    var IconChevron = pick("IconChevronRightOutlineRegular", pathIcon("M9 6l6 6-6 6"));
    var IconClose = pick("IconCloseOutlineRegular", pathIcon("M6 6l12 12M18 6 6 18"));
    var IconEye = pick("IconEyeOutlineRegular", pathIcon("M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"));
    var IconEyeOff = pick("IconEyeOffOutlineRegular", pathIcon("M3 3l18 18M10.6 6.2A10.9 10.9 0 0 1 12 6c6.4 0 10 6 10 6a17.6 17.6 0 0 1-3.4 3.9M6.3 7.2A17 17 0 0 0 2 12s3.6 6 10 6c1.4 0 2.6-.3 3.7-.8"));
    var IconWarning = pick("IconWarningTriangleOutlineRegular", pathIcon("M12 4 3 20h18L12 4zM12 10v4M12 17h.01"));
    var IconCheck = pick("IconCheckOutlineRegular", pathIcon("M4 12.5 9.5 18 20 6.5"));
    var IconEdit = pick("IconEditOutlineRegular", pathIcon("M4 20h4L20 8l-4-4L4 16v4z"));
    var IconCopy = pick("IconCopyOutlineRegular", pathIcon("M9 9h11v11H9zM4 15V4h11"));
    var IconPulse = pick("IconPulseOutlineRegular", null) || svgIcon(h("path", { d: "M3 12h3l2-5 3 10 2-5h3", strokeWidth: 1.5 }));

    // ── Primitive fallbacks (only used when the export is absent) ─────────
    function FallbackButton(props) {
      var rest = copyProps(props);
      var variant = rest.variant || "ghost";
      var size = rest.size || "md";
      var icon = rest.icon;
      var children = rest.children;
      delete rest.variant;
      delete rest.size;
      delete rest.icon;
      delete rest.children;
      rest.type = rest.type || "button";
      rest.className = cx("mcpm-fbtn", "mcpm-fbtn-" + variant, size === "sm" ? "mcpm-fbtn-sm" : "mcpm-fbtn-md", props.className);
      return h("button", rest, icon != null ? h("span", { className: "mcpm-fbtnIcon", "aria-hidden": "true" }, icon) : null, children);
    }

    function FallbackSwitch(props) {
      var checked = !!props.checked;
      return h("button", {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        "aria-label": props.label,
        title: props.title,
        disabled: !!props.disabled,
        className: cx("mcpm-fswitch", checked ? "mcpm-fswitchOn" : "", props.className),
        onClick: function () {
          if (typeof props.onChange === "function") props.onChange(!checked);
        }
      }, h("span", { className: "mcpm-fswitchThumb", "aria-hidden": "true" }));
    }

    function FallbackTag(props) {
      return h("span", { className: cx("mcpm-ftag", props.className), "data-tone": props.tone || "outline" }, props.children);
    }

    function FallbackStateDot(props) {
      return h("span", { className: cx("mcpm-fdot", props.className), "data-state": props.state || "idle", "aria-hidden": "true" });
    }

    function FallbackTooltip(props) {
      return props.children == null ? null : props.children;
    }

    var modalSeq = 0;

    function FallbackModal(props) {
      var open = !!props.open;
      var titleIdRef = useRef(null);
      if (titleIdRef.current == null) {
        modalSeq += 1;
        titleIdRef.current = "mcpm-modal-title-" + modalSeq;
      }
      useEffect(function () {
        if (!open) return undefined;
        var onKeyDown = function (event) {
          if (event.key === "Escape" && typeof props.onClose === "function") {
            event.stopPropagation();
            props.onClose();
          }
        };
        if (typeof document !== "undefined") document.addEventListener("keydown", onKeyDown);
        var timer = setTimeout(function () {
          try {
            var node = document.querySelector("[data-modal-autofocus]");
            if (node && typeof node.focus === "function") node.focus();
          } catch (error) {
            /* focus is a nicety */
          }
        }, 30);
        return function () {
          if (typeof document !== "undefined") document.removeEventListener("keydown", onKeyDown);
          clearTimeout(timer);
        };
      }, [open]);
      if (!open) return null;
      return h("div", { className: "mcpm-fmodalRoot", role: "presentation" },
        h("div", {
          className: "mcpm-fmodalMask",
          onClick: function () {
            if (typeof props.onClose === "function") props.onClose();
          }
        }),
        h("div", { className: "mcpm-fmodal", role: "dialog", "aria-modal": "true", "aria-labelledby": titleIdRef.current },
          h("div", { className: "mcpm-fmodalHead" },
            h("h3", { className: "mcpm-fmodalTitle", id: titleIdRef.current }, props.title),
            h("button", {
              type: "button",
              className: "mcpm-iconButton",
              "aria-label": props.closeLabel || "Close",
              onClick: function () {
                if (typeof props.onClose === "function") props.onClose();
              }
            }, h(IconClose, { size: 16 }))),
          props.description ? h("p", { className: "mcpm-fmodalDesc" }, props.description) : null,
          h("div", { className: "mcpm-fmodalBody" }, props.children),
          props.footer ? h("div", { className: "mcpm-fmodalFooter" }, props.footer) : null));
    }

    function FallbackInput(props) {
      var rest = copyProps(props);
      var icon = rest.icon;
      var className = rest.className;
      delete rest.icon;
      delete rest.className;
      rest.className = "mcpm-input";
      return h("span", { className: cx("mcpm-inputWrap", className) },
        icon != null ? h("span", { className: "mcpm-inputIcon", "aria-hidden": "true" }, icon) : null,
        h("input", rest));
    }

    function FallbackPill(props) {
      var rest = copyProps(props);
      var active = !!rest.active;
      delete rest.active;
      rest.className = cx("mcpm-chip", props.className);
      if (typeof rest.onClick !== "function") return h("span", rest);
      rest.type = "button";
      return h("button", rest);
    }

    // Compact segmented control used by the dialogs. The primitives tabs/Pill
    // stretch to fill the dialog width (252px items), which breaks the form
    // layout, so these tabs are self-drawn, content-sized and keyboard driven.
    function InlineTabs(props) {
      var items = asArray(props.items);
      function step(event, index, delta) {
        if (typeof event.preventDefault === "function") event.preventDefault();
        var nextIndex = (index + delta + items.length) % items.length;
        if (typeof props.onChange === "function") props.onChange(items[nextIndex].value);
        var parent = event.currentTarget && event.currentTarget.parentNode;
        var nextNode = parent && parent.children ? parent.children[nextIndex] : null;
        if (nextNode && typeof nextNode.focus === "function") nextNode.focus();
      }
      return h("div", { className: cx("mcpm-tabs", props.className), role: "tablist", "aria-label": props.label },
        items.map(function (item, index) {
          var selected = item.value === props.value;
          return h("button", {
            key: String(item.value),
            type: "button",
            role: "tab",
            id: item.id,
            "aria-selected": selected,
            "aria-controls": item.panelId,
            tabIndex: selected ? 0 : -1,
            className: cx("mcpm-tab", selected ? "mcpm-tabActive" : ""),
            onClick: function () {
              if (typeof props.onChange === "function") props.onChange(item.value);
            },
            onKeyDown: function (event) {
              if (event.key === "ArrowRight") step(event, index, 1);
              else if (event.key === "ArrowLeft") step(event, index, -1);
            }
          }, item.label);
        }));
    }

    function FallbackToast(props) {
      var holdMs = typeof props.holdMs === "number" ? props.holdMs : 3000;
      useEffect(function () {
        var timer = setTimeout(function () {
          if (typeof props.onDone === "function") props.onDone();
        }, holdMs);
        return function () {
          clearTimeout(timer);
        };
      }, [holdMs]);
      return h("div", { className: "mcpm-toast", role: "status" }, props.text);
    }

    function FallbackTextShimmer(props) {
      return h("span", { className: props.className }, props.children);
    }

    var Button = pick("Button", FallbackButton);
    var Switch = pick("Switch", FallbackSwitch);
    var Tag = pick("Tag", FallbackTag);
    var StateDot = pick("StateDot", FallbackStateDot);
    var Tooltip = pick("Tooltip", FallbackTooltip);
    var Modal = pick("Modal", FallbackModal);
    var Input = pick("Input", FallbackInput);
    var Pill = pick("Pill", FallbackPill);
    var Toast = pick("Toast", FallbackToast);
    var TextShimmer = pick("TextShimmer", FallbackTextShimmer);
    var writeClipboardPrimitive = pick("writeClipboard", null);

    // ── Tooltips: self-drawn, independent of primitive hover behaviour ────
    var tipSeq = 0;

    // Pure placement helper. The width comes from the viewport, never from the
    // trigger: 320px cap on normal screens, the full available width on narrow
    // (<480px) screens, i.e. viewport - 16 with 8px on each side. Because the
    // cap is 320 the only time the width drops below 220 is an available width
    // that is itself narrower than 220.
    function computeTipPosition(anchor, viewport, tipSize) {
      var gap = 6;
      var margin = 8;
      var viewportWidth = numOr(viewport && viewport.width, 1280);
      var viewportHeight = numOr(viewport && viewport.height, 800);
      var available = Math.max(viewportWidth - margin * 2, 120);
      var width = viewportWidth < 480 ? available : Math.min(320, available);
      var height = Math.max(numOr(tipSize && tipSize.height, 0), 0);
      var anchorTop = numOr(anchor && anchor.top, 0);
      var anchorBottom = numOr(anchor && anchor.bottom, anchorTop);
      var anchorLeft = numOr(anchor && anchor.left, 0);
      var anchorWidth = numOr(anchor && anchor.width, 0);
      var spaceBelow = viewportHeight - (anchorBottom + gap + margin);
      var spaceAbove = anchorTop - gap - margin;
      var placement = "bottom";
      if (spaceBelow < height && spaceAbove > spaceBelow) placement = "top";
      var left = anchorLeft + anchorWidth / 2 - width / 2;
      if (left < margin) left = margin;
      if (left + width > viewportWidth - margin) left = viewportWidth - margin - width;
      var top = placement === "bottom" ? anchorBottom + gap : anchorTop - gap - height;
      return {
        placement: placement,
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(width)
      };
    }

    // Only one tooltip may be visible at a time: showing a new one dismisses
    // whatever was already open, no matter which component owns it.
    var activeTipHide = null;

    function acquireTip(hide) {
      if (activeTipHide && activeTipHide !== hide) {
        var previous = activeTipHide;
        activeTipHide = null;
        try {
          previous();
        } catch (error) {
          /* a stale tooltip must never break the new one */
        }
      }
      activeTipHide = hide;
    }

    function releaseTip(hide) {
      if (activeTipHide === hide) activeTipHide = null;
    }

    function readTipViewport() {
      var width = 1280;
      var height = 800;
      if (typeof window !== "undefined" && window.innerWidth) width = window.innerWidth;
      if (typeof window !== "undefined" && window.innerHeight) height = window.innerHeight;
      return { width: width, height: height };
    }

    // Build the body-level tooltip node. Text goes through textContent only
    // (never innerHTML), and the panel's computed theme values are copied onto
    // the node because the portal lives outside the themed panel container.
    function createTipNode(doc, tipId, label, description, anchorEl) {
      var node = doc.createElement("div");
      node.className = "mcpm-tip mcpm-tipFixed";
      node.setAttribute("role", "tooltip");
      node.id = tipId;
      var tokens = [
        "--dsw-alias-bg-layer-3",
        "--dsw-alias-bg-layer-2",
        "--dsw-alias-label-primary",
        "--dsw-alias-label-secondary",
        "--dsw-alias-border-l2",
        "--mcpm-hairline",
        "--mcpm-fs-caption",
        "--mcpm-line-desc"
      ];
      if (anchorEl && typeof window !== "undefined" && typeof window.getComputedStyle === "function") {
        var anchorStyle = null;
        try {
          anchorStyle = window.getComputedStyle(anchorEl);
        } catch (error) {
          anchorStyle = null;
        }
        if (anchorStyle && typeof anchorStyle.getPropertyValue === "function") {
          for (var i = 0; i < tokens.length; i += 1) {
            var value = anchorStyle.getPropertyValue(tokens[i]);
            value = value && typeof value.trim === "function" ? value.trim() : "";
            if (value) node.style.setProperty(tokens[i], value);
          }
        }
      }
      var text = label == null ? "" : String(label);
      var hasDescription = typeof description === "string" && description !== "" && description !== text;
      var nameSpan = doc.createElement("span");
      nameSpan.className = "mcpm-tipName";
      nameSpan.textContent = text;
      node.appendChild(nameSpan);
      if (hasDescription) {
        var descSpan = doc.createElement("span");
        descSpan.className = "mcpm-tipDesc";
        descSpan.textContent = description;
        node.appendChild(descSpan);
      }
      return node;
    }

    // Attach the node to the body-level portal and place it in viewport
    // coordinates: pin the viewport-derived width first, then measure the
    // resulting height and set fixed left/top (no anchor offsets).
    function mountTipNode(doc, node, anchor, viewport) {
      if (!node || !doc || !doc.body) return null;
      doc.body.appendChild(node);
      var probe = computeTipPosition(anchor, viewport, { height: 0 });
      node.style.width = probe.width + "px";
      var height = 0;
      if (typeof node.getBoundingClientRect === "function") {
        var rect = node.getBoundingClientRect();
        height = numOr(rect && rect.height, 0);
      }
      var position = computeTipPosition(anchor, viewport, { width: probe.width, height: height });
      node.style.left = position.left + "px";
      node.style.top = position.top + "px";
      return position;
    }

    // Lightweight tooltip: 260ms delay, pointer + focus, Escape/scroll/resize
    // hide, body-level fixed portal so panel overflow/mask never clips it.
    function Tip(props) {
      var delayMs = numOr(props.delayMs, 260);
      var tipIdRef = useRef(null);
      if (tipIdRef.current == null) {
        tipSeq += 1;
        tipIdRef.current = "mcpm-tip-" + tipSeq;
      }
      var [open, setOpen] = useState(false);
      var wrapRef = useRef(null);
      var nodeRef = useRef(null);
      var timerRef = useRef(0);
      var hideRef = useRef(null);

      function clearTimer() {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = 0;
        }
      }

      function removeNode() {
        var node = nodeRef.current;
        nodeRef.current = null;
        if (node && node.parentNode && typeof node.parentNode.removeChild === "function") {
          node.parentNode.removeChild(node);
        }
      }

      function hide() {
        clearTimer();
        releaseTip(hideRef.current);
        setOpen(false);
        removeNode();
      }
      hideRef.current = hide;

      function buildTip() {
        removeNode();
        var wrap = wrapRef.current;
        if (!wrap || typeof wrap.getBoundingClientRect !== "function") return;
        if (typeof document === "undefined" || typeof document.createElement !== "function" || !document.body) return;
        var anchor = wrap.getBoundingClientRect();
        var node = createTipNode(document, tipIdRef.current, props.label, props.description, wrap);
        nodeRef.current = node;
        mountTipNode(document, node, anchor, readTipViewport());
        setOpen(true);
      }

      function show() {
        clearTimer();
        timerRef.current = setTimeout(function () {
          timerRef.current = 0;
          acquireTip(hideRef.current);
          buildTip();
        }, delayMs);
      }

      useEffect(function () {
        return function () {
          clearTimer();
          releaseTip(hideRef.current);
          removeNode();
        };
      }, []);

      useEffect(function () {
        if (!open) return undefined;
        var onScroll = function () {
          hide();
        };
        var onKeyDown = function (event) {
          if (event.key === "Escape") hide();
        };
        var onResize = function () {
          hide();
        };
        if (typeof window !== "undefined") {
          window.addEventListener("scroll", onScroll, true);
          window.addEventListener("resize", onResize);
        }
        if (typeof document !== "undefined") document.addEventListener("keydown", onKeyDown);
        return function () {
          if (typeof window !== "undefined") {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
          }
          if (typeof document !== "undefined") document.removeEventListener("keydown", onKeyDown);
        };
      }, [open]);

      return h("span", {
        className: cx("mcpm-tipWrap", props.wrapClassName || ""),
        ref: wrapRef,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
        "aria-describedby": open ? tipIdRef.current : undefined
      }, props.children);
    }

    // ── Style injection ───────────────────────────────────────────────────
    var stylesInjected = false;

    function injectStyles() {
      if (stylesInjected) return;
      try {
        if (typeof document === "undefined" || !document.head) return;
        if (document.querySelector('style[data-plugin-css="dsh-mcp-workbench/McpManager.module.css"]')) {
          stylesInjected = true;
          return;
        }
        var tag = document.createElement("style");
        tag.dataset.plugin = "dsh-mcp-workbench";
        tag.dataset.pluginCss = STYLE_ID;
        tag.textContent = CSS_TEXT;
        document.head.appendChild(tag);
        stylesInjected = true;
      } catch (error) {
        /* styling failure must never break the panel */
      }
    }

    // ── API layer: every failure is a value, never a throw ────────────────
    function apiUrl(path) {
      return API_BASE + path;
    }

    function requestApi(path, init) {
      var url = apiUrl(path);
      var options = { credentials: "same-origin" };
      var key;
      if (init) {
        for (key in init) {
          if (Object.prototype.hasOwnProperty.call(init, key)) options[key] = init[key];
        }
      }
      var pending;
      try {
        pending = fetch(url, options);
      } catch (error) {
        return Promise.resolve({ ok: false, unavailable: true, status: 0, error: null, data: null });
      }
      return pending.then(function (response) {
        return response.text().then(function (bodyText) {
          var data = null;
          if (bodyText) {
            try {
              data = JSON.parse(bodyText);
            } catch (error) {
              data = null;
            }
          }
          if (!response.ok && (data === null || typeof data.ok !== "boolean")) {
            return { ok: false, unavailable: true, status: response.status, error: null, data: null };
          }
          var ok = !!(data && data.ok === true);
          return {
            ok: ok,
            unavailable: false,
            status: response.status,
            data: data,
            error: data && typeof data.error === "string" && data.error !== "" ? data.error : null
          };
        }, function () {
          return { ok: false, unavailable: !response.ok, status: response.status, error: null, data: null };
        });
      }, function () {
        return { ok: false, unavailable: true, status: 0, error: null, data: null };
      });
    }

    function apiGet(path) {
      return requestApi(path, { method: "GET" });
    }

    function apiPost(path, body) {
      return requestApi(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body === undefined ? {} : body)
      });
    }

    // ── Small domain helpers ──────────────────────────────────────────────
    function countEnabledTools(tools) {
      return asArray(tools).filter(function (tool) {
        return tool && tool.enabled !== false;
      }).length;
    }

    function hostOf(url) {
      if (typeof url !== "string" || url === "") return "";
      try {
        var parsed = new URL(url);
        return parsed.host || url;
      } catch (error) {
        return url;
      }
    }

    function transportLabel(server) {
      if (!server || typeof server !== "object") return "";
      return server.transport === "stdio" ? "stdio" : "streamable-http";
    }

    function serverDescription(server) {
      if (!server || typeof server !== "object") return "";
      var note = typeof server.note === "string" ? server.note.trim() : "";
      if (note) return note;
      if (server.transport === "stdio") {
        var command = typeof server.command === "string" ? server.command : "";
        return command ? "stdio · " + command : "stdio";
      }
      var url = typeof server.url === "string" ? server.url : "";
      var host = hostOf(url);
      return transportLabel(server) + (host ? " · " + host : "");
    }

    function validateServerConfig(server, t) {
      if (!server || typeof server !== "object") return null;
      if (server.transport === "stdio") {
        if (typeof server.command !== "string" || server.command.trim() === "") return t("commandRequired");
        return null;
      }
      var url = typeof server.url === "string" ? server.url : "";
      if (!HTTP_URL_RE.test(url)) return t("urlInvalid");
      return null;
    }

    function buildCopyConfig(server) {
      var entry = {};
      if (server.transport === "stdio") {
        entry.transport = "stdio";
        entry.command = server.command || "";
        if (asArray(server.args).length) entry.args = asArray(server.args);
        if (server.env && typeof server.env === "object" && Object.keys(server.env).length) entry.env = server.env;
      } else {
        entry.transport = server.transport || "streamable-http";
        entry.url = server.url || "";
        if (server.headers && typeof server.headers === "object" && Object.keys(server.headers).length) entry.headers = server.headers;
      }
      var root = {};
      root[server.name] = entry;
      return { mcpServers: root };
    }

    function parseHeaderLines(text) {
      var lines = String(text || "").split(/\r?\n/);
      var headers = {};
      for (var i = 0; i < lines.length; i += 1) {
        var line = lines[i].trim();
        if (line === "") continue;
        var at = line.indexOf(":");
        if (at <= 0) return { ok: false };
        var name = line.slice(0, at).trim();
        var value = line.slice(at + 1).trim();
        if (name === "") return { ok: false };
        headers[name] = value;
      }
      return { ok: true, value: headers };
    }

    function parseEnvLines(text) {
      var lines = String(text || "").split(/\r?\n/);
      var env = {};
      for (var i = 0; i < lines.length; i += 1) {
        var line = lines[i].trim();
        if (line === "") continue;
        var at = line.indexOf("=");
        if (at <= 0) return { ok: false };
        var name = line.slice(0, at).trim();
        if (name === "") return { ok: false };
        env[name] = line.slice(at + 1).trim();
      }
      return { ok: true, value: env };
    }

    function splitArgLines(text) {
      return String(text || "")
        .split(/\r?\n/)
        .map(function (line) {
          return line.trim();
        })
        .filter(function (line) {
          return line !== "";
        });
    }

    function headersToText(headers) {
      if (!headers || typeof headers !== "object") return "";
      return Object.keys(headers)
        .map(function (key) {
          return key + ": " + String(headers[key] == null ? "" : headers[key]);
        })
        .join("\n");
    }

    // ── Header rows (Postman-style key/value editor) ─────────────────────
    // Pure helpers kept outside the component so they can be unit checked.
    function defaultHeaderRows() {
      return [{ key: "x-mcp-key", value: "" }];
    }

    function headerRowsFromHeaders(headers) {
      if (!headers || typeof headers !== "object" || Array.isArray(headers)) return defaultHeaderRows();
      var keys = Object.keys(headers);
      if (keys.length === 0) return defaultHeaderRows();
      return keys.map(function (key) {
        var value = headers[key];
        return { key: key, value: value == null ? "" : String(value) };
      });
    }

    // rows -> headers object: trim around keys, trim trailing whitespace from
    // values, drop rows with an empty key, keep insertion order, report dupes.
    function headerRowsToHeaders(rows) {
      var headers = {};
      var list = asArray(rows);
      for (var i = 0; i < list.length; i += 1) {
        var row = list[i] || {};
        var key = String(row.key == null ? "" : row.key).trim();
        if (key === "") continue;
        var value = String(row.value == null ? "" : row.value).replace(/\s+$/, "");
        // Auto-generated default row that the user never touched must not be
        // written back, otherwise every save would add an empty auth header.
        if (row.pristine && key === "x-mcp-key" && value === "") continue;
        if (Object.prototype.hasOwnProperty.call(headers, key)) return { ok: false, duplicate: true };
        headers[key] = value;
      }
      return { ok: true, value: headers };
    }

    // Parse a pasted JSON document (single server object or mcpServers bundle)
    // into its single-server fields. Used by the JSON -> fields tab sync so the
    // form reflects what the user pasted without clobbering manual input.
    function jsonServerInfo(text) {
      var empty = { ok: false, headers: {}, hasHeaders: false, name: "", transport: "", url: "" };
      var raw = String(text == null ? "" : text).trim();
      if (raw === "") return empty;
      try {
        var data = JSON.parse(raw);
        if (!data || typeof data !== "object" || Array.isArray(data)) return empty;
        var entry = null;
        var name = "";
        if (data.mcpServers && typeof data.mcpServers === "object" && !Array.isArray(data.mcpServers)) {
          var ids = Object.keys(data.mcpServers);
          if (ids.length > 0) {
            name = ids[0];
            entry = data.mcpServers[ids[0]];
          }
        } else {
          entry = data;
        }
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) entry = {};
        var headers = null;
        var candidates = [entry.headers, data.headers];
        for (var i = 0; i < candidates.length; i += 1) {
          var candidate = candidates[i];
          if (candidate && typeof candidate === "object" && !Array.isArray(candidate) && Object.keys(candidate).length > 0) {
            headers = candidate;
            break;
          }
        }
        if (!name && typeof entry.name === "string") name = entry.name.trim();
        var transport = typeof entry.transport === "string" && entry.transport !== "" ? entry.transport : "streamable-http";
        var url = "";
        if (typeof entry.url === "string" && entry.url !== "") url = entry.url;
        else if (typeof entry.baseUrl === "string" && entry.baseUrl !== "") url = entry.baseUrl;
        return { ok: true, headers: headers || {}, hasHeaders: headers !== null, name: name, transport: transport, url: url };
      } catch (error) {
        return empty;
      }
    }

    // Parse a pasted JSON document into header rows (default row when the
    // document has no headers or cannot be parsed).
    function headerRowsFromJsonText(text) {
      var info = jsonServerInfo(text);
      if (!info.ok || !info.hasHeaders) return defaultHeaderRows();
      return headerRowsFromHeaders(info.headers);
    }

    var headerRowSeq = 0;
    function headerRowsWithIds(rows, pristine) {
      return asArray(rows).map(function (row) {
        headerRowSeq += 1;
        return {
          id: "mcpm-hrow-" + headerRowSeq,
          key: row && row.key != null ? String(row.key) : "",
          value: row && row.value != null ? String(row.value) : "",
          shown: false,
          pristine: pristine === true
        };
      });
    }

    function envToText(env) {
      if (!env || typeof env !== "object") return "";
      return Object.keys(env)
        .map(function (key) {
          return key + "=" + String(env[key] == null ? "" : env[key]);
        })
        .join("\n");
    }

    function findTool(tools, name) {
      var list = asArray(tools);
      for (var i = 0; i < list.length; i += 1) {
        if (list[i] && list[i].name === name) return list[i];
      }
      return null;
    }

    function formatClock(value) {
      var date = new Date(numOr(value, 0));
      if (isNaN(date.getTime())) return "--:--:--";
      var parts = [date.getHours(), date.getMinutes(), date.getSeconds()];
      return parts.map(function (part) {
        return part < 10 ? "0" + part : String(part);
      }).join(":");
    }

    function copyFailureText(t, key, reason) {
      if (typeof reason === "string" && reason !== "") return t("failedWith", { reason: reason });
      return t(key);
    }

    function deriveStatus(server, testResult, t, testing) {
      var tools = asArray(server && server.tools);
      var toolCount = numOr(server && server.toolCount, tools.length);
      var enabledToolCount = numOr(server && server.enabledToolCount, countEnabledTools(tools));
      var configMessage = validateServerConfig(server, t);
      var isDisabled = !server || server.enabled === false || server.status === "disabled";
      if (isDisabled) {
        return { dot: "idle", tone: "neutral", tagText: t("disabled"), line: t("disabled"), lineTone: "muted" };
      }
      if (testing) {
        return { dot: "ongoing", tone: "warning", tagText: t("connecting"), line: t("connecting"), lineTone: "muted", shimmer: true };
      }
      if (configMessage) {
        return { dot: "warning", tone: "warning", tagText: t("configErrorShort"), line: t("configInvalid", { message: configMessage }), lineTone: "error" };
      }
      if (testResult && testResult.ok === false) {
        return { dot: "error", tone: "danger", tagText: t("connectFailedShort"), line: testResult.error || t("connectFailed", { reason: "" }), lineTone: "error" };
      }
      if (testResult && testResult.ok === true) {
        var testedTotal = numOr(testResult.toolCount, toolCount);
        var testedOn = testedTotal;
        if (asArray(testResult.tools).length) {
          testedOn = asArray(testResult.tools).filter(function (tool) {
            var known = findTool(tools, tool && tool.name);
            return known ? known.enabled !== false : true;
          }).length;
        }
        return buildConnectedStatus(t, testedTotal, testedOn);
      }
      if (server && server.status === "connecting") {
        return { dot: "ongoing", tone: "warning", tagText: t("connecting"), line: t("connecting"), lineTone: "muted", shimmer: true };
      }
      if (server && server.status === "error") {
        var reason = typeof server.error === "string" && server.error !== "" ? server.error : t("timeout");
        return { dot: "error", tone: "danger", tagText: t("connectFailedShort"), line: t("connectFailed", { reason: reason }), lineTone: "error" };
      }
      if (server && server.status === "connected") {
        return buildConnectedStatus(t, toolCount, enabledToolCount);
      }
      return { dot: "idle", tone: "outline", tagText: t("enabled"), line: t("enabled"), lineTone: "muted" };
    }

    function buildConnectedStatus(t, total, on) {
      var safeTotal = Math.max(0, numOr(total, 0));
      var safeOn = Math.max(0, Math.min(numOr(on, safeTotal), safeTotal));
      var off = safeTotal - safeOn;
      if (off > 0) {
        return { dot: "done", tone: "info", tagText: t("connectedShort"), line: t("connectedPartial", { count: safeTotal, off: off }), lineTone: "success" };
      }
      return { dot: "done", tone: "success", tagText: t("connectedShort"), line: t("connected", { count: safeTotal }), lineTone: "success" };
    }

    // ── Clipboard ─────────────────────────────────────────────────────────
    function copyText(text) {
      return new Promise(function (resolve) {
        var finish = function (value) {
          resolve(!!value);
        };
        try {
          if (typeof writeClipboardPrimitive === "function") {
            var maybe = writeClipboardPrimitive(text);
            if (maybe && typeof maybe.then === "function") {
              maybe.then(function () { finish(true); }, function () { finish(fallbackCopyText(text)); });
            } else {
              finish(true);
            }
            return;
          }
        } catch (error) {
          /* fall through to the local implementations */
        }
        if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          navigator.clipboard.writeText(text).then(function () { finish(true); }, function () { finish(fallbackCopyText(text)); });
          return;
        }
        finish(fallbackCopyText(text));
      });
    }

    function fallbackCopyText(text) {
      try {
        if (typeof document === "undefined" || !document.body) return false;
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.top = "-1000px";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        var copied = false;
        try {
          copied = document.execCommand("copy");
        } catch (error) {
          copied = false;
        }
        document.body.removeChild(area);
        return !!copied;
      } catch (error) {
        return false;
      }
    }

    // ── Section shell: error boundary keeps a render bug local ────────────
    class McpManagerSection extends React.Component {
      constructor(props) {
        super(props);
        this.state = { failed: false, remountKey: 0 };
        this.handleRetry = this.handleRetry.bind(this);
      }

      static getDerivedStateFromError() {
        return { failed: true };
      }

      componentDidCatch(error) {
        try {
          console.error("[dsh-mcp-workbench] section crashed", error);
        } catch (ignored) {
          /* logging is best effort */
        }
      }

      handleRetry() {
        this.setState(function (state) {
          return { failed: false, remountKey: state.remountKey + 1 };
        });
      }

      render() {
        var props = this.props || {};
        var t = makeTranslator(props.t);
        if (this.state.failed) {
          return h("div", { className: "mcpm-root" },
            h("h2", { className: "mcpm-heading" }, t("title")),
            h("p", { className: "mcpm-intro" }, t("intro")),
            h("div", { className: "mcpm-errorBox", role: "alert" },
              h("p", null, t("readFailed")),
              h(Button, { variant: "outline", size: "sm", onClick: this.handleRetry }, t("retry"))));
        }
        return h(McpManagerBody, Object.assign({ key: this.state.remountKey }, props));
      }
    }


    // ── Skeleton / static bits ────────────────────────────────────────────
    function renderSkeleton(t) {
      var rows = [0, 1, 2, 3];
      return h("div", { className: "mcpm-cards", "aria-hidden": "true" },
        rows.map(function (index) {
          return h("div", { className: "mcpm-skeletonCard", key: "skeleton-" + index },
            h("span", { className: "mcpm-skeletonBlock mcpm-skeletonDot" }),
            h("span", { className: "mcpm-skeletonStack" },
              h("span", { className: "mcpm-skeletonBlock mcpm-skeletonLine mcpm-skeletonLineWide" }),
              h("span", { className: "mcpm-skeletonBlock mcpm-skeletonLine mcpm-skeletonLineShort" })),
            h("span", { className: "mcpm-skeletonBlock mcpm-skeletonLine", style: { width: "56px" } }));
        }));
    }

    // ── The section body ──────────────────────────────────────────────────
    function McpManagerBody(props) {
      injectStyles();
      var t = useMemo(function () {
        return makeTranslator(props.t);
      }, [props.t]);

      var [phase, setPhase] = useState("loading");
      var [servers, setServers] = useState([]);
      var [events, setEvents] = useState([]);
      var [registeredTotal, setRegisteredTotal] = useState(0);
      var [error, setError] = useState(null);
      var [refreshing, setRefreshing] = useState(false);
      var [busy, setBusy] = useState({});
      var [cardErrors, setCardErrors] = useState({});
      var [expanded, setExpanded] = useState({});
      var [queries, setQueries] = useState({});
      var [testResults, setTestResults] = useState({});
      var [dialog, setDialog] = useState(null);
      var [toast, setToast] = useState(null);
      var [notice, setNotice] = useState(null);
      var [copiedId, setCopiedId] = useState(null);
      var [logsOpen, setLogsOpen] = useState(false);
      var [logs, setLogs] = useState([]);
      var [logsError, setLogsError] = useState(null);
      var [logsLoading, setLogsLoading] = useState(false);

      var tRef = useRef(t);
      tRef.current = t;
      var mountedRef = useRef(true);
      var testingCountRef = useRef(0);
      var busyRef = useRef(busy);
      busyRef.current = busy;
      var dialogRef = useRef(dialog);
      dialogRef.current = dialog;
      var logsOpenRef = useRef(logsOpen);
      logsOpenRef.current = logsOpen;
      var authExpiredRef = useRef(false);

      useEffect(function () {
        mountedRef.current = true;
        return function () {
          mountedRef.current = false;
        };
      }, []);

      function handleAuthFailure(result) {
        if (!result || result.status !== 401) return false;
        markSessionExpired();
        return true;
      }

      // A 401 means the login expired: stop polling and say so once, instead
      // of re-rendering the same failure every five seconds.
      function markSessionExpired() {
        authExpiredRef.current = true;
        setError(tRef.current("sessionExpired"));
        setPhase("error");
        setRefreshing(false);
        setLogsLoading(false);
        setLogsError(tRef.current("recentEventsFailed"));
      }

      var loadState = useCallback(function (options) {
        var silent = !!(options && options.silent);
        if (!silent) setRefreshing(true);
        return apiGet("/state").then(function (result) {
          if (!mountedRef.current) return;
          if (!result.ok || !result.data) {
            if (result.status === 401) {
              markSessionExpired();
              return;
            }
            if (silent) {
              setToast({ text: tRef.current("refreshFailed"), at: Date.now() });
              return;
            }
            setError(result.unavailable ? tRef.current("readFailed") : result.error || tRef.current("readFailed"));
            setPhase("error");
            setRefreshing(false);
            return;
          }
          var data = result.data;
          setServers(asArray(data.servers));
          setEvents(asArray(data.events));
          setRegisteredTotal(numOr(data.registeredTotal, 0));
          setError(null);
          setPhase("ready");
          if (!silent) setRefreshing(false);
        });
      }, []);

      useEffect(function () {
        loadState({});
      }, [loadState]);

      var loadLogs = useCallback(function (quiet) {
        if (!quiet) setLogsLoading(true);
        return apiGet("/logs?limit=" + LOG_LIMIT).then(function (result) {
          if (!mountedRef.current) return;
          if (!quiet) setLogsLoading(false);
          if (!result.ok || !result.data) {
            setLogsError(tRef.current("recentEventsFailed"));
            return;
          }
          setLogs(asArray(result.data.events));
          setLogsError(null);
        });
      }, []);

      useEffect(function () {
        if (!logsOpen) return;
        loadLogs(false);
      }, [logsOpen, loadLogs]);

      // Poll only while the panel is actually visible and nothing is in flight.
      useEffect(function () {
        var timer = setInterval(function () {
          try {
            if (authExpiredRef.current) return;
            if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
            if (testingCountRef.current > 0) return;
            if (dialogRef.current) return;
            if (busyRef.current && Object.keys(busyRef.current).length > 0) return;
            loadState({ silent: true });
            if (logsOpenRef.current) loadLogs(true);
          } catch (err) {
            /* a poll must never surface as an exception */
          }
        }, POLL_INTERVAL_MS);
        return function () {
          clearInterval(timer);
        };
      }, [loadState, loadLogs]);

      useEffect(function () {
        if (!notice) return undefined;
        var timer = setTimeout(function () {
          if (mountedRef.current) setNotice(null);
        }, 4000);
        return function () {
          clearTimeout(timer);
        };
      }, [notice]);

      useEffect(function () {
        if (!copiedId) return undefined;
        var timer = setTimeout(function () {
          if (mountedRef.current) setCopiedId(null);
        }, 2500);
        return function () {
          clearTimeout(timer);
        };
      }, [copiedId]);

      function setCardError(id, message) {
        setCardErrors(function (current) {
          var next = Object.assign({}, current);
          if (!message) delete next[id];
          else next[id] = message;
          return next;
        });
      }

      function setServerBusy(id, kind, value) {
        setBusy(function (current) {
          var next = Object.assign({}, current);
          var entry = Object.assign({}, next[id] || {});
          if (value) entry[kind] = true;
          else delete entry[kind];
          if (Object.keys(entry).length === 0) delete next[id];
          else next[id] = entry;
          return next;
        });
      }

      function patchServer(id, patch) {
        setServers(function (current) {
          return current.map(function (item) {
            if (!item || item.id !== id) return item;
            return Object.assign({}, item, patch);
          });
        });
      }

      function patchTools(id, tools) {
        setServers(function (current) {
          return current.map(function (item) {
            if (!item || item.id !== id) return item;
            return Object.assign({}, item, { tools: tools, toolCount: tools.length, enabledToolCount: countEnabledTools(tools) });
          });
        });
      }

      function patchTool(id, toolName, enabled) {
        setServers(function (current) {
          return current.map(function (item) {
            if (!item || item.id !== id) return item;
            var tools = asArray(item.tools).map(function (tool) {
              if (!tool || tool.name !== toolName) return tool;
              return Object.assign({}, tool, { enabled: !!enabled });
            });
            return Object.assign({}, item, { tools: tools, toolCount: tools.length, enabledToolCount: countEnabledTools(tools) });
          });
        });
      }

      function applyReturnedServer(result) {
        if (result && result.data && result.data.server && result.data.server.id) {
          var returned = result.data.server;
          setServers(function (current) {
            return current.map(function (item) {
              return item && item.id === returned.id ? returned : item;
            });
          });
        }
      }

      function clearTestResult(id) {
        setTestResults(function (current) {
          if (!current[id]) return current;
          var next = Object.assign({}, current);
          delete next[id];
          return next;
        });
      }

      function handleToggleServer(server, nextEnabled) {
        if (!server || !server.id) return;
        if (busy[server.id] && busy[server.id].toggle) return;
        var previous = server.enabled;
        setCardError(server.id, null);
        setServerBusy(server.id, "toggle", true);
        patchServer(server.id, { enabled: nextEnabled });
        apiPost("/servers/toggle", { id: server.id, enabled: !!nextEnabled }).then(function (result) {
          if (!mountedRef.current) return;
          setServerBusy(server.id, "toggle", false);
          if (handleAuthFailure(result)) return;
          if (!result.ok) {
            patchServer(server.id, { enabled: previous });
            setCardError(server.id, result.unavailable ? tRef.current("readFailed") : copyFailureText(tRef.current, "toggleFailed", result.error));
            return;
          }
          clearTestResult(server.id);
          applyReturnedServer(result);
          loadState({ silent: true });
        });
      }

      function handleTest(server) {
        if (!server || !server.id) return;
        if (busy[server.id] && busy[server.id].test) return;
        setCardError(server.id, null);
        setServerBusy(server.id, "test", true);
        testingCountRef.current += 1;
        apiPost("/servers/test", { id: server.id }).then(function (result) {
          if (!mountedRef.current) return;
          testingCountRef.current = Math.max(0, testingCountRef.current - 1);
          setServerBusy(server.id, "test", false);
          if (handleAuthFailure(result)) return;
          if (!result.ok) {
            var message = result.unavailable
              ? tRef.current("testFailedNetwork")
              : result.error
                ? tRef.current("connectFailed", { reason: result.error })
                : tRef.current("testFailedNetwork");
            setTestResults(function (current) {
              var next = Object.assign({}, current);
              next[server.id] = { ok: false, at: Date.now(), error: message, toolCount: 0, tools: null };
              return next;
            });
            return;
          }
          var data = result.data || {};
          var tools = asArray(data.tools);
          setTestResults(function (current) {
            var next = Object.assign({}, current);
            next[server.id] = {
              ok: true,
              at: Date.now(),
              error: null,
              toolCount: numOr(data.toolCount, tools.length),
              tools: tools.length ? tools.map(function (tool) {
                var known = findTool(server.tools, tool && tool.name);
                return { name: tool && tool.name, description: tool && tool.description, enabled: known ? known.enabled !== false : true };
              }) : null,
              latencyMs: numOr(data.latencyMs, 0)
            };
            return next;
          });
        });
      }

      function handleToolToggle(server, tool) {
        if (!server || !server.id || !tool) return;
        var snapshot = asArray(server.tools);
        var nextEnabled = tool.enabled === false;
        setCardError(server.id, null);
        patchTool(server.id, tool.name, nextEnabled);
        apiPost("/tools/toggle", { id: server.id, tool: tool.name, enabled: nextEnabled }).then(function (result) {
          if (!mountedRef.current) return;
          if (handleAuthFailure(result)) {
            patchTools(server.id, snapshot);
            return;
          }
          if (!result.ok) {
            patchTools(server.id, snapshot);
            setCardError(server.id, result.unavailable ? tRef.current("readFailed") : copyFailureText(tRef.current, "toolToggleFailed", result.error));
            return;
          }
          applyReturnedServer(result);
        });
      }

      function handleBulk(server, action) {
        if (!server || !server.id) return;
        var snapshot = asArray(server.tools);
        if (snapshot.length === 0) return;
        var optimistic = snapshot.map(function (tool) {
          if (!tool) return tool;
          var enabled;
          if (action === "all") enabled = true;
          else if (action === "none") enabled = false;
          else enabled = tool.enabled === false;
          return Object.assign({}, tool, { enabled: enabled });
        });
        setCardError(server.id, null);
        patchTools(server.id, optimistic);
        apiPost("/tools/bulk", { id: server.id, action: action }).then(function (result) {
          if (!mountedRef.current) return;
          if (handleAuthFailure(result)) {
            patchTools(server.id, snapshot);
            return;
          }
          if (!result.ok) {
            patchTools(server.id, snapshot);
            setCardError(server.id, result.unavailable ? tRef.current("readFailed") : copyFailureText(tRef.current, "bulkFailed", result.error));
            return;
          }
          applyReturnedServer(result);
        });
      }

      function handleCopyConfig(server) {
        if (!server) return;
        var text;
        try {
          text = JSON.stringify(buildCopyConfig(server), null, 2);
        } catch (err) {
          text = "";
        }
        copyText(text).then(function (copied) {
          if (!mountedRef.current) return;
          if (copied) {
            setCopiedId(server.id);
            setCardError(server.id, null);
          } else {
            setCardError(server.id, tRef.current("copyFailed"));
          }
        });
      }

      function handleDialogDone(result) {
        setDialog(null);
        if (result && result.message && mountedRef.current) setNotice({ text: result.message, at: Date.now() });
        loadState({ silent: true });
      }

      function handleRefresh() {
        if (refreshing) return;
        loadState({});
      }

      function handleToggleLogs() {
        setLogsOpen(function (current) {
          return !current;
        });
      }

      var enabledServerCount = useMemo(function () {
        return servers.filter(function (server) {
          return server && server.enabled !== false;
        }).length;
      }, [servers]);

      var heading = h("h2", { className: "mcpm-heading" }, t("title"));
      var intro = h("p", { className: "mcpm-intro" }, t("intro"));

      if (phase === "loading") {
        return h("div", { className: "mcpm-root" },
          heading,
          intro,
          h("p", { className: "mcpm-srOnly", role: "status" }, t("loading")),
          renderSkeleton(t));
      }

      if (phase === "error") {
        return h("div", { className: "mcpm-root" },
          heading,
          intro,
          h("div", { className: "mcpm-errorBox", role: "alert" },
            h("p", null, error || t("readFailed")),
            h(Button, { variant: "outline", size: "sm", onClick: handleRefresh }, t("retry"))));
      }

      return h("div", { className: "mcpm-root" },
        h("div", { className: "mcpm-headRow" },
          h("div", { className: "mcpm-headText" }, heading, intro),
          h("div", { className: "mcpm-headActions" },
            h("span", { className: "mcpm-summary" }, t("summary", { on: enabledServerCount, total: servers.length })),
            h(Tip, { label: t("refresh") },
              h(Button, {
                variant: "ghost",
                size: "sm",
                className: "mcpm-iconButton",
                icon: refreshing ? h(IconLoading, { size: 16, className: "mcpm-spin" }) : h(IconRefresh, { size: 16 }),
                "aria-disabled": refreshing ? "true" : "false",
                "aria-busy": refreshing ? "true" : "false",
                "aria-label": t("refresh"),
                onClick: handleRefresh
              })),
            h(Button, {
              variant: "primary",
              size: "sm",
              icon: h(IconPlus, { size: 16 }),
              "aria-label": t("add"),
              title: t("add"),
              onClick: function () {
                setDialog({ mode: "add", server: null });
              }
            }, t("add")))),
        notice ? h("p", { className: "mcpm-notice", role: "status" }, notice.text) : null,
        servers.length === 0
          ? h("p", { className: "mcpm-empty" }, t("empty"))
          : h("ul", { className: "mcpm-cards" },
            servers.map(function (server) {
              var id = server.id;
              return h(ServerCard, {
                key: id || server.name,
                server: server,
                t: t,
                busy: busy[id] || null,
                testResult: testResults[id] || null,
                cardError: cardErrors[id] || null,
                expanded: !!expanded[id],
                query: queries[id] || "",
                copied: copiedId === id,
                onToggleExpand: function () {
                  setExpanded(function (current) {
                    var next = Object.assign({}, current);
                    next[id] = !current[id];
                    return next;
                  });
                },
                onQueryChange: function (value) {
                  setQueries(function (current) {
                    var next = Object.assign({}, current);
                    next[id] = value;
                    return next;
                  });
                },
                onToggleServer: function (nextEnabled) {
                  handleToggleServer(server, nextEnabled);
                },
                onTest: function () {
                  handleTest(server);
                },
                onEdit: function () {
                  setDialog({ mode: "edit", server: server });
                },
                onCopy: function () {
                  handleCopyConfig(server);
                },
                onDelete: function () {
                  setDialog({ mode: "delete", server: server });
                },
                onToolToggle: function (tool) {
                  handleToolToggle(server, tool);
                },
                onBulk: function (action) {
                  handleBulk(server, action);
                }
              });
            })),
        h("section", { className: "mcpm-events" },
          h("button", {
            type: "button",
            className: "mcpm-eventsToggle",
            "aria-expanded": logsOpen ? "true" : "false",
            "aria-controls": "mcpm-events-body",
            onClick: handleToggleLogs
          },
            h("span", { className: "mcpm-eventsChevron", "data-open": logsOpen ? "true" : "false", "aria-hidden": "true" }, h(IconChevron, { size: 14 })),
            h("span", null, t("recentEvents"))),
          logsOpen
            ? h("div", { className: "mcpm-eventsBody", id: "mcpm-events-body" },
              logsLoading && logs.length === 0
                ? h("p", { className: "mcpm-empty" }, h(TextShimmer, { active: true }, t("recentEvents")))
                : logsError
                  ? h("p", { className: "mcpm-empty mcpm-eventsError", role: "alert" }, logsError)
                  : logs.length === 0
                    ? h("p", { className: "mcpm-empty" }, t("recentEventsEmpty"))
                    : h("ul", { className: "mcpm-eventsList" },
                      logs.map(function (event, index) {
                        var level = event && (event.level === "warn" || event.level === "error") ? event.level : "info";
                        var serverName = event && typeof event.server === "string" && event.server !== "" ? event.server : "";
                        var message = event && event.message ? String(event.message) : "";
                        return h("li", { className: "mcpm-event", key: String(index) + ":" + String(event && event.at) },
                          h("span", { className: "mcpm-eventLevel", "data-level": level, "aria-hidden": "true" }),
                          h("span", { className: "mcpm-eventTime" }, formatClock(event && event.at)),
                          h("span", { className: "mcpm-eventServer", title: serverName || "—" }, serverName || "—"),
                          h("span", { className: "mcpm-eventMessage", title: message }, message),
                          h("span", { className: "mcpm-srOnly" }, level));
                      })))
            : null),
        dialog && (dialog.mode === "add" || dialog.mode === "edit")
          ? h(ServerDialog, {
            key: "server-dialog",
            mode: dialog.mode,
            server: dialog.server,
            servers: servers,
            t: t,
            onRequestDelete: function () {
              setDialog({ mode: "delete", server: dialog.server });
            },
            onClose: function () {
              setDialog(null);
            },
            onDone: handleDialogDone
          })
          : null,
        dialog && dialog.mode === "delete"
          ? h(DeleteDialog, {
            key: "delete-dialog",
            server: dialog.server,
            t: t,
            onClose: function () {
              setDialog(null);
            },
            onDone: handleDialogDone
          })
          : null,
        toast ? h(Toast, { text: toast.text, holdMs: 5000, onDone: function () { setToast(null); } }) : null);
    }


    // ── Server card ───────────────────────────────────────────────────────
    function ServerCard(props) {
      var server = props.server || {};
      var t = props.t;
      var busy = props.busy || {};
      var tools = asArray(server.tools);
      var status = deriveStatus(server, props.testResult || null, t, !!busy.test);
      var configMessage = validateServerConfig(server, t);
      var isOff = server.enabled === false || server.status === "disabled";
      var locked = isOff || !!configMessage;
      var description = serverDescription(server);

      return h("li", { className: "mcpm-row", "data-off": isOff ? "true" : "false" },
        h("div", { className: "mcpm-rowHead" },
          h("span", { className: "mcpm-dotWrap" }, h(StateDot, { state: status.dot })),
          h("div", { className: "mcpm-rowMain" },
            h("div", { className: "mcpm-titleRow" },
              h("button", {
                type: "button",
                className: "mcpm-nameButton",
                "aria-expanded": props.expanded ? "true" : "false",
                "aria-label": (props.expanded ? t("collapse") : t("expand")) + " · " + server.name,
                title: server.name,
                onClick: props.onToggleExpand
              },
                h("span", { className: "mcpm-nameText" }, server.name),
                h("span", { className: "mcpm-chevron", "data-open": props.expanded ? "true" : "false", "aria-hidden": "true" }, h(IconChevron, { size: 14 }))),
              h(Tag, { tone: status.tone, className: "mcpm-tag" }, status.tagText)),
            h("p", { className: "mcpm-status", "data-tone": status.lineTone },
              status.shimmer ? h(TextShimmer, { active: true }, status.line) : status.line),
            description ? h("p", { className: "mcpm-desc", title: description }, description) : null,
            props.cardError ? h("p", { className: "mcpm-errorLine", role: "alert" }, props.cardError) : null,
            props.copied ? h("p", { className: "mcpm-status", "data-tone": "muted" }, t("copied")) : null),
          h("div", { className: "mcpm-rowActions" },
            h(Switch, {
              checked: !isOff,
              label: t("enableServer", { name: server.name }),
              disabled: !!busy.toggle || !!configMessage,
              onChange: function (nextEnabled) {
                props.onToggleServer(nextEnabled);
              }
            }),
            h(Tip, { label: busy.test ? t("testing") : t("test") },
              h("button", {
                type: "button",
                className: "mcpm-iconButton mcpm-testButton",
                "aria-label": busy.test ? t("testing") : t("test"),
                "aria-busy": busy.test ? "true" : "false",
                "aria-disabled": busy.test || locked ? "true" : "false",
                onClick: function () {
                  if (busy.test || locked) return;
                  props.onTest();
                }
              }, busy.test ? h(IconLoading, { size: 16, className: "mcpm-spin" }) : h(IconPulse, { size: 16 }))),
            h(MoreMenu, {
              t: t,
              onEdit: props.onEdit,
              onCopy: props.onCopy,
              onDelete: props.onDelete
            }))),
        props.expanded
          ? h(ToolsPanel, {
            t: t,
            server: server,
            tools: tools,
            query: props.query,
            locked: locked,
            onQueryChange: props.onQueryChange,
            onToolToggle: props.onToolToggle,
            onBulk: props.onBulk
          })
          : null);
    }

    // ── Tools tag cloud ───────────────────────────────────────────────────
    var toolsPanelSeq = 0;

    function ToolsPanel(props) {
      var t = props.t;
      var server = props.server || {};
      var tools = asArray(props.tools);
      var locked = !!props.locked;
      var query = typeof props.query === "string" ? props.query : "";
      var idRef = useRef(null);
      if (idRef.current == null) {
        toolsPanelSeq += 1;
        idRef.current = "mcpm-tools-" + toolsPanelSeq;
      }
      var filtered = useMemo(function () {
        var needle = query.trim().toLowerCase();
        if (!needle) return tools;
        return tools.filter(function (tool) {
          var name = String(tool && tool.name ? tool.name : "").toLowerCase();
          var description = String(tool && tool.description ? tool.description : "").toLowerCase();
          return name.indexOf(needle) !== -1 || description.indexOf(needle) !== -1;
        });
      }, [tools, query]);
      var enabledCount = countEnabledTools(tools);
      var disabledCount = tools.length - enabledCount;
      var scrollable = tools.length > CHIP_SCROLL_THRESHOLD;

      return h("div", { className: "mcpm-tools" },
        h("div", { className: "mcpm-toolsHead" },
          h("div", { className: "mcpm-toolsSummary" },
            h("span", null, t("toolsSummary", { on: enabledCount, total: tools.length })),
            h("span", { className: "mcpm-toolsCount" }, "· " + t("toolsTotal", { count: tools.length })),
            disabledCount > 0 ? h("span", { className: "mcpm-toolsCount" }, "· " + t("toolsOff", { count: disabledCount })) : null),
          h("div", { className: "mcpm-toolsActions" },
            h("button", {
              type: "button",
              className: "mcpm-textButton",
              "aria-disabled": locked || tools.length === 0 ? "true" : "false",
              onClick: function () {
                if (locked || tools.length === 0) return;
                props.onBulk("all");
              }
            }, t("selectAll")),
            h("button", {
              type: "button",
              className: "mcpm-textButton",
              "aria-disabled": locked || tools.length === 0 ? "true" : "false",
              onClick: function () {
                if (locked || tools.length === 0) return;
                props.onBulk("invert");
              }
            }, t("invert")),
            h("button", {
              type: "button",
              className: "mcpm-textButton",
              "aria-disabled": locked || tools.length === 0 ? "true" : "false",
              onClick: function () {
                if (locked || tools.length === 0) return;
                props.onBulk("none");
              }
            }, t("disableAll")))),
        tools.length > 0
          ? h("div", { className: "mcpm-search" },
            h("span", { className: "mcpm-searchIcon", "aria-hidden": "true" }, h(IconSearch, { size: 14 })),
            h("input", {
              type: "search",
              className: "mcpm-searchInput",
              placeholder: t("searchTools"),
              "aria-label": t("searchTools"),
              value: query,
              disabled: locked,
              onChange: function (event) {
                props.onQueryChange(event.target.value);
              }
            }))
          : null,
        tools.length === 0
          ? h("p", { className: "mcpm-empty" }, t("noTools"))
          : filtered.length === 0
            ? h("p", { className: "mcpm-empty" }, t("noToolMatch"))
            : h("div", {
              className: cx("mcpm-chips", scrollable ? "mcpm-chipsScroll" : ""),
              id: idRef.current,
              role: "group",
              "aria-label": t("tools")
            },
              filtered.map(function (tool) {
                var name = tool && tool.name ? tool.name : "";
                var enabled = !tool || tool.enabled !== false;
                var description = tool && typeof tool.description === "string" ? tool.description : "";
                return h("span", { key: name, className: "mcpm-chipWrap" },
                  h(Tip, { label: name, description: description },
                    h("button", {
                      type: "button",
                      className: cx("mcpm-chip", enabled ? "" : "mcpm-chipOff", locked ? "mcpm-chipLocked" : ""),
                      "aria-pressed": enabled ? "true" : "false",
                      "aria-disabled": locked ? "true" : "false",
                      "data-locked": locked ? "true" : "false",
                      "aria-label": enabled ? t("disableTool", { name: name }) : t("enableTool", { name: name }),
                      onClick: function () {
                        if (locked) return;
                        props.onToolToggle(tool);
                      }
                    },
                      h("span", { className: "mcpm-chipDot", "data-on": enabled ? "true" : "false", "aria-hidden": "true" }),
                      h("span", { className: "mcpm-chipName" }, name))));
              })));
    }

    // ── "More" menu ───────────────────────────────────────────────────────
    function MoreMenu(props) {
      var t = props.t;
      var [open, setOpen] = useState(false);
      var wrapRef = useRef(null);
      useEffect(function () {
        if (!open) return undefined;
        var onPointerDown = function (event) {
          if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
        };
        var onKeyDown = function (event) {
          if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return function () {
          document.removeEventListener("mousedown", onPointerDown);
          document.removeEventListener("keydown", onKeyDown);
        };
      }, [open]);
      function choose(handler) {
        return function () {
          setOpen(false);
          if (typeof handler === "function") handler();
        };
      }
      return h("div", { className: "mcpm-menuWrap", ref: wrapRef },
        h(Tip, { label: t("more") },
          h(Button, {
            variant: "ghost",
            size: "sm",
            className: "mcpm-iconButton",
            "aria-label": t("more"),
            "aria-haspopup": "menu",
            "aria-expanded": open ? "true" : "false",
            icon: h(IconEllipsis, { size: 16 }),
            onClick: function () {
              setOpen(!open);
            }
          })),
        open
          ? h("div", { className: "mcpm-menu", role: "menu" },
            h("button", { type: "button", role: "menuitem", className: "mcpm-menuItem", onClick: choose(props.onEdit) },
              h("span", { className: "mcpm-menuIcon", "aria-hidden": "true" }, h(IconEdit, { size: 14 })),
              t("edit")),
            h("button", { type: "button", role: "menuitem", className: "mcpm-menuItem", onClick: choose(props.onCopy) },
              h("span", { className: "mcpm-menuIcon", "aria-hidden": "true" }, h(IconCopy, { size: 14 })),
              t("copyConfig")),
            h("button", { type: "button", role: "menuitem", className: "mcpm-menuItem", "data-danger": "true", onClick: choose(props.onDelete) },
              h("span", { className: "mcpm-menuIcon", "aria-hidden": "true" }, h(IconTrash, { size: 14 })),
              t("delete")))
          : null);
    }

    // ── Add / edit dialog ─────────────────────────────────────────────────
    var serverDialogSeq = 0;

    function ServerDialog(props) {
      var t = props.t;
      var mode = props.mode === "edit" ? "edit" : "add";
      var isEdit = mode === "edit" && !!props.server;
      var initial = props.server || {};
      var idRef = useRef(null);
      if (idRef.current == null) {
        serverDialogSeq += 1;
        idRef.current = "mcpm-dialog-" + serverDialogSeq;
      }
      var dialogId = idRef.current;
      var aliveRef = useRef(true);
      useEffect(function () {
        aliveRef.current = true;
        return function () {
          aliveRef.current = false;
        };
      }, []);

      var [tab, setTab] = useState("fields");
      var [form, setForm] = useState(function () {
        return {
          name: typeof initial.name === "string" ? initial.name : "",
          transport: initial.transport === "stdio" ? "stdio" : "streamable-http",
          url: typeof initial.url === "string" ? initial.url : "",
          command: typeof initial.command === "string" ? initial.command : "",
          argsText: asArray(initial.args).join("\n"),
          envText: envToText(initial.env),
          note: typeof initial.note === "string" ? initial.note : ""
        };
      });
      var [errors, setErrors] = useState({});
      var [formError, setFormError] = useState(null);
      var [jsonText, setJsonText] = useState(function () {
        if (!isEdit) return "";
        try {
          return JSON.stringify(buildCopyConfig(initial), null, 2);
        } catch (error) {
          return "";
        }
      });
      var [jsonError, setJsonError] = useState(null);
      var [saving, setSaving] = useState(false);
      var [headerRows, setHeaderRows] = useState(function () {
        var initialHeaders = initial.headers && typeof initial.headers === "object" && !Array.isArray(initial.headers) ? initial.headers : null;
        var hasInitialHeaders = !!initialHeaders && Object.keys(initialHeaders).length > 0;
        return headerRowsWithIds(headerRowsFromHeaders(initialHeaders), !hasInitialHeaders);
      });

      function update(key, value) {
        setForm(function (current) {
          var next = Object.assign({}, current);
          next[key] = value;
          return next;
        });
      }

      function validate() {
        var nextErrors = {};
        var name = form.name.trim();
        if (name === "") nextErrors.name = t("nameRequired");
        else if (!SERVER_NAME_RE.test(name)) nextErrors.name = t("nameFormat");
        else {
          var clash = asArray(props.servers).some(function (item) {
            if (!item || item.name !== name) return false;
            if (isEdit && props.server && item.id === props.server.id) return false;
            return true;
          });
          if (clash) nextErrors.name = t("nameDuplicated");
        }
        var payload = { name: name, transport: form.transport, note: form.note.trim() };
        if (form.transport === "stdio") {
          var command = form.command.trim();
          if (command === "") nextErrors.command = t("commandRequired");
          var envParsed = parseEnvLines(form.envText);
          if (!envParsed.ok) nextErrors.env = t("envInvalid");
          payload.command = command;
          payload.args = splitArgLines(form.argsText);
          payload.env = envParsed.ok ? envParsed.value : {};
        } else {
          var url = form.url.trim();
          if (!HTTP_URL_RE.test(url)) nextErrors.url = t("urlInvalid");
          var headersParsed = headerRowsToHeaders(headerRows);
          if (!headersParsed.ok) nextErrors.headers = headersParsed.duplicate ? t("duplicateHeader") : t("headersInvalid");
          payload.url = url;
          payload.headers = headersParsed.ok ? headersParsed.value : {};
        }
        return { errors: nextErrors, payload: payload, valid: Object.keys(nextErrors).length === 0 };
      }

      function close() {
        if (saving) return;
        props.onClose();
      }

      function saveFields() {
        if (saving) return;
        var checked = validate();
        setErrors(checked.errors);
        setFormError(null);
        if (!checked.valid) return;
        var payload = checked.payload;
        if (isEdit && props.server && props.server.id) {
          payload.id = props.server.id;
          payload.enabled = props.server.enabled !== false;
          if (typeof props.server.toolCallTimeoutMs === "number") payload.toolCallTimeoutMs = props.server.toolCallTimeoutMs;
          var disabledTools = {};
          var hasDisabledTools = false;
          asArray(props.server.tools).forEach(function (tool) {
            if (tool && tool.name && tool.enabled === false) {
              disabledTools[tool.name] = false;
              hasDisabledTools = true;
            }
          });
          if (hasDisabledTools) payload.tools = disabledTools;
        } else {
          payload.enabled = true;
        }
        setSaving(true);
        apiPost("/servers/save", { server: payload }).then(function (result) {
          if (!aliveRef.current) return;
          setSaving(false);
          if (!result.ok) {
            setFormError(result.unavailable ? t("readFailed") : copyFailureText(t, "saveFailed", result.error));
            return;
          }
          props.onDone({ message: t("saved") });
        });
      }

      function saveJson() {
        if (saving) return;
        var raw = jsonText.trim();
        if (raw === "") {
          setJsonError(t("jsonInvalid", { reason: "empty" }));
          return;
        }
        try {
          JSON.parse(raw);
        } catch (error) {
          var reason = error && error.message ? String(error.message) : String(error);
          setJsonError(t("jsonInvalid", { reason: reason }));
          return;
        }
        setJsonError(null);
        setSaving(true);
        apiPost("/import", { json: raw }).then(function (result) {
          if (!aliveRef.current) return;
          setSaving(false);
          if (!result.ok) {
            setJsonError(result.unavailable ? t("readFailed") : copyFailureText(t, "importFailed", result.error));
            return;
          }
          var data = result.data || {};
          var imported = numOr(data.imported, 0);
          var updated = numOr(data.updated, 0);
          var parts = [];
          if (imported > 0) parts.push(t("imported", { count: imported }));
          if (updated > 0) parts.push(t("importUpdated", { count: updated }));
          if (parts.length === 0) parts.push(t("saved"));
          props.onDone({ message: parts.join("，") });
        });
      }

      function field(id, labelText, control, hintText, errorText, extra) {
        var extras = extra || {};
        return h("div", { className: "mcpm-field", key: id },
          h("label", { className: "mcpm-label", htmlFor: id }, labelText, extras.required ? " *" : ""),
          control,
          hintText ? h("span", { className: "mcpm-hint" }, hintText) : null,
          errorText ? h("span", { className: "mcpm-fieldError", role: "alert" }, errorText) : null);
      }

      function textInput(id, key, placeholder, autoFocus, ariaInvalid) {
        return h(Input, {
          id: id,
          value: form[key],
          placeholder: placeholder,
          disabled: saving,
          "data-modal-autofocus": autoFocus ? "true" : undefined,
          "aria-invalid": ariaInvalid ? "true" : "false",
          onChange: function (event) {
            update(key, event.target.value);
          }
        });
      }

      function textArea(id, key, rows, extraClass, placeholder, autoFocus) {
        return h("textarea", {
          id: id,
          className: cx("mcpm-textarea", extraClass || ""),
          value: form[key],
          rows: rows,
          placeholder: placeholder,
          disabled: saving,
          "data-modal-autofocus": autoFocus ? "true" : undefined,
          onChange: function (event) {
            update(key, event.target.value);
          }
        });
      }

      function updateHeaderRow(id, patch) {
        setHeaderRows(function (current) {
          return current.map(function (row) {
            if (row.id !== id) return row;
            // Any edit makes the auto-generated default row a real header row.
            return Object.assign({}, row, patch, { pristine: false });
          });
        });
      }

      function updateFields(patch) {
        setForm(function (current) {
          return Object.assign({}, current, patch);
        });
      }

      function addHeaderRow() {
        if (saving) return;
        setHeaderRows(function (current) {
          return current.concat(headerRowsWithIds([{ key: "", value: "" }]));
        });
      }

      function removeHeaderRow(id) {
        if (saving) return;
        setHeaderRows(function (current) {
          return current.filter(function (row) {
            return row.id !== id;
          });
        });
      }

      function toggleHeaderRow(id) {
        setHeaderRows(function (current) {
          return current.map(function (row) {
            if (row.id !== id) return row;
            return Object.assign({}, row, { shown: !row.shown });
          });
        });
      }

      function headerEditor() {
        var rowNodes = asArray(headerRows).map(function (row, index) {
          var rowNo = index + 1;
          var keyId = dialogId + "-header-" + row.id + "-key";
          var valueId = dialogId + "-header-" + row.id + "-value";
          var keyLabel = t("fieldHeaders") + " " + rowNo + " " + t("headerKey");
          var valueLabel = t("fieldHeaders") + " " + rowNo + " " + t("headerValue");
          return h("div", { className: "mcpm-headerRow", key: row.id },
            h("span", { className: "mcpm-inputWrap mcpm-headerKeyWrap" },
              h("input", {
                id: keyId,
                type: "text",
                className: "mcpm-headerField",
                value: row.key,
                placeholder: t("headerKeyPlaceholder"),
                autoComplete: "off",
                spellCheck: false,
                disabled: saving,
                "aria-label": keyLabel,
                onChange: function (event) {
                  updateHeaderRow(row.id, { key: event.target.value });
                }
              })),
            h("span", { className: "mcpm-inputWrap mcpm-headerValueWrap" },
              h("input", {
                id: valueId,
                type: row.shown ? "text" : "password",
                className: "mcpm-headerField",
                value: row.value,
                placeholder: t("headerValuePlaceholder"),
                autoComplete: "off",
                spellCheck: false,
                disabled: saving,
                "aria-label": valueLabel,
                onChange: function (event) {
                  updateHeaderRow(row.id, { value: event.target.value });
                }
              }),
              h("button", {
                type: "button",
                className: "mcpm-iconButton mcpm-headerToggle",
                "aria-label": row.shown ? t("hideSecret") : t("showSecret"),
                "aria-pressed": row.shown ? "true" : "false",
                disabled: saving,
                onClick: function () {
                  toggleHeaderRow(row.id);
                }
              }, h(row.shown ? IconEyeOff : IconEye, { size: 16 }))),
            h("button", {
              type: "button",
              className: "mcpm-iconButton mcpm-headerRemove",
              "aria-label": t("removeHeader") + " " + rowNo,
              disabled: saving,
              onClick: function () {
                removeHeaderRow(row.id);
              }
            }, h(IconClose, { size: 14 })));
        });
        return h("div", { className: "mcpm-headerRows" },
          rowNodes,
          h("button", {
            type: "button",
            className: "mcpm-headerAdd",
            disabled: saving,
            onClick: addHeaderRow
          }, h(IconPlus, { size: 14 }), t("addHeader")));
      }

      var fieldsPanel = h("div", { className: "mcpm-form", role: "tabpanel", id: dialogId + "-panel-fields", "aria-labelledby": dialogId + "-tab-fields" },
        field(dialogId + "-name", t("fieldName"), textInput(dialogId + "-name", "name", "comein-mcp-all", true, !!errors.name), t("fieldNameHint"), errors.name, { required: true }),
        h("div", { className: "mcpm-field" },
          h("span", { className: "mcpm-label" }, t("fieldTransport")),
          h(InlineTabs, {
            items: [
              { value: "streamable-http", label: "streamable-http", id: dialogId + "-tab-http" },
              { value: "stdio", label: "stdio", id: dialogId + "-tab-stdio" }
            ],
            value: form.transport,
            label: t("fieldTransport"),
            onChange: function (value) {
              update("transport", value);
            }
          })),
        form.transport === "stdio"
          ? field(dialogId + "-command", t("fieldCommand"), textInput(dialogId + "-command", "command", "npx"), t("fieldCommandHint"), errors.command, { required: true })
          : null,
        form.transport === "stdio"
          ? field(dialogId + "-args", t("fieldArgs"), textArea(dialogId + "-args", "argsText", 3, "mcpm-code", "-y\n@modelcontextprotocol/server-filesystem"), t("fieldArgsHint"))
          : null,
        form.transport === "stdio"
          ? field(dialogId + "-env", t("fieldEnv"), textArea(dialogId + "-env", "envText", 3, "mcpm-code", "API_KEY=…"), t("fieldEnvHint"), errors.env)
          : null,
        form.transport !== "stdio"
          ? field(dialogId + "-url", t("fieldUrl"), textInput(dialogId + "-url", "url", "https://example.com/mcp", false, !!errors.url), null, errors.url, { required: true })
          : null,
        form.transport !== "stdio"
          ? field(dialogId + "-headers", t("fieldHeaders"), headerEditor(), t("headerHint"), errors.headers)
          : null,
        field(dialogId + "-note", t("fieldNote"), textArea(dialogId + "-note", "note", 2, "", undefined), t("fieldNoteHint")),
        formError ? h("p", { className: "mcpm-formError", role: "alert" }, formError) : null);

      var jsonPreview = null;
      var trimmedJson = jsonText.trim();
      if (trimmedJson !== "") {
        try {
          jsonPreview = JSON.stringify(JSON.parse(trimmedJson), null, 2);
        } catch (error) {
          jsonPreview = null;
        }
      }

      var jsonPanel = h("div", { className: "mcpm-form", role: "tabpanel", id: dialogId + "-panel-json", "aria-labelledby": dialogId + "-tab-json" },
        h("textarea", {
          className: "mcpm-textarea mcpm-code",
          "aria-label": t("tabJson"),
          "data-modal-autofocus": "true",
          placeholder: t("jsonPlaceholder"),
          value: jsonText,
          disabled: saving,
          spellCheck: false,
          onChange: function (event) {
            setJsonText(event.target.value);
            setJsonError(null);
          }
        }),
        h("span", { className: "mcpm-hint" }, t("jsonHint")),
        jsonPreview ? h("pre", { className: "mcpm-code mcpm-jsonPreview", "aria-label": t("preview") }, jsonPreview) : null,
        jsonError ? h("p", { className: "mcpm-formError", role: "alert" }, jsonError) : null);

      return h(Modal, {
        open: true,
        onClose: close,
        title: isEdit ? t("editTitle") : t("addTitle"),
        closeLabel: t("close"),
        className: "mcpm-modalContent",
        contentClassName: "mcpm-modalContent",
        footer: h("div", { className: "mcpm-modalFooter" },
          isEdit
            ? h(Button, {
              variant: "outline",
              size: "sm",
              className: "mcpm-danger",
              disabled: saving,
              onClick: function () {
                if (typeof props.onRequestDelete === "function") props.onRequestDelete();
              }
            }, t("delete"))
            : null,
          h("div", { className: "mcpm-modalFooterEnd" },
            h(Button, { variant: "outline", size: "sm", disabled: saving, onClick: close }, t("cancel")),
            h(Button, {
              variant: "primary",
              size: "sm",
              disabled: saving,
              onClick: tab === "json" ? saveJson : saveFields
            }, saving ? t("saving") : t("save"))))
      },
        h("div", { className: "mcpm-form" },
          h(InlineTabs, {
            items: [
              { value: "json", label: t("tabJson"), id: dialogId + "-tab-json", panelId: dialogId + "-panel-json" },
              { value: "fields", label: t("tabFields"), id: dialogId + "-tab-fields", panelId: dialogId + "-panel-fields" }
            ],
            value: tab,
            label: t("title"),
            onChange: function (value) {
              if (value === "fields" && tab === "json") {
                var info = jsonServerInfo(jsonText);
                if (info.ok) {
                  setHeaderRows(headerRowsWithIds(info.hasHeaders ? headerRowsFromHeaders(info.headers) : defaultHeaderRows(), !info.hasHeaders));
                  var patch = {};
                  if (form.name.trim() === "" && info.name !== "") patch.name = info.name;
                  if (form.url.trim() === "" && info.url !== "") patch.url = info.url;
                  if (info.transport !== "" && info.transport !== form.transport && form.transport === "streamable-http") patch.transport = info.transport;
                  if (Object.keys(patch).length > 0) updateFields(patch);
                }
              }
              setTab(value);
            }
          }),
          tab === "json" ? jsonPanel : fieldsPanel));
    }

    // ── Delete confirmation ───────────────────────────────────────────────
    function DeleteDialog(props) {
      var t = props.t;
      var [saving, setSaving] = useState(false);
      var [errorText, setErrorText] = useState(null);
      var aliveRef = useRef(true);
      useEffect(function () {
        aliveRef.current = true;
        return function () {
          aliveRef.current = false;
        };
      }, []);

      function close() {
        if (saving) return;
        props.onClose();
      }

      function confirm() {
        if (saving || !props.server) return;
        setSaving(true);
        setErrorText(null);
        apiPost("/servers/delete", { id: props.server.id }).then(function (result) {
          if (!aliveRef.current) return;
          setSaving(false);
          if (!result.ok) {
            setErrorText(result.unavailable ? t("readFailed") : copyFailureText(t, "deleteFailed", result.error));
            return;
          }
          props.onDone({ message: null });
        });
      }

      return h(Modal, {
        open: true,
        onClose: close,
        title: t("deleteTitle"),
        closeLabel: t("close"),
        description: t("deleteDescription", { name: props.server ? props.server.name : "" }),
        className: "mcpm-modalContent",
        contentClassName: "mcpm-modalContent",
        footer: h("div", { className: "mcpm-modalFooter" },
          h("div", { className: "mcpm-modalFooterEnd" },
            h(Button, { variant: "outline", size: "sm", disabled: saving, onClick: close }, t("cancel")),
            h(Button, { variant: "outline", size: "sm", className: "mcpm-danger", disabled: saving, onClick: confirm }, saving ? t("deleting") : t("delete"))))
      },
        errorText ? h("p", { className: "mcpm-formError", role: "alert" }, errorText) : null);
    }

    // ── Plugin wiring ─────────────────────────────────────────────────────
    function getLocaleService(ctx) {
      try {
        if (ctx && ctx.locale) return ctx.locale;
        if (ctx && typeof ctx.get === "function") {
          var service = ctx.get("locale");
          if (service) return service;
        }
      } catch (error) {
        return null;
      }
      return null;
    }

    function apply(ctx) {
      injectStyles();
      var locale = getLocaleService(ctx);
      var bound = null;
      if (locale && typeof locale.register === "function") {
        var registerDictionaries = function () {
          return locale.register(NS, { zh: DICT.zh, en: DICT.en });
        };
        try {
          if (typeof ctx.effect === "function") ctx.effect(registerDictionaries, "mcp-manager: dictionaries");
          else registerDictionaries();
        } catch (error) {
          try {
            console.warn("[dsh-mcp-workbench] locale registration skipped", error);
          } catch (ignored) {
            /* no console available */
          }
        }
      }
      if (locale && typeof locale.bind === "function") {
        try {
          bound = locale.bind(NS);
        } catch (error) {
          bound = null;
        }
      }
      var t = makeTranslator(bound);
      var slots = ctx && ctx.slots;
      if (slots && typeof slots.inject === "function" && typeof slots.register === "function") {
        try {
          slots.inject("settings.section", function () {
            return slots.register({
              name: "settings.section",
              id: "mcp",
              order: 18,
              label: function () {
                return t("nav");
              },
              locale: NS,
              inject: function () {
                return {};
              }
            }, McpManagerSection);
          });
        } catch (error) {
          try {
            console.error("[dsh-mcp-workbench] failed to register the settings section", error);
          } catch (ignored) {
            /* no console available */
          }
        }
      }
    }

    var inject = ["slots", "locale"];

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
