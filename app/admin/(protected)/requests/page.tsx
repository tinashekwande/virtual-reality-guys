"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Eye, FileText, Sparkles, MessageSquare, Flame, MapPin, Gamepad2, Clock, LayoutGrid, List as ListIcon, Mail, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { AiMessageGeneratorModal } from "@/components/admin/ai/AiMessageGeneratorModal"
import { RequestsBoard } from "@/components/admin/RequestsBoard"
import { TableSkeleton } from "@/components/admin/skeletons"
import { calculateLeadScore } from "@/lib/ai/lead-scoring"
import { extractTimeFromText } from "@/lib/time-utils"
import { extractEventDate, extractRequestSuburb, extractBookedGame } from "@/lib/requests/parse"
import { toast } from "sonner"
import type { FormRequest, RequestStatus } from "@/types"

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New Request" },
  { value: "in_progress", label: "Pending Confirmation" },
  { value: "archived", label: "Booking Confirmed" },
  { value: "completed", label: "Event Completed" },
  { value: "cancelled" as RequestStatus, label: "Lost / Cancelled" },
]

const STATUS_BADGE: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  new_request: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  pending_confirmation: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  archived: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  booking_confirmed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  confirmed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  event_completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "new":
    case "new_request":
      return "New Request"
    case "in_progress":
    case "pending_confirmation":
      return "Pending Confirmation"
    case "archived":
    case "booking_confirmed":
    case "confirmed":
      return "Booking Confirmed"
    case "completed":
    case "event_completed":
      return "Event Completed"
    case "cancelled":
      return "Lost / Cancelled"
    default:
      return status.replace(/_/g, " ")
  }
}

