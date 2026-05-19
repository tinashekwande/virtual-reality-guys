import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — List all admin profiles along with current user metadata
export async function GET() {
  const { user: currentAdmin, error: authError } = await requireAdmin()
  if (authError) return authError

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('admin_profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    admins: data ?? [],
    currentUser: { id: currentAdmin.id, email: currentAdmin.email }
  })
}

// POST — Create a new secondary admin account
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const admin = createAdminClient()

  try {
    const { email, password } = await request.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Email and password (min 8 chars) required' }, { status: 400 })
    }

    // Create user in Supabase Auth via Admin API
    const { data: authData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so they can log in immediately
    })

    if (createError || !authData.user) {
      return NextResponse.json({ error: createError?.message ?? 'Failed to create auth user' }, { status: 400 })
    }

    // Insert user into admin_profiles table
    const { error: dbError } = await admin.from('admin_profiles').insert({
      id: authData.user.id,
      email,
      role: 'admin',
    })

    if (dbError) {
      // Clean up the auth user if database profile creation fails
      await admin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'An unexpected error occurred' }, { status: 500 })
  }
}
