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

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'archived'

export interface FormRequest {
  id: string
  name: string
  email: string
  phone?: string
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
