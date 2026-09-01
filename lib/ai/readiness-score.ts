import { EventReadinessBreakdown } from '@/types/ai'
import { Invoice, EventItem } from '@/types'

/**
 * Calculates a 0–100% operational readiness score for any booking or event.
 */
export function calculateEventReadiness(
  record: Invoice | EventItem | any,
  isInvoice: boolean = true
): EventReadinessBreakdown {
  const items: EventReadinessBreakdown['items'] = []
  let score = 0

  if (isInvoice) {
    const inv = record as Invoice

    // 1. Booking Confirmation & Status (20 pts)
    const isConfirmed = inv.status === 'paid' || inv.status === 'deposit_paid'
    if (isConfirmed) {
      score += 20
      items.push({
        label: 'Booking Confirmed',
        passed: true,
        critical: true,
        detail: 'Event date is locked into calendar.',
      })
    } else {
      items.push({
        label: 'Booking Confirmation',
        passed: false,
        critical: true,
        detail: `Current status is ${inv.status}. Confirmation required.`,
      })
    }

    // 2. Deposit Received (25 pts)
    const depositPaid = inv.status === 'deposit_paid' || inv.status === 'paid'
    if (depositPaid) {
      score += 25
      items.push({
        label: '50% Deposit Received',
        passed: true,
        critical: true,
        detail: 'Deposit secured in FNB account.',
      })
    } else {
      items.push({
        label: '50% Deposit Payment',
        passed: false,
        critical: true,
        detail: '50% deposit has not been recorded yet.',
      })
    }

    // 3. Customer Contact Complete (20 pts)
    const hasContact = Boolean(inv.client_email && inv.client_phone && inv.client_address)
    if (hasContact) {
      score += 20
      items.push({
        label: 'Customer Contact & Venue Address',
        passed: true,
        critical: false,
        detail: 'Email, phone, and venue location verified.',
      })
    } else {
      items.push({
        label: 'Customer Contact Details',
        passed: false,
        critical: false,
        detail: 'Missing phone number or exact physical venue address.',
      })
    }

    // 4. Document / Invoice Generated (15 pts)
    if (inv.doc_number) {
      score += 15
      items.push({
        label: 'Tax Invoice / Quote Generated',
        passed: true,
        critical: false,
        detail: `Document #${inv.doc_number} generated.`,
      })
    } else {
      items.push({
        label: 'Document Generation',
        passed: false,
        critical: false,
        detail: 'Invoice document number pending.',
      })
    }

    // 5. Package & Equipment Requirements Set (20 pts)
    if (inv.items && inv.items.length > 0) {
      score += 20
      items.push({
        label: 'VR Package & Equipment Configured',
        passed: true,
        critical: false,
        detail: `${inv.items[0]?.description || 'VR Package'} assigned.`,
      })
    } else {
      items.push({
        label: 'Package Configuration',
        passed: false,
        critical: false,
        detail: 'No specific VR package line item selected.',
      })
    }
  } else {
    // Standalone Event
    const evt = record as EventItem

    if (evt.status !== 'cancelled') {
      score += 30
      items.push({
        label: 'Event Scheduled',
        passed: true,
        critical: true,
        detail: `Event is marked as ${evt.status}.`,
      })
    }

    if (evt.location) {
      score += 25
      items.push({
        label: 'Venue Location Confirmed',
        passed: true,
        critical: false,
        detail: `Venue: ${evt.location}`,
      })
    } else {
      items.push({
        label: 'Venue Location',
        passed: false,
        critical: false,
        detail: 'Location address not specified.',
      })
    }

    if (Number(evt.total_revenue) > 0) {
      score += 25
      items.push({
        label: 'Revenue & Budget Planned',
        passed: true,
        critical: false,
        detail: `Projected Revenue: R${Number(evt.total_revenue).toLocaleString()}`,
      })
    } else {
      items.push({
        label: 'Revenue Projection',
        passed: false,
        critical: false,
        detail: 'Revenue not yet populated.',
      })
    }

    if (evt.description) {
      score += 20
      items.push({
        label: 'Operational Plan & Description',
        passed: true,
        critical: false,
        detail: 'Schedule notes logged.',
      })
    } else {
      items.push({
        label: 'Schedule Notes',
        passed: false,
        critical: false,
        detail: 'No setup description notes logged.',
      })
    }
  }

  let status: EventReadinessBreakdown['status'] = 'at_risk'
  if (score >= 85) status = 'ready'
  else if (score >= 65) status = 'mostly_ready'
  else if (score >= 45) status = 'needs_attention'

  return {
    score,
    status,
    items,
  }
}
