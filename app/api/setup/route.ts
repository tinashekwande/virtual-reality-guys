import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — check if first-run setup is needed
export async function GET() {
  const admin = createAdminClient()
  const { count } = await admin
    .from('admin_profiles')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ configured: (count ?? 0) > 0 })
}

// POST — create first admin (only works if no admins exist)
export async function POST(request: Request) {
  const admin = createAdminClient()

  // Lock check
  const { count } = await admin
    .from('admin_profiles')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: 'Setup already completed' }, { status: 403 })
  }

  const { email, password } = await request.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required' }, { status: 400 })
  }

  // Create Supabase Auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 500 })
  }

  // Insert admin profile
  await admin.from('admin_profiles').insert({
    id: authData.user.id,
    email,
    role: 'admin',
  })

  return NextResponse.json({ success: true })
}
