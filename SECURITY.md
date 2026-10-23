# Security Policy

dsh-mcp-tools is a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin that manages MCP servers from the Settings page.

## Supported versions

| Version | Supported |
| --- | --- |
| 1.0.x | ✅ |
| < 1.0 | ❌ |

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Report privately via GitHub Security Advisories:

<https://github.com/hxlog/dsh-mcp-tools/security/advisories/new>

Useful details: affected version, DSH version, platform, reproduction steps, and impact. We aim to acknowledge reports within 5 business days and will credit reporters who want it.

## Scope and threat model

- **The state file is credential-equivalent.** MCP server configuration is stored in `~/.dsh/dsh-mcp-tools/state.json`; request headers may contain plaintext API keys. Treat the file as a secret (mode 600), never commit it, never paste it into issues or logs.
- **Outbound network access is limited to the MCP servers you configure** (streamable HTTP endpoints or stdio processes). There is no telemetry, no update check, and no remote control channel.
- **MCP servers are untrusted input.** Tool names/descriptions and their results come from servers you add; the plugin must keep them out of the model when a tool is disabled, but it does not sandbox a malicious server. Only add servers you trust.
- **No third-party runtime dependencies and no install lifecycle scripts** — the plugin runs with `npm install --ignore-scripts` semantics.

## Hardening recommendations

- Keep `~/.dsh/dsh-mcp-tools/state.json` readable only by you.
- Use short-lived tokens for MCP server headers where possible.
- Review a server before adding it, and disable tools you do not need.
