"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Play, 
  Film, 
  Star, 
  Share2, 
  Check, 
  CalendarCheck, 
  MessageSquare, 
  ShieldCheck, 
  Tv, 
  Headphones, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Gamepad2, 
  Ghost, 
  Swords, 
  Car, 
  Compass, 
  Target, 
  Dumbbell, 
  GraduationCap, 
  Activity, 
  Info,
  Layers,
  ChevronRight,
  Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import GameBookingModal from "@/components/GameBookingModal"
import type { Game } from "@/lib/gamesData"

interface GamePageClientProps {
  game: Game
  relatedGames: Game[]
  moreGames: Game[]
}

// Category Icons Mapper
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Horror Experiences":
      return <Ghost className="h-4 w-4 text-purple-400" />
    case "Fighting & Action Games":
      return <Swords className="h-4 w-4 text-rose-400" />
    case "Driving & Racing Simulation":
      return <Car className="h-4 w-4 text-amber-400" />
    case "Adventure & Thrill Rides":
      return <Compass className="h-4 w-4 text-emerald-400" />
    case "Shooting Games":
      return <Target className="h-4 w-4 text-cyan-400" />
    case "Sports & Fitness":
      return <Dumbbell className="h-4 w-4 text-yellow-400" />
    case "Educational & Learning Experiences":
      return <GraduationCap className="h-4 w-4 text-blue-400" />
    default:
      return <Activity className="h-4 w-4 text-primary" />
  }
}

