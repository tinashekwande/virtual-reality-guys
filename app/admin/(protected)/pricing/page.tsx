"use client"

import { useEffect, useMemo, useState } from "react"
import { Tag, Plus, Pencil, Trash2, Save, X, Info } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirm } from "@/components/admin/confirm-provider"
import { PRICING_CATEGORIES, PRICE_UNITS, type PricingItem } from "@/lib/pricing-catalog-shared"

type Draft = Partial<PricingItem> & { category: string; name: string; price_unit: string }

const EMPTY: Draft = { category: "party", name: "", price_unit: "per event", active: true, sort_order: 0 }

const rand = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : `R${Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 2 })}`

function priceLabel(i: PricingItem) {
  if (i.price_unit === "quote") return "Quote"
  if (i.price_unit === "rule") return i.price === 0 ? "Included" : "Rule"
  return `${rand(i.price)} ${i.price_unit === "per event" ? "" : i.price_unit}`.trim()
}

const selectClass =
  "w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const confirm = useConfirm()

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/pricing")
      if (!res.ok) throw new Error("Failed to load pricing")
      const data = await res.json()
      setItems(data.items || [])
    } catch (err: any) {
      toast.error(err?.message || "Could not load pricing")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const grouped = useMemo(
    () => PRICING_CATEGORIES.map(c => ({ ...c, rows: items.filter(i => i.category === c.id) })),
    [items]
  )

  const save = async () => {
    if (!editing) return
    if (!editing.name.trim()) return toast.error("Give the item a name")
    setSaving(true)
    try {
      const num = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v))
      const payload = {
        ...editing,
        price: num(editing.price),
        min_price: num(editing.min_price),
        duration_hours: num(editing.duration_hours),
        headsets: num(editing.headsets),
        staff: num(editing.staff),
        max_players: num(editing.max_players),
        sort_order: num(editing.sort_order) ?? 0,
      }
      const res = await fetch(editing.id ? `/api/pricing/${editing.id}` : "/api/pricing", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Save failed")
      toast.success(editing.id ? "Price updated" : "Price added")
      setEditing(null)
      load()
    } catch (err: any) {
      toast.error(err?.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item: PricingItem) => {
    const res = await fetch(`/api/pricing/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    })
    if (!res.ok) return toast.error("Could not update")
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, active: !i.active } : i)))
    toast.success(item.active ? "Moved to draft (won't be quoted)" : "Now live for quotes")
  }

  const remove = async (item: PricingItem) => {
    const ok = await confirm({
      title: `Delete "${item.name}"?`,
      description: "This removes it from the pricing baseline. You can switch it to draft instead if you might use it again.",
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return
    const res = await fetch(`/api/pricing/${item.id}`, { method: "DELETE" })
    if (!res.ok) return toast.error("Could not delete")
    setItems(prev => prev.filter(i => i.id !== item.id))
    toast.success("Deleted")
  }

  const field = (key: keyof Draft, label: string, type: "text" | "number" = "number") => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={(editing?.[key] as any) ?? ""}
        onChange={e => setEditing(d => (d ? { ...d, [key]: e.target.value } : d))}
      />
    </div>
  )

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground text-xs">Loading pricing...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-primary" />
            Pricing
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Prices for every type of event. Live items are the baseline for client emails and quotes.
          </p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })} className="bg-primary text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add price
        </Button>
      </div>

      <div className="flex gap-2 items-start text-xs text-muted-foreground bg-secondary/30 border border-border/50 rounded-xl p-3">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <p>
          <span className="font-semibold text-foreground">Live</span> items are used when replying to clients.{" "}
          <span className="font-semibold text-foreground">Draft</span> items are saved for later and are never quoted.
          Website prices are still set separately.
        </p>
      </div>

      {grouped.map(group => (
        <div key={group.id} className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">{group.label}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 h-7"
              onClick={() => setEditing({ ...EMPTY, category: group.id })}
            >
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>

          {group.rows.length === 0 ? (
            <p className="text-xs text-muted-foreground">No pricing yet. Clients will be told this is quoted individually.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {group.rows.map(item => (
                <div key={item.id} className={`py-3 flex flex-col sm:flex-row sm:items-center gap-3 ${item.active ? "" : "opacity-60"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground">{item.name}</p>
                      {!item.active && (
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">Draft</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[
                        item.duration_hours ? `${item.duration_hours} h` : null,
                        item.headsets ? `${item.headsets} headsets` : null,
                        item.staff ? `${item.staff} staff` : null,
                        item.max_players ? `up to ${item.max_players} players` : null,
                        item.min_price ? `min ${rand(item.min_price)}` : null,
                      ].filter(Boolean).join(" · ")}
                    </p>
                    {item.includes && <p className="text-xs text-foreground/80 mt-1">{item.includes}</p>}
                    {item.notes && <p className="text-[11px] text-muted-foreground mt-1 italic">{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <p className="font-bold text-sm text-foreground whitespace-nowrap min-w-[90px] text-right">{priceLabel(item)}</p>
                    <div className="flex items-center gap-1.5" title={item.active ? "Live" : "Draft"}>
                      <Switch checked={item.active} onCheckedChange={() => toggleActive(item)} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing({ ...item })}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(item)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit price" : "Add price"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Event type</Label>
                  <select
                    className={selectClass}
                    value={editing.category}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                  >
                    {PRICING_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Charged</Label>
                  <select
                    className={selectClass}
                    value={editing.price_unit}
                    onChange={e => setEditing({ ...editing, price_unit: e.target.value })}
                  >
                    {PRICE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {field("name", "Name", "text")}
              <div className="grid grid-cols-2 gap-3">
                {field("price", "Price (R)")}
                {field("min_price", "Minimum charge (R)")}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {field("duration_hours", "Hours")}
                {field("headsets", "Headsets")}
                {field("staff", "Staff")}
                {field("max_players", "Max players")}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">What's included (clients see this)</Label>
                <Textarea
                  rows={2}
                  value={editing.includes ?? ""}
                  onChange={e => setEditing({ ...editing, includes: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Internal notes (how to quote it)</Label>
                <Textarea
                  rows={2}
                  value={editing.notes ?? ""}
                  onChange={e => setEditing({ ...editing, notes: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                {field("sort_order", "Order in list")}
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={editing.active ?? true}
                    onCheckedChange={v => setEditing({ ...editing, active: v })}
                  />
                  <span className="text-xs">{editing.active ?? true ? "Live (used in quotes)" : "Draft"}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditing(null)} className="text-xs gap-1">
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
                <Button onClick={save} disabled={saving} className="bg-primary text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
