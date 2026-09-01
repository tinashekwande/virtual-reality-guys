import { createAdminClient } from '@/lib/supabase/admin'
import { Invoice, EventItem, FormRequest, TeamMember } from '@/types'
import { EquipmentItem, EquipmentLog, AiAction, FollowUpItem } from '@/types/ai'

/**
 * Controlled Backend Tool Execution Engine
 * Safe queries with validation — NO raw SQL exposure.
 */

// 1. Get Bookings & Calendar Events
export async function getBookingsTool(args: {
  date_from?: string
  date_to?: string
  status?: string
  limit?: number
}) {
  const admin = createAdminClient()
  const limit = Math.min(args.limit || 50, 100)

  let invoicesQuery = admin.from('invoices').select('*').order('event_date', { ascending: true }).limit(limit)
  let eventsQuery = admin.from('events').select('*').order('event_date', { ascending: true }).limit(limit)

  if (args.status && args.status !== 'all') {
    invoicesQuery = invoicesQuery.eq('status', args.status)
    eventsQuery = eventsQuery.eq('status', args.status)
  }
  if (args.date_from) {
    invoicesQuery = invoicesQuery.gte('event_date', args.date_from)
    eventsQuery = eventsQuery.gte('event_date', args.date_from)
  }
  if (args.date_to) {
    invoicesQuery = invoicesQuery.lte('event_date', args.date_to)
    eventsQuery = eventsQuery.lte('event_date', args.date_to)
  }

  const [{ data: invoices }, { data: standaloneEvents }] = await Promise.all([
    invoicesQuery,
    eventsQuery,
  ])

  return {
    invoices: (invoices || []) as Invoice[],
    events: (standaloneEvents || []) as EventItem[],
    total_count: (invoices?.length || 0) + (standaloneEvents?.length || 0),
  }
}

// 2. Get Single Booking / Event
export async function getBookingByIdTool(args: { id: string; type?: 'invoice' | 'event' }) {
  const admin = createAdminClient()
  if (args.type === 'event') {
    const { data } = await admin.from('events').select('*').eq('id', args.id).single()
    return data ? { event: data, type: 'event' } : null
  }
  const { data } = await admin.from('invoices').select('*').eq('id', args.id).single()
  return data ? { invoice: data, type: 'invoice' } : null
}

// 3. Get Unpaid / Overdue Invoices
export async function getUnpaidInvoicesTool(args: { overdue_only?: boolean }) {
  const admin = createAdminClient()
  const now = new Date().toISOString().split('T')[0]

  let query = admin
    .from('invoices')
    .select('*')
    .in('status', ['pending', 'deposit_paid', 'sent', 'draft'])
    .order('due_date', { ascending: true })

  if (args.overdue_only) {
    query = query.lt('due_date', now)
  }

  const { data } = await query
  const list = (data || []) as Invoice[]

  const totalOutstanding = list.reduce((acc, inv) => {
    if (inv.status === 'deposit_paid') {
      const pct = (inv.deposit_percentage || 50) / 100
      return acc + (Number(inv.total) * (1 - pct))
    }
    return acc + Number(inv.total || 0)
  }, 0)

  return {
    invoices: list,
    count: list.length,
    total_outstanding_zar: totalOutstanding,
  }
}

