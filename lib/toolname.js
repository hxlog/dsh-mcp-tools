/**
 * Tool naming contract, copied from @deepseek-ai/dsh-mcp-client's publicToolName()
 * (that helper is not exported). Public model-facing name:
 *   mcp__<serverName>__<rawName>, normalized to [A-Za-z0-9_-] and <= 64 chars;
 *   when normalization/truncation changes the string, append '_' + 12 hex of
 *   sha256(serverName + '\0' + rawName) so distinct identities never collapse.
 */
import { createHash } from 'node:crypto'

export const MAX_PUBLIC_NAME_LENGTH = 64
const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g
const HASH_LENGTH = 12

export function publicToolName(serverName, rawName) {
  const joined = `mcp__${serverName}__${rawName}`
  const normalized = joined.replace(INVALID_NAME_CHARS, '_')
  if (normalized === joined && normalized.length <= MAX_PUBLIC_NAME_LENGTH) return normalized
  const hash = createHash('sha256')
    .update(`${serverName}\0${rawName}`)
    .digest('hex')
    .slice(0, HASH_LENGTH)
  return normalized.slice(0, MAX_PUBLIC_NAME_LENGTH - HASH_LENGTH - 1) + '_' + hash
}

export const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/
