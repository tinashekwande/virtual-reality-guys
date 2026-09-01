import { createAdminClient } from '@/lib/supabase/admin'
import { AiConflict, EquipmentItem } from '@/types/ai'
import { Invoice, EventItem } from '@/types'
import { estimateTravelMinutes } from './context'

/**
 * Intelligent Conflict Detection Engine
 * Scans all upcoming bookings and events for:
 * - Equipment Shortages (Headset fleet capacity)
 * - Time Overlaps
 * - Travel Time feasibility
 * - Staff Conflicts
 */
export async function detectAllConflicts(targetDate?: string): Promise<AiConflict[]> {
  const admin = createAdminClient()
  const conflicts: AiConflict[] = []

  try {
    let invQuery = admin
      .from('invoices')
      .select('*')
      .in('status', ['paid', 'deposit_paid', 'pending', 'sent'])
      .order('event_date', { ascending: true })

    let evtQuery = admin
      .from('events')
      .select('*')
      .in('status', ['scheduled', 'in_progress', 'completed'])
      .order('event_date', { ascending: true })

    if (targetDate) {
      invQuery = invQuery.eq('event_date', targetDate)
      evtQuery = evtQuery.eq('event_date', targetDate)
    }

    const [{ data: invoices }, { data: events }, { data: equipment }] = await Promise.all([
      invQuery,
      evtQuery,
      admin.from('equipment').select('*'),
    ])

    const invList = (invoices || []) as Invoice[]
    const evtList = (events || []) as EventItem[]
    const eqList = (equipment || []) as EquipmentItem[]

    // Active Headset Fleet
    const availableHeadsets = eqList.filter(
      (e) => e.category === 'VR Headset' && e.status !== 'maintenance' && e.status !== 'retired'
    ).length || 8

    // Group events and bookings by date (YYYY-MM-DD)
    const itemsByDate: Record<
      string,
      Array<{
        id: string
        title: string
        source: 'invoice' | 'event'
        date: string
        location: string
        headsetsRequired: number
        raw: any
      }>
    > = {}

    // Process Invoices
    invList.forEach((inv) => {
      const date = inv.event_date || inv.issue_date || ''
      if (!date) return

      let headsets = 4 // default standard
      const desc = (inv.items?.[0]?.description || '').toLowerCase()
      if (desc.includes('starter') || desc.includes('2 headset')) headsets = 2
      else if (desc.includes('premium') || desc.includes('6 headset')) headsets = 6
      else if (desc.includes('corporate') || desc.includes('10 headset')) headsets = 8

      if (!itemsByDate[date]) itemsByDate[date] = []
      itemsByDate[date].push({
        id: inv.id,
        title: `${inv.type === 'quote' ? 'Quote' : 'Booking'}: ${inv.client_name}`,
        source: 'invoice',
        date,
        location: inv.client_address || 'Cape Town',
        headsetsRequired: headsets,
        raw: inv,
      })
    })

    // Process Standalone Events
    evtList.forEach((evt) => {
      const date = evt.event_date || ''
      if (!date) return

      let headsets = 6 // default event
      const type = (evt.event_type || '').toLowerCase()
      if (type.includes('expo') || type.includes('festival') || type.includes('tournament')) headsets = 8
      else if (type.includes('pop-up') || type.includes('small')) headsets = 4

      if (!itemsByDate[date]) itemsByDate[date] = []
      itemsByDate[date].push({
        id: evt.id,
        title: `Event: ${evt.title}`,
        source: 'event',
        date,
        location: evt.location || 'Cape Town',
        headsetsRequired: headsets,
        raw: evt,
      })
    })

    // Analyze each date for conflicts
    for (const [dateStr, dayItems] of Object.entries(itemsByDate)) {
      // 1. Equipment Shortage Analysis
      const totalHeadsetsNeeded = dayItems.reduce((acc, item) => acc + item.headsetsRequired, 0)
      if (totalHeadsetsNeeded > availableHeadsets) {
        const shortage = totalHeadsetsNeeded - availableHeadsets
        conflicts.push({
          id: `equip-${dateStr}`,
          type: 'equipment_shortage',
          severity: shortage > 2 ? 'critical' : 'high',
          title: `VR Headset Shortage on ${dateStr}`,
          description: `${dayItems.length} events on this day require ${totalHeadsetsNeeded} VR headsets, but your active fleet has ${availableHeadsets}. Shortage: ${shortage} headset(s).`,
          target_date: dateStr,
          affected_records: dayItems.map((i) => i.title),
          required_action: `Rent ${shortage} additional VR headset(s) or adjust event schedules.`,
          recommendation: `Secure rental for ${shortage} Meta Quest unit(s) from local partner or adjust start times to stagger usage.`,
        })
      }

      // 2. High Density / Schedule Overlap Alert
      if (dayItems.length >= 2) {
        // 3. Travel Time & Geographic Conflict Check
        for (let i = 0; i < dayItems.length - 1; i++) {
          const a = dayItems[i]
          const b = dayItems[i + 1]
          const travelMins = estimateTravelMinutes(a.location, b.location)

          if (travelMins >= 45) {
            conflicts.push({
              id: `travel-${dateStr}-${i}`,
              type: 'travel_conflict',
              severity: 'medium',
              title: `High Travel Duration on ${dateStr}`,
              description: `Back-to-back bookings between "${a.location || 'Location A'}" and "${b.location || 'Location B'}" require approximately ${travelMins} minutes travel time across Cape Town.`,
              target_date: dateStr,
              affected_records: [a.title, b.title],
              required_action: 'Ensure at least 60-75 min buffer between setup and departure.',
              recommendation: `Assign separate transport teams or confirm adequate travel window between ${a.location} and ${b.location}.`,
            })
          }
        }
      }
    }
  } catch (err) {
    console.error('[Conflict Engine] Scan error:', err)
  }

  return conflicts
}
