import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import * as m from '@/lib/marketing/service'

type Ctx = { params: Promise<{ resource: string }> }

const actorFor = (user: { email?: string | null } | null) => `Admin${user?.email ? ` (${user.email})` : ''}`

// GET /api/marketing/{contacts|campaigns|ads|communications}
export async function GET(request: Request, { params }: Ctx) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource } = await params
  const sp = new URL(request.url).searchParams
  try {
    switch (resource) {
      case 'contacts':
        return NextResponse.json(
          await m.listContacts({
            status: sp.get('status') || undefined,
            tag: sp.get('tag') || undefined,
            search: sp.get('search') || undefined,
            limit: Number(sp.get('limit')) || 500,
          })
        )
      case 'campaigns':
        return NextResponse.json({ campaigns: await m.listCampaigns({ status: sp.get('status') || undefined }) })
      case 'ads':
        return NextResponse.json({ ads: await m.listAds({ status: sp.get('status') || undefined }) })
      case 'communications':
        return NextResponse.json({
          communications: await m.listCommunications({
            request_id: sp.get('request_id') || undefined,
            email: sp.get('email') || undefined,
            limit: Number(sp.get('limit')) || 200,
          }),
        })
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/marketing/{contacts|campaigns|ads|communications}
export async function POST(request: Request, { params }: Ctx) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource } = await params
  const actor = actorFor(user)
  try {
    const body = await request.json()
    switch (resource) {
      case 'contacts': {
        const list = Array.isArray(body.contacts) ? body.contacts : [body]
        return NextResponse.json(await m.upsertContacts(list.map((c: any) => ({ ...c, source: c.source || 'manual' })), actor), { status: 201 })
      }
      case 'campaigns':
        return NextResponse.json(await m.createCampaign(body, actor), { status: 201 })
      case 'ads':
        return NextResponse.json(await m.createAd(body, actor), { status: 201 })
      case 'communications':
        return NextResponse.json(await m.logCommunication(body, actor), { status: 201 })
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
