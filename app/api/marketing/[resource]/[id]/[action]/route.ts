import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import * as m from '@/lib/marketing/service'

type Ctx = { params: Promise<{ resource: string; id: string; action: string }> }

// POST /api/marketing/campaigns/:id/prepare     → build recipient list
// POST /api/marketing/campaigns/:id/send-batch  → send next batch via portal email provider
export async function POST(request: Request, { params }: Ctx) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource, id, action } = await params
  const actor = `Admin${user?.email ? ` (${user.email})` : ''}`
  if (resource !== 'campaigns') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    if (action === 'prepare') return NextResponse.json(await m.prepareCampaignRecipients(id, actor))
    if (action === 'send-batch') {
      const body = await request.json().catch(() => ({}))
      return NextResponse.json(await m.sendCampaignBatchViaPortal(id, Math.min(Number(body.limit) || 50, 100), actor))
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
