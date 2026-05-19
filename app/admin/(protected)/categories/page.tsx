"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import type { Category } from "@/types"

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = () =>
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))

  useEffect(() => { load() }, [])

  async function handleCreate() {
    setError("")
    if (!newName.trim()) return
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error); return }
    setNewName("")
    setCreating(false)
    await load()
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    })
    setEditId(null)
    await load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await fetch(`/api/categories/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    await load()
  }

  const deleteTarget = categories.find(c => c.id === deleteId)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Categories</h2>
          <p className="text-sm text-muted-foreground">{categories.length} categories total</p>
        </div>
        <Button onClick={() => { setCreating(true); setError("") }} size="sm">
          <Plus className="h-4 w-4 mr-2" />New Category
        </Button>
      </div>

      {/* Create row */}
      {creating && (
        <div className="flex items-center gap-2 p-4 bg-card border border-primary/30 rounded-xl">
          <Input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name…"
            onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false) }}
          />
          <Button size="sm" onClick={handleCreate}><Check className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setCreating(false); setNewName("") }}><X className="h-4 w-4" /></Button>
          {error && <p className="text-sm text-destructive ml-2">{error}</p>}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Media</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No categories yet</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-4">
                  {editId === c.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="h-8 text-sm"
                        onKeyDown={e => { if (e.key === "Enter") handleEdit(c.id); if (e.key === "Escape") setEditId(null) }}
                      />
                      <button onClick={() => handleEdit(c.id)} className="text-primary hover:text-primary/80"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{c.media_count ?? 0} files</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditId(c.id); setEditName(c.name) }} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this category?"
        description={`Delete "${deleteTarget?.name}"? ${(deleteTarget?.media_count ?? 0) > 0 ? `⚠️ This category has ${deleteTarget?.media_count} linked media files — they will become uncategorized.` : ""}`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
