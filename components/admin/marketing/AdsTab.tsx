"use client"

import { useEffect, useState } from "react"
import { Megaphone, Plus, RefreshCw, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api, zar, StatusPill, ActorBadge, Field, selectClass, EmptyState } from "./shared"

const PLATFORMS: Record<string, string> = {
  meta: "Meta (FB + IG)",
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google Ads",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  print: "Print / Flyers",
  radio: "Radio",
  influencer: "Influencer",
  other: "Other",
}

const empty = {
  name: "", platform: "meta", objective: "leads", status: "planned", start_date: "", end_date: "",
  budget: 0, spend: 0, impressions: 0, clicks: 0, leads: 0, bookings: 0, revenue_attributed: 0,
  target_audience: "", ad_copy: "", landing_url: "", creative_url: "", notes: "",
}

export function AdsTab({ onChanged }: { onChanged: () => void }) {
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(empty)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api("/api/marketing/ads")
      setAds(data.ads || [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openForm = (ad?: any) => {
    setEditingId(ad?.id || null)
    setForm(ad ? Object.fromEntries(Object.keys(empty).map((k) => [k, ad[k] ?? (empty as any)[k]])) : empty)
    setOpen(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = ["budget", "spend", "impressions", "clicks", "leads", "bookings", "revenue_attributed"]
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, numeric.includes(k) ? Number(v) || 0 : v]))
    try {
      if (editingId) await api(`/api/marketing/ads/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
      else await api("/api/marketing/ads", { method: "POST", body: JSON.stringify(payload) })
      toast.success(editingId ? "Ad campaign updated" : "Ad campaign added")
      setOpen(false)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const remove = async (ad: any) => {
    if (!confirm(`Delete "${ad.name}"?`)) return
    try {
      await api(`/api/marketing/ads/${ad.id}`, { method: "DELETE" })
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Track every ad campaign. Record the actual ad bill under Accounts → Expenses (“Marketing / Ads”) too.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="text-xs"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>
          <Button size="sm" onClick={() => openForm()} className="text-xs gap-1.5"><Plus className="w-4 h-4" />New ad campaign</Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading ad campaigns…</p>
      ) : ads.length === 0 ? (
        <EmptyState icon={Megaphone} title="No ad campaigns yet" body="Add your Facebook/Instagram, Google or TikTok campaigns to see spend, cost per lead and return on ad spend." />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left font-medium px-4 py-3">Campaign</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Spend / Budget</th>
                <th className="text-right font-medium px-4 py-3">Clicks</th>
                <th className="text-right font-medium px-4 py-3">Leads</th>
                <th className="text-right font-medium px-4 py-3">Cost / lead</th>
                <th className="text-right font-medium px-4 py-3">Bookings</th>
                <th className="text-right font-medium px-4 py-3">ROAS</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ads.map((a) => {
                const spend = Number(a.spend || 0)
                const cpl = a.leads > 0 ? spend / a.leads : null
                const roas = spend > 0 ? Number(a.revenue_attributed || 0) / spend : null
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 min-w-[200px]">
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {PLATFORMS[a.platform] || a.platform}
                        {a.start_date ? ` · ${a.start_date}${a.end_date ? ` → ${a.end_date}` : ""}` : ""} <ActorBadge actor={a.created_by} />
                      </p>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                    <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">{zar(spend)} / {zar(a.budget)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.clicks}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.leads}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{cpl !== null ? zar(cpl.toFixed(2)) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.bookings}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{roas !== null ? `${roas.toFixed(1)}×` : "—"}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(a)} aria-label="Edit"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(a)} aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit ad campaign" : "New ad campaign"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name"><Input required value={form.name} onChange={set("name")} placeholder="Kids parties — Northern Suburbs" /></Field>
              <Field label="Platform">
                <select className={selectClass} value={form.platform} onChange={set("platform")}>
                  {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Objective"><Input value={form.objective} onChange={set("objective")} placeholder="leads / traffic / awareness" /></Field>
              <Field label="Status">
                <select className={selectClass} value={form.status} onChange={set("status")}>
                  {["planned", "active", "paused", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Start date"><Input type="date" value={form.start_date} onChange={set("start_date")} /></Field>
              <Field label="End date"><Input type="date" value={form.end_date} onChange={set("end_date")} /></Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Budget (R)"><Input type="number" min={0} value={form.budget} onChange={set("budget")} /></Field>
              <Field label="Spend (R)"><Input type="number" min={0} value={form.spend} onChange={set("spend")} /></Field>
              <Field label="Impressions"><Input type="number" min={0} value={form.impressions} onChange={set("impressions")} /></Field>
              <Field label="Clicks"><Input type="number" min={0} value={form.clicks} onChange={set("clicks")} /></Field>
              <Field label="Leads"><Input type="number" min={0} value={form.leads} onChange={set("leads")} /></Field>
              <Field label="Bookings"><Input type="number" min={0} value={form.bookings} onChange={set("bookings")} /></Field>
              <Field label="Revenue (R)"><Input type="number" min={0} value={form.revenue_attributed} onChange={set("revenue_attributed")} /></Field>
            </div>
            <Field label="Target audience"><Input value={form.target_audience} onChange={set("target_audience")} placeholder="Parents 28–45, 15km around Durbanville" /></Field>
            <Field label="Ad copy"><Textarea rows={3} value={form.ad_copy} onChange={set("ad_copy")} /></Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Landing page URL"><Input value={form.landing_url} onChange={set("landing_url")} /></Field>
              <Field label="Creative URL"><Input value={form.creative_url} onChange={set("creative_url")} /></Field>
            </div>
            <Field label="Notes"><Textarea rows={2} value={form.notes} onChange={set("notes")} /></Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId ? "Save" : "Add campaign"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
