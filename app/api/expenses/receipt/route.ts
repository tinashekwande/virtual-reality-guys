import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

const BUCKET = 'receipts'
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']

// POST — upload a receipt (photo or PDF); returns its storage path to save on the expense
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File is too large (max 10 MB).' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Upload a photo (JPG, PNG, WebP, HEIC) or a PDF.' }, { status: 400 })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'receipt'
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`

    const admin = createAdminClient()
    const { error } = await admin.storage.from(BUCKET).upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    })
    if (error) {
      const msg = /bucket/i.test(error.message) ? 'Receipt storage is not set up yet: run supabase/accounts_v2.sql in Supabase first.' : error.message
      return NextResponse.json({ error: msg }, { status: 500 })
    }
    return NextResponse.json({ path }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}

// GET ?path= — short-lived private link to view a receipt
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const path = new URL(request.url).searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(path, 60 * 10)
  if (error || !data) return NextResponse.json({ error: error?.message || 'Receipt not found' }, { status: 404 })
  return NextResponse.json({ url: data.signedUrl })
}
