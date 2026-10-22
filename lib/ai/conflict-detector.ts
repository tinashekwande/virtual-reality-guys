import { createAdminClient } from '@/lib/supabase/admin'
import { AiConflict, EquipmentItem } from '@/types/ai'
import { Invoice, EventItem } from '@/types'
import { estimateTravelMinutes } from './context'
import {
  extractTimeFromText,
  extractDurationMinutes,
  parseTimeRange,
  evaluateClash,
  ParsedTimeRange,
} from '@/lib/time-utils'

export interface EventScheduleItem {
  id: string
  title: string
  source: 'invoice' | 'event' | 'personal'
  date: string
  location: string
  headsetsRequired: number
  timeRange: ParsedTimeRange
  raw: any
}

/**
 * Intelligent Conflict Detection Engine
 * Scans all upcoming bookings, events, and personal appointments for:
 * - Direct Time Overlaps (accurate to the minute)
 * - Travel Time & Turnaround Buffers
 * - Concurrent Equipment Fleet Capacity (time-based)
 * - Personal Calendar Clashes
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

    let perQuery = admin
      .from('personal_calendar_events')
      .select('*')
      .order('date', { ascending: true })

    if (targetDate) {
      invQuery = invQuery.eq('event_date', targetDate)
      evtQuery = evtQuery.eq('event_date', targetDate)
      perQuery = perQuery.eq('date', targetDate)
    }

    const [
      { data: invoices },
      { data: events },
      { data: equipment },
      perResult,
    ] = await Promise.all([
      invQuery,
      evtQuery,
      admin.from('equipment').select('*'),
      perQuery.then((r) => r).catch(() => ({ data: [] })),
    ])

    const invList = (invoices || []) as Invoice[]
    const evtList = (events || []) as EventItem[]
    const eqList = (equipment || []) as EquipmentItem[]
    const perList = (perResult?.data || []) as any[]

    // Active Headset Fleet Capacity
    const availableHeadsets =
      eqList.filter(
        (e) =>
          e.category === 'VR Headset' &&
          e.status !== 'maintenance' &&
          e.status !== 'retired'
      ).length || 8

    // Group items by date (YYYY-MM-DD)
    const itemsByDate: Record<string, EventScheduleItem[]> = {}
    const personalByDate: Record<string, EventScheduleItem[]> = {}

    // 1. Process Invoices
    invList.forEach((inv) => {
      const date = inv.event_date || inv.issue_date || ''
      if (!date) return

      let headsets = 4 // default standard
      const desc = (inv.items?.[0]?.description || '').toLowerCase()
      if (desc.includes('starter') || desc.includes('2 headset')) headsets = 2
      else if (desc.includes('premium') || desc.includes('6 headset')) headsets = 6
      else if (desc.includes('corporate') || desc.includes('10 headset') || desc.includes('8 headset')) headsets = 8

      const durationMinutes = extractDurationMinutes(desc, 180)
      const rawTime =
        inv.event_time ||
        (inv.start_time ? (inv.end_time ? `${inv.start_time} - ${inv.end_time}` : inv.start_time) : '') ||
        extractTimeFromText(inv.notes)

      const timeRange = parseTimeRange(rawTime, { durationMinutes })

      if (!itemsByDate[date]) itemsByDate[date] = []
      itemsByDate[date].push({
        id: inv.id,
        title: `${inv.type === 'quote' ? 'Quote' : 'Booking'}: ${inv.client_name}`,
        source: 'invoice',
        date,
        location: inv.client_address || 'Cape Town',
        headsetsRequired: headsets,
        timeRange,
        raw: inv,
      })
    })

    // 2. Process Standalone Events
    evtList.forEach((evt) => {
      const date = evt.event_date || ''
      if (!date) return

      let headsets = 6
      const type = (evt.event_type || '').toLowerCase()
      if (type.includes('expo') || type.includes('festival') || type.includes('tournament')) headsets = 8
      else if (type.includes('pop-up') || type.includes('small')) headsets = 4

      const durationMinutes = extractDurationMinutes(evt.description, 180)
      const rawTime =
        (evt.start_time ? (evt.end_time ? `${evt.start_time} - ${evt.end_time}` : evt.start_time) : '') ||
        evt.event_time ||
        extractTimeFromText(evt.description)

      const timeRange = parseTimeRange(rawTime, { durationMinutes })

      if (!itemsByDate[date]) itemsByDate[date] = []
      itemsByDate[date].push({
        id: evt.id,
        title: `Event: ${evt.title}`,
        source: 'event',
        date,
        location: evt.location || 'Cape Town',
        headsetsRequired: headsets,
        timeRange,
        raw: evt,
      })
    })

    // 3. Process Personal Events
    perList.forEach((per) => {
      const date = per.date || ''
      if (!date) return

      const rawTime = per.is_all_day
        ? 'All Day'
        : per.start_time
        ? per.end_time
          ? `${per.start_time} - ${per.end_time}`
          : per.start_time
        : 'All Day'

      const timeRange = parseTimeRange(rawTime, { isAllDay: per.is_all_day })

      if (!personalByDate[date]) personalByDate[date] = []
      personalByDate[date].push({
        id: per.id,
        title: `Personal: ${per.title}`,
        source: 'personal',
        date,
        location: per.location || 'Personal',
        headsetsRequired: 0,
        timeRange,
        raw: per,
      })
    })

    // ── Analyze each date for conflicts ──
    for (const [dateStr, dayItems] of Object.entries(itemsByDate)) {
      // Sort day items chronologically by start time
      dayItems.sort((a, b) => a.timeRange.startMinutes - b.timeRange.startMinutes)

      // ── A. Time-Aware Concurrent Equipment Demand ──
      // Instead of blindly summing all items on the day, we test 30-min intervals
      // to check peak concurrent headset demand.
      let peakConcurrentHeadsets = 0
      let peakIntervalStr = ''

      for (let m = 480; m <= 1320; m += 30) { // 08:00 to 22:00
        const activeEventsInSlot = dayItems.filter(
          (item) => item.timeRange.startMinutes <= m && item.timeRange.endMinutes > m
        )
        const concurrentDemand = activeEventsInSlot.reduce(
          (sum, item) => sum + item.headsetsRequired,
          0
        )
        if (concurrentDemand > peakConcurrentHeadsets) {
          peakConcurrentHeadsets = concurrentDemand
          const slotEnd = m + 30
          const h1 = Math.floor(m / 60).toString().padStart(2, '0')
          const m1 = (m % 60).toString().padStart(2, '0')
          const h2 = Math.floor(slotEnd / 60).toString().padStart(2, '0')
          const m2 = (slotEnd % 60).toString().padStart(2, '0')
          peakIntervalStr = `${h1}:${m1} - ${h2}:${m2}`
        }
      }

      if (peakConcurrentHeadsets > availableHeadsets) {
        const shortage = peakConcurrentHeadsets - availableHeadsets
        conflicts.push({
          id: `equip-${dateStr}`,
          type: 'equipment_shortage',
          severity: shortage > 2 ? 'critical' : 'high',
          title: `VR Headset Shortage on ${dateStr} (${peakIntervalStr})`,
          description: `During peak hours (${peakIntervalStr}), overlapping bookings require ${peakConcurrentHeadsets} VR headsets, but your active fleet has ${availableHeadsets} headsets (shortage: ${shortage} units).`,
          target_date: dateStr,
          affected_records: dayItems.map((i) => i.title),
          required_action: `Rent ${shortage} additional Meta Quest headset(s) or adjust booking time slots so they do not overlap.`,
          recommendation: `Secure rental from partner or stagger event times by 2-3 hours to allow headset recharging and reuse.`,
        })
      }

      // ── B. Pairwise Time Overlap & Buffer Analysis ──
      for (let i = 0; i < dayItems.length; i++) {
        for (let j = i + 1; j < dayItems.length; j++) {
          const a = dayItems[i]
          const b = dayItems[j]

          const travelMins = estimateTravelMinutes(a.location, b.location)
          const clash = evaluateClash(a.timeRange, b.timeRange, travelMins, 30)

          if (clash.isDirectOverlap) {
            conflicts.push({
              id: `overlap-${dateStr}-${a.id}-${b.id}`,
              type: 'time_overlap',
              severity: 'critical',
              title: `Direct Time Clash on ${dateStr}`,
              description: `"${a.title}" (${a.timeRange.displayTime}) directly overlaps with "${b.title}" (${b.timeRange.displayTime}) by ${clash.overlapMinutes} minutes. Staff and equipment cannot be at two locations at the same time.`,
              target_date: dateStr,
              affected_records: [a.title, b.title],
              required_action: `Reschedule one of the bookings or confirm whether separate team and equipment sets are available.`,
              recommendation: `Shift "${b.title}" to start after ${a.timeRange.endTimeStr} (plus travel & setup buffer).`,
            })
          } else if (clash.isBufferClash) {
            conflicts.push({
              id: `travel-${dateStr}-${a.id}-${b.id}`,
              type: 'travel_conflict',
              severity: 'high',
              title: `Tight Turnaround Buffer on ${dateStr}`,
              description: `Gap between "${a.title}" (ends ${a.timeRange.endTimeStr} in ${a.location}) and "${b.title}" (starts ${b.timeRange.startTimeStr} in ${b.location}) is only ${clash.gapMinutes} mins. Cross-town travel is estimated at ${travelMins} mins plus setup buffer (required buffer: ${clash.requiredBufferMinutes} mins).`,
              target_date: dateStr,
              affected_records: [a.title, b.title],
              required_action: `Increase the gap between events by at least ${clash.requiredBufferMinutes - clash.gapMinutes} minutes or assign independent transport teams.`,
              recommendation: `Confirm setup team arrives early or adjust start time of "${b.title}".`,
            })
          }
        }
      }

      // ── C. Personal Calendar Clashes ──
      const dayPersonalEvents = personalByDate[dateStr] || []
      for (const bEvent of dayItems) {
        for (const pEvent of dayPersonalEvents) {
          const clash = evaluateClash(bEvent.timeRange, pEvent.timeRange, 15, 0)
          if (clash.isDirectOverlap) {
            conflicts.push({
              id: `personal-clash-${dateStr}-${bEvent.id}-${pEvent.id}`,
              type: 'time_overlap',
              severity: 'medium',
              title: `Personal & Business Clash on ${dateStr}`,
              description: `Personal commitment "${pEvent.title.replace('Personal: ', '')}" (${pEvent.timeRange.displayTime}) directly conflicts with "${bEvent.title}" (${bEvent.timeRange.displayTime}).`,
              target_date: dateStr,
              affected_records: [bEvent.title, pEvent.title],
              required_action: 'Reassign VR staff to host the event or reschedule personal appointment.',
              recommendation: 'Check team availability or notify team lead of schedule conflict.',
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
