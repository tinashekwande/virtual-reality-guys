import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { renderInvoicePdf, invoicePdfFilename } from '@/lib/pdf/invoice-pdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

/** Resolve the real status/time embedded in notes (fallback tags) before rendering. */
function normalize(inv: any) {
  if (inv && typeof inv.notes === 'string') {
    const sm = inv.notes.match(/\[STATUS:([a-zA-Z0-9_]+)\]/)
    if (sm && inv.status === 'sent') inv.status = sm[1]
    const tm = inv.notes.match(/\[TIME:([^\]]+)\]/)
    if (tm && !inv.event_time) inv.event_time = tm[1].trim()
    inv.notes = inv.notes.replace(/\[(STATUS|TIME|REQUEST):[^\]]*\]/g, '').trim()
  }
  return inv
}

// GET — download a server-generated PDF of this quote/invoice (admin only)
export async function GET(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const { data, error } = await createAdminClient().from('invoices').select('*').eq('id', id).single()
  if (error || !data) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

  const invoice = normalize(data)
  const pdf = renderInvoicePdf(invoice)
  const inline = new URL(request.url).searchParams.get('inline') === '1'
  return new Response(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${invoicePdfFilename(invoice)}"`,
      'Cache-Control': 'no-store',
    },
  })
}
