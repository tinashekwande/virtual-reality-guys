import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — list all team members (public)
export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('team_members')
    .select('*')
    .order('sort_order')
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — add team member (admin only, multipart/form-data)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const formData = await request.formData()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const bio = formData.get('bio') as string
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0
  const imageFile = formData.get('image') as File | null

  if (!name || !role) return NextResponse.json({ error: 'Name and role required' }, { status: 400 })

  const admin = createAdminClient()
  let imageUrl: string | null = null

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const bytes = await imageFile.arrayBuffer()
    const { error: uploadError } = await admin.storage
      .from('team-avatars')
      .upload(fileName, bytes, { contentType: imageFile.type })
    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage.from('team-avatars').getPublicUrl(fileName)
      imageUrl = publicUrl
    }
  }

  const { data, error } = await admin
    .from('team_members')
    .insert({ name, role, bio: bio || null, image_url: imageUrl, sort_order: sortOrder })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
