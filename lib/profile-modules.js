// lib/profile-modules.js — resolve the MCP SDK and the official mcp-client tool
// adapter from the *running profile's* node_modules (the profiles/node_modules
// symlink farm shares realpaths with the harness process, so the modules we get
// are the same instances the host uses).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const home = function () {
  return process.env.DSH_HOME && process.env.DSH_HOME.trim() ? process.env.DSH_HOME.trim() : path.join(os.homedir(), '.dsh')
}

function collectProfileDirsFrom(homeDir, out) {
  try {
    const profilesRoot = path.join(homeDir, 'profiles')
    for (const entry of fs.readdirSync(profilesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const dir = path.join(profilesRoot, entry.name)
      try { if (fs.statSync(path.join(dir, 'package.json')).isFile()) out.push(dir) } catch (error) {}
    }
  } catch (error) {}
}

function profileDirs() {
  const dirs = []
  // 1) DSH_HOME from the environment (the running harness normally exports it).
  collectProfileDirsFrom(home(), dirs)
  // 2) The real user home — keeps module resolution working when DSH_HOME is
  //    pointed at a sandbox for tests.
  const realHome = path.join(os.homedir(), '.dsh')
  if (path.resolve(realHome) !== path.resolve(home())) collectProfileDirsFrom(realHome, dirs)
  if (process.env.DSH_PROFILE) {
    const preferredSuffix = path.join('profiles', process.env.DSH_PROFILE)
    dirs.sort(function (a, b) {
      const ap = a.endsWith(preferredSuffix) ? 0 : 1
      const bp = b.endsWith(preferredSuffix) ? 0 : 1
      return ap - bp
    })
  }
  dirs.push(process.cwd())
  dirs.push(home())
  return Array.from(new Set(dirs))
}

const moduleCache = new Map()

export async function loadProfileModule(specifier) {
  if (moduleCache.has(specifier)) return moduleCache.get(specifier)
  const errors = []
  for (const dir of profileDirs()) {
    try {
      const anchor = path.join(dir, 'package.json')
      const require = createRequire(anchor)
      const resolved = require.resolve(specifier)
      const loaded = await import(pathToFileURL(resolved).href)
      moduleCache.set(specifier, loaded)
      return loaded
    } catch (error) {
      errors.push(dir + ': ' + String((error && (error.code || error.message)) || error))
    }
  }
  throw new Error('无法解析模块 ' + specifier + '（已尝试 ' + errors.length + ' 个 profile 入口）')
}

let sdkPromise = null
export function loadSdk() {
  if (!sdkPromise) {
    sdkPromise = (async function () {
      const client = await loadProfileModule('@modelcontextprotocol/client')
      let stdio = null
      try { stdio = await loadProfileModule('@modelcontextprotocol/client/stdio') } catch (error) { stdio = null }
      return {
        Client: client.Client,
        StreamableHTTPClientTransport: client.StreamableHTTPClientTransport,
        StdioClientTransport: stdio && stdio.StdioClientTransport ? stdio.StdioClientTransport : null
      }
    })()
    sdkPromise.catch(function () { sdkPromise = null })
  }
  return sdkPromise
}

let adapterPromise = null
export function loadToolAdapter() {
  if (!adapterPromise) {
    adapterPromise = (async function () {
      try {
        const mod = await loadProfileModule('@deepseek-ai/dsh-mcp-client')
        return typeof mod.createMcpToolDefinition === 'function' ? mod.createMcpToolDefinition : null
      } catch (error) {
        return null
      }
    })()
  }
  return adapterPromise
}
