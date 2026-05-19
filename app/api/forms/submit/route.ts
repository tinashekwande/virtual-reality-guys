import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public endpoint — receives form submissions from the website
export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, message, form_type = 'contact' } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('form_requests')
    .insert({ name, email, phone: phone || null, message, form_type, status: 'new' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
