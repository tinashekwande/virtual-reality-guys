"use client"

import { useEffect, useState, useRef } from "react"
import { Pencil, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import type { Media, Category } from "@/types"

export default function GalleryAdminPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState("all")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editItem, setEditItem] = useState<Media | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const [m, c] = await Promise.all([
      fetch("/api/media").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ])
    setMedia(Array.isArray(m) ? m : [])
    setCategories(Array.isArray(c) ? c : [])
  }

  useEffect(() => { load() }, [])

  const filtered = filter === "all" ? media : media.filter(m => m.category_id === filter)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setUploading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const files = fileRef.current?.files
    if (!files?.length) { setError("Please select at least one file"); setUploading(false); return }
    const categoryId = formData.get("category_id") as string
    if (!categoryId) { setError("Please select a category"); setUploading(false); return }

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("title", formData.get("title") as string)
      fd.append("description", formData.get("description") as string)
      fd.append("category_id", formData.get("category_id") as string)
      await fetch("/api/media", { method: "POST", body: fd })
    }

    setUploadOpen(false)
    form.reset()
    await load()
    setUploading(false)
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editItem) return
    const fd = new FormData(e.currentTarget)
    const categoryId = fd.get("category_id") as string
    if (!categoryId) {
      alert("Category is required")
      return
    }
    await fetch(`/api/media/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        category_id: categoryId,
      }),
    })
    setEditItem(null)
    await load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await fetch(`/api/media/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    await load()
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Gallery Management</h2>
          <p className="text-sm text-muted-foreground">{media.length} files total</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4 mr-2" />Upload Media</Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
        >All ({media.length})</button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
          >{c.name} ({media.filter(m => m.category_id === c.id).length})</button>
        ))}
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <Upload className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No media yet. Upload your first file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="group relative bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-square bg-secondary">
                {item.type === "image"
                  ? <img src={item.file_url} alt={item.title ?? ""} className="w-full h-full object-cover" />
                  : <video src={item.file_url} className="w-full h-full object-cover" muted />
                }
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground truncate">{(item as any).categories?.name ?? "—"}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditItem(item)} className="w-7 h-7 bg-card/90 rounded-md flex items-center justify-center hover:bg-card">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="w-7 h-7 bg-destructive/80 rounded-md flex items-center justify-center hover:bg-destructive text-white">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Upload Media</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Files (images or videos)</Label>
              <input ref={fileRef} type="file" name="files" multiple accept="image/*,video/*"
                className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium cursor-pointer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-title">Title (optional)</Label>
              <Input id="up-title" name="title" placeholder="e.g. Cape Town Expo 2025" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-cat">Category</Label>
              <Select name="category_id">
                <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-desc">Description (optional)</Label>
              <Textarea id="up-desc" name="description" rows={2} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={v => !v && setEditItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Media</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ed-title">Title</Label>
                <Input id="ed-title" name="title" defaultValue={editItem.title ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-cat">Category</Label>
                <Select name="category_id" defaultValue={editItem.category_id ?? ""}>
                  <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-desc">Description</Label>
                <Textarea id="ed-desc" name="description" defaultValue={editItem.description ?? ""} rows={2} />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this media?"
        description="This will permanently delete the file from storage. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
