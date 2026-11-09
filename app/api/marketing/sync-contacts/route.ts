import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { syncContactsFromClients } from '@/lib/marketing/service'

export async function POST() {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError
  try {
    return NextResponse.json(await syncContactsFromClients(`Admin${user?.email ? ` (${user.email})` : ''}`))
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
