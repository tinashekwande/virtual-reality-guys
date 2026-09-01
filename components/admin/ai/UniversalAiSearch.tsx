"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Sparkles, ArrowRight, Loader2, Calendar, FileText, User, Tag } from "lucide-react"
import Link from "next/link"

export function UniversalAiSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Hotkey listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Search execution with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/ai/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error("Search failed")
        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error("[UniversalAiSearch] Error:", err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <>
      {/* Top Navigation Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs text-muted-foreground transition-all cursor-pointer w-44 sm:w-64 justify-between"
      >
        <span className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="truncate">AI Business Search...</span>
        </span>
        <kbd className="hidden sm:inline-block text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="bg-card border border-primary/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-secondary/20">
              <Search className="w-4 h-4 text-primary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type natural query e.g. 'unpaid birthday invoices', 'schools', 'Natasha'..."
                className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <kbd className="text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border/30">
              {query && results.length === 0 && !loading && (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No business records found matching &quot;{query}&quot;.
                </div>
              )}

              {!query && (
                <div className="p-4 text-xs text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">💡 Try natural language queries:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>&quot;Unpaid invoices&quot;</li>
                    <li>&quot;Birthday parties above R1000&quot;</li>
                    <li>&quot;School events&quot;</li>
                    <li>&quot;Corporate activations&quot;</li>
                  </ul>
                </div>
              )}

              {results.map((res) => (
                <Link
                  key={res.id}
                  href={res.link}
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl hover:bg-secondary/40 transition-colors flex items-center justify-between gap-3 group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-secondary text-primary">
                      {res.type === "invoice" ? (
                        <FileText className="w-4 h-4" />
                      ) : res.type === "event" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {res.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{res.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {res.amount_zar !== undefined && (
                      <span className="text-xs font-bold text-foreground">
                        R{res.amount_zar.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        res.badge_color === "green"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : res.badge_color === "cyan"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          : res.badge_color === "purple"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {res.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
