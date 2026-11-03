import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getMarketingReport } from '@/lib/marketing/service'
import { getConfiguredEmailProvider } from '@/lib/email/sender'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError
  try {
    return NextResponse.json({
      ...(await getMarketingReport()),
      portal_email_provider: getConfiguredEmailProvider(),
      mcp_configured: !!process.env.MCP_SECRET_KEY && process.env.MCP_SECRET_KEY.length >= 24,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
