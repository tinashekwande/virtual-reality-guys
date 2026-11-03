import { timingSafeEqual } from 'crypto'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createPortalMcpServer } from './server'

/**
 * HTTP entry point for the admin-portal MCP connector.
 *
 * Auth: a long random secret in the MCP_SECRET_KEY environment variable.
 * Clients pass it either in the URL path (/api/mcp/<secret>, for claude.ai
 * custom connectors) or as "Authorization: Bearer <secret>" (Claude Code,
 * Claude Desktop, other MCP clients).
 */

function secretMatches(provided: string | null | undefined) {
  const expected = process.env.MCP_SECRET_KEY
  if (!expected || expected.length < 24 || !provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32001, message }, id: null }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function handleMcpRequest(request: Request, pathKey?: string) {
  if (!process.env.MCP_SECRET_KEY || process.env.MCP_SECRET_KEY.length < 24) {
    return jsonError(503, 'MCP connector is not configured. Set MCP_SECRET_KEY (24+ characters) in the environment.')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonError(503, 'SUPABASE_SERVICE_ROLE_KEY must be set for the MCP connector.')
  }

  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  if (!secretMatches(pathKey) && !secretMatches(bearer)) {
    return jsonError(401, 'Unauthorized')
  }

  // Stateless: a fresh server + transport per request (works on serverless hosting).
  const server = createPortalMcpServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  try {
    return await transport.handleRequest(request)
  } finally {
    // Response body is fully buffered in JSON mode, so it is safe to close.
    void server.close().catch(() => {})
  }
}
