import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import * as m from '@/lib/marketing/service'

type Ctx = { params: Promise<{ resource: string; id: string }> }

const actorFor = (user: { email?: string | null } | null) => `Admin${user?.email ? ` (${user.email})` : ''}`

export async function GET(_: Request, { params }: Ctx) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource, id } = await params
  try {
    if (resource === 'campaigns') return NextResponse.json(await m.getCampaign(id, { includeRecipients: true }))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource, id } = await params
  const actor = actorFor(user)
  try {
    const body = await request.json()
    switch (resource) {
      case 'contacts':
        return NextResponse.json(await m.updateContact(id, body, actor))
      case 'campaigns':
        return NextResponse.json(await m.updateCampaign(id, body, actor))
      case 'ads':
        return NextResponse.json(await m.updateAd(id, body, actor))
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError
  const { resource, id } = await params
  const actor = actorFor(user)
  try {
    switch (resource) {
      case 'contacts':
        return NextResponse.json(await m.deleteContact(id, actor))
      case 'campaigns':
        return NextResponse.json(await m.deleteCampaign(id, actor))
      case 'ads':
        return NextResponse.json(await m.deleteAd(id, actor))
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
