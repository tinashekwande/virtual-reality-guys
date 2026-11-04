import type { FormRequest } from '@/types'

/** Extract the requested event date from a request message's metadata or body. */
export function extractEventDate(message: string): string {
  if (!message) return ''
  const explicitMatch = message.match(/\[Event Date:\s*([^\]]+)\]/i)
  if (explicitMatch) return explicitMatch[1].trim()
  const isoMatch = message.match(/\b(20\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01]))\b/)
  if (isoMatch) return isoMatch[1].replace(/\//g, '-')
  return ''
}

/** Extract the client's suburb/area from the request. */
export function extractRequestSuburb(r: FormRequest): string {
  if (r.suburb && r.suburb.trim()) return r.suburb.trim()
  if (!r.message) return ''
  const explicitMatch = r.message.match(/\[Suburb:\s*([^\]]+)\]/i)
  if (explicitMatch) return explicitMatch[1].trim()
  const locMatch = r.message.match(/(?:suburb|location|area|venue)\s*[:\-]\s*([A-Za-z\s]+?)(?:[,\.\n]|$)/i)
  if (locMatch && locMatch[1].trim().length > 2) return locMatch[1].trim()
  return ''
}

/** Extract a booked game title, if the lead came from a game page. */
export function extractBookedGame(message: string): string {
  if (!message) return ''
  const explicitMatch = message.match(/\[Booked Game:\s*([^\]]+)\]/i)
  if (explicitMatch) return explicitMatch[1].trim()
  return ''
}

/**
 * The pipeline the request board is organised around. Each stage maps the many
 * underlying statuses (new/new_request, etc.) into one clear column.
 */
export type PipelineStage = 'new' | 'in_progress' | 'confirmed' | 'completed' | 'lost'

export interface StageDef {
  key: PipelineStage
  label: string
  /** Canonical status written when a card is dropped into this stage. */
  canonicalStatus: string
  /** All underlying statuses that belong in this stage. */
  statuses: string[]
  accent: string // tailwind text/border colour classes
  dot: string // tailwind bg for the status dot
}

export const PIPELINE_STAGES: StageDef[] = [
  { key: 'new', label: 'New', canonicalStatus: 'new', statuses: ['new', 'new_request'], accent: 'text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400' },
  { key: 'in_progress', label: 'In progress', canonicalStatus: 'in_progress', statuses: ['in_progress', 'pending_confirmation', 'pending', 'deposit_paid'], accent: 'text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  { key: 'confirmed', label: 'Confirmed', canonicalStatus: 'archived', statuses: ['archived', 'booking_confirmed', 'confirmed', 'scheduled'], accent: 'text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' },
  { key: 'completed', label: 'Completed', canonicalStatus: 'completed', statuses: ['completed', 'event_completed'], accent: 'text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  { key: 'lost', label: 'Lost', canonicalStatus: 'cancelled', statuses: ['cancelled'], accent: 'text-zinc-400 border-zinc-500/30', dot: 'bg-zinc-500' },
]

export function stageForStatus(status: string): PipelineStage {
  const found = PIPELINE_STAGES.find((s) => s.statuses.includes(status))
  return found ? found.key : 'new'
}
