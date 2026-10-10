"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Gamepad2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function BookingFormInner() {
  const searchParams = useSearchParams()
  const gameParam = searchParams?.get("game") || ""

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [formType, setFormType] = useState(gameParam ? "birthday" : "contact")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const fd = new FormData(e.currentTarget)

    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      suburb: fd.get("suburb"),
      event_date: fd.get("event_date"),
      message: fd.get("message"),
      form_type: gameParam ? "game_booking" : formType,
      game_title: gameParam || undefined,
    }

    const res = await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setStatus("success")
      ;(e.target as HTMLFormElement).reset()
    } else {
      const d = await res.json()
      setErrorMsg(d.error ?? "Something went wrong")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-secondary rounded-2xl p-8 border border-border text-center space-y-3">
        <div className="text-4xl">🎮</div>
        <h3 className="font-bold text-xl">Request Sent!</h3>
        <p className="text-muted-foreground">We'll get back to you within 24 hours to discuss your VR experience.</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>Send Another</Button>
      </div>
    )
  }

  return (
    <div className="bg-secondary rounded-2xl p-8 border border-border space-y-4">
      {gameParam && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-purple-400" />
            <span>Selected Experience: <strong className="text-white">{gameParam}</strong></span>
          </div>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
            Direct Game Lead
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input id="name" name="name" placeholder="Your name" className="bg-background" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" className="bg-background" required />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <Input id="phone" name="phone" type="tel" placeholder="+27 71 000 0000" className="bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="suburb" className="text-sm font-medium">Suburb / Area</label>
            <Input id="suburb" name="suburb" placeholder="e.g. Camps Bay, Durbanville, Somerset West..." className="bg-background" required />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="event-type" className="text-sm font-medium">Event Type</label>
            <Select value={formType} onValueChange={setFormType}>
              <SelectTrigger id="event-type" className="bg-background" aria-label="Event Type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="school">School Event</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="contact">Other / General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="event_date" className="text-sm font-medium">Event Date</label>
            <Input
              id="event_date"
              name="event_date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="bg-background text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">Tell us about your event</label>
          <Textarea id="message" name="message" placeholder="Number of guests, venue location, special requirements..." rows={4} className="bg-background" required />
        </div>
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
        <CyberButton
          type="submit"
          size="full"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            "Sending…"
          ) : (
            <>
              <span>Book Your VR Experience</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </CyberButton>
      </form>
    </div>
  )
}

export default function BookingForm() {
  return (
    <Suspense fallback={
      <div className="bg-secondary rounded-2xl p-8 border border-border text-center space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        <p className="text-xs text-muted-foreground">Loading booking form...</p>
      </div>
    }>
      <BookingFormInner />
    </Suspense>
  )
}
