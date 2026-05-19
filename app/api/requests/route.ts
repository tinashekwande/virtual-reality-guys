import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — list requests with filters (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const formType = searchParams.get('form_type')

  const admin = createAdminClient()
  let query = admin.from('form_requests').select('*').order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (formType) query = query.eq('form_type', formType)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
