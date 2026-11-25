"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Play, Users, ArrowRight } from "lucide-react"

export interface ServiceGame {
  id: string
  title: string
  image: string
  shortDesc: string
  category: string
  suitability: string
  playerMode?: string
  youtubeId?: string
}

const SHORT_CATEGORY: Record<string, string> = {
  "Fighting & Action Games": "Action",
  "Shooting Games": "Shooter",
  "Adventure & Thrill Rides": "Thrill Ride",
  "Sports & Fitness": "Sports & Rhythm",
  "Driving & Racing Simulation": "Racing",
  "Educational & Learning Experiences": "Educational",
  "Horror Experiences": "Horror",
}

const FALLBACK = "/images/vr-hero.jpg"

function shortSuitability(s: string): string {
  if (/^schools/i.test(s)) return "Schools"
  if (/^teens/i.test(s)) return "Teens & adults"
  return s.split("/")[0].trim()
}

/** A game tile that links to the game's catalogue page. Matches the catalogue card style. */
export default function ServiceGameCard({ game }: { game: ServiceGame }) {
  const imgRef = useRef<HTMLImageElement>(null)
  // An image that failed before hydration never fires React's onError, so check once mounted.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0 && !img.src.includes(FALLBACK)) img.src = FALLBACK
  }, [])
  const multiplayer = /multi|co-op|squad|arena/i.test(game.playerMode || "")
  return (
    <Link
      href={`/vr-games-catalogue/${game.id}`}
      className="group flex flex-col h-full bg-card/30 backdrop-blur-sm border border-border/60 hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full bg-secondary/20 overflow-hidden">
        <img
          ref={imgRef}
          src={game.image}
          alt={`${game.title} — VR game available at Virtual Reality Guys events`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            if (!e.currentTarget.src.includes(FALLBACK)) e.currentTarget.src = FALLBACK
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-full border border-primary/40 text-primary">
            {SHORT_CATEGORY[game.category] || game.category}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-full border border-white/20 text-white truncate">
            {shortSuitability(game.suitability)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          {multiplayer ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-black/70 rounded-full px-2 py-0.5">
              <Users className="h-3 w-3 text-primary" /> Multiplayer
            </span>
          ) : <span />}
          {game.youtubeId && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-black/80 border border-primary/40 rounded-full px-2 py-0.5">
              <Play className="h-2.5 w-2.5 fill-primary" /> Trailer
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-primary transition-colors">{game.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-grow">{game.shortDesc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
          See the experience <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
