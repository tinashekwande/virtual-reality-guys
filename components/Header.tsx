"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileNav from "@/components/MobileNav"
import MotionButton from "@/components/motion/MotionButton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-lg shadow-black/20"
          : "bg-background/60 backdrop-blur-md border-b border-border/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-0 group">
            <div className="relative h-16 w-16 sm:h-18 sm:w-18 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Virtual Reality Guys logo"
                fill
                className="object-contain animate-pulse"
                priority
                sizes="(max-width: 640px) 64px, 72px"
              />
            </div>
            <span className="text-xl font-bold">
              Virtual Reality <span className="text-primary group-hover:text-accent transition-colors">Guys</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium focus:outline-none cursor-pointer">
                Services <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border border-border rounded-xl p-2 z-[60] w-64">
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/virtual-reality-cape-town" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Cape Town VR Hub</p>
                    <p className="text-xs text-muted-foreground">Local experiences & venues</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/vr-experience-cape-town" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">VR Experiences</p>
                    <p className="text-xs text-muted-foreground">Immersive VR adventures</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/vr-team-building" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">VR Team Building</p>
                    <p className="text-xs text-muted-foreground">Corporate team activities</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/corporate-events" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Corporate Events</p>
                    <p className="text-xs text-muted-foreground">Premium event packages</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/kids-parties" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Kids Parties</p>
                    <p className="text-xs text-muted-foreground">Gaming parties for kids</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/birthday-party-activities" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Birthday Parties</p>
                    <p className="text-xs text-muted-foreground">Fun VR party activities</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/family-fun-day-experiences" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Family Fun Days</p>
                    <p className="text-xs text-muted-foreground">Experiences for all ages</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/school-vr-demonstrations" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">School VR Demos</p>
                    <p className="text-xs text-muted-foreground">Educational showcases</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/mobile-vr-hire" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">Mobile VR Hire</p>
                    <p className="text-xs text-muted-foreground">Setup & rental options</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer rounded-lg">
                  <Link href="/vr-games-catalogue" className="w-full px-3 py-2 block">
                    <p className="font-semibold text-sm">VR Games Catalogue</p>
                    <p className="text-xs text-muted-foreground">Browse games & experiences</p>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
            >
              Blog
            </Link>
            <Link
              href="/gallery"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
            >
              Bookings
            </Link>
          </div>

          <div className="hidden md:block">
            <MotionButton>
              <Button asChild size="lg">
                <Link href="/contact">
                  Book Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </MotionButton>
          </div>

          <MobileNav />
        </div>
      </div>
    </nav>
  )
}