export default function RequestsAdminPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<FormRequest[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selected, setSelected] = useState<FormRequest | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [view, setView] = useState<"board" | "list">("board")
  const [comms, setComms] = useState<any[]>([])
  const [commsLoading, setCommsLoading] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("requests-view")
      if (saved === "board" || saved === "list") setView(saved)
    } catch {}
  }, [])

  const changeView = (v: "board" | "list") => {
    setView(v)
    try { localStorage.setItem("requests-view", v) } catch {}
  }

  const loadComms = async (requestId: string) => {
    setCommsLoading(true)
    setComms([])
    try {
      const res = await fetch(`/api/marketing/communications?request_id=${requestId}&limit=50`)
      if (res.ok) {
        const d = await res.json()
        setComms(d.communications || [])
      }
    } catch {
      // communications are a nice-to-have; ignore failures
    } finally {
      setCommsLoading(false)
    }
  }

  const handleCreateInvoice = (
    r: FormRequest,
    type: "invoice" | "quote" = "invoice",
    customPackage?: string,
    customPrice?: number
  ) => {
    const date = extractEventDate(r.message)
    const bookedGame = extractBookedGame(r.message)

    // Intelligently infer package and price based on enquiry message and player count
    let pkg = customPackage
    let price = customPrice

    if (!pkg || !price) {
      if (bookedGame) {
        pkg = `VR Game Experience featuring ${bookedGame} (4 Headsets, 2-3 Hours)`
        price = 1199
      } else {
        const msg = (r.message || "").toLowerCase()
        const numMatch = msg.match(/\b(\d{1,3})\s*(kids|children|players|people|guests|adults|participants|students)\b/i)
        const count = numMatch ? parseInt(numMatch[1], 10) : 8

        if (msg.includes("corporate") || msg.includes("team") || msg.includes("company") || (r.form_type || "").toLowerCase().includes("corporate")) {
          pkg = "Corporate Event VR Package (Half Day, 4 Hours, 6 Headsets, 2 Staff)"
          price = 2999
        } else if (msg.includes("school") || (r.form_type || "").toLowerCase().includes("school")) {
          pkg = "School / Educational VR Experience (Minimum Booking)"
          price = 2500
        } else if (count <= 8) {
          pkg = "Starter VR Package (4 Headsets, 2 Hours, up to 8 players)"
          price = 999
        } else if (count > 12) {
          pkg = "Premium VR Package (6 Headsets, 4 Hours, up to 20 players)"
          price = 1999
        } else {
          pkg = "Standard VR Package (5 Headsets, 3 Hours, up to 12 players)"
          price = 1499
        }
      }
    }

    const suburb = extractRequestSuburb(r)
    const time = extractTimeFromText(r.message) || ""
    const params = new URLSearchParams({
      create: type,
      request_id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || "",
      address: suburb || "",
      date: date || "",
      time: time,
      package: pkg,
      price: String(price),
      notes: r.message || "",
    })
    router.push(`/admin/quotes-invoices?${params.toString()}`)
  }

  const handleAiExtract = async (r: FormRequest) => {
    setExtracting(true)
    try {
      const res = await fetch("/api/ai/extract-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: r.message,
          name: r.name,
          email: r.email,
          phone: r.phone,
        }),
      })
      if (!res.ok) throw new Error("Extraction failed")
      const data = await res.json()
      setExtractedData(data.extracted)
      toast.success("AI extracted event requirements & package recommendation!")
    } catch (err: any) {
      toast.error("Could not run AI extraction")
    } finally {
      setExtracting(false)
    }
  }

  const handleOpenRequest = (r: FormRequest) => {
    setIsMessageModalOpen(false)
    setSelected(r)
    setExtractedData(null)
    loadComms(r.id)
  }

  const handleCloseSheet = () => {
    setSelected(null)
    setIsMessageModalOpen(false)
    setExtractedData(null)
  }

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus !== "all") params.set("status", filterStatus)
    if (filterType !== "all") params.set("form_type", filterType)
    const res = await fetch(`/api/requests?${params}`)
    const d = await res.json()
    setRequests(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => {
    load()

    const handleRefresh = () => {
      load()
    }
    window.addEventListener("new-requests-received", handleRefresh)

    return () => {
      window.removeEventListener("new-requests-received", handleRefresh)
    }
  }, [filterStatus, filterType])

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to update status")
      }
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Status updated to ${getStatusLabel(newStatus)}!`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/requests/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete request")
      setRequests(prev => prev.filter(r => r.id !== deleteId))
      toast.success("Request deleted")
    } catch (err) {
      toast.error("Failed to delete request")
    } finally {
      setDeleteId(null)
    }
  }

  const formTypes = Array.from(new Set(requests.map(r => r.form_type))).filter(Boolean)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-primary" />
            Customer Enquiries & AI Sales Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI lead scoring, automatic package recommendation, and 1-click quote drafting
          </p>
        </div>
        {/* Filters + view toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => changeView("board")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => changeView("list")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
          </div>
          {view === "list" && (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {formTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "board" && (
        loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : requests.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl py-16 text-center text-muted-foreground text-sm">No customer submissions found</div>
        ) : (
          <RequestsBoard
            requests={requests}
            onOpen={handleOpenRequest}
            onStatusChange={handleStatusChange}
            onDraftQuote={(r) => handleCreateInvoice(r, "quote")}
          />
        )
      )}

      {/* List / table view */}
      {view === "list" && (
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-3"><TableSkeleton rows={6} cols={5} /></div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-xs">No customer submissions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Suburb / Area</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">AI Lead Score</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(r => {
                  const leadScore = calculateLeadScore(r)
                  const sub = extractRequestSuburb(r)
                  return (
                    <tr key={r.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => handleOpenRequest(r)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{r.name}</span>
                          {extractBookedGame(r.message) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              <Gamepad2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                              <span className="truncate max-w-[130px]">{extractBookedGame(r.message)}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">{r.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        {sub ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                            <span className="truncate max-w-[130px]">{sub}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px] italic">Not specified</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            leadScore.priority.includes("HIGH")
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : leadScore.priority.includes("MEDIUM")
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {leadScore.priority} ({leadScore.score})
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v as RequestStatus)}>
                          <SelectTrigger className={`h-7 text-xs w-40 border ${STATUS_BADGE[r.status] || STATUS_BADGE.new}`}>
                            <SelectValue>{getStatusLabel(r.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                        <div>{new Date(r.created_at).toLocaleDateString()}</div>
                        {extractTimeFromText(r.message) && (
                          <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-0.5 font-semibold">
                            <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{extractTimeFromText(r.message)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleCreateInvoice(r, "quote")}
                            title="Draft Quote from Request"
                            className="p-1.5 hover:bg-primary/10 rounded-lg text-primary hover:text-primary transition-colors flex items-center gap-1 font-semibold px-2 py-1 bg-primary/5 border border-primary/20"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Draft Quote</span>
                          </button>
                          <button onClick={() => handleOpenRequest(r)} title="View Request Details" className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(r.id)} title="Delete Request" className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && handleCloseSheet()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <SheetHeader className="border-b border-border pb-3">
                <SheetTitle className="text-base font-bold text-foreground">Enquiry & AI Intelligence</SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-semibold">Status:</span>
                    <Select value={selected.status} onValueChange={(v) => handleStatusChange(selected.id, v as RequestStatus)}>
                      <SelectTrigger className={`h-7 text-xs w-44 border ${STATUS_BADGE[selected.status] || STATUS_BADGE.new}`}>
                        <SelectValue>{getStatusLabel(selected.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-muted-foreground font-mono">{new Date(selected.created_at).toLocaleDateString()}</span>
                </div>

                {/* Lead Score & Conversion Prob */}
                {(() => {
                  const leadScore = calculateLeadScore(selected)
                  return (
                    <div className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-rose-400" /> AI Lead Score: {leadScore.score}/100
                        </span>
                        <span className="font-bold text-cyan-400">
                          {leadScore.conversion_probability_pct}% Conversion Prob.
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-muted-foreground">
                        {leadScore.factors.map((f, i) => (
                          <p key={i} className="flex items-center gap-1">
                            <span>{f.positive ? "✓" : "⚠"}</span> {f.label}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* Booked Game Experience Badge */}
                {extractBookedGame(selected.message) && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Booked VR Game Experience</p>
                        <p className="text-xs font-bold text-foreground">{extractBookedGame(selected.message)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                      Direct Game Lead
                    </span>
                  </div>
                )}

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-secondary/20 border border-border/40">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Client Name</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Email Address</p>
                    <p className="font-semibold text-foreground mt-0.5 truncate">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Phone Number</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Suburb / Area</p>
                    <p className="font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{extractRequestSuburb(selected) || "Not specified"}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Requested Date</p>
                    <p className="font-bold text-amber-400 mt-0.5">
                      {extractEventDate(selected.message) || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Requested Time</p>
                    <p className="font-bold text-cyan-400 mt-0.5 flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{extractTimeFromText(selected.message) || "Flexible / Not specified"}</span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Form Category</p>
                    <p className="font-semibold text-foreground mt-0.5 capitalize">{selected.form_type}</p>
                  </div>
                </div>

                {/* Raw Customer Message */}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Customer Message</p>
                  <p className="leading-relaxed whitespace-pre-wrap bg-secondary/40 border border-border/60 rounded-xl p-3 text-foreground font-sans">
                    {selected.message}
                  </p>
                </div>

                {/* Email / communication history */}
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email history
                    {comms.length > 0 && <span className="text-[9px] bg-muted rounded-full px-1.5 py-0.5 text-muted-foreground">{comms.length}</span>}
                  </p>
                  {commsLoading ? (
                    <p className="text-[11px] text-muted-foreground italic px-1 py-2">Loading emails…</p>
                  ) : comms.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic bg-secondary/20 border border-border/40 rounded-xl p-3">
                      No emails logged yet. When you (or Claude) reply, it appears here.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {comms.map((c) => (
                        <details key={c.id} className="bg-secondary/30 border border-border/50 rounded-xl overflow-hidden">
                          <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer list-none">
                            {c.direction === "inbound"
                              ? <ArrowDownLeft className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                              : <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />}
                            <span className="flex-1 min-w-0">
                              <span className="block text-[11px] font-semibold text-foreground truncate">{c.subject || "(no subject)"}</span>
                              <span className="block text-[9px] text-muted-foreground">
                                {c.sent_by}{c.sent_by ? " · " : ""}{new Date(c.created_at).toLocaleString()}
                              </span>
                            </span>
                            <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded-full border flex-shrink-0 ${c.status === "sent" ? "text-emerald-400 border-emerald-500/30" : c.status === "failed" ? "text-red-400 border-red-500/30" : "text-muted-foreground border-border"}`}>{c.status}</span>
                          </summary>
                          <pre className="px-3 pb-3 pt-1 whitespace-pre-wrap text-[11px] text-muted-foreground font-sans leading-relaxed">{c.body}</pre>
                        </details>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Extract Button & Results */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                      ✨ AI Request Extraction
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAiExtract(selected)}
                      disabled={extracting}
                      className="h-7 text-xs bg-primary hover:bg-primary/90"
                    >
                      {extracting ? "Extracting..." : "Analyze Enquiry"}
                    </Button>
                  </div>

                  {extractedData && (
                    <div className="space-y-2 pt-2 border-t border-primary/20 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Recommended Package:</span>
                        <span className="font-bold text-cyan-400">
                          {extractedData.recommended_package?.name} (R{extractedData.recommended_package?.price_zar})
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {extractedData.recommended_package?.reason}
                      </p>
                      {extractedData.missing_fields?.length > 0 && (
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                          <span className="font-bold">Missing Info: </span>
                          {extractedData.missing_fields.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <Button
                    onClick={() =>
                      handleCreateInvoice(
                        selected,
                        "quote",
                        extractedData?.recommended_package?.name,
                        extractedData?.recommended_package?.price_zar
                      )
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 text-xs rounded-xl"
                  >
                    <FileText className="h-4 w-4" />
                    Create Official Quote from Enquiry
                  </Button>
                  <Button
                    onClick={() => setIsMessageModalOpen(true)}
                    variant="outline"
                    className="w-full border-border hover:bg-secondary flex items-center justify-center gap-2 text-xs rounded-xl"
                  >
                    <MessageSquare className="h-4 w-4 text-primary" />
                    AI Reply via WhatsApp / Email
                  </Button>
                </div>

                <div className="pt-2">
                  <Button variant="destructive" size="sm" onClick={() => { setDeleteId(selected.id); setSelected(null) }} className="w-full text-xs">
                    <Trash2 className="h-4 w-4 mr-2" />Delete Request
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Message Generator Modal */}
      {selected && (
        <AiMessageGeneratorModal
          isOpen={isMessageModalOpen}
          initialTemplate="quote_delivery"
          recipient={{
            name: selected.name,
            email: selected.email,
            phone: selected.phone,
            package_name:
              extractedData?.recommended_package?.name ||
              (selected.form_type ? `${selected.form_type} Package` : "Standard VR Package"),
            amount_zar: extractedData?.recommended_package?.price_zar,
            customer_message: selected.message,
            event_type: extractedData?.event_type || selected.form_type,
            missing_fields: extractedData?.missing_fields,
            player_count: extractedData?.player_count,
            location: extractRequestSuburb(selected) || extractedData?.location,
          }}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this request?"
        description="This will permanently delete the form submission."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
