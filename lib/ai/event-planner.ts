import { EventPlan } from '@/types/ai'
import { Invoice, EventItem } from '@/types'
import { generateAiContent } from './client'
import { getMasterSystemInstruction, estimateTravelMinutes } from './context'
import { calculateEventReadiness } from './readiness-score'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Generates an operational event plan using AI reasoning, combined with
 * deterministic fleet inventory and travel matrix algorithms.
 */
export async function generateEventPlan(
  record: Invoice | EventItem | any,
  isInvoice: boolean = true
): Promise<EventPlan> {
  const readiness = calculateEventReadiness(record, isInvoice)
  const clientName = isInvoice ? (record as Invoice).client_name : (record as EventItem).title
  const eventDate = isInvoice ? (record as Invoice).event_date || (record as Invoice).issue_date : (record as EventItem).event_date
  const location = isInvoice ? (record as Invoice).client_address || 'Cape Town' : (record as EventItem).location || 'Cape Town'
  const packageDesc = isInvoice
    ? (record as Invoice).items?.[0]?.description || 'Standard VR Package (4 Headsets, 3 Hours, 2 Staff)'
    : (record as EventItem).event_type || 'Corporate Activation'

  // Deterministic travel calculation
  const travelMins = estimateTravelMinutes('Kraaifontein (HQ)', location)
  const distanceKm = Math.round(travelMins * 0.8)
  const fuelEst = Math.round(distanceKm * 2.8) // ZAR ~R2.80/km fuel + vehicle wear

  // Determine headset and staff quantities from package
  let headsetCount = 4
  let staffCount = 2
  let eventDurationHours = 3

  const pLower = packageDesc.toLowerCase()
  if (pLower.includes('starter') || pLower.includes('2 headset')) {
    headsetCount = 2
    staffCount = 1
    eventDurationHours = 2
  } else if (pLower.includes('premium') || pLower.includes('6 headset')) {
    headsetCount = 6
    staffCount = 3
    eventDurationHours = 4
  } else if (pLower.includes('corporate') || pLower.includes('expo') || pLower.includes('festival')) {
    headsetCount = 8
    staffCount = 3
    eventDurationHours = 5
  }

  // Generate standard timeline baseline
  const timeline: EventPlan['timeline'] = [
    { time: '08:00', title: 'Equipment Inspection & Van Loading', type: 'prep', description: `Check batteries on ${headsetCount} Meta Quest units, sanitize straps, load 4K display & router.` },
    { time: '08:30', title: 'Depart from HQ to Venue', type: 'travel', description: `Estimated travel duration: ${travelMins} minutes to ${location}.` },
    { time: '09:15', title: 'Arrive & Safety Boundary Calibration', type: 'setup', description: 'Map 2m x 2m Guardian boundaries per station, connect 5GHz Wi-Fi casting, test TV mirrors.' },
    { time: '10:00', title: 'Event Experience Begins', type: 'event', description: `Guide players through curated game selection, host multiplayer matches.` },
    { time: `${10 + eventDurationHours}:00`, title: 'Event Concludes & Feedback', type: 'event', description: 'Thank host, request Google review, take final photo.' },
    { time: `${10 + eventDurationHours}:15`, title: 'Pack-up & Equipment Count', type: 'packup', description: 'Inspect lenses, pack headsets into shockproof cases, fold TV stands.' },
    { time: `${11 + eventDurationHours}:00`, title: 'Return to HQ & Dock on Charging Station', type: 'return', description: 'Plug in all 8 headset bays for next event rotation.' },
  ]

  // Equipment Checklist
  const equipmentChecklist: EventPlan['equipment_checklist'] = [
    { item: `Meta Quest 3 Headsets (Fully Charged)`, category: 'VR Headset', quantity: headsetCount, checked: true },
    { item: `Touch Plus Motion Controllers (with Lanyards)`, category: 'Controller', quantity: headsetCount * 2, checked: true },
    { item: `Kiwi Elite Comfort Straps & Silicone Hygiene Covers`, category: 'Accessories', quantity: headsetCount, checked: true },
    { item: `55" 4K UHD Spectator TV Display & Tripod Stand`, category: 'Display/TV', quantity: headsetCount >= 4 ? 2 : 1, checked: true },
    { item: `Dedicated TP-Link Wi-Fi 6 Low-Latency Router`, category: 'Router', quantity: 1, checked: true },
    { item: `Heavy Duty Extension Reels & Surge Protectors`, category: 'Power & Cables', quantity: 2, checked: true },
    { item: `10,000mAh Battery Powerbanks for Extended Play`, category: 'Power & Cables', quantity: Math.ceil(headsetCount / 2), checked: true },
    { item: `Anti-Bacterial Hygiene Sanitizing Wipes Pack`, category: 'Accessories', quantity: 2, checked: true },
  ]

  // Staffing Plan
  const staffingPlan: EventPlan['staffing_plan'] = [
    { role: 'Lead VR Event Supervisor', duties: 'Client check-in, safety boundary briefing, tournament brackets.' },
  ]
  if (staffCount >= 2) {
    staffingPlan.push({ role: 'VR Assistant / Spectator Guide', duties: 'Headset fitting, game swapping, hygiene wiping between turns.' })
  }
  if (staffCount >= 3) {
    staffingPlan.push({ role: 'Technical Support & Stream Operator', duties: 'Display casting management, battery swapping, tournament scoring.' })
  }

  const eventPlan: EventPlan = {
    id: crypto.randomUUID(),
    invoice_id: isInvoice ? record.id : undefined,
    event_id: !isInvoice ? record.id : undefined,
    client_name: clientName,
    event_date: eventDate || new Date().toISOString().split('T')[0],
    readiness_score: readiness.score,
    timeline,
    staffing_plan: staffingPlan,
    equipment_checklist: equipmentChecklist,
    travel_plan: {
      origin: 'Kraaifontein (HQ)',
      destination: location,
      distance_km: distanceKm,
      estimated_travel_minutes: travelMins,
      departure_time: '08:30',
      arrival_time: '09:15',
      fuel_estimate_zar: fuelEst,
      toll_fees_zar: 0,
    },
    notes: isInvoice ? (record as Invoice).notes || '' : (record as EventItem).description || '',
    status: 'draft',
    created_at: new Date().toISOString(),
  }

  // Attempt to save plan into database
  try {
    const admin = createAdminClient()
    await admin.from('event_plans').upsert(
      {
        invoice_id: eventPlan.invoice_id,
        event_id: eventPlan.event_id,
        client_name: eventPlan.client_name,
        event_date: eventPlan.event_date,
        readiness_score: eventPlan.readiness_score,
        timeline: eventPlan.timeline,
        staffing_plan: eventPlan.staffing_plan,
        equipment_checklist: eventPlan.equipment_checklist,
        travel_plan: eventPlan.travel_plan,
        notes: eventPlan.notes,
        status: 'draft',
      },
      { onConflict: 'id' }
    )
  } catch (err) {
    console.warn('[Event Planner] Could not persist plan to DB:', err)
  }

  return eventPlan
}
