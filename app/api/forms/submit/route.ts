import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public endpoint — receives form submissions from the website
export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, suburb, message, event_date, form_type = 'contact' } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Prepend metadata headers (event date & suburb) so they are preserved across all views
  const metaHeaders: string[] = []
  if (event_date) metaHeaders.push(`[Event Date: ${event_date}]`)
  if (suburb) metaHeaders.push(`[Suburb: ${suburb}]`)

  const formattedMessage = metaHeaders.length > 0
    ? `${metaHeaders.join(' ')}\n\n${message}`
    : message

  const admin = createAdminClient()

  // Build insert payload
  const insertPayload: Record<string, any> = {
    name,
    email,
    phone: phone || null,
    message: formattedMessage,
    form_type,
    status: 'new',
  }
  if (suburb) {
    insertPayload.suburb = suburb
  }

  let { data, error } = await admin
    .from('form_requests')
    .insert(insertPayload)
    .select()
    .single()

  // Graceful fallback if database schema does not have the 'suburb' column yet
  if (error && (error.message?.includes('suburb') || error.code === '42703')) {
    delete insertPayload.suburb
    const retry = await admin
      .from('form_requests')
      .insert(insertPayload)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
