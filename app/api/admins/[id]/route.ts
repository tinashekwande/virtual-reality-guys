import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify caller is an authenticated admin
  const { user: currentAdmin, error: authError } = await requireAdmin()
  if (authError) return authError

  const { id: idToDelete } = await params

  // 2. Prevent self-deletion
  if (currentAdmin.id === idToDelete) {
    return NextResponse.json(
      { error: 'You cannot delete your own admin account. Please have another admin delete it or log in as a different user.' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // 3. Delete the auth user (this cascades and deletes the profile in `admin_profiles` as defined in the DB foreign key references)
  const { error } = await admin.auth.admin.deleteUser(idToDelete)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
