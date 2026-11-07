"use client"

import { CyberButton } from "@/components/ui/cyber-button"
import { usePathname } from "next/navigation"
import { CalendarCheck } from "lucide-react"
import WhatsAppIcon from "@/components/WhatsAppIcon"
import { WHATSAPP_URL } from "@/lib/contact"

/**
 * Sticky WhatsApp / Book bar for phones on public pages. Most party enquiries
 * in South Africa start on WhatsApp, so it stays one tap away while scrolling.
 */
export default function MobileActionBar() {
  const pathname = usePathname()
  if (pathname === "/admin" || pathname?.startsWith("/admin/") || pathname?.startsWith("/experiences")) return null

  const bookHref = pathname === "/" ? "#contact" : "/contact"

  return (
    <>
      {/* Spacer so the bar never covers the footer */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-white/10 bg-background/90 backdrop-blur-lg px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-3">
          <CyberButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="full"
            wrapperClassName="w-full"
            className="h-12 px-3 text-sm"
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp
          </CyberButton>
          <CyberButton
            href={bookHref}
            variant="primary"
            size="full"
            wrapperClassName="w-full"
            className="h-12 px-3 text-sm"
          >
            <CalendarCheck className="h-5 w-5" /> Check Date
          </CyberButton>
        </div>
      </div>
    </>
  )
}
