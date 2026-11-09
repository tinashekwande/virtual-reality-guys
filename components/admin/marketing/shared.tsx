"use client"

import { cn } from "@/lib/utils"

export const zar = (n: number | string | null | undefined) =>
  `R${Number(n || 0).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—"

export const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—"

export async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data as T
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  planned: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  sending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  sent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  subscribed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  received: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  replied: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  paused: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  unsubscribed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  skipped: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
  bounced: "bg-red-500/10 text-red-400 border-red-500/30",
  complained: "bg-red-500/10 text-red-400 border-red-500/30",
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
        STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  )
}

export function Kpi({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1 truncate">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

export function ActorBadge({ actor }: { actor?: string | null }) {
  if (!actor) return null
  const isClaude = /claude/i.test(actor)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        isClaude ? "bg-orange-500/10 text-orange-300" : "bg-muted text-muted-foreground"
      )}
    >
      {isClaude ? "Claude" : actor.replace(/^Admin \((.*)\)$/, "$1")}
    </span>
  )
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

export const selectClass =
  "w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

export function EmptyState({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
      <Icon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{body}</p>
    </div>
  )
}
