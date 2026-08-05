"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard, Image as ImageIcon, FolderOpen,
  Users, ClipboardList, LogOut, Headset, Menu, X, ShieldCheck,
  BookOpen, Receipt
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes-invoices", label: "Quotes & Invoices", icon: Receipt },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <Headset className="h-7 w-7 text-primary flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight">VR Guys</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname
            ? (item.exact ? pathname === item.href : pathname.startsWith(item.href))
            : false
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Real-time new booking notifications
  useEffect(() => {
    if (!mounted) return

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }

    let knownIds: string[] = []
    let isFirstFetch = true

    const playChime = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) return
        const ctx = new AudioContextClass()
        
        // Note 1: E5
        const osc1 = ctx.createOscillator()
        const gain1 = ctx.createGain()
        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
        gain1.gain.setValueAtTime(0.08, ctx.currentTime)
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        osc1.start(ctx.currentTime)
        osc1.stop(ctx.currentTime + 0.35)
        
        // Note 2: A5 (starts slightly later)
        setTimeout(() => {
          const osc2 = ctx.createOscillator()
          const gain2 = ctx.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx.destination)
          osc2.type = 'sine'
          osc2.frequency.setValueAtTime(880.00, ctx.currentTime) // A5
          gain2.gain.setValueAtTime(0.08, ctx.currentTime)
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
          osc2.start(ctx.currentTime)
          osc2.stop(ctx.currentTime + 0.45)
        }, 110)
      } catch (err) {
        console.error("Audio chime error:", err)
      }
    }

    const checkNewRequests = async () => {
      try {
        const res = await fetch("/api/requests?status=new")
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data)) return

        const currentIds = data.map((r: any) => r.id)

        if (isFirstFetch) {
          knownIds = currentIds
          isFirstFetch = false
          return
        }

        const newRequests = data.filter((r: any) => !knownIds.includes(r.id))

        if (newRequests.length > 0) {
          playChime()

          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            newRequests.forEach((req: any) => {
              new Notification("New Booking Received! 🎮", {
                body: `${req.name} requested a booking (${req.form_type || "VR Experience"})\nEmail: ${req.email}`,
                icon: "/favicon-192x192.png"
              })
            })
          }

          // Trigger custom event so open admin view components can auto-refresh
          window.dispatchEvent(new CustomEvent("new-requests-received"))
          
          knownIds = currentIds
        } else if (currentIds.length < knownIds.length) {
          // Sync list if requests were deleted or processed
          knownIds = currentIds
        }
      } catch (err) {
        console.error("Failed to check new requests:", err)
      }
    }

    checkNewRequests()
    const timer = setInterval(checkNewRequests, 15000)

    return () => {
      clearInterval(timer)
    }
  }, [mounted])

  const currentPage = NAV_ITEMS.find(i =>
    i.exact ? pathname === i.href : (pathname ? pathname.startsWith(i.href) : false)
  )?.label ?? "Admin"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-60 md:flex-shrink-0">
        {mounted ? (
          <AdminSidebar />
        ) : (
          <div className="flex flex-col h-full w-full bg-sidebar border-r border-sidebar-border">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border h-[69px]">
              <Headset className="h-7 w-7 text-primary flex-shrink-0 opacity-50" />
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight text-muted-foreground">VR Guys</p>
              </div>
            </div>
            <div className="flex-1 px-3 py-4 space-y-2">
              <div className="h-8 bg-sidebar-accent/50 rounded-lg animate-pulse" />
              <div className="h-8 bg-sidebar-accent/50 rounded-lg animate-pulse" />
              <div className="h-8 bg-sidebar-accent/50 rounded-lg animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && mounted && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card/50 backdrop-blur flex-shrink-0">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-semibold">{currentPage}</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  )
}
