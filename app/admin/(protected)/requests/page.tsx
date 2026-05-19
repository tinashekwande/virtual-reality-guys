"use client"

import { useEffect, useState } from "react"
import { Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import type { FormRequest, RequestStatus } from "@/types"

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

const STATUS_BADGE: Record<RequestStatus, string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  archived: "bg-muted text-muted-foreground border-border",
}

export default function RequestsAdminPage() {
  const [requests, setRequests] = useState<FormRequest[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selected, setSelected] = useState<FormRequest | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => { load() }, [filterStatus, filterType])

  async function handleStatusChange(id: string, status: RequestStatus) {
    await fetch(`/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    await load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await fetch(`/api/requests/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    if (selected?.id === deleteId) setSelected(null)
    await load()
  }

  const formTypes = [...new Set(requests.map(r => r.form_type))]
  const newCount = requests.filter(r => r.status === "new").length

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Form Requests</h2>
          <p className="text-sm text-muted-foreground">
            {requests.length} submissions
            {newCount > 0 && <span className="ml-2 text-primary font-semibold">• {newCount} new</span>}
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {formTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading…</div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No submissions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                    <td className="px-5 py-4 font-medium">{r.name}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground hidden sm:table-cell">{r.email}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">{r.form_type}</span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v as RequestStatus)}>
                        <SelectTrigger className={`h-7 text-xs w-32 border ${STATUS_BADGE[r.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setSelected(r)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(r.id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Request Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${STATUS_BADGE[selected.status]}`}>
                    {selected.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Name", value: selected.name },
                    { label: "Email", value: selected.email },
                    { label: "Phone", value: selected.phone ?? "—" },
                    { label: "Form Type", value: selected.form_type },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{f.label}</p>
                      <p className="mt-1">{f.value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Message</p>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap bg-secondary/50 rounded-lg p-3">{selected.message}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(selected.id, s.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${selected.status === s.value ? STATUS_BADGE[s.value] : "border-border hover:bg-secondary"}`}
                      >{s.label}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" size="sm" onClick={() => { setDeleteId(selected.id); setSelected(null) }} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />Delete Request
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

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
