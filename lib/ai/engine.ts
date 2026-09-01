import { createAdminClient } from '@/lib/supabase/admin'
import { generateAiContent } from './client'
import { getMasterSystemInstruction } from './context'
import { detectAllConflicts } from './conflict-detector'
import { calculateRevenueForecast } from './forecasting'
import {
  getBookingsTool,
  getUnpaidInvoicesTool,
  getCustomerHistoryTool,
  getRevenueSummaryTool,
  getEquipmentStatusTool,
  getPendingRequestsTool,
  getTeamMembersTool,
} from './tools'
import { AiDailyBriefing } from '@/types/ai'

/**
 * VR GUYS MASTER AI ENGINE
 * Central intelligence coordinating all business subsystems.
 */

// 1. Generate Daily Business Briefing
export async function generateDailyBriefing(): Promise<AiDailyBriefing> {
  const admin = createAdminClient()
  const todayStr = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  let greetingTime = 'Good morning'
  if (hour >= 12 && hour < 17) greetingTime = 'Good afternoon'
  else if (hour >= 17) greetingTime = 'Good evening'

  const [
    bookingsRes,
    unpaidRes,
    conflicts,
    forecast,
    pendingReqs,
    equipmentRes,
    followupsRes,
  ] = await Promise.all([
    getBookingsTool({ limit: 100 }),
    getUnpaidInvoicesTool({ overdue_only: false }),
    detectAllConflicts(),
    calculateRevenueForecast(),
    getPendingRequestsTool(),
    getEquipmentStatusTool(),
    admin.from('follow_ups').select('*').eq('status', 'pending').limit(10),
  ])

  // Calculate stats
  const eventsToday = bookingsRes.invoices.filter((i) => (i.event_date || i.issue_date) === todayStr).length +
    bookingsRes.events.filter((e) => e.event_date === todayStr).length

  const pendingQuotes = bookingsRes.invoices.filter((i) => i.type === 'quote' && (i.status === 'draft' || i.status === 'sent')).length

  // Build Attention Required items
  const attentionItems: AiDailyBriefing['attention_required'] = []

  // Add conflict warnings
  conflicts.forEach((c) => {
    attentionItems.push({
      id: c.id,
      type: c.type,
      severity: c.severity === 'critical' || c.severity === 'high' ? 'high' : 'medium',
      title: c.title,
      description: c.description,
      action_label: 'View Conflict',
      action_link: '/admin/planner',
    })
  })

  // Add unpaid overdue warning if any
  if (unpaidRes.count > 0 && unpaidRes.total_outstanding_zar > 0) {
    attentionItems.push({
      id: 'unpaid-invoices',
      type: 'payment_overdue',
      severity: 'medium',
      title: `${unpaidRes.count} Payment(s) Outstanding (R${unpaidRes.total_outstanding_zar.toLocaleString()})`,
      description: `Follow up on pending deposits and balances to secure cash flow.`,
      action_label: 'View Invoices',
      action_link: '/admin/quotes-invoices',
    })
  }

  // Build Opportunities items
  const opportunities: AiDailyBriefing['opportunities'] = []

  // Check pending form requests
  if (pendingReqs.count > 0) {
    const firstReq = pendingReqs.requests[0]
    opportunities.push({
      id: `req-${firstReq.id}`,
      type: 'pending_request',
      title: `New Customer Enquiry: ${firstReq.name}`,
      estimated_value_zar: 899,
      description: `Pending request: "${firstReq.message.slice(0, 75)}..."`,
      action_label: 'Prepare Quote',
      action_link: '/admin/requests',
    })
  }

  // Build Follow-ups items
  const followupsDue: AiDailyBriefing['follow_ups_due'] = []
  const quotesToFollowUp = bookingsRes.invoices
    .filter((i) => i.type === 'quote' && i.status === 'sent')
    .slice(0, 5)

  quotesToFollowUp.forEach((q) => {
    followupsDue.push({
      id: q.id,
      client_name: q.client_name,
      days_pending: 2,
      channel: q.client_phone ? 'WhatsApp / Email' : 'Email',
      action_label: 'Send Follow-up',
      action_link: `/admin/quotes-invoices?id=${q.id}`,
    })
  })

  return {
    greeting: `${greetingTime}, VR Guys Team 👋`,
    summary: `Here is what needs your attention today across bookings, fleet capacity, and cash flow.`,
    date: new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    stats: {
      events_today: eventsToday,
      events_this_week: bookingsRes.total_count,
      pending_quotes: pendingQuotes,
      outstanding_amount: unpaidRes.total_outstanding_zar,
      equipment_shortages: conflicts.filter((c) => c.type === 'equipment_shortage').length,
      followups_due: followupsDue.length,
      at_risk_bookings: conflicts.length,
    },
    attention_required: attentionItems,
    opportunities,
    financial_intelligence: {
      growth_rate: forecast.growth_vs_previous_month_pct,
      growth_description: `Revenue is currently tracking ${forecast.growth_vs_previous_month_pct}% above previous period with healthy weekend birthday party volume.`,
      highest_value_category: 'School & Corporate VR Experiences',
      unpaid_invoices_count: unpaidRes.count,
      unpaid_invoices_amount: unpaidRes.total_outstanding_zar,
      projected_revenue: forecast.projected_total_zar,
    },
    follow_ups_due: followupsDue,
  }
}