export default function GamePageClient({ game, relatedGames, moreGames }: GamePageClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hi VR Guys! I was looking at "${game.title}" on your website and would love to book this experience for an event. Could you let me know availability?`
  )

  const allScreenshots = [
    game.image,
    ...(game.galleryImages || [])
  ].filter((src, idx, arr) => arr.indexOf(src) === idx)

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      
      {/* Top Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-border/40 bg-secondary/20 backdrop-blur-md sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/vr-games-catalogue" className="hover:text-primary transition-colors">VR Games</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground font-semibold truncate">{game.title}</span>
          </div>

          <Link 
            href="/vr-games-catalogue"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-white transition-colors flex-shrink-0 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All 60+ Games</span>
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
        
        {/* Play Store Hero Header */}
        <section className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Cyber Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* App Icon / Poster */}
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/20 flex-shrink-0 bg-secondary">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/vr-hero.jpg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* App Meta & Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
                    {getCategoryIcon(game.category)}
                    {game.category}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border font-medium">
                    {game.suitability}
                  </span>
                  {game.comfortRating && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-purple-300 border border-purple-500/30 font-medium">
                      {game.comfortRating} Comfort
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-tech text-white tracking-wide">
                  {game.title}
                </h1>

                {/* Developer with Verified check */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
                  <span className="font-semibold text-foreground">{game.developer || "Meta Horizon VR Studios"}</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <span>Meta Quest 3 Experience</span>
                </div>
              </div>

              {/* Play Store Metric Badges Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-2 border-y border-border/40 text-xs sm:text-sm">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="font-bold text-white ml-1 text-sm">4.9</span>
                  </div>
                  <span className="text-muted-foreground text-xs">(140+ reviews)</span>
                </div>

                {/* Players */}
                <div className="border-l border-border/40 pl-4 sm:pl-6 flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{game.playerMode || "Single & Multiplayer"}</span>
                </div>

                {/* Play Style */}
                <div className="border-l border-border/40 pl-4 sm:pl-6 flex items-center gap-1.5 text-muted-foreground">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-foreground">{game.playStyle}</span>
                </div>

                {/* Difficulty */}
                <div className="border-l border-border/40 pl-4 sm:pl-6 flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Diff: {["Easy", "Medium", "Challenging", "Hard", "Expert"][game.difficulty - 1] || "Medium"}
                  </span>
                </div>
              </div>

              {/* Short Hook */}
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {game.shortDesc}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button 
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                  className="rounded-2xl h-12 px-7 bg-primary text-black font-black font-tech text-base shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
                >
                  <CalendarCheck className="h-5 w-5 fill-black" />
                  Book Experience
                </Button>

                <a
                  href={`https://wa.me/27717800323?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm transition-all"
                >
                  <MessageSquare className="h-4 w-4 fill-emerald-400" />
                  Inquire on WhatsApp
                </a>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="h-12 px-4 rounded-2xl border-border/70 hover:bg-secondary text-muted-foreground hover:text-white text-xs gap-1.5"
                  title="Share game page"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Media Carousel & HD Trailer Player */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-tech text-white flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              Gameplay Trailer & Screenshots
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              Meta Quest Captured Gameplay
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Trailer / Active Media Player (takes 7 cols on large) */}
            <div className="lg:col-span-8 bg-card border border-border/70 rounded-3xl overflow-hidden shadow-2xl relative aspect-video bg-black flex items-center justify-center">
              {game.youtubeId ? (
                isPlayingTrailer ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${game.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={`${game.title} Gameplay Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div 
                    onClick={() => setIsPlayingTrailer(true)}
                    className="relative w-full h-full cursor-pointer group flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${game.youtubeId}/hqdefault.jpg`}
                      alt={`${game.title} Trailer Preview`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                      onError={(e) => {
                        e.currentTarget.src = game.image
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Glowing Play Icon */}
                    <div className="absolute z-10 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_35px_rgba(0,210,255,0.7)] group-hover:scale-110 group-hover:shadow-[0_0_45px_rgba(0,210,255,1)] transition-all duration-300">
                        <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-black ml-1" />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider px-3.5 py-1.5 bg-black/70 rounded-full border border-white/20 backdrop-blur-md">
                        Watch Official VR Trailer
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/85 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white font-medium flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      4K Meta Quest 3 In-Game Footage
                    </div>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground font-mono">High Quality VR Visuals</p>
                  </div>
                </div>
              )}
            </div>

            {/* Screenshots Thumbnails Grid (takes 4 cols on large) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                In-Game Snapshots
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto max-h-[380px] pr-1">
                {allScreenshots.map((src, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveScreenshot(src)}
                    className="group relative h-28 lg:h-28 rounded-2xl overflow-hidden border border-border/70 hover:border-primary/60 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                  >
                    <img 
                      src={src} 
                      alt={`${game.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/vr-hero.jpg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-2 right-2 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Content: Detailed About + Technical Specs Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Description & Highlights (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Section */}
            <section className="bg-card/30 border border-border/60 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-tech text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About This Experience
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {game.longDesc}
              </p>

              {/* Key Features Bullet List */}
              {game.features && game.features.length > 0 && (
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Key Gameplay Highlights:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {game.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-secondary/30 border border-border/40 text-xs sm:text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="pt-4 border-t border-border/40 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gameplay Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium text-foreground hover:border-primary/50 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Book with VR Guys */}
            <section className="bg-card/20 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-primary tracking-widest">
                  Turnkey Mobile Experience
                </span>
                <h2 className="text-2xl font-bold font-tech text-white">
                  Why Book {game.title} with Virtual Reality Guys?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Headphones className="h-4 w-4" /> Meta Quest 3 Hardware
                  </div>
                  <p className="text-muted-foreground">
                    Crystal-clear 4K pancake lenses and spatial audio bring this world to life without tangled PC wires.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Tv className="h-4 w-4" /> Live TV Spectator Casting
                  </div>
                  <p className="text-muted-foreground">
                    We cast the player's headset view onto large TVs so spectators, friends, and family can watch the gameplay live.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Users className="h-4 w-4" /> Dedicated Game Masters
                  </div>
                  <p className="text-muted-foreground">
                    Our trained VR supervisors guide each player into the headset, explain the controls, and ensure everyone has fun.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <ShieldCheck className="h-4 w-4" /> 100% Sanitized & Safe
                  </div>
                  <p className="text-muted-foreground">
                    Silicone hygiene covers, medical alcohol wipes, and calibrated safety boundary zones ensure peace of mind.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Google Play Store Technical Specs Matrix (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card/40 border border-border/60 rounded-3xl p-6 shadow-xl space-y-5">
              <h3 className="text-lg font-bold font-tech text-white flex items-center gap-2 border-b border-border/40 pb-3">
                <Layers className="h-4 w-4 text-primary" />
                Technical Information
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-semibold text-foreground text-right">{game.developer || "Meta Studios"}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Publisher</span>
                  <span className="font-semibold text-foreground text-right">{game.publisher || game.developer || "Independent"}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground text-right">{game.category}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Play Style</span>
                  <span className="font-semibold text-foreground text-right">{game.playStyle}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Comfort Rating</span>
                  <span className="font-semibold text-purple-300 text-right">{game.comfortRating || "Moderate"}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Controllers</span>
                  <span className="font-semibold text-foreground text-right">{game.controllers || "Touch Controllers"}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Player Mode</span>
                  <span className="font-semibold text-foreground text-right">{game.playerMode || "Single / Multi"}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Age Suitability</span>
                  <span className="font-semibold text-foreground text-right">{game.suitability}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Difficulty (1-5)</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < game.difficulty ? 'text-primary fill-primary' : 'text-muted/30'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-muted-foreground">VR Headsets</span>
                  <span className="font-semibold text-cyan-400 text-right">Meta Quest 2 & 3</span>
                </div>
              </div>

              {/* Book Button in Specs Box */}
              <div className="pt-2">
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full h-11 rounded-2xl bg-primary text-black font-bold font-tech text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                  <CalendarCheck className="h-4 w-4 mr-2 fill-black" />
                  Book This Experience
                </Button>
              </div>
            </div>

            {/* Quick Pricing Card */}
            <div className="bg-gradient-to-br from-secondary/40 to-primary/10 border border-primary/30 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                Turnkey Event Pricing
              </span>
              <h4 className="text-lg font-bold font-tech text-white">
                Book for Parties & Events
              </h4>
              <p className="text-xs text-muted-foreground">
                Pricing starts from just <strong className="text-white">R899</strong> for 2-hour starter packages with headsets, game library, TV casting, and full staff supervision.
              </p>
              <Link 
                href="/pricing"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View all VR package packages <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Related Games (Same category / tags) */}
        {relatedGames.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Similar Experiences
                </span>
                <h2 className="text-2xl font-bold font-tech text-white mt-0.5">
                  Related Games in {game.category.split(" ")[0]}
                </h2>
              </div>
              <Link 
                href="/vr-games-catalogue" 
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all catalogue <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedGames.map(rel => (
                <Link
                  key={rel.id}
                  href={`/vr-games-catalogue/${rel.id}`}
                  className="group bg-card/30 border border-border/60 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
                >
                  <div className="relative h-36 w-full bg-secondary/30 overflow-hidden">
                    <img 
                      src={rel.image} 
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/images/vr-hero.jpg"
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-bold text-primary border border-primary/40">
                      {rel.category.split(" ")[0]}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-grow">
                      {rel.shortDesc}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{rel.suitability.split(" ")[0]}</span>
                      <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More Popular Experiences (Cross-category highlights) */}
        {moreGames.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Community Favorites
                </span>
                <h2 className="text-2xl font-bold font-tech text-white mt-0.5">
                  More Popular VR Games
                </h2>
              </div>
              <Link 
                href="/vr-games-catalogue" 
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Browse All Games <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {moreGames.map(mg => (
                <Link
                  key={mg.id}
                  href={`/vr-games-catalogue/${mg.id}`}
                  className="group bg-card/30 border border-border/60 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
                >
                  <div className="relative h-36 w-full bg-secondary/30 overflow-hidden">
                    <img 
                      src={mg.image} 
                      alt={mg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/images/vr-hero.jpg"
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-bold text-white border border-white/20">
                      {mg.category.split(" ")[0]}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {mg.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-grow">
                      {mg.shortDesc}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{mg.playStyle.split("/")[0]}</span>
                      <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                        View Page →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Mobile Bottom Booking Bar */}
      <aside aria-label="Quick booking actions" className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-primary/30 p-3 sm:p-4 lg:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/40 flex-shrink-0 bg-secondary">
            <img 
              src={game.image} 
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/vr-hero.jpg"
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{game.title}</p>
            <p className="text-[10px] text-primary truncate">From R899 • Mobile Setup</p>
          </div>
        </div>

        <Button
          onClick={() => setIsBookingOpen(true)}
          className="rounded-xl h-10 px-5 bg-primary text-black font-bold font-tech text-xs shadow-md shadow-primary/30 flex-shrink-0"
        >
          <CalendarCheck className="h-4 w-4 mr-1.5 fill-black" />
          Book Now
        </Button>
      </aside>

      {/* Booking Modal */}
      <GameBookingModal
        game={game}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Screenshot Lightbox Modal */}
      {activeScreenshot && (
        <div 
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveScreenshot(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img 
              src={activeScreenshot} 
              alt="Enlarged screenshot" 
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

    </div>
  )
}
