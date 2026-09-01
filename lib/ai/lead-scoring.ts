import { FormRequest, Invoice } from '@/types'

export interface LeadScoreResult {
  score: number // 0-100
  priority: '🔥 HIGH' | '⚡ MEDIUM' | '🌱 LOW'
  estimated_value_zar: number
  conversion_probability_pct: number
  factors: Array<{
    positive: boolean
    label: string
  }>
}

/**
 * Calculates a lead score and quote conversion probability with explainable factors.
 */
export function calculateLeadScore(
  request: FormRequest | Invoice | any,
  customerHistory?: { is_repeat_customer?: boolean; total_spent_zar?: number }
): LeadScoreResult {
  let score = 50
  const factors: LeadScoreResult['factors'] = []
  let estValue = 899

  const message = (request.message || request.notes || '').toLowerCase()
  const name = (request.name || request.client_name || '').toLowerCase()

  // 1. Customer Repeat History (+20 pts)
  if (customerHistory?.is_repeat_customer) {
    score += 20
    factors.push({ positive: true, label: 'Previous satisfied customer with verified booking history' })
  }

  // 2. High-Value Event Category (+15 pts)
  if (message.includes('school') || name.includes('school') || name.includes('primary') || name.includes('high')) {
    score += 15
    estValue = 2499
    factors.push({ positive: true, label: 'Educational / School Event (High booking value & multi-headset demand)' })
  } else if (message.includes('corporate') || message.includes('company') || message.includes('team building')) {
    score += 15
    estValue = 1899
    factors.push({ positive: true, label: 'Corporate Event / Team Building (Strong budget authorization)' })
  } else if (message.includes('festival') || message.includes('expo')) {
    score += 20
    estValue = 3500
    factors.push({ positive: true, label: 'Large Public Activation / Expo (High commercial value)' })
  } else {
    factors.push({ positive: true, label: 'Birthday Party / Private Celebration' })
  }

  // 3. Complete Contact Information (+10 pts)
  if (request.email && (request.phone || request.client_phone)) {
    score += 10
    factors.push({ positive: true, label: 'Complete direct phone and email contact details provided' })
  }

  // 4. Specific Date Mention (+10 pts)
  if (message.match(/\b(20\d{2}|\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))\b/i)) {
    score += 10
    factors.push({ positive: true, label: 'Specific target event date specified in enquiry' })
  }

  // 5. Short vague enquiry check (-10 pts)
  if (request.message && request.message.length < 25) {
    score -= 10
    factors.push({ positive: false, label: 'Brief enquiry with missing details' })
  }

  score = Math.max(15, Math.min(score, 98))

  let priority: LeadScoreResult['priority'] = '🌱 LOW'
  if (score >= 75) priority = '🔥 HIGH'
  else if (score >= 55) priority = '⚡ MEDIUM'

  const conversionProb = Math.round(score * 0.9)

  return {
    score,
    priority,
    estimated_value_zar: estValue,
    conversion_probability_pct: conversionProb,
    factors,
  }
}
