// components/blog/MarkdownEditor.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Heading2, Heading3, Bold, Italic, List, ListOrdered, 
  Quote, Link as LinkIcon, Table, Youtube, Image as ImageIcon, 
  Eye, Edit2, Upload, FolderOpen 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { marked } from "marked"
import type { Media } from "@/types"

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [previewHtml, setPreviewHtml] = useState("")
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryMedia, setGalleryMedia] = useState<Media[]>([])
  const [uploading, setUploading] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Configure marked renderer for preview
  useEffect(() => {
    if (activeTab === "preview") {
      const renderer = new marked.Renderer();
      (renderer as any).heading = function (arg1: any, arg2?: any, arg3?: any) {
        let text = ""
        let depth = 2
        if (typeof arg1 === "object") {
          text = arg1.text || ""
          depth = arg1.depth || 2
        } else {
          text = arg1
          depth = arg2
        }
        const id = text
          .toLowerCase()
          .replace(/<[^>]*>/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
        return `<h${depth} id="${id}">${text}</h${depth}>`
      }
      
      const html = marked.parse(value, { renderer })
      setPreviewHtml(html as string)
    }
  }, [activeTab, value])

  // Load gallery media when dialog opens
  useEffect(() => {
    if (galleryOpen) {
      fetch("/api/media")
        .then(r => r.json())
        .then(d => setGalleryMedia(Array.isArray(d) ? d.filter((m: any) => m.type === "image") : []))
        .catch(err => console.error("Failed to load gallery:", err))
    }
  }, [galleryOpen])

  // Insert markdown at cursor
  function insertMarkdown(before: string, after: string = "", defaultText: string = "") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const textToInsert = before + (selectedText || defaultText) + after

    const newValue = textarea.value.substring(0, start) + textToInsert + textarea.value.substring(end)
    onChange(newValue)

    // Refocus and place cursor
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + (selectedText || defaultText).length
      textarea.selectionStart = newCursorPos
      textarea.selectionEnd = newCursorPos
    }, 50)
  }

  // Handle local file upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        insertMarkdown(`![${file.name.split(".")[0]}](${data.url})`, "", "")
      } else {
        const error = await res.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (err) {
      console.error(err)
      alert("Error uploading image")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Insert from gallery
  function handleSelectFromGallery(mediaUrl: string, title?: string) {
    insertMarkdown(`![${title || "Image"}](${mediaUrl})`, "", "")
    setGalleryOpen(false)
  }

  // Toolbar Actions
  const TOOLBAR_ITEMS = [
    { icon: Heading2, label: "H2 Heading", action: () => insertMarkdown("## ", "\n", "Heading 2") },
    { icon: Heading3, label: "H3 Heading", action: () => insertMarkdown("### ", "\n", "Heading 3") },
    { icon: Bold, label: "Bold Text", action: () => insertMarkdown("**", "**", "bold text") },
    { icon: Italic, label: "Italic Text", action: () => insertMarkdown("*", "*", "italic text") },
    { icon: List, label: "Bullet List", action: () => insertMarkdown("- ", "\n", "List item") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertMarkdown("1. ", "\n", "List item") },
    { icon: Quote, label: "Quote Block", action: () => insertMarkdown("> ", "\n", "Blockquote text") },
    { icon: LinkIcon, label: "Add Link", action: () => insertMarkdown("[", "](https://example.com)", "link text") },
    { 
      icon: Table, 
      label: "Add Table", 
      action: () => insertMarkdown(
        "\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |\n\n"
      ) 
    },
    { 
      icon: Youtube, 
      label: "YouTube Video", 
      action: () => {
        const videoId = prompt("Enter YouTube Video ID (e.g. dQw4w9WgXcQ):")
        if (videoId?.trim()) {
          insertMarkdown(
            `\n<div class="video-container">\n  <iframe src="https://www.youtube.com/embed/${videoId.trim()}" frameborder="0" allowfullscreen></iframe>\n</div>\n\n`
          )
        }
      } 
    },
  ]

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col min-h-[450px]">
      {/* Editor/Preview tabs and toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 flex-wrap gap-2 bg-secondary/20">
        {/* Toggle tabs */}
        <div className="flex gap-1 bg-background border border-border p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${activeTab === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Edit2 className="h-3.5 w-3.5" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${activeTab === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>

        {/* Markdown Toolbar */}
        {activeTab === "edit" && (
          <div className="flex items-center gap-1 flex-wrap">
            {TOOLBAR_ITEMS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={item.label}
              >
                <item.icon className="h-4 w-4" />
              </button>
            ))}

            <div className="h-4 w-[1px] bg-border mx-1" />

            {/* Local Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              title="Upload Image"
            >
              <Upload className="h-4 w-4" />
            </button>

            {/* Choose from gallery */}
            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Choose from Gallery"
                >
                  <FolderOpen className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Insert Image from Gallery</DialogTitle>
                </DialogHeader>
                {galleryMedia.length === 0 ? (
                  <p className="text-sm text-center py-10 text-muted-foreground">
                    No images available in gallery. Upload one first.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-4">
                    {galleryMedia.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectFromGallery(m.file_url, m.title)}
                        className="group relative aspect-square bg-secondary border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <img
                          src={m.file_url}
                          alt={m.title || ""}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] bg-background/90 text-foreground px-2 py-0.5 rounded border border-border font-semibold">
                            Select
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 flex flex-col bg-background">
        {activeTab === "edit" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Write your article in Markdown syntax here… Use the toolbar to insert elements."
            className="flex-1 w-full p-4 bg-transparent resize-y outline-none border-0 text-sm font-mono leading-relaxed min-h-[350px] placeholder:text-muted-foreground/60"
          />
        ) : (
          <div className="p-6 overflow-y-auto max-h-[60vh] min-h-[350px] bg-background">
            {value.trim() ? (
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-20">
                Nothing to preview yet. Write some content in the editor tab.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
