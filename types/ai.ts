// types/ai.ts — TypeScript types for VR Guys AI Business OS

export type AiActionLevel = 1 | 2 | 3
export type AiActionStatus = 'pending_approval' | 'approved' | 'rejected' | 'executed' | 'failed'

export interface AiAction {
  id: string
  action_type: string
  level: AiActionLevel
  status: AiActionStatus
  title: string
  description?: string
  payload: Record<string, any>
  result?: Record<string, any>
  error?: string
  requires_approval: boolean
  created_by?: string
  approved_by?: string
  created_at: string
  executed_at?: string
}

export interface AiAuditLog {
  id: string
  action_id?: string
  action_name: string
  category: 'sales' | 'booking' | 'finance' | 'operations' | 'customer' | 'system' | 'general'
  actor: string
  target_record?: string
  details: Record<string, any>
  status: 'success' | 'warning' | 'error'
  created_at: string
}

export interface EquipmentItem {
  id: string
  name: string
  serial_number?: string
  category: 'VR Headset' | 'Controller' | 'Display/TV' | 'Router' | 'Power & Cables' | 'Accessories'
  status: 'available' | 'assigned' | 'maintenance' | 'retired'
  usage_count: number
  battery_health?: number
  notes?: string
  last_inspected_at?: string
  created_at: string
  updated_at?: string
}

export interface EquipmentLog {
  id: string
  equipment_id: string
  event_id?: string
  invoice_id?: string
  issue_type: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'ignored'
  logged_by?: string
  created_at: string
  resolved_at?: string
  equipment?: EquipmentItem
}

export interface EventPlanTimelineItem {
  time: string
  title: string
  description?: string
  type: 'prep' | 'travel' | 'setup' | 'event' | 'packup' | 'return'
}

export interface EventPlanChecklistItem {
  item: string
  category: string
  quantity: number
  checked: boolean
}

export interface EventPlanStaffingItem {
  role: string
  assigned_to?: string
  duties: string
}

export interface EventPlan {
  id: string
  event_id?: string
  invoice_id?: string
  client_name: string
  event_date: string
  readiness_score: number
  timeline: EventPlanTimelineItem[]
  staffing_plan: EventPlanStaffingItem[]
  equipment_checklist: EventPlanChecklistItem[]
  travel_plan: {
    origin?: string
    destination?: string
    distance_km?: number
    estimated_travel_minutes?: number
    departure_time?: string
    arrival_time?: string
    fuel_estimate_zar?: number
    toll_fees_zar?: number
  }
  notes?: string
  status: 'draft' | 'confirmed' | 'in_progress' | 'completed'
  created_at: string
  updated_at?: string
}

export interface EventDebrief {
  id: string
  event_id?: string
  invoice_id?: string
  client_name?: string
  event_date?: string
  outcome: 'successful' | 'minor_issues' | 'delayed' | 'interrupted' | 'failed'
  customer_satisfaction: 'positive' | 'neutral' | 'negative'
  delay_minutes: number
  equipment_issues: Array<{
    equipment_name: string
    issue: string
    severity: 'low' | 'medium' | 'high'
  }>
  staff_notes?: string
  action_items: string[]
  created_at: string
}

export interface FollowUpItem {
  id: string
  client_name: string
  client_email?: string
  client_phone?: string
  invoice_id?: string
  request_id?: string
  stage: 'quote_followup' | 'deposit_reminder' | 'event_prep' | 'payment_balance' | 'review_request'
  scheduled_for: string
  status: 'pending' | 'sent' | 'cancelled' | 'replied'
  channel: 'email' | 'whatsapp' | 'sms'
  message_draft: string
  generated_reason?: string
  created_at: string
  updated_at?: string
}

export interface AiConflict {
  id: string
  type: 'time_overlap' | 'equipment_shortage' | 'staff_conflict' | 'travel_conflict' | 'capacity_overload'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  target_date: string
  affected_records: string[]
  required_action: string
  recommendation: string
}

export interface EventReadinessBreakdown {
  score: number // 0-100
  status: 'ready' | 'mostly_ready' | 'needs_attention' | 'at_risk'
  items: Array<{
    label: string
    passed: boolean
    critical: boolean
    detail: string
  }>
}

export interface AiDailyBriefing {
  greeting: string
  summary: string
  date: string
  stats: {
    events_today: number
    events_this_week: number
    pending_quotes: number
    outstanding_amount: number
    equipment_shortages: number
    followups_due: number
    at_risk_bookings: number
  }
  attention_required: Array<{
    id: string
    type: string
    severity: 'high' | 'medium' | 'low'
    title: string
    description: string
    action_label: string
    action_link: string
  }>
  opportunities: Array<{
    id: string
    type: string
    title: string
    estimated_value_zar: number
    description: string
    action_label: string
    action_link: string
  }>
  financial_intelligence: {
    growth_rate: number
    growth_description: string
    highest_value_category: string
    unpaid_invoices_count: number
    unpaid_invoices_amount: number
    projected_revenue: number
  }
  follow_ups_due: Array<{
    id: string
    client_name: string
    days_pending: number
    channel: string
    action_label: string
    action_link: string
  }>
}

export interface AiBusinessSettings {
  id?: string
  model: string
  automation_toggles: {
    auto_draft_quotes: boolean
    auto_conflict_detection: boolean
    auto_daily_briefing: boolean
    auto_followups: boolean
    auto_payment_reminders: boolean
    auto_event_planning: boolean
    auto_lead_scoring: boolean
  }
  business_context: {
    company_name: string
    currency: string
    base_location: string
    free_radius_areas: string[]
    deposit_percentage: number
    fnb_account: string
    packages: Array<{
      name: string
      price: number
      headsets: number
      hours: number
      staff: number
      players: number
    }>
  }
  approval_rules: {
    require_quote_approval: boolean
    require_email_approval: boolean
    require_whatsapp_approval: boolean
    require_discount_approval: boolean
    require_staff_assignment_approval: boolean
  }
}
