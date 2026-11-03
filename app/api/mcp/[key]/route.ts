import { handleMcpRequest } from '@/lib/mcp/handler'

// Admin portal MCP connector — secret in the URL: /api/mcp/<MCP_SECRET_KEY>
// (used for claude.ai custom connectors, which take a URL only).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Ctx = { params: Promise<{ key: string }> }

export async function POST(request: Request, { params }: Ctx) {
  return handleMcpRequest(request, (await params).key)
}
export async function GET(request: Request, { params }: Ctx) {
  return handleMcpRequest(request, (await params).key)
}
export async function DELETE(request: Request, { params }: Ctx) {
  return handleMcpRequest(request, (await params).key)
}
