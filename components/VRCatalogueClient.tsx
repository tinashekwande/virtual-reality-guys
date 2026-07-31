"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Search, 
  Ghost, 
  Swords, 
  Car, 
  Compass, 
  Target, 
  Dumbbell, 
  GraduationCap, 
  Users, 
  Activity, 
  Zap, 
  Printer, 
  X, 
  Check, 
  ChevronRight, 
  CalendarCheck,
  Star,
  Gamepad,
  Info,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { gamesData, Game } from "@/lib/gamesData"

// Category Icons Mapper
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Horror Experiences":
      return <Ghost className="h-4 w-4" />
    case "Fighting & Action Games":
      return <Swords className="h-4 w-4" />
    case "Driving & Racing Simulation":
      return <Car className="h-4 w-4" />
    case "Adventure & Thrill Rides":
      return <Compass className="h-4 w-4" />
    case "Shooting Games":
      return <Target className="h-4 w-4" />
    case "Sports & Fitness":
      return <Dumbbell className="h-4 w-4" />
    case "Educational & Learning Experiences":
      return <GraduationCap className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

// Category Label Miniaturizer
const getShortCategory = (category: string) => {
  return category.split(" ")[0]
}

export default function VRCatalogueClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  // Filter and Search Logic
  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesCategory = activeCategory === "all" || game.category === activeCategory
      
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        game.title.toLowerCase().includes(query) ||
        game.shortDesc.toLowerCase().includes(query) ||
        game.actionType.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  // Category Configuration
  const categories = [
    { id: "all", label: "All Experiences", icon: <Activity className="h-4 w-4" /> },
    { id: "Horror Experiences", label: "👻 Horror", icon: <Ghost className="h-4 w-4" /> },
    { id: "Fighting & Action Games", label: "🥊 Fighting & Action", icon: <Swords className="h-4 w-4" /> },
    { id: "Driving & Racing Simulation", label: "🏎️ Driving & Racing", icon: <Car className="h-4 w-4" /> },
    { id: "Adventure & Thrill Rides", label: "🎢 Adventure & Thrill", icon: <Compass className="h-4 w-4" /> },
    { id: "Shooting Games", label: "🔫 Shooting", icon: <Target className="h-4 w-4" /> },
    { id: "Sports & Fitness", label: "⚽ Sports & Fitness", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "Educational & Learning Experiences", label: "🌍 Educational", icon: <GraduationCap className="h-4 w-4" /> },
  ]

  // Event List
  const perfectForEvents = [
    "Birthday Parties",
    "School Events",
    "Corporate Team Building",
    "Church Events",
    "Community Gatherings",
    "Shopping Malls",
    "Exhibitions & Festivals"
  ]

  // Print function
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full relative min-h-screen pt-24 pb-16">
      {/* Neon Floating Ambient Background Orbs */}
      <div className="absolute top-20 left-[10%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse duration-[8000ms] print:hidden" />
      <div className="absolute bottom-40 right-[10%] w-[350px] h-[350px] rounded-full bg-accent/20 blur-[120px] pointer-events-none animate-pulse duration-[10000ms] print:hidden" />

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header / Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 print:mb-8">
          <p className="text-primary font-semibold tracking-wide uppercase mb-4 print:hidden">
            VR Library
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 font-tech tracking-tight text-white uppercase bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent print:text-black print:text-3xl">
            Games & Experiences
          </h1>
          <p className="text-lg text-muted-foreground print:text-slate-700">
            Step into another world! We bring state-of-the-art mobile virtual reality setups to your venue, pre-loaded with these world-class games and interactive experiences.
          </p>
          
          {/* Header Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 print:hidden">
            <a href="#catalogue" className="px-6 py-3 rounded-xl font-bold bg-primary text-black hover:shadow-lg hover:shadow-primary/30 transition-all">
              Explore Games
            </a>
            <Button onClick={handlePrint} variant="outline" className="px-6 py-3 rounded-xl border-border/80 hover:bg-secondary">
              <Printer className="mr-2 h-4 w-4" /> Save PDF Catalogue
            </Button>
            <Link href="/contact" className="px-6 py-3 rounded-xl font-bold border border-primary/40 hover:border-primary text-primary hover:bg-primary/5 transition-all">
              Book Event Now
            </Link>
          </div>
        </div>

        {/* Dynamic Catalogue Controls (Search and Filters) */}
        <section id="catalogue" className="mb-12 print:hidden">
          <div className="bg-card/45 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by game name, keywords, or gameplay tags (e.g. rhythm, horror)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all text-sm sm:text-base"
              />
            </div>
            
            {/* Filter Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-300 cursor-pointer ${
                    activeCategory === category.id
                      ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/25"
                      : "bg-background/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {category.icon}
                  <span>{category.label.replace(/^[^\s]+\s+/, "")}</span>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* PRINT ONLY CATEGORY SPLIT */}
        <div className="hidden print:block space-y-8">
          <p className="text-xs text-slate-500 mb-6 border-b pb-2">
            Virtual Reality Guys • Email: info@virtualrealityguyz.co.za • Tel: 081 765 6431
          </p>
        </div>

        {/* Dynamic Card Grid */}
        <section className="mb-16">
          {filteredGames.length === 0 ? (
            <div className="text-center py-20 bg-card/20 border border-border/40 rounded-3xl">
              <Ghost className="h-16 w-16 mx-auto text-muted-foreground animate-bounce mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Cyber Matches Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try refining your search query or choosing a different category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <article
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="bg-card/30 backdrop-blur-sm border border-border/60 hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 cursor-pointer flex flex-col h-full group print:border-slate-300 print:shadow-none print:break-inside-avoid print:bg-white"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full bg-secondary/20 overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 print:grayscale"
                      loading="lazy"
                    />
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center print:hidden">
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-primary">
                        {getCategoryIcon(game.category)}
                        {getShortCategory(game.category)}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-white">
                        {game.suitability.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors print:text-black">
                      {game.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-grow mb-4 line-clamp-3 print:text-slate-800 print:line-clamp-none">
                      {game.shortDesc}
                    </p>
                    
                    {/* Specs Bottom */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/40 text-[11px] text-muted-foreground print:text-slate-600 print:border-slate-200">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {game.playStyle.split("/")[0]}
                      </span>
                      
                      {/* Difficulty stars */}
                      <span className="flex gap-0.5 items-center">
                        <span className="mr-1">Diff:</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-2.5 w-2.5 ${i < game.difficulty ? 'text-primary fill-primary print:text-slate-800 print:fill-slate-800' : 'text-muted/40'}`} 
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Perfect For Events Grid */}
        <section className="py-16 bg-card/20 border border-border/40 rounded-3xl p-8 text-center space-y-8 mb-16 print:border-slate-300 print:bg-slate-50 print:break-inside-avoid">
          <h2 className="text-2xl font-bold font-tech uppercase text-white tracking-wide print:text-black">
            Perfect For <span className="text-primary print:text-slate-800">Your Event</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {perfectForEvents.map(event => (
              <span 
                key={event} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background/50 border border-border/80 text-sm font-semibold text-foreground print:bg-white print:border-slate-300 print:text-slate-800"
              >
                <Check className="h-4 w-4 text-primary print:text-slate-700" />
                {event}
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* Dynamic Pop-up Detail Modal Overlay */}
      {selectedGame && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in print:hidden"
          onClick={() => setSelectedGame(null)}
        >
          <div 
            className="bg-card border border-border/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image banner */}
            <div className="relative h-48 sm:h-64 w-full bg-secondary/10 flex-shrink-0">
              <img 
                src={selectedGame.image} 
                alt={selectedGame.title} 
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-all border border-white/10"
                aria-label="Close details popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable to fit any height */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Header Info */}
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {getCategoryIcon(selectedGame.category)}
                  {selectedGame.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedGame.title}
                </h2>
                {selectedGame.developer && (
                  <p className="text-xs text-muted-foreground font-medium">
                    Developed by <span className="text-primary/95">{selectedGame.developer}</span>
                    {selectedGame.publisher && ` • Published by ${selectedGame.publisher}`}
                  </p>
                )}
              </div>

              {/* Meta Horizon Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-secondary/10 border border-border/40 rounded-2xl p-4">
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Activity className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Comfort</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedGame.comfortRating || "Moderate"}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-border/20 max-sm:border-l-0">
                  <Users className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Players</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedGame.playerMode || "Single User"}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-border/20 max-sm:border-l-0">
                  <Gamepad className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Input</span>
                  <span className="text-xs font-bold text-white mt-0.5 truncate max-w-full" title={selectedGame.controllers}>
                    {selectedGame.controllers || "Touch"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-border/20">
                  <Shield className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Space Req.</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedGame.spaceRequired || "1.5 GB"}</span>
                </div>
              </div>

              {/* Long Description */}
              <div className="space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                  <Info className="h-3 w-3" /> About This Experience
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {selectedGame.longDesc}
                </p>
              </div>

              {/* Bullet Features (Meta style highlights) */}
              {selectedGame.features && selectedGame.features.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Key Highlights & Features</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {selectedGame.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-border/40 text-xs">
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-muted-foreground">Action Type</span>
                  <span className="font-semibold text-white">{selectedGame.actionType}</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-muted-foreground">Play Style</span>
                  <span className="font-semibold text-white">{selectedGame.playStyle}</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-semibold text-white">
                    {["Easy", "Medium", "Hard", "Very Hard", "Extreme"][selectedGame.difficulty - 1] || "Medium"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-muted-foreground">Age Suitability</span>
                  <span className="font-semibold text-white">{selectedGame.suitability}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-secondary/40 border border-border/40 text-white font-medium hover:border-primary/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions - Sticky bottom */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-6 border-t border-border/40 bg-card/90 backdrop-blur-md flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                Rated: <strong className="text-white">{selectedGame.suitability}</strong>
              </span>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedGame(null)} className="rounded-xl border-border/80 hover:bg-secondary">
                  Close
                </Button>
                <Button asChild className="rounded-xl font-bold bg-primary text-black hover:shadow-lg hover:shadow-primary/30">
                  <Link href={`/contact?game=${encodeURIComponent(selectedGame.title)}`}>
                    <CalendarCheck className="mr-2 h-4.5 w-4.5" /> Book Experience
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
