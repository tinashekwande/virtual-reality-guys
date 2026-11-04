"use client"

import { useEffect, useState } from "react"
import { Mail, Plus, Users, Send, RefreshCw, Trash2, Pencil, Eye } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api, zar, fmtDate, fmtDateTime, StatusPill, ActorBadge, Field, selectClass, EmptyState } from "./shared"
import { useConfirm } from "@/components/admin/confirm-provider"

const STARTER_HTML = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111827">
  <h2 style="color:#0891b2">Hi {{first_name}} 👋</h2>
  <p>Planning a party or team event? Bring the VR arcade to your venue!</p>
  <p><a href="https://virtualrealityguyz.co.za/contact" style="background:#06b6d4;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Book your date</a></p>
  <p>The Virtual Reality Guys team<br/>+27 71 780 0323 (call / WhatsApp)</p>
</div>`

type Campaign = Record<string, any>

const emptyForm = {
  name: "",
  subject: "",
  preview_text: "",
  body_html: STARTER_HTML,
  audience_tags: "",
  send_method: "gmail",
  goal: "",
  notes: "",
}

export function CampaignsTab({ provider, onChanged }: { provider: string | null; onChanged: () => void }) {
  const confirm = useConfirm()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [detail, setDetail] = useState<{ campaign: Campaign; recipients: any[] } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api<{ campaigns: Campaign[] }>("/api/marketing/campaigns")
      setCampaigns(data.campaigns || [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setEditorOpen(true)
  }

  const openEdit = (c: Campaign) => {
    setEditing(c)
    setForm({
      name: c.name || "",
      subject: c.subject || "",
      preview_text: c.preview_text || "",
      body_html: c.body_html || "",
      audience_tags: (c.audience_tags || []).join(", "),
      send_method: c.send_method || "gmail",
      goal: c.goal || "",
      notes: c.notes || "",
    })
    setEditorOpen(true)
  }

  const openDetail = async (id: string) => {
    try {
      const data = await api(`/api/marketing/campaigns/${id}`)
      setDetail(data)
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      audience_tags: form.audience_tags.split(",").map((t) => t.trim()).filter(Boolean),
    }
    try {
      if (editing) {
        await api(`/api/marketing/campaigns/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        if (detail?.campaign.id === editing.id) await openDetail(editing.id)
        toast.success("Campaign updated")
      } else {
        await api("/api/marketing/campaigns", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Campaign created")
      }
      setEditorOpen(false)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const prepare = async (id: string) => {
    setBusy(true)
    try {
      const r = await api(`/api/marketing/campaigns/${id}/prepare`, { method: "POST" })
      toast.success(`${r.pending} recipients ready (${r.recipients} total)`)
      await openDetail(id)
      load()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  const sendBatch = async (id: string) => {
    if (!(await confirm({ title: "Send batch now?", description: "This sends the next batch (up to 50 emails) from the portal immediately.", confirmLabel: "Send batch", destructive: false }))) return
    setBusy(true)
    try {
      const r = await api(`/api/marketing/campaigns/${id}/send-batch`, { method: "POST", body: JSON.stringify({ limit: 50 }) })
      toast.success(`Sent ${r.sent} so far · ${r.pending} still pending`)
      await openDetail(id)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  const updateResults = async (c: Campaign, patch: Record<string, any>) => {
    try {
      await api(`/api/marketing/campaigns/${c.id}`, { method: "PATCH", body: JSON.stringify(patch) })
      toast.success("Saved")
      await openDetail(c.id)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const remove = async (c: Campaign) => {
    if (!(await confirm({ title: "Delete campaign?", description: `"${c.name}" and its send log will be permanently deleted.`, confirmLabel: "Delete" }))) return
    try {
      await api(`/api/marketing/campaigns/${c.id}`, { method: "DELETE" })
      toast.success("Campaign deleted")
      setDetail(null)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Create campaigns here or ask Claude to write and send them. Every send is logged per recipient.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" onClick={openNew} className="text-xs gap-1.5">
            <Plus className="w-4 h-4" /> New campaign
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading campaigns…</p>
      ) : campaigns.length === 0 ? (
        <EmptyState icon={Mail} title="No email campaigns yet" body='Create one, or ask Claude: "Write a December holiday party promo for past birthday clients and send it."' />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left font-medium px-4 py-3">Campaign</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Sent</th>
                <th className="text-right font-medium px-4 py-3">Replies</th>
                <th className="text-right font-medium px-4 py-3">Bookings</th>
                <th className="text-right font-medium px-4 py-3">Revenue</th>
                <th className="text-left font-medium px-4 py-3">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 min-w-[220px]">
                    <button onClick={() => openDetail(c.id)} className="text-left">
                      <p className="font-medium text-foreground hover:text-primary">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[280px]">{c.subject}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {c.sent_count}/{c.recipients_count}
                    {c.failed_count > 0 && <span className="text-red-400 text-xs ml-1">({c.failed_count} failed)</span>}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.replies_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.bookings_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{zar(c.revenue_attributed)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDate(c.created_at)} <ActorBadge actor={c.created_by} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(c.id)} aria-label="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)} aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit campaign" : "New email campaign"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Field label="Campaign name">
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="December holiday parties" />
              </Field>
              <Field label="Subject line">
                <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Make this year's party unforgettable 🎮" />
              </Field>
              <Field label="Preview text">
                <Input value={form.preview_text} onChange={(e) => setForm({ ...form, preview_text: e.target.value })} />
              </Field>
              <Field label="Audience tags" hint="Comma separated, e.g. birthday, past-client. Leave empty to send to all subscribed contacts.">
                <Input value={form.audience_tags} onChange={(e) => setForm({ ...form, audience_tags: e.target.value })} />
              </Field>
              <Field label="Send method">
                <select className={selectClass} value={form.send_method} onChange={(e) => setForm({ ...form, send_method: e.target.value })}>
                  <option value="gmail">Claude sends through Gmail</option>
                  <option value="portal">Portal email provider (Resend / SMTP)</option>
                </select>
              </Field>
              <Field label="Goal">
                <Input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="10 December bookings" />
              </Field>
              <Field label="Email body (HTML)" hint="Use {{first_name}} to personalise. An unsubscribe link is added automatically.">
                <Textarea rows={10} className="font-mono text-xs" value={form.body_html} onChange={(e) => setForm({ ...form, body_html: e.target.value })} />
              </Field>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Preview</p>
              <div className="rounded-lg border border-border bg-white overflow-hidden">
                <div className="px-3 py-2 border-b text-xs text-zinc-600 bg-zinc-50">
                  <strong className="text-zinc-900">{form.subject || "(no subject)"}</strong>
                  {form.preview_text && <span className="text-zinc-500"> — {form.preview_text}</span>}
                </div>
                <iframe
                  title="Email preview"
                  sandbox=""
                  className="w-full h-[420px] bg-white"
                  srcDoc={form.body_html.replace(/\{\{\s*first_name\s*\}\}/g, "Thandi").replace(/\{\{\s*name\s*\}\}/g, "Thandi Mokoena")}
                />
              </div>
            </div>
            <DialogFooter className="lg:col-span-2">
              <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save changes" : "Create draft"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <CampaignDetail
              data={detail}
              provider={provider}
              busy={busy}
              onPrepare={() => prepare(detail.campaign.id)}
              onSendBatch={() => sendBatch(detail.campaign.id)}
              onEdit={() => {
                openEdit(detail.campaign)
              }}
              onDelete={() => remove(detail.campaign)}
              onSaveResults={(p) => updateResults(detail.campaign, p)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CampaignDetail({
  data,
  provider,
  busy,
  onPrepare,
  onSendBatch,
  onEdit,
  onDelete,
  onSaveResults,
}: {
  data: { campaign: Campaign; recipients: any[] }
  provider: string | null
  busy: boolean
  onPrepare: () => void
  onSendBatch: () => void
  onEdit: () => void
  onDelete: () => void
  onSaveResults: (p: Record<string, any>) => void
}) {
  const c = data.campaign
  const recipients = data.recipients || []
  const [results, setResults] = useState({
    replies_count: c.replies_count || 0,
    bookings_count: c.bookings_count || 0,
    revenue_attributed: Number(c.revenue_attributed || 0),
    cost: Number(c.cost || 0),
  })
  const pending = recipients.filter((r) => r.status === "pending").length
  const closed = ["sent", "cancelled"].includes(c.status)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 flex-wrap">
          {c.name} <StatusPill status={c.status} />
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <p><span className="text-foreground font-medium">Subject:</span> {c.subject}</p>
          <p><span className="text-foreground font-medium">Audience:</span> {c.audience_tags?.length ? c.audience_tags.join(", ") : "All subscribed contacts"}</p>
          <p><span className="text-foreground font-medium">Send method:</span> {c.send_method === "portal" ? "Portal provider" : "Gmail (via Claude)"}</p>
          <p><span className="text-foreground font-medium">Created by:</span> <ActorBadge actor={c.created_by} /></p>
          {c.goal && <p className="sm:col-span-2"><span className="text-foreground font-medium">Goal:</span> {c.goal}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onEdit} className="text-xs"><Pencil className="w-3.5 h-3.5 mr-1.5" />Edit</Button>
          {!closed && (
            <Button size="sm" variant="outline" onClick={onPrepare} disabled={busy} className="text-xs">
              <Users className="w-3.5 h-3.5 mr-1.5" />Build recipient list
            </Button>
          )}
          {!closed && provider && pending > 0 && (
            <Button size="sm" onClick={onSendBatch} disabled={busy} className="text-xs">
              <Send className="w-3.5 h-3.5 mr-1.5" />Send next batch from portal
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete} className="text-xs text-destructive ml-auto">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
          </Button>
        </div>
        {!closed && pending > 0 && !provider && (
          <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
            {pending} recipients are waiting. Ask Claude: <em>“Send the {c.name} campaign through Gmail.”</em> Claude sends each email and records it here.
          </p>
        )}

        <div className="rounded-xl border border-border p-3 space-y-3">
          <p className="text-xs font-semibold text-foreground">Results</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Field label="Replies"><Input type="number" min={0} value={results.replies_count} onChange={(e) => setResults({ ...results, replies_count: Number(e.target.value) })} /></Field>
            <Field label="Bookings"><Input type="number" min={0} value={results.bookings_count} onChange={(e) => setResults({ ...results, bookings_count: Number(e.target.value) })} /></Field>
            <Field label="Revenue (R)"><Input type="number" min={0} value={results.revenue_attributed} onChange={(e) => setResults({ ...results, revenue_attributed: Number(e.target.value) })} /></Field>
            <Field label="Cost (R)"><Input type="number" min={0} value={results.cost} onChange={(e) => setResults({ ...results, cost: Number(e.target.value) })} /></Field>
          </div>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => onSaveResults(results)}>Save results</Button>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">
            Recipients ({recipients.length}) · {c.sent_count} sent · {pending} pending
          </p>
          {recipients.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recipients yet — use “Build recipient list”.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <tbody>
                  {recipients.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <p className="text-foreground">{r.name || r.email}</p>
                        {r.name && <p className="text-muted-foreground">{r.email}</p>}
                      </td>
                      <td className="px-3 py-2"><StatusPill status={r.status} /></td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.sent_at ? fmtDateTime(r.sent_at) : r.error || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
