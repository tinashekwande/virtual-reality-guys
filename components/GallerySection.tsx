"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Media, Category } from "@/types"

interface Props {
  media: Media[]
  categories: Category[]
  preview?: boolean
}

export default function GallerySection({ media, categories, preview = false }: Props) {
  const [activeCategory, setActiveCategory] = useState("all")

  // If no DB data, fallback to nothing (admin needs to upload)
  if (media.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Gallery coming soon — check back after our next event!</p>
      </div>
    )
  }

  const displayMedia = preview ? media.slice(0, 6) : media

  const filtered = activeCategory === "all"
    ? displayMedia
    : displayMedia.filter(m => m.category_id === activeCategory)

  return (
    <div>
      {/* Category filter tabs */}
      {!preview && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
          >All Events</button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
            >{c.name}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`relative group overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            {item.type === "video" ? (
              <video
                src={item.file_url}
                className="w-full h-full min-h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                muted
                loop
                playsInline
                onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                onMouseLeave={e => (e.target as HTMLVideoElement).pause()}
              />
            ) : (
              <Image
                src={item.file_url}
                alt={item.title ?? "VR Event"}
                width={i === 0 ? 800 : 400}
                height={i === 0 ? 600 : 300}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${i === 0 ? "min-h-[300px] lg:min-h-[500px]" : "min-h-[200px]"}`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
              <div>
                {item.title && <p className={`font-semibold ${i === 0 ? "text-lg" : "text-sm"}`}>{item.title}</p>}
                {(item as any).categories?.name && (
                  <p className="text-xs text-primary mt-1">{(item as any).categories.name}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Gallery CTA */}
      {preview && (
        <div className="flex justify-center mt-12">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 gap-2 group"
          >
            View Full Gallery
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  )
}
