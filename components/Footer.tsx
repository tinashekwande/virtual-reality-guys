"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-16 border-t border-border bg-card/20 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand block */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-0">
              <div className="relative h-16 w-16 sm:h-18 sm:w-18">
                <Image
                  src="/images/logo.png"
                  alt="Virtual Reality Guys logo"
                  fill
                  className="object-contain animate-pulse"
                  sizes="(max-width: 640px) 64px, 72px"
                />
              </div>
              <span className="text-xl font-bold">
                Virtual Reality <span className="text-primary">Guys</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Bringing premium, immersive mobile VR gaming experiences directly to events across Cape Town. Perfect for schools, private parties, corporate events, team buildings, and festivals.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-primary/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-primary/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-primary/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links & Service links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground tracking-wide">Our VR Services</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="/virtual-reality-cape-town" className="hover:text-primary transition-colors">
                  Cape Town VR Hub
                </Link>
              </li>
              <li>
                <Link href="/vr-team-building" className="hover:text-primary transition-colors">
                  VR Team Building
                </Link>
              </li>
              <li>
                <Link href="/corporate-events" className="hover:text-primary transition-colors">
                  Corporate Events
                </Link>
              </li>
              <li>
                <Link href="/kids-parties" className="hover:text-primary transition-colors">
                  Kids Gaming Parties
                </Link>
              </li>
              <li>
                <Link href="/birthday-party-activities" className="hover:text-primary transition-colors">
                  Birthday Activities
                </Link>
              </li>
              <li>
                <Link href="/family-fun-day-experiences" className="hover:text-primary transition-colors">
                  Family Fun Days
                </Link>
              </li>
              <li>
                <Link href="/school-vr-demonstrations" className="hover:text-primary transition-colors">
                  School VR Demos
                </Link>
              </li>
              <li>
                <Link href="/mobile-vr-hire" className="hover:text-primary transition-colors">
                  Mobile VR Setup Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Contact details */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground tracking-wide">Contact Details</h3>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href="tel:+27717800323" className="hover:text-primary transition-colors font-medium">
                  +27 71 780 0323
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href="mailto:virtualrealityguyz@gmail.com" className="hover:text-primary transition-colors font-medium break-all">
                  virtualrealityguyz@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Cape Town (CPT), South Africa</p>
                  <p className="text-xs mt-1">Serving Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Stellenbosch, Somerset West, and surrounds.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 mt-16 pt-8 text-center text-muted-foreground text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Virtual Reality Guys. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