// 4. Get Customer & Booking History
export async function getCustomerHistoryTool(args: { query: string }) {
  const admin = createAdminClient()
  const q = `%${args.query.trim()}%`

  const [{ data: invoices }, { data: requests }] = await Promise.all([
    admin
      .from('invoices')
      .select('*')
      .or(`client_name.ilike.${q},client_email.ilike.${q},client_phone.ilike.${q}`)
      .order('created_at', { ascending: false }),
    admin
      .from('form_requests')
      .select('*')
      .or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q}`)
      .order('created_at', { ascending: false }),
  ])

  const invList = (invoices || []) as Invoice[]
  const totalSpent = invList
    .filter((i) => i.status === 'paid' || i.status === 'deposit_paid')
    .reduce((acc, i) => acc + (Number(i.total) || 0), 0)

  return {
    customer_name: invList[0]?.client_name || (requests as any)?.[0]?.name || args.query,
    total_bookings: invList.length,
    total_spent_zar: totalSpent,
    is_repeat_customer: invList.length > 1,
    invoices: invList,
    requests: (requests || []) as FormRequest[],
  }
}

// 5. Get Revenue Summary
export async function getRevenueSummaryTool(args: { period?: 'all' | 'this_month' | 'last_month' | 'year' }) {
  const admin = createAdminClient()
  const [{ data: invoices }, { data: events }, { data: expenses }] = await Promise.all([
    admin.from('invoices').select('*'),
    admin.from('events').select('*'),
    admin.from('expenses').select('*'),
  ])

  const invList = (invoices || []) as Invoice[]
  const evtList = (events || []) as EventItem[]
  const expList = (expenses || []) as any[]

  // Paid Revenue
  const invoiceRevenue = invList.reduce((acc, inv) => {
    if (inv.status === 'paid') return acc + Number(inv.total || 0)
    if (inv.status === 'deposit_paid') {
      const pct = (inv.deposit_percentage || 50) / 100
      return acc + (Number(inv.total || 0) * pct)
    }
    return acc
  }, 0)

  const eventRevenue = evtList.reduce((acc, evt) => acc + Number(evt.total_revenue || 0), 0)
  const totalRevenue = invoiceRevenue + eventRevenue

  // Pending Pipeline
  const pendingPipeline = invList
    .filter((i) => i.status === 'pending' || i.status === 'sent')
    .reduce((acc, i) => acc + Number(i.total || 0), 0)

  // Expenses & Net Profit
  const totalExpenses = expList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  return {
    total_confirmed_revenue_zar: totalRevenue,
    pending_pipeline_zar: pendingPipeline,
    total_expenses_zar: totalExpenses,
    net_profit_zar: netProfit,
    profit_margin_pct: Number(profitMargin.toFixed(1)),
    invoice_count: invList.length,
    event_count: evtList.length,
  }
}

// 6. Get Equipment Inventory & Availability
export async function getEquipmentStatusTool() {
  const admin = createAdminClient()
  const [{ data: equipment }, { data: logs }] = await Promise.all([
    admin.from('equipment').select('*').order('name', { ascending: true }),
    admin.from('equipment_logs').select('*, equipment(name)').eq('status', 'open'),
  ])

  const items = (equipment || []) as EquipmentItem[]
  const totalHeadsets = items.filter((e) => e.category === 'VR Headset')
  const availableHeadsets = totalHeadsets.filter((e) => e.status === 'available')
  const maintenanceHeadsets = totalHeadsets.filter((e) => e.status === 'maintenance')

  return {
    total_headsets: totalHeadsets.length,
    available_headsets: availableHeadsets.length,
    in_maintenance_headsets: maintenanceHeadsets.length,
    equipment_items: items,
    open_issue_logs: (logs || []) as EquipmentLog[],
  }
}

// 7. Get Pending Enquiries & Requests
export async function getPendingRequestsTool() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('form_requests')
    .select('*')
    .in('status', ['new', 'in_progress'])
    .order('created_at', { ascending: false })

  return {
    requests: (data || []) as FormRequest[],
    count: data?.length || 0,
  }
}

// 8. Get Team Members & Staff
export async function getTeamMembersTool() {
  const admin = createAdminClient()
  const { data } = await admin.from('team_members').select('*').order('sort_order', { ascending: true })
  return {
    team_members: (data || []) as TeamMember[],
    count: data?.length || 0,
  }
}

// 9. Propose AI Action (Level 1, 2, or 3)
export async function createActionProposalTool(args: {
  action_type: string
  level?: 1 | 2 | 3
  title: string
  description?: string
  payload: Record<string, any>
  requires_approval?: boolean
}) {
  const admin = createAdminClient()
  const level = args.level || 2
  const requires_approval = args.requires_approval !== undefined ? args.requires_approval : level > 1

  const payload = {
    action_type: args.action_type,
    level,
    status: requires_approval ? 'pending_approval' : 'approved',
    title: args.title,
    description: args.description || '',
    payload: args.payload,
    requires_approval,
    created_by: 'VR Guys AI Engine',
  }

  const { data, error } = await admin.from('ai_actions').insert([payload]).select().single()

  if (error) {
    console.error('[AI Actions] Error creating action proposal:', error)
    return null
  }

  // Create Audit Log
  await admin.from('ai_audit_logs').insert([
    {
      action_id: data.id,
      action_name: args.action_type,
      category: 'operations',
      actor: 'AI Engine',
      target_record: args.title,
      details: args.payload,
      status: 'success',
    },
  ])

  return data as AiAction
}

// 10. Execute Approved AI Action
export async function executeApprovedActionTool(actionId: string, approvedBy: string = 'Admin') {
  const admin = createAdminClient()
  const { data: action, error } = await admin.from('ai_actions').select('*').eq('id', actionId).single()

  if (error || !action) {
    throw new Error('Action not found')
  }

  let result: Record<string, any> = { executed: true }

  try {
    // Dispatch action type execution
    switch (action.action_type) {
      case 'create_invoice':
      case 'send_quote': {
        const payload = action.payload
        const { data: newDoc, error: docErr } = await admin
          .from('invoices')
          .insert([payload])
          .select()
          .single()
        if (docErr) throw docErr
        result = { document_id: newDoc.id, doc_number: newDoc.doc_number }
        break
      }
      case 'update_booking_status': {
        const { id, status, is_invoice } = action.payload
        const table = is_invoice ? 'invoices' : 'form_requests'
        await admin.from(table).update({ status }).eq('id', id)
        result = { updated: true, new_status: status }
        break
      }
      case 'create_followup': {
        const { data: fUp, error: fErr } = await admin
          .from('follow_ups')
          .insert([action.payload])
          .select()
          .single()
        if (fErr) throw fErr
        result = { followup_id: fUp.id }
        break
      }
      case 'mark_equipment_maintenance': {
        const { equipment_id, issue_description } = action.payload
        await admin.from('equipment').update({ status: 'maintenance' }).eq('id', equipment_id)
        await admin.from('equipment_logs').insert([
          {
            equipment_id,
            issue_type: 'maintenance_flag',
            description: issue_description || 'Flagged by AI Maintenance Engine',
            severity: 'medium',
            status: 'open',
          },
        ])
        result = { equipment_status: 'maintenance' }
        break
      }
      default:
        result = { executed: true, note: 'Generic action processed' }
    }

    // Update Action status
    await admin
      .from('ai_actions')
      .update({
        status: 'executed',
        approved_by: approvedBy,
        result,
        executed_at: new Date().toISOString(),
      })
      .eq('id', actionId)

    // Audit Log
    await admin.from('ai_audit_logs').insert([
      {
        action_id: actionId,
        action_name: action.action_type,
        category: 'operations',
        actor: approvedBy,
        target_record: action.title,
        details: { result },
        status: 'success',
      },
    ])

    return { success: true, action: { ...action, status: 'executed', result } }
  } catch (err: any) {
    await admin
      .from('ai_actions')
      .update({
        status: 'failed',
        error: err?.message || 'Execution error',
      })
      .eq('id', actionId)

    throw err
  }
}
