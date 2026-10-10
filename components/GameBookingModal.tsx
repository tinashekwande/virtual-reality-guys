"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Gamepad2,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Game } from "@/lib/gamesData"

interface GameBookingModalProps {
  game: Game | null
  isOpen: boolean
  onClose: () => void
}

export default function GameBookingModal({ game, isOpen, onClose }: GameBookingModalProps) {
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [suburb, setSuburb] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventType, setEventType] = useState("birthday")
  const [guestsCount, setGuestsCount] = useState("6-10")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!mounted || !isOpen || !game) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    try {
      const payload = {
        name,
        email,
        phone,
        suburb,
        event_date: eventDate,
        form_type: "game_booking",
        game_id: game.id,
        game_title: game.title,
        message: `[Event Type: ${eventType}] [Estimated Players: ${guestsCount}] ${notes ? `[Notes: ${notes}]` : ""}`.trim()
      }

      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking request")
      }

      setStatus("success")
    } catch (err: any) {
      console.error("Booking error:", err)
      setErrorMsg(err.message || "Failed to submit booking. Please try WhatsApp or calling us directly.")
      setStatus("error")
    }
  }

  const handleResetAndClose = () => {
    setStatus("idle")
    setName("")
    setEmail("")
    setPhone("")
    setSuburb("")
    setEventDate("")
    setNotes("")
    onClose()
  }

  const whatsappMessage = encodeURIComponent(
    `Hi VR Guys! I'm interested in booking the "${game.title}" VR experience for my event on ${eventDate || "[date]"}. My name is ${name || "[name]"}.`
  )

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border border-primary/40 shadow-2xl shadow-primary/20 flex flex-col text-foreground animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-border/60 bg-secondary/30 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-primary/50 shadow-md flex-shrink-0 bg-secondary">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/vr-hero.jpg"
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Selected Game
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {game.category.split(" ")[0]}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-tech text-white mt-1">
                Book {game.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Mobile VR setup brought directly to your venue in Cape Town
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-secondary/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-grow">
          {status === "success" ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-tech text-white">
                  Booking Request Received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Awesome! We've received your request for <strong className="text-primary">{game.title}</strong>. Our team will verify headset availability for your date and send your customized quotation within a few hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-semibold text-white">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Date:</span>
                  <span className="font-semibold text-white">{eventDate || "To be confirmed"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suburb:</span>
                  <span className="font-semibold text-white">{suburb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Featured Game:</span>
                  <span className="font-semibold text-primary">{game.title}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/27717800323?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shadow-lg transition-all"
                >
                  <MessageSquare className="h-4 w-4 fill-black" />
                  Instant WhatsApp Confirmation
                </a>
                <Button 
                  variant="outline" 
                  onClick={handleResetAndClose}
                  className="rounded-xl border-border/60 hover:bg-secondary text-xs"
                >
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/40 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-background/60 border-border/70 rounded-xl text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-background/60 border-border/70 rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              {/* Phone & Suburb */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" /> WhatsApp / Phone *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="e.g. 071 780 0323"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-background/60 border-border/70 rounded-xl text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Suburb / Area in Cape Town *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Constantia, Sea Point, Bellville"
                    value={suburb}
                    onChange={e => setSuburb(e.target.value)}
                    className="bg-background/60 border-border/70 rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              {/* Date & Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Preferred Event Date *
                  </label>
                  <Input
                    required
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="bg-background/60 border-border/70 rounded-xl text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Event Type
                  </label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-background/60 border-border/70 rounded-xl text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="kids_party">Kids / Teen Party</SelectItem>
                      <SelectItem value="corporate">Corporate Team Building</SelectItem>
                      <SelectItem value="school">School / Educational Event</SelectItem>
                      <SelectItem value="festival">Festival / Brand Activation</SelectItem>
                      <SelectItem value="private">Private Family Gathering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Guests Count & Custom Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Estimated Players
                  </label>
                  <Select value={guestsCount} onValueChange={setGuestsCount}>
                    <SelectTrigger className="bg-background/60 border-border/70 rounded-xl text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">Up to 5 Players (Starter)</SelectItem>
                      <SelectItem value="6-10">6 - 10 Players (Standard)</SelectItem>
                      <SelectItem value="11-20">11 - 20 Players (Premium)</SelectItem>
                      <SelectItem value="20+">20+ Players (Large Event)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Gamepad2 className="h-3.5 w-3.5 text-primary" /> VR Headsets Setup
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-secondary/40 border border-border/60 flex items-center text-xs text-muted-foreground font-mono">
                    Meta Quest 3 + TV Casting
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" /> Special Requests or Additional Games
                </label>
                <Textarea
                  rows={2}
                  placeholder={`Mention other games you'd like (e.g. Beat Saber, Superhot) or event timing details...`}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="bg-background/60 border-border/70 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full h-11 rounded-xl bg-primary text-black font-bold font-tech text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Securing Experience...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-black" />
                      Request Booking for {game.title}
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  No payment required today. We check headset availability and send your official invoice/quote.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
