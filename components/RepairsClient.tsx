"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Search, Wrench, Gamepad2, Glasses, Zap, X, CheckCircle2, MapPin,
  ShieldCheck, Timer, MessageCircle, Mail, ChevronRight,
} from "lucide-react"
import {
  repairsData, repairDevices, toZar, formatZar, fromPriceZar,
  type Repair, type RepairVariant,
} from "@/lib/repairsData"

const WHATSAPP = "27717800323"
const EMAIL = "bookings@virtualrealityguyz.co.za"

type Sort = "featured" | "price-asc" | "price-desc" | "az" | "za"
type Stock = "all" | "in" | "out"

const kindIcon = (kind: Repair["kind"]) =>
  kind === "Controller" ? <Gamepad2 className="h-7 w-7" /> :
  kind === "Service" ? <Zap className="h-7 w-7" /> : <Glasses className="h-7 w-7" />

function requestText(r: Repair, v?: RepairVariant) {
  const opt = v && r.variants.length > 1 ? ` — ${v.name}` : ""
  const price = v ? ` (${formatZar(toZar(v.usd))})` : ""
  return `Hi VR Guys, I'd like a repair: ${r.title}${opt}${price}. My device issue is: `
}

export default function RepairsClient() {
  const [device, setDevice] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>("featured")
  const [stock, setStock] = useState<Stock>("all")
  const [selected, setSelected] = useState<Repair | null>(null)
  const [variantIdx, setVariantIdx] = useState(0)

  useEffect(() => {
    if (!selected) return
    setVariantIdx(0)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [selected])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: repairsData.length }
    repairsData.forEach((r) => (c[r.device] = (c[r.device] || 0) + 1))
    return c
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const list = repairsData.filter((r) =>
      (device === "all" || r.device === device) &&
      (stock === "all" || (stock === "in" ? r.inStock : !r.inStock)) &&
      (!q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) ||
        r.variants.some((v) => v.name.toLowerCase().includes(q)))
    )
    const sorted = [...list]
    if (sort === "price-asc") sorted.sort((a, b) => fromPriceZar(a) - fromPriceZar(b))
    if (sort === "price-desc") sorted.sort((a, b) => fromPriceZar(b) - fromPriceZar(a))
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === "za") sorted.sort((a, b) => b.title.localeCompare(a.title))
    return sorted
  }, [device, query, sort, stock])

  const inStockCount = repairsData.filter((r) => r.inStock).length
  const highest = Math.max(...repairsData.flatMap((r) => r.variants.map((v) => toZar(v.usd))))
  const v = selected?.variants[variantIdx]

  return (
    <div className="w-full relative pt-24 pb-16">
      <div className="absolute top-20 left-[10%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-40 right-[10%] w-[350px] h-[350px] rounded-full bg-accent/20 blur-[120px] pointer-events-none animate-pulse duration-[10000ms]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="inline h-3 w-3 mx-1" />
          <span className="text-foreground">All Repairs</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase mb-4">VR Repairs</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 font-tech tracking-tight text-white uppercase bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent">
            All Repairs
          </h1>
          <p className="text-lg text-muted-foreground">
            Every repair service we offer for VR headsets and controllers — Meta Quest 1, 2, 3, 3S and Pro,
            PlayStation VR2 and Valve Index. Tell us what&apos;s wrong and you&apos;ll approve the exact price before
            any work starts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#repairs" className="px-6 py-3 rounded-xl font-bold bg-primary text-black hover:shadow-lg hover:shadow-primary/30 transition-all">
              Browse Repairs
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi VR Guys, I'd like to start a repair. My device is: ")}`}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-bold border border-primary/40 hover:border-primary text-primary hover:bg-primary/5 transition-all"
            >
              Start a Repair
            </a>
          </div>
        </div>

        {/* Controls */}
        <section id="repairs" className="mb-10 scroll-mt-28">
          <div className="bg-card/45 backdrop-blur-md border border-border/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repairs (e.g. charge port, joystick, Quest 3)..."
                aria-label="Search repairs"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {["all", ...repairDevices].map((d) => (
                <button
                  key={d} onClick={() => setDevice(d)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    device === d
                      ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/25"
                      : "bg-background/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {d === "all" ? "All repairs" : d} <span className="opacity-60">({counts[d] || 0})</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">Availability:</span>
                {([["all", `All (${repairsData.length})`], ["in", `In stock (${inStockCount})`], ["out", `Out of stock (${repairsData.length - inStockCount})`]] as [Stock, string][]).map(([k, label]) => (
                  <button
                    key={k} onClick={() => setStock(k)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      stock === k ? "border-primary text-primary bg-primary/10" : "border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <span className="text-muted-foreground">Sort by</span>
                <select
                  value={sort} onChange={(e) => setSort(e.target.value as Sort)}
                  className="bg-background/60 border border-border/80 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                  <option value="az">Alphabetically, A–Z</option>
                  <option value="za">Alphabetically, Z–A</option>
                </select>
              </label>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {filtered.length} {filtered.length === 1 ? "repair" : "repairs"} · prices from {formatZar(Math.min(...repairsData.map(fromPriceZar)))} up to {formatZar(highest)}
          </p>
        </section>

        {/* Grid */}
        <section className="mb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card/20 border border-border/40 rounded-3xl">
              <Wrench className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No repairs match</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Try a different search or device filter — or message us and we&apos;ll diagnose it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((r) => (
                <article
                  key={r.id} onClick={() => setSelected(r)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(r))}
                  tabIndex={0} role="button" aria-label={`${r.title}, from ${formatZar(fromPriceZar(r))}`}
                  className="bg-card/30 backdrop-blur-sm border border-border/60 hover:border-primary/50 rounded-3xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer flex flex-col h-full group focus:outline-none focus-visible:border-primary"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
                      {kindIcon(r.kind)}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black/60 rounded-full border border-primary/40 text-primary">
                      {r.device}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-grow mb-4 line-clamp-3">{r.desc}</p>
                  <div className="flex items-end justify-between pt-4 border-t border-border/40">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {r.variants.length > 1 ? "From" : "Price"}
                      </p>
                      <p className="text-xl font-extrabold text-white font-tech">{formatZar(fromPriceZar(r))}</p>
                    </div>
                    <span className={`text-[11px] font-semibold ${r.inStock ? "text-primary" : "text-muted-foreground"}`}>
                      {r.inStock ? (r.variants.length > 1 ? `${r.variants.length} options` : "In stock") : "Out of stock"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-tech uppercase tracking-tight text-white mb-3">
              Rather have us <span className="text-primary">fix it for you?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              No surprises. Send us a repair request, describe what&apos;s happening, and approve the exact price before we start.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["1", "Request a repair", "Message us on WhatsApp or email with your device and the fault."],
              ["2", "Approve the price", "We confirm the repair and the exact cost — nothing starts until you say yes."],
              ["3", "Get back in the game", "We fix it and let you know as soon as it's ready."],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-card/40 border border-border/60 rounded-2xl p-6">
                <span className="text-primary font-tech text-3xl font-bold">{n}</span>
                <h3 className="text-base font-semibold text-white mt-2 mb-1">{t}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi VR Guys, I'd like to start a repair. My device is: ")}`}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-bold bg-primary text-black hover:shadow-lg hover:shadow-primary/30 transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" /> Start a repair request
            </a>
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Repair request")}`}
              className="px-6 py-3 rounded-xl font-bold border border-primary/40 hover:border-primary text-primary hover:bg-primary/5 transition-all inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email us
            </a>
          </div>
        </section>

        {/* Trust strip — neutral promises only */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [<CheckCircle2 key="a" className="h-6 w-6" />, "No surprises", "You approve the price first"],
            [<Glasses key="b" className="h-6 w-6" />, "Headsets & controllers", "Quest, PSVR2 & Valve Index"],
            [<Timer key="c" className="h-6 w-6" />, "Priority option", "Jump the queue when you need it"],
            [<MapPin key="d" className="h-6 w-6" />, "Cape Town based", "Talk to a real person"],
          ].map(([icon, t, d], i) => (
            <div key={i} className="bg-card/40 border border-border/60 rounded-2xl p-5 text-center">
              <span className="text-primary inline-flex mb-2">{icon}</span>
              <p className="text-sm font-bold uppercase tracking-wide text-white">{t}</p>
              <p className="text-xs text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </section>
        <p className="text-center text-[11px] text-muted-foreground mt-6 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Prices in rand (ZAR). Final price confirmed with you before any work begins.
        </p>
      </div>

      {/* Detail modal */}
      {selected && v && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={selected.title}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <button onClick={() => setSelected(null)} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-primary/40 text-primary">{selected.device}</span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-2 pr-8">{selected.title}</h2>
            <p className="text-sm text-muted-foreground mb-5">{selected.desc}</p>

            {selected.variants.length > 1 && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Choose an option</p>
                <div className="grid grid-cols-1 gap-2">
                  {selected.variants.map((opt, i) => (
                    <button
                      key={opt.name} onClick={() => setVariantIdx(i)}
                      className={`flex justify-between items-center px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        i === variantIdx ? "border-primary bg-primary/10 text-white" : "border-border/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{opt.name}</span>
                      <span className="font-bold">{formatZar(toZar(opt.usd))}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end justify-between border-t border-border/50 pt-4 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                <p className="text-3xl font-extrabold text-white font-tech">{formatZar(toZar(v.usd))}</p>
              </div>
              <span className={`text-xs font-semibold ${selected.inStock ? "text-primary" : "text-muted-foreground"}`}>
                {selected.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(requestText(selected, v))}`}
                target="_blank" rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl font-bold bg-primary text-black text-center inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <MessageCircle className="h-4 w-4" /> {selected.inStock ? "Request on WhatsApp" : "Ask about availability"}
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Repair request: ${selected.title}`)}&body=${encodeURIComponent(requestText(selected, v))}`}
                className="px-4 py-3 rounded-xl font-bold border border-primary/40 text-primary text-center inline-flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
              >
                <Mail className="h-4 w-4" /> Email request
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 text-center">You&apos;ll approve the final price before any work starts.</p>
          </div>
        </div>
      )}
    </div>
  )
}
