"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, X, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileNav from "@/components/MobileNav"
import type { Media, Category } from "@/types"

interface Props {
  media: Media[]
  categories: Category[]
}

export default function GalleryPageClient({ media, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Filter media based on selected category
  const filteredMedia = activeCategory === "all"
    ? media
    : media.filter(m => m.category_id === activeCategory)

  // Next and Previous navigation for lightbox
  const showNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prevIndex) => 
      prevIndex !== null && prevIndex < filteredMedia.length - 1 ? prevIndex + 1 : 0
    )
  }, [lightboxIndex, filteredMedia.length])

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prevIndex) => 
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : filteredMedia.length - 1
    )
  }, [lightboxIndex, filteredMedia.length])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "ArrowRight") showNext()
      if (e.key === "ArrowLeft") showPrev()
      if (e.key === "Escape") closeLightbox()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, showNext, showPrev, closeLightbox])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-0">
              <div className="relative h-16 w-16 sm:h-18 sm:w-18">
                <Image
                  src="/images/logo.png"
                  alt="Virtual Reality Guyz logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">
                Virtual Reality <span className="text-primary">Guys</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/#experiences"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Experiences
              </Link>
              <Link
                href="/#packages"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Packages
              </Link>
              <Link
                href="/gallery"
                className="text-primary font-semibold transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/#contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="hidden md:block">
              <Button asChild size="lg">
                <Link href="/#contact">
                  Book Now
                </Link>
              </Button>
            </div>

            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Event Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Take a look at the future of event gaming. Real photos and videos capturing the immersion, thrill, and laughter from our recent events.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10 pb-4 border-b border-border/50">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card/40"
              }`}
            >
              All Events ({media.length})
            </button>
            {categories.map(c => {
              const count = media.filter(m => m.category_id === c.id).length
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === c.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card/40"
                  }`}
                >
                  {c.name} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-3xl bg-card/20">
            <p className="text-lg font-medium mb-2">No event media in this category yet</p>
            <p className="text-sm text-muted-foreground">Check back soon as we document more awesome VR gatherings!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className={`relative group overflow-hidden rounded-3xl cursor-pointer border border-border/30 shadow-lg transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20 bg-secondary/20 ${
                  i === 0 ? "md:col-span-2 md:row-span-2 min-h-[350px] lg:min-h-[500px]" : "min-h-[220px]"
                }`}
              >
                {item.type === "video" ? (
                  <div className="relative w-full h-full min-h-[220px]">
                    <video
                      src={item.file_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                      onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={e => (e.target as HTMLVideoElement).pause()}
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md p-2 rounded-full border border-border/30 text-primary shadow-md">
                      <Play className="h-4 w-4 fill-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full min-h-[220px]">
                    <img
                      src={item.file_url}
                      alt={item.title ?? "VR Event"}
                      className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title && (
                      <p className={`font-bold text-foreground truncate ${i === 0 ? "text-xl" : "text-base"}`}>
                        {item.title}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[90%]">
                        {item.description}
                      </p>
                    )}
                    {item.categories?.name && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mt-3">
                        {item.categories.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Premium Full-Screen Lightbox */}
      {lightboxIndex !== null && filteredMedia[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col justify-between items-center transition-all duration-300">
          
          {/* Lightbox Header */}
          <div className="w-full flex items-center justify-between px-6 py-4 z-[110] bg-gradient-to-b from-background to-transparent">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground bg-secondary/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/50">
              {lightboxIndex + 1} / {filteredMedia.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-3 bg-secondary/50 backdrop-blur-md rounded-full border border-border hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
              aria-label="Close Lightbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lightbox Media Container */}
          <div className="relative flex-1 w-full max-w-7xl px-4 flex items-center justify-center select-none group">
            {/* Prev Arrow */}
            <button
              onClick={showPrev}
              className="absolute left-6 p-4 rounded-full bg-secondary/40 backdrop-blur-md border border-border hover:bg-secondary/70 transition-all text-foreground hover:scale-105 hover:border-primary/30 z-[110] focus:outline-none focus:ring-2 focus:ring-primary opacity-80 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Current Slide */}
            <div className="w-full max-h-[70vh] flex items-center justify-center p-2 z-[105]">
              {filteredMedia[lightboxIndex].type === "video" ? (
                <video
                  src={filteredMedia[lightboxIndex].file_url}
                  className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-border/20 object-contain"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={filteredMedia[lightboxIndex].file_url}
                  alt={filteredMedia[lightboxIndex].title ?? "VR Event Gallery"}
                  className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-border/20 object-contain"
                />
              )}
            </div>

            {/* Next Arrow */}
            <button
              onClick={showNext}
              className="absolute right-6 p-4 rounded-full bg-secondary/40 backdrop-blur-md border border-border hover:bg-secondary/70 transition-all text-foreground hover:scale-105 hover:border-primary/30 z-[110] focus:outline-none focus:ring-2 focus:ring-primary opacity-80 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Footer / Caption */}
          <div className="w-full max-w-4xl px-6 pb-8 pt-4 z-[110] bg-gradient-to-t from-background via-background/80 to-transparent">
            <div className="bg-card/75 border border-border/50 backdrop-blur-md p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-accent" />
              <h2 className="text-xl font-bold text-foreground">
                {filteredMedia[lightboxIndex].title || "VR Event Capture"}
              </h2>
              {filteredMedia[lightboxIndex].description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
                  {filteredMedia[lightboxIndex].description}
                </p>
              )}
              {filteredMedia[lightboxIndex].categories?.name && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mt-4">
                  {filteredMedia[lightboxIndex].categories.name}
                </span>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
