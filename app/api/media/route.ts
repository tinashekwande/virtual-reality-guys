import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — list media, optional ?category=id filter (public)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category')

  const admin = createAdminClient()
  let query = admin
    .from('media')
    .select('*, categories(id, name)')
    .order('created_at', { ascending: false })

  if (categoryId) query = query.eq('category_id', categoryId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — upload media (admin only, multipart/form-data)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('category_id') as string

  if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 })
  if (!categoryId) return NextResponse.json({ error: 'Category is required' }, { status: 400 })

  const admin = createAdminClient()
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await admin.storage
    .from('gallery')
    .upload(fileName, bytes, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = admin.storage.from('gallery').getPublicUrl(fileName)

  const fileType = file.type.startsWith('video') ? 'video' : 'image'

  const { data, error } = await admin
    .from('media')
    .insert({
      file_url: publicUrl,
      type: fileType,
      title: title || null,
      description: description || null,
      category_id: categoryId || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
