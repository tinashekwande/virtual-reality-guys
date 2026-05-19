import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const formData = await request.formData()
  const admin = createAdminClient()

  const updates: Record<string, unknown> = {
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio') || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }

  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const bytes = await imageFile.arrayBuffer()
    const { error: uploadError } = await admin.storage
      .from('team-avatars')
      .upload(fileName, bytes, { contentType: imageFile.type })
    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage.from('team-avatars').getPublicUrl(fileName)
      updates.image_url = publicUrl
    }
  }

  const { data, error } = await admin.from('team_members').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { data: member } = await admin.from('team_members').select('image_url').eq('id', id).single()
  if (member?.image_url) {
    const path = member.image_url.split('/team-avatars/')[1]
    if (path) await admin.storage.from('team-avatars').remove([path])
  }

  const { error } = await admin.from('team_members').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