// 2. Natural Language Conversational Assistant
export async function answerBusinessQuery(
  userQuery: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<{ text: string; data?: any; suggested_actions?: Array<{ label: string; action: string; link?: string }> }> {
  // 1. Gather live business data context
  const [
    bookings,
    unpaid,
    revenue,
    equipment,
    requests,
    conflicts,
    team,
  ] = await Promise.all([
    getBookingsTool({ limit: 20 }),
    getUnpaidInvoicesTool({ overdue_only: false }),
    getRevenueSummaryTool({ period: 'this_month' }),
    getEquipmentStatusTool(),
    getPendingRequestsTool(),
    detectAllConflicts(),
    getTeamMembersTool(),
  ])

  const contextPrompt = `LIVE DATABASE SNAPSHOT:
- Confirmed Paid Revenue: R${revenue.total_confirmed_revenue_zar.toLocaleString()}
- Pending Quotes & Invoices: R${revenue.pending_pipeline_zar.toLocaleString()}
- Total Active VR Headsets: ${equipment.available_headsets} available / ${equipment.total_headsets} total
- Unpaid Invoices Total: R${unpaid.total_outstanding_zar.toLocaleString()} (${unpaid.count} invoices)
- Pending Customer Requests: ${requests.count} new requests
- Detected Operational Conflicts: ${conflicts.length} active warnings (${conflicts.map((c) => c.title).join('; ') || 'None'})
- Team Members: ${team.team_members.map((t) => `${t.name} (${t.role})`).join(', ')}

RECENT BOOKINGS & INVOICES:
${bookings.invoices
  .slice(0, 8)
  .map((i) => `- #${i.doc_number}: ${i.client_name} | ${i.event_date || i.issue_date} | ${i.status} | R${i.total}`)
  .join('\n')}

PENDING REQUESTS:
${requests.requests
  .slice(0, 5)
  .map((r) => `- From ${r.name} (${r.email}): "${r.message.slice(0, 60)}"`)
  .join('\n')}
`

  const sysInstruction = await getMasterSystemInstruction()
  const prompt = `${contextPrompt}\n\nUSER QUESTION: "${userQuery}"\n\nPlease answer concisely using the live business data above. Use markdown formatting, bullet points, and highlight key action items.`

  try {
    const aiResponse = await generateAiContent(prompt, {
      systemInstruction: sysInstruction,
      temperature: 0.3,
    })

    const suggestedActions = []
    const qLower = userQuery.toLowerCase()
    if (qLower.includes('unpaid') || qLower.includes('invoice') || qLower.includes('money')) {
      suggestedActions.push({ label: 'View Quotes & Invoices', action: 'navigate', link: '/admin/quotes-invoices' })
      suggestedActions.push({ label: 'View Financial Accounts', action: 'navigate', link: '/admin/accounting' })
    } else if (qLower.includes('equipment') || qLower.includes('headset') || qLower.includes('shortage')) {
      suggestedActions.push({ label: 'View Equipment Inventory', action: 'navigate', link: '/admin/equipment' })
      suggestedActions.push({ label: 'Open Booking Planner', action: 'navigate', link: '/admin/planner' })
    } else if (qLower.includes('request') || qLower.includes('enquiry') || qLower.includes('lead')) {
      suggestedActions.push({ label: 'View Customer Requests', action: 'navigate', link: '/admin/requests' })
    }

    return {
      text: aiResponse || 'Here is the current business summary.',
      suggested_actions: suggestedActions,
    }
  } catch (err: any) {
    console.error('[AI Engine] Error answering query:', err)
    return {
      text: `Live business data snapshot:\n\n- Confirmed Revenue: R${revenue.total_confirmed_revenue_zar.toLocaleString()}\n- Outstanding Invoices: R${unpaid.total_outstanding_zar.toLocaleString()}\n- Available Headsets: ${equipment.available_headsets} of ${equipment.total_headsets}\n- Pending Enquiries: ${requests.count}`,
      suggested_actions: [
        { label: 'Go to Quotes & Invoices', action: 'navigate', link: '/admin/quotes-invoices' },
        { label: 'Open Booking Planner', action: 'navigate', link: '/admin/planner' },
      ],
    }
  }
}
