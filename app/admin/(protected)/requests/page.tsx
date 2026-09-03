"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Eye, Receipt, FileText, Sparkles, MessageSquare, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { AiMessageGeneratorModal } from "@/components/admin/ai/AiMessageGeneratorModal"
import { calculateLeadScore } from "@/lib/ai/lead-scoring"
import { toast } from "sonner"
import type { FormRequest, RequestStatus } from "@/types"

function extractEventDate(message: string): string {
  if (!message) return ""
  const explicitMatch = message.match(/\[Event Date:\s*([^\]]+)\]/i)
  if (explicitMatch) return explicitMatch[1].trim()
  const isoMatch = message.match(/\b(20\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01]))\b/)
  if (isoMatch) return isoMatch[1].replace(/\//g, "-")
  return ""
}

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New Request" },
  { value: "in_progress", label: "Pending Confirmation" },
  { value: "archived", label: "Booking Confirmed" },
  { value: "completed", label: "Event Completed" },
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

  const handleCreateInvoice = (
    r: FormRequest,
    type: "invoice" | "quote" = "invoice",
    customPackage?: string,
    customPrice?: number
  ) => {
    const date = extractEventDate(r.message)

    // Intelligently infer package and price based on enquiry message and player count
    let pkg = customPackage
    let price = customPrice

    if (!pkg || !price) {
      const msg = (r.message || "").toLowerCase()
      const numMatch = msg.match(/\b(\d{1,3})\s*(kids|children|players|people|guests|adults|participants|students)\b/i)
      const count = numMatch ? parseInt(numMatch[1], 10) : 12

      if (msg.includes("corporate") || msg.includes("team") || msg.includes("company") || (r.form_type || "").toLowerCase().includes("corporate")) {
        pkg = "Corporate Event VR Package (6-8 Headsets, 4 Hours)"
        price = 1499
      } else if (msg.includes("school") || (r.form_type || "").toLowerCase().includes("school")) {
        pkg = "School / Educational VR Experience (4 Headsets, 3 Hours)"
        price = 899
      } else if (count <= 10) {
        pkg = "Starter VR Package (2 Headsets, 2 Hours, 1 Staff)"
        price = 499
      } else if (count > 20) {
        pkg = "Premium VR Package (6 Headsets, 4 Hours, 3 Staff)"
        price = 1299
      } else {
        pkg = "Standard VR Package (4 Headsets, 3 Hours, 2 Staff)"
        price = 899
      }
    }

    const params = new URLSearchParams({
      create: type,
      name: r.name,
      email: r.email,
      phone: r.phone || "",
      date: date || "",
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
      if (!res.ok) throw new Error("Failed to update status")
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success("Status updated")
    } catch (err) {
      toast.error("Failed to update status")
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
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {formTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-xs">Loading requests pipeline…</div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-xs">No customer submissions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">AI Lead Score</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(r => {
                  const leadScore = calculateLeadScore(r)
                  return (
                    <tr key={r.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => handleOpenRequest(r)}>
                      <td className="px-5 py-4 font-semibold text-foreground">{r.name}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{r.email}</td>
                      <td className="px-5 py-4">
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
                        {new Date(r.created_at).toLocaleDateString()}
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

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && handleCloseSheet()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <SheetHeader className="border-b border-border pb-3">
                <SheetTitle className="text-base font-bold text-foreground">Enquiry & AI Intelligence</SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full border font-semibold ${STATUS_BADGE[selected.status] || STATUS_BADGE.new}`}>
                    {getStatusLabel(selected.status)}
                  </span>
                  <span className="text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</span>
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

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-secondary/20 border border-border/40">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Client Name</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Email Address</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Phone Number</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">Form Category</p>
                    <p className="font-semibold text-foreground mt-0.5">{selected.form_type}</p>
                  </div>
                </div>

                {/* Raw Customer Message */}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Customer Message</p>
                  <p className="leading-relaxed whitespace-pre-wrap bg-secondary/40 border border-border/60 rounded-xl p-3 text-foreground font-sans">
                    {selected.message}
                  </p>
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
            location: extractedData?.location,
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
