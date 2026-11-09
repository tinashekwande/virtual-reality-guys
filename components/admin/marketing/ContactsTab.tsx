"use client"

import { useEffect, useState } from "react"
import { Users, Plus, Download, RefreshCw, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api, fmtDate, StatusPill, Field, selectClass, EmptyState } from "./shared"
import { useConfirm } from "@/components/admin/confirm-provider"

export function ContactsTab({ onChanged }: { onChanged: () => void }) {
  const confirm = useConfirm()
  const [contacts, setContacts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [bulk, setBulk] = useState("")
  const [tags, setTags] = useState("")
  const [syncing, setSyncing] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams({ status, limit: "500" })
      if (search.trim()) qs.set("search", search.trim())
      const data = await api(`/api/marketing/contacts?${qs}`)
      setContacts(data.contacts || [])
      setTotal(data.total || 0)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const sync = async () => {
    setSyncing(true)
    try {
      const r = await api("/api/marketing/sync-contacts", { method: "POST" })
      toast.success(`Imported ${r.created} new contacts, updated ${r.updated}`)
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSyncing(false)
    }
  }

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean)
    // Each line: email, name, phone
    const list = bulk
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [email, name, phone] = line.split(/[,;\t]/).map((s) => s?.trim())
        return { email, name, phone, tags: tagList, consent_basis: "opt_in" }
      })
    if (!list.length) return
    try {
      const r = await api("/api/marketing/contacts", { method: "POST", body: JSON.stringify({ contacts: list }) })
      toast.success(`Added ${r.created}, updated ${r.updated}${r.invalid?.length ? `, ${r.invalid.length} invalid skipped` : ""}`)
      setAddOpen(false)
      setBulk("")
      setTags("")
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const toggleSub = async (c: any) => {
    const next = c.status === "subscribed" ? "unsubscribed" : "subscribed"
    if (next === "subscribed" && !(await confirm({ title: "Re-subscribe this contact?", description: `Only re-subscribe ${c.email} if they asked to receive emails again.`, confirmLabel: "Re-subscribe", destructive: false }))) return
    try {
      await api(`/api/marketing/contacts/${c.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) })
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const remove = async (c: any) => {
    if (!(await confirm({ title: "Delete contact?", description: `${c.email} will be removed from marketing contacts.`, confirmLabel: "Delete" }))) return
    try {
      await api(`/api/marketing/contacts/${c.id}`, { method: "DELETE" })
      load()
      onChanged()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <form
          className="flex gap-2 flex-1 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault()
            load()
          }}
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search name, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={selectClass + " max-w-[160px]"} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </form>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={load} className="text-xs"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={sync} disabled={syncing} className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />{syncing ? "Importing…" : "Import from clients"}
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="text-xs gap-1.5"><Plus className="w-4 h-4" />Add contacts</Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {total} contacts. “Import from clients” adds everyone from website requests and quotes/invoices, tagged by enquiry type. Unsubscribed people are never emailed and are never re-subscribed automatically.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <EmptyState icon={Users} title="No contacts found" body="Import your past clients and enquiries, or add contacts who have opted in." />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left font-medium px-4 py-3">Contact</th>
                <th className="text-left font-medium px-4 py-3">Tags</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Source</th>
                <th className="text-left font-medium px-4 py-3">Last emailed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-2.5 min-w-[200px]">
                    <p className="font-medium text-foreground">{c.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {(c.tags || []).map((t: string) => (
                        <span key={t} className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{c.source?.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(c.last_emailed_at)}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => toggleSub(c)}>
                      {c.status === "subscribed" ? "Unsubscribe" : "Re-subscribe"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(c)} aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add contacts</DialogTitle></DialogHeader>
          <form onSubmit={add} className="space-y-3">
            <Field label="Contacts" hint="One per line: email, name, phone (name and phone optional). Only add people who agreed to receive marketing.">
              <Textarea rows={8} className="font-mono text-xs" value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"thandi@example.com, Thandi Mokoena, 0821234567\njohn@example.com, John"} />
            </Field>
            <Field label="Tags" hint="Comma separated, e.g. expo-2026, corporate">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
