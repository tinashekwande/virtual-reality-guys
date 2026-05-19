import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — list all categories with media count (public)
export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('categories')
    .select('*, media(count)')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const categories = data.map(c => ({
    ...c,
    media_count: (c.media as any)?.[0]?.count ?? 0,
  }))

  return NextResponse.json(categories)
}

// POST — create category (admin only)
export async function POST(request: Request) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError

  const { name } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('categories')
    .insert({ name: name.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
