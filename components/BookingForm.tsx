"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [formType, setFormType] = useState("contact")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const fd = new FormData(e.currentTarget)

    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      event_date: fd.get("event_date"),
      message: fd.get("message"),
      form_type: formType,
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
    <div className="bg-secondary rounded-2xl p-8 border border-border">
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
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <Input id="phone" name="phone" type="tel" placeholder="+27 71 000 0000" className="bg-background" />
          </div>
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
        <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : <><span>Book Your VR Experience</span><ArrowRight className="ml-2 h-5 w-5" /></>}
        </Button>
      </form>
    </div>
  )
}
