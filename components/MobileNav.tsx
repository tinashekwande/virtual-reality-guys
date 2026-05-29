"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/virtual-reality-cape-town", label: "Cape Town VR" },
  { href: "/vr-team-building", label: "Team Building" },
  { href: "/corporate-events", label: "Corporate Events" },
  { href: "/kids-parties", label: "Kids Parties" },
  { href: "/birthday-party-activities", label: "Birthday Parties" },
  { href: "/family-fun-day-experiences", label: "Family Fun Days" },
  { href: "/school-vr-demonstrations", label: "School VR" },
  { href: "/mobile-vr-hire", label: "Mobile VR Hire" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Bookings" },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button 
        className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer" 
        onClick={() => setOpen(!open)} 
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border absolute top-20 left-0 right-0 z-40 max-h-[calc(100vh-80px)] overflow-y-auto shadow-2xl">
          <div className="px-4 py-6 space-y-3">
            {NAV_LINKS.map(l => (
              <Link 
                key={l.href} 
                href={l.href} 
                className="block text-base font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-all" 
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/60">
              <Button asChild className="w-full" size="lg">
                <Link href="/contact" onClick={() => setOpen(false)}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
