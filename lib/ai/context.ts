import { createAdminClient } from '@/lib/supabase/admin'
import { AiBusinessSettings } from '@/types/ai'

export const DEFAULT_BUSINESS_CONTEXT: AiBusinessSettings['business_context'] = {
  company_name: 'Virtual Reality Guys',
  currency: 'ZAR',
  base_location: 'Cape Town, Western Cape, South Africa',
  free_radius_areas: [
    'Kraaifontein',
    'Brackenfell',
    'Durbanville',
    'Bellville',
    'Kuils River',
    'Joostenberg Vlakte',
    'Pinehurst',
    'Buh-Rein Estate',
  ],
  deposit_percentage: 50,
  fnb_account: '63124445502',
  packages: [
    {
      name: 'Starter Package',
      price: 499,
      headsets: 2,
      hours: 2,
      staff: 1,
      players: 10,
    },
    {
      name: 'Standard Package',
      price: 899,
      headsets: 4,
      hours: 3,
      staff: 2,
      players: 20,
    },
    {
      name: 'Premium Package',
      price: 1299,
      headsets: 6,
      hours: 4,
      staff: 3,
      players: 40,
    },
  ],
}

/**
 * Cape Town Distance & Duration Estimation Matrix (in minutes)
 */
export const CAPE_TOWN_TRAVEL_MATRIX: Record<string, Record<string, number>> = {
  Kraaifontein: {
    Brackenfell: 10,
    Durbanville: 15,
    Bellville: 20,
    City_Bowl: 35,
    Camps_Bay: 45,
    Stellenbosch: 30,
    Somerset_West: 35,
    Century_City: 25,
    Constantia: 40,
  },
  City_Bowl: {
    Camps_Bay: 15,
    Constantia: 25,
    Bellville: 30,
    Durbanville: 35,
    Kraaifontein: 35,
    Stellenbosch: 55,
    Somerset_West: 50,
    Century_City: 15,
  },
  Stellenbosch: {
    Kraaifontein: 30,
    Somerset_West: 25,
    Bellville: 35,
    Durbanville: 35,
    City_Bowl: 55,
    Constantia: 55,
  },
}

/**
 * Calculates estimated travel duration (in minutes) between two Cape Town locations.
 */
export function estimateTravelMinutes(fromLoc: string, toLoc: string): number {
  if (!fromLoc || !toLoc) return 30

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
  const nFrom = normalize(fromLoc)
  const nTo = normalize(toLoc)

  if (nFrom === nTo) return 10

  // Check direct travel matrix matches
  for (const [k1, destinations] of Object.entries(CAPE_TOWN_TRAVEL_MATRIX)) {
    if (normalize(k1).includes(nFrom) || nFrom.includes(normalize(k1))) {
      for (const [k2, mins] of Object.entries(destinations)) {
        if (normalize(k2).includes(nTo) || nTo.includes(normalize(k2))) {
          return mins
        }
      }
    }
  }

  // General heuristic for Greater Cape Town
  if (nTo.includes('stellenbosch') || nTo.includes('paarl') || nTo.includes('franschhoek')) {
    return 50
  }
  if (nTo.includes('campsbay') || nTo.includes('houtbay') || nTo.includes('constantia')) {
    return 45
  }
  if (nTo.includes('durbanville') || nTo.includes('bellville') || nTo.includes('brackenfell')) {
    return 20
  }

  return 35
}

/**
 * Retrieves the live AI Business Settings and Context from Supabase,
 * falling back to robust system defaults.
 */
export async function getAiBusinessContext(): Promise<AiBusinessSettings> {
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('ai_settings').select('*').limit(1).single()

    if (data) {
      return {
        id: data.id,
        model: data.model || 'gemini-2.5-flash',
        automation_toggles: data.automation_toggles || {
          auto_draft_quotes: true,
          auto_conflict_detection: true,
          auto_daily_briefing: true,
          auto_followups: true,
          auto_payment_reminders: true,
          auto_event_planning: true,
          auto_lead_scoring: true,
        },
        business_context: data.business_context || DEFAULT_BUSINESS_CONTEXT,
        approval_rules: data.approval_rules || {
          require_quote_approval: true,
          require_email_approval: true,
          require_whatsapp_approval: true,
          require_discount_approval: true,
          require_staff_assignment_approval: false,
        },
      }
    }
  } catch (err) {
    console.warn('[AI Context] Could not load ai_settings, using defaults:', err)
  }

  return {
    model: 'gemini-2.5-flash',
    automation_toggles: {
      auto_draft_quotes: true,
      auto_conflict_detection: true,
      auto_daily_briefing: true,
      auto_followups: true,
      auto_payment_reminders: true,
      auto_event_planning: true,
      auto_lead_scoring: true,
    },
    business_context: DEFAULT_BUSINESS_CONTEXT,
    approval_rules: {
      require_quote_approval: true,
      require_email_approval: true,
      require_whatsapp_approval: true,
      require_discount_approval: true,
      require_staff_assignment_approval: false,
    },
  }
}

/**
 * Generates the full system instruction prompt with structured business memory.
 */
export async function getMasterSystemInstruction(): Promise<string> {
  const settings = await getAiBusinessContext()
  const ctx = settings.business_context

  const packagesList = ctx.packages
    .map(
      (p) =>
        `- ${p.name}: R${p.price} (Incl. 15% VAT) | ${p.headsets} VR Headsets, ${p.hours} Hours, ${p.staff} Staff, up to ${p.players} players`
    )
    .join('\n')

  return `You are "VR Guys AI" — the intelligent Business Operations & Strategic Brain of Virtual Reality Guys (VR Guys Business OS).

COMPANY OVERVIEW & RULES:
- Company Name: ${ctx.company_name}
- Currency: ${ctx.currency} (South African Rand, formatted as R X,XXX)
- Base Location: ${ctx.base_location}
- Free Delivery Areas: ${ctx.free_radius_areas.join(', ')}
- Deposit Policy: ${ctx.deposit_percentage}% deposit required to secure event date. Balance payable on event day.
- Banking: FNB Cheque Account: ${ctx.fnb_account}, Branch 250655 (Brackenfell).
- Hardware Inventory: Standard fleet of 8 Meta Quest VR Headsets (Kiwi Elite Straps, silicone hygiene covers), 55" 4K Spectator TV Displays, Wi-Fi 6 Dedicated Routers, High-Capacity Power Docks.
- Target Audiences: Birthday parties (ages 8+), School demonstrations & workshops, Corporate team building & activations, Brand expos, Festivals & community pop-ups.

CURRENT PACKAGE PRICING (INCL. 15% VAT):
${packagesList}

YOUR CAPABILITIES & PRINCIPLES:
1. TRUTHFUL BUSINESS DATA: You have access to real business records (bookings, invoices, quotes, requests, expenses, equipment inventory, staff). Never invent fake clients, revenue, or bookings.
2. ACTIONABLE & CONCISE: Answer business questions directly with concrete numbers, bullet points, checklists, and next steps.
3. CONFLICT & RISK SENSITIVITY: Proactively flag equipment shortages, staff conflicts, travel time delays, and overdue unpaid invoices.
4. PERMISSION LEVELS: Understand that Level 1 actions are automatic, Level 2 actions (quotes, WhatsApp, emails, invoices) propose actions for human approval, and Level 3 actions (refunds, cancellations, deletions) require human-only execution.
5. PREDICTIONS VS FACTS: When providing forecasts or lead scores, clearly label them as estimates rather than factual financial certainties.
`
}
