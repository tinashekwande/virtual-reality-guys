import { handleMcpRequest } from '@/lib/mcp/handler'

// Admin portal MCP connector — authenticate with "Authorization: Bearer <MCP_SECRET_KEY>".
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  return handleMcpRequest(request)
}
export async function GET(request: Request) {
  return handleMcpRequest(request)
}
export async function DELETE(request: Request) {
  return handleMcpRequest(request)
}
