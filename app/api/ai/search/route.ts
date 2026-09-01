import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Invoice, EventItem, FormRequest } from '@/types'

export async function GET(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const query = (searchParams.get('q') || '').trim().toLowerCase()

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const admin = createAdminClient()
    const results: Array<{
      id: string
      type: 'invoice' | 'quote' | 'event' | 'request'
      title: string
      subtitle: string
      badge: string
      badge_color: string
      amount_zar?: number
      link: string
    }> = []

    // Fetch live datasets
    const [{ data: invoices }, { data: events }, { data: requests }] = await Promise.all([
      admin.from('invoices').select('*').limit(100),
      admin.from('events').select('*').limit(50),
      admin.from('form_requests').select('*').limit(50),
    ])

    const invList = (invoices || []) as Invoice[]
    const evtList = (events || []) as EventItem[]
    const reqList = (requests || []) as FormRequest[]

    // Check special natural language query filters
    const isUnpaidQuery = query.includes('unpaid') || query.includes('overdue') || query.includes('owing')
    const isBirthdayQuery = query.includes('birthday')
    const isSchoolQuery = query.includes('school')
    const isCorporateQuery = query.includes('corporate')

    // Filter Invoices
    invList.forEach((inv) => {
      let matches = false
      const clientName = (inv.client_name || '').toLowerCase()
      const docNum = (inv.doc_number || '').toLowerCase()
      const notes = (inv.notes || '').toLowerCase()
      const itemDesc = (inv.items?.[0]?.description || '').toLowerCase()

      if (clientName.includes(query) || docNum.includes(query) || notes.includes(query) || itemDesc.includes(query)) {
        matches = true
      }
      if (isUnpaidQuery && (inv.status === 'pending' || inv.status === 'deposit_paid' || inv.status === 'sent')) {
        matches = true
      }
      if (isBirthdayQuery && (itemDesc.includes('birthday') || notes.includes('birthday'))) {
        matches = true
      }
      if (isSchoolQuery && (clientName.includes('school') || itemDesc.includes('school') || notes.includes('school'))) {
        matches = true
      }
      if (isCorporateQuery && (clientName.includes('corp') || itemDesc.includes('corporate') || notes.includes('corporate'))) {
        matches = true
      }

      if (matches) {
        results.push({
          id: inv.id,
          type: inv.type === 'quote' ? 'quote' : 'invoice',
          title: `${inv.type === 'quote' ? 'Quote' : 'Invoice'} #${inv.doc_number} — ${inv.client_name}`,
          subtitle: `${inv.event_date || inv.issue_date} • ${inv.items?.[0]?.description || 'VR Package'}`,
          badge: inv.status.toUpperCase().replace('_', ' '),
          badge_color: inv.status === 'paid' ? 'green' : inv.status === 'deposit_paid' ? 'cyan' : 'amber',
          amount_zar: Number(inv.total),
          link: `/admin/quotes-invoices?id=${inv.id}`,
        })
      }
    })

    // Filter Standalone Events
    evtList.forEach((evt) => {
      const title = (evt.title || '').toLowerCase()
      const loc = (evt.location || '').toLowerCase()
      const type = (evt.event_type || '').toLowerCase()

      if (title.includes(query) || loc.includes(query) || type.includes(query)) {
        results.push({
          id: evt.id,
          type: 'event',
          title: `Event: ${evt.title}`,
          subtitle: `${evt.event_date} • ${evt.event_type} • ${evt.location || 'Cape Town'}`,
          badge: evt.status.toUpperCase(),
          badge_color: 'purple',
          amount_zar: Number(evt.total_revenue),
          link: `/admin/planner?eventId=${evt.id}`,
        })
      }
    })

    // Filter Requests
    reqList.forEach((r) => {
      const name = (r.name || '').toLowerCase()
      const msg = (r.message || '').toLowerCase()
      const email = (r.email || '').toLowerCase()

      if (name.includes(query) || msg.includes(query) || email.includes(query)) {
        results.push({
          id: r.id,
          type: 'request',
          title: `Enquiry: ${r.name}`,
          subtitle: `${r.email} • "${r.message.slice(0, 50)}..."`,
          badge: r.status.toUpperCase(),
          badge_color: 'blue',
          link: `/admin/requests`,
        })
      }
    })

    return NextResponse.json({
      results: results.slice(0, 15),
      total_found: results.length,
    })
  } catch (err: any) {
    console.error('[API /api/ai/search] Error:', err)
    return NextResponse.json({ error: err?.message || 'Search failed' }, { status: 500 })
  }
}
