"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays, MapPin, Phone, MessageCircle, Mail, Clock, Inbox, DollarSign,
  BellRing, RefreshCw, CheckCircle2, ChevronRight, Gamepad2, CalendarClock,
} from "lucide-react"
import { toast } from "sonner"
import { normalizePhone, extractTimeFromText } from "@/lib/time-utils"
import { extractRequestSuburb, extractEventDate, extractBookedGame } from "@/lib/requests/parse"
import { ListSkeleton, KpiRowSkeleton } from "@/components/admin/skeletons"

const zar = (n: number | string | null | undefined) =>
  `R${Number(n || 0).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`

function waLink(phone?: string | null, text?: string) {
  const num = normalizePhone(phone)
  if (!num) return null
  return `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ""}`
}
function mapsLink(addr?: string | null) {
  if (!addr || !addr.trim()) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.trim() + ", Cape Town")}`
}
function parseTimeTag(s?: string | null): string | null {
  if (!s) return null
  const m = s.match(/\[TIME:([^\]]+)\]/)
  if (m) return m[1].trim()
  return extractTimeFromText(s)
}

const STAGE_LABEL: Record<string, string> = {
  quote_followup: "Quote follow-up",
  deposit_reminder: "Deposit reminder",
  event_prep: "Event prep / confirm",
  payment_balance: "Balance due",
  review_request: "Review request",
}

export default function TodayPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actioned, setActioned] = useState<Set<string>>(new Set())

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/today")
      if (!res.ok) throw new Error("Failed to load")
      setData(await res.json())
    } catch {
      toast.error("Couldn't load today's overview")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const markFollowUpDone = async (id: string) => {
    setActioned((s) => new Set(s).add(id))
    try {
      const res = await fetch(`/api/follow-ups/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "sent" }),
      })
      if (!res.ok) throw new Error()
      toast.success("Follow-up marked as done")
    } catch {
      toast.error("Could not update follow-up")
      setActioned((s) => { const n = new Set(s); n.delete(id); return n })
    }
  }

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
  })()

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-primary" /> Today
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {greeting} — {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground" aria-label="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-5"><KpiRowSkeleton count={3} /><ListSkeleton rows={3} /><ListSkeleton rows={2} /></div>
      ) : !data ? (
        <p className="text-sm text-muted-foreground text-center py-10">No data available.</p>
      ) : (
        <>
          {/* Quick counts */}
          <div className="grid grid-cols-3 gap-3">
            <CountTile icon={CalendarClock} label="Events today" value={data.bookings.today.invoices.length + data.bookings.today.events.length} tone="cyan" />
            <CountTile icon={Inbox} label="New enquiries" value={data.new_requests.length} tone="amber" />
            <CountTile icon={BellRing} label="Follow-ups due" value={data.follow_ups_due.length} tone="violet" />
          </div>

          {/* Today's & tomorrow's bookings */}
          <Section title="Events" icon={CalendarDays}>
            <DayBookings label="Today" group={data.bookings.today} emptyText="No events scheduled today." />
            <DayBookings label="Tomorrow" group={data.bookings.tomorrow} emptyText="Nothing booked for tomorrow yet." />
          </Section>

          {/* New enquiries needing a reply */}
          <Section title="New enquiries to reply to" icon={Inbox} actionLabel="All requests" onAction={() => router.push("/admin/requests")}>
            {data.new_requests.length === 0 ? (
              <Empty text="You're all caught up — no new enquiries." />
            ) : (
              <div className="space-y-2">
                {data.new_requests.map((r: any) => {
                  const date = extractEventDate(r.message)
                  const suburb = extractRequestSuburb(r)
                  const game = extractBookedGame(r.message)
                  const wa = waLink(r.phone, `Hi ${(r.name || "").split(" ")[0]}, thanks for your enquiry with Virtual Reality Guys!`)
                  return (
                    <div key={r.id} className="bg-card border border-border rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <button onClick={() => router.push("/admin/requests")} className="text-left min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{r.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                        </button>
                        <span className="text-[10px] uppercase bg-muted text-muted-foreground rounded px-1.5 py-0.5 flex-shrink-0">{r.form_type}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                        {date && <span className="text-amber-400 font-medium">{date}</span>}
                        {suburb && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{suburb}</span>}
                        {game && <span className="flex items-center gap-0.5 text-purple-300"><Gamepad2 className="w-3 h-3" />{game}</span>}
                      </div>
                      <div className="flex gap-2 mt-2.5">
                        {wa && <QuickBtn href={wa} icon={MessageCircle} label="WhatsApp" tone="green" />}
                        {r.phone && <QuickBtn href={`tel:${r.phone}`} icon={Phone} label="Call" />}
                        <QuickBtn href={`mailto:${r.email}`} icon={Mail} label="Email" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>

          {/* Follow-ups due */}
          <Section title="Follow-ups due" icon={BellRing}>
            {data.follow_ups_due.length === 0 ? (
              <Empty text="No follow-ups due right now." />
            ) : (
              <div className="space-y-2">
                {data.follow_ups_due.map((f: any) => {
                  const done = actioned.has(f.id)
                  const wa = waLink(f.client_phone, f.message_draft)
                  const overdue = new Date(f.scheduled_for).getTime() < Date.now()
                  return (
                    <div key={f.id} className={`bg-card border rounded-xl p-3 ${done ? "opacity-50 border-border" : "border-border"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{f.client_name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            <span className="text-violet-300 font-medium">{STAGE_LABEL[f.stage] || f.stage}</span>
                            {" · "}
                            <span className={overdue ? "text-rose-400" : ""}>{overdue ? "overdue" : new Date(f.scheduled_for).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>
                          </p>
                        </div>
                        <button onClick={() => markFollowUpDone(f.id)} disabled={done} className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 flex-shrink-0 disabled:opacity-60">
                          <CheckCircle2 className="w-4 h-4" /> {done ? "Done" : "Mark done"}
                        </button>
                      </div>
                      {f.message_draft && <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 bg-muted/30 rounded-lg p-2">{f.message_draft}</p>}
                      <div className="flex gap-2 mt-2.5">
                        {wa && <QuickBtn href={wa} icon={MessageCircle} label="WhatsApp" tone="green" />}
                        {f.client_phone && <QuickBtn href={`tel:${f.client_phone}`} icon={Phone} label="Call" />}
                        {f.client_email && <QuickBtn href={`mailto:${f.client_email}`} icon={Mail} label="Email" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>

          {/* Deposits / payments due */}
          <Section title="Payments outstanding" icon={DollarSign} actionLabel="Invoices" onAction={() => router.push("/admin/quotes-invoices")}>
            <div className="bg-card border border-border rounded-xl p-3 mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total outstanding</span>
              <span className="text-lg font-bold text-foreground">{zar(data.unpaid_invoices.outstanding_zar)}</span>
            </div>
            {data.unpaid_invoices.items.length === 0 ? (
              <Empty text="Nothing outstanding — nicely done!" />
            ) : (
              <div className="space-y-2">
                {data.unpaid_invoices.items.slice(0, 8).map((i: any) => {
                  const wa = waLink(i.client_phone, `Hi ${(i.client_name || "").split(" ")[0]}, a friendly reminder about your VR booking (${i.doc_number}).`)
                  return (
                    <div key={i.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{i.client_name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {i.doc_number}{i.event_date ? ` · ${i.event_date}` : ""} · <span className="capitalize">{String(i.status).replace(/_/g, " ")}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-foreground">{zar(i.total)}</span>
                        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" aria-label="WhatsApp reminder"><MessageCircle className="w-4 h-4" /></a>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  )
}

function CountTile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "cyan" | "amber" | "violet" }) {
  const tones = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  }[tone]
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg border mb-1.5 ${tones}`}><Icon className="w-4 h-4" /></div>
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function Section({ title, icon: Icon, children, actionLabel, onAction }: { title: string; icon: any; children: React.ReactNode; actionLabel?: string; onAction?: () => void }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Icon className="w-4 h-4 text-primary" />{title}</h2>
        {actionLabel && onAction && (
          <button onClick={onAction} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">{actionLabel}<ChevronRight className="w-3 h-3" /></button>
        )}
      </div>
      {children}
    </section>
  )
}

function DayBookings({ label, group, emptyText }: { label: string; group: any; emptyText: string }) {
  const items = [
    ...group.invoices.map((i: any) => ({ kind: "invoice", id: i.id, title: i.client_name, time: i.event_time || parseTimeTag(i.notes), place: i.client_address, phone: i.client_phone, sub: i.doc_number })),
    ...group.events.map((e: any) => ({ kind: "event", id: e.id, title: e.title, time: e.event_time || parseTimeTag(e.description), place: e.location, phone: null, sub: e.status })),
    ...group.personal.map((p: any) => ({ kind: "personal", id: p.id, title: p.title, time: p.is_all_day ? "All day" : p.start_time, place: p.location, phone: null, sub: "Personal" })),
  ]
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">{label}</p>
      {items.length === 0 ? (
        <Empty text={emptyText} />
      ) : (
        <div className="space-y-2">
          {items.map((it) => {
            const maps = mapsLink(it.place)
            const wa = waLink(it.phone)
            return (
              <div key={it.kind + it.id} className="bg-card border border-border rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{it.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{it.sub}</p>
                  </div>
                  {it.time && <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 flex-shrink-0"><Clock className="w-3 h-3" />{it.time}</span>}
                </div>
                {(maps || wa) && (
                  <div className="flex gap-2 mt-2.5">
                    {maps && <QuickBtn href={maps} icon={MapPin} label={it.place} tone="cyan" />}
                    {wa && <QuickBtn href={wa} icon={MessageCircle} label="WhatsApp" tone="green" />}
                    {it.phone && <QuickBtn href={`tel:${it.phone}`} icon={Phone} label="Call" />}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function QuickBtn({ href, icon: Icon, label, tone }: { href: string; icon: any; label?: string | null; tone?: "green" | "cyan" }) {
  const toneCls = tone === "green" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : tone === "cyan" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" : "text-muted-foreground bg-muted/40 border-border"
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-lg border px-2.5 py-1.5 max-w-[55%] ${toneCls}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-[12px] text-muted-foreground bg-card border border-dashed border-border rounded-xl p-3 text-center">{text}</p>
}
