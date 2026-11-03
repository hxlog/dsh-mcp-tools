// scripts/fixtures/fake-mcp-server.mjs — zero-dependency stdio MCP server for
// offline manager tests. Implements just enough of the protocol (newline
// delimited JSON-RPC 2.0) for initialize / tools/list / tools/call / ping.
import readline from 'node:readline'

const rl = readline.createInterface({ input: process.stdin })

const TOOLS = [
  { name: 'echo', description: 'Echo the given text', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } },
  { name: 'upper', description: 'Uppercase the given text', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } },
  { name: 'reverse', description: 'Reverse the given text. This deliberately long description exists so the settings panel tooltip can be measured: it must wrap inside the 320px cap instead of stretching across the dialog and it must stay inside the viewport at any window size.', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }
]

function send(payload) {
  process.stdout.write(JSON.stringify(payload) + '\n')
}

rl.on('line', function (line) {
  let message = null
  try { message = JSON.parse(line) } catch (error) { return }
  if (!message || typeof message !== 'object') return
  // Notifications (initialized, cancelled, …) carry no id and need no reply.
  if (message.id === undefined) return
  if (message.method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id: message.id,
      result: {
        protocolVersion: '2025-06-18',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'fake-mcp', version: '1.0.0' }
      }
    })
    return
  }
  if (message.method === 'tools/list') {
    send({ jsonrpc: '2.0', id: message.id, result: { tools: TOOLS } })
    return
  }
  if (message.method === 'tools/call') {
    const name = message.params && message.params.name
    const args = (message.params && message.params.arguments) || {}
    const text = typeof args.text === 'string' ? args.text : ''
    const output = name === 'upper' ? text.toUpperCase() : name === 'reverse' ? text.split('').reverse().join('') : text
    send({ jsonrpc: '2.0', id: message.id, result: { content: [{ type: 'text', text: output }] } })
    return
  }
  if (message.method === 'ping') {
    send({ jsonrpc: '2.0', id: message.id, result: {} })
    return
  }
  send({
    jsonrpc: '2.0',
    id: message.id,
    error: { code: -32601, message: 'unknown method: ' + String(message.method) }
  })
})
