import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()

  if (!body.category_id) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('media')
    .update({
      title: body.title ?? null,
      description: body.description ?? null,
      category_id: body.category_id,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  
  revalidatePath('/')
  revalidatePath('/gallery')
  
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  // Get file URL to delete from storage
  const { data: media } = await admin.from('media').select('file_url').eq('id', id).single()

  if (media?.file_url) {
    const path = media.file_url.split('/gallery/')[1]
    if (path) await admin.storage.from('gallery').remove([path])
  }

  const { error } = await admin.from('media').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  
  revalidatePath('/')
  revalidatePath('/gallery')
  
  return NextResponse.json({ success: true })
}
