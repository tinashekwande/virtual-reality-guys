// types/index.ts — Shared TypeScript types

export interface Category {
  id: string
  name: string
  created_at: string
  media_count?: number
}

export interface Media {
  id: string
  file_url: string
  type: 'image' | 'video'
  title?: string
  description?: string
  category_id?: string
  categories?: Category
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image_url?: string
  bio?: string
  sort_order: number
  created_at: string
}

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'archived' | 'pending_confirmation' | 'booking_confirmed' | 'event_completed'

export interface FormRequest {
  id: string
  name: string
  email: string
  phone?: string
  suburb?: string
  message: string
  form_type: string
  status: RequestStatus
  created_at: string
}

export interface DashboardStats {
  totalMedia: number
  totalCategories: number
  totalTeamMembers: number
  totalRequests: number
  newRequests: number
  recentMedia: Media[]
  recentRequests: FormRequest[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export type InvoiceType = 'quote' | 'invoice'
export type InvoiceStatus = 'draft' | 'pending' | 'deposit_paid' | 'sent' | 'paid' | 'cancelled'

export interface Invoice {
  id: string
  type: InvoiceType
  doc_number: string
  client_name: string
  client_email?: string
  client_phone?: string
  client_address?: string
  event_date?: string
  issue_date: string
  due_date?: string
  status: InvoiceStatus
  items: InvoiceItem[]
  subtotal: number
  discount: number
  transport_fee: number
  total: number
  deposit_percentage?: number
  notes?: string
  created_at: string
  updated_at?: string
}

export interface EventItem {
  id: string
  title: string
  event_date: string
  event_type: string
  location?: string
  description?: string
  total_revenue: number
  total_expenses: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at?: string
}

export type ExpenseCategory =
  | 'Staff Wages'
  | 'Transport / Fuel'
  | 'Venue Fee'
  | 'Equipment / Maintenance'
  | 'Marketing / Ads'
  | 'Food & Refreshments'
  | 'Other'

export interface ExpenseItem {
  id: string
  event_id?: string
  invoice_id?: string
  title: string
  category: ExpenseCategory
  amount: number
  date: string
  notes?: string
  created_at: string
  updated_at?: string
}

export type RentalAgreementStatus = 'draft' | 'active' | 'returned' | 'completed' | 'cancelled'

export interface RentalAgreementRecord {
  id: string
  agreement_number: string
  renter_name: string
  renter_email?: string
  renter_phone?: string
  renter_id_number?: string
  renter_address?: string
  is_company?: boolean
  company_name?: string
  company_reg?: string
  company_rep?: string
  company_position?: string
  start_date?: string
  start_time?: string
  end_date?: string
  end_time?: string
  delivery_address?: string
  purpose?: string
  purpose_other?: string
  rental_fee: number
  delivery_fee: number
  other_charges: number
  total_amount: number
  booking_deposit_paid: number
  deposit_date_paid?: string
  security_deposit: number
  status: RentalAgreementStatus
  equipment_list: any[]
  headset_serial_numbers?: string
  replacement_values?: any[]
  late_return_charge?: number
  late_return_unit?: string
  handover_notes?: string
  return_notes?: string
  full_agreement_data: any
  created_at: string
  updated_at?: string
}

export * from './ai'

