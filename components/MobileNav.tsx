"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experiences", label: "Experiences" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="md:hidden bg-background border-b border-border absolute top-20 left-0 right-0 z-40">
          <div className="px-4 py-4 space-y-4">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="block text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Button asChild className="w-full">
              <Link href="#contact" onClick={() => setOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
