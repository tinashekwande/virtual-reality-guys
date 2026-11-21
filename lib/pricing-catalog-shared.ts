// Shared by the portal Pricing page (client) and the server pricing helpers.

export const PRICING_CATEGORIES = [
  { id: 'party', label: 'Birthday parties' },
  { id: 'corporate', label: 'Corporate & team building' },
  { id: 'school', label: 'Schools' },
  { id: 'fitness', label: 'Fitness & recurring' },
  { id: 'rental', label: 'Equipment rentals' },
  { id: 'repairs', label: 'Repairs' },
  { id: 'addon', label: 'Add-ons' },
  { id: 'transport', label: 'Transport' },
  { id: 'policy', label: 'Policies & rules' },
] as const

export const PRICE_UNITS = [
  'per event', 'per person', 'per learner', 'per hour', 'per headset', 'per session', 'quote', 'rule',
] as const

export type PricingItem = {
  id: string
  category: string
  name: string
  price: number | null
  price_unit: string
  min_price: number | null
  duration_hours: number | null
  headsets: number | null
  staff: number | null
  max_players: number | null
  includes: string | null
  notes: string | null
  active: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}
