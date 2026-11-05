import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { syncInvoiceStatus } from '@/lib/accounts/server'

interface Props {
  params: Promise<{ id: string }>
}

// DELETE — remove a payment that was entered by mistake; invoice status follows the remaining payments
export async function DELETE(_request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { data: existing } = await admin.from('payments').select('invoice_id').eq('id', id).single()
  if (!existing) return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })

  const { error } = await admin.from('payments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const newStatus = await syncInvoiceStatus(admin, existing.invoice_id)
  return NextResponse.json({ success: true, invoice_status: newStatus })
}
