import type { SupabaseClient } from '@supabase/supabase-js'
import type { Invoice, PaymentItem } from '@/types'
import { statusFromPayments, summarisePayments } from '@/lib/accounts/calc'
import { reconcileFollowUpsForInvoice } from '@/lib/followups/scheduler'

/** Invoice rows can keep their real status as a [STATUS:x] tag in notes (when the DB check constraint is older). Resolve it. */
export function resolveInvoiceStatus<T extends { status?: string; notes?: string | null }>(inv: T): T {
  const notes = typeof inv.notes === 'string' ? inv.notes : ''
  const m = notes.match(/\[STATUS:([a-zA-Z0-9_]+)\]/)
  if (m && inv.status === 'sent') return { ...inv, status: m[1] }
  return inv
}

/** True when a Supabase error means a table/column from supabase/accounts_v2.sql has not been created yet. */
export function isMissingSchemaError(message?: string | null): boolean {
  if (!message) return false
  return /does not exist|schema cache|could not find|relation .* does not exist/i.test(message)
}

/**
 * Re-derive an invoice's status from the money actually received (paid / deposit paid)
 * and save it, using the same fallback the invoice API uses for older status constraints.
 * Returns the new status, or null if nothing changed.
 */
export async function syncInvoiceStatus(admin: SupabaseClient, invoiceId: string): Promise<string | null> {
  const { data: raw } = await admin.from('invoices').select('*').eq('id', invoiceId).single()
  if (!raw) return null
  const inv = resolveInvoiceStatus(raw) as Invoice

  const { data: pays } = await admin.from('payments').select('*').eq('invoice_id', invoiceId)
  const summary = summarisePayments(inv, (pays || []) as PaymentItem[])
  const next = statusFromPayments(inv, summary)
  if (!next || next === inv.status) return null

  const now = new Date().toISOString()
  const baseNotes = (raw.notes || '').replace(/\[STATUS:[^\]]+\]/g, '').trim()

  let { data, error } = await admin
    .from('invoices')
    .update({ status: next, notes: baseNotes, updated_at: now })
    .eq('id', invoiceId)
    .select()
    .single()

  if (error && /check constraint|invoices_status_check/i.test(error.message)) {
    const retry = await admin
      .from('invoices')
      .update({ status: 'sent', notes: `${baseNotes} [STATUS:${next}]`.trim(), updated_at: now })
      .eq('id', invoiceId)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }
  if (error) {
    console.error('[accounts] failed to sync invoice status:', error.message)
    return null
  }

  if (data) {
    reconcileFollowUpsForInvoice({ ...resolveInvoiceStatus(data), status: next }).catch((e) =>
      console.error('[accounts] follow-up reconcile error:', e)
    )
  }
  return next
}
