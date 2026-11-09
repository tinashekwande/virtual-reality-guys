"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarCheck } from "lucide-react"
import WhatsAppIcon from "@/components/WhatsAppIcon"
import { WHATSAPP_URL } from "@/lib/contact"

/**
 * Sticky WhatsApp / Book bar for phones on public pages. Most party enquiries
 * in South Africa start on WhatsApp, so it stays one tap away while scrolling.
 * Kept deliberately calm (no glow/animation) so it doesn't compete with page content.
 */
const baseBtn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold tracking-wide transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export default function MobileActionBar() {
  const pathname = usePathname()
  if (pathname === "/admin" || pathname?.startsWith("/admin/") || pathname?.startsWith("/experiences")) return null

  const bookHref = pathname === "/" || pathname === "/index" ? "/#contact" : "/contact"

  return (
    <>
      {/* Spacer so the bar never covers the footer */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-white/10 bg-background/95 backdrop-blur-lg px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseBtn} border border-[#25D366]/50 bg-[#25D366]/10 text-white hover:bg-[#25D366]/20 focus-visible:ring-[#25D366]`}
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp
          </a>
          <Link
            href={bookHref}
            className={`${baseBtn} bg-primary text-[#040817] hover:bg-primary/90 focus-visible:ring-primary`}
          >
            <CalendarCheck className="h-5 w-5" /> Book Now
          </Link>
        </div>
      </div>
    </>
  )
}
