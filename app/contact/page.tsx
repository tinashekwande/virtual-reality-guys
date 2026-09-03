import type { Metadata } from "next"
import Link from "next/link"
import { Check, Phone, Mail, MapPin, Star, Sparkles, Trophy, Calendar } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Book VR Experience Cape Town | Virtual Reality Guys Contact',
  description: 'Book your mobile Virtual Reality gaming experience in Cape Town today! View package pricing, check service areas, or request a custom event quotation.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Book VR Experience Cape Town | Virtual Reality Guys Contact',
    description: 'Ready to book a premium VR gaming party or team building event? View package options and send an online booking request directly to our event team.',
    url: 'https://virtualrealityguyz.co.za/contact',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Book Virtual Reality Cape Town' }],
  }
}

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Book Virtual Reality Guys CPT",
    "url": "https://virtualrealityguyz.co.za/contact",
    "description": "Standalone contact and booking request page for the Virtual Reality Guys' mobile VR entertainment services in Cape Town, South Africa."
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bookings & Contact",
        "item": "https://virtualrealityguyz.co.za/contact"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How quickly do you respond to booking inquiries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We respond to all online booking requests, emails, and WhatsApp messages within 24 hours (usually much faster). We will confirm availability for your date and time."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept EFT (bank transfers) and secure card payments. Bookings require a deposit to secure your date, with the balance due before or on the event day."
        }
      },
      {
        "@type": "Question",
        "name": "How far in advance should we book?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend booking at least 2 to 3 weeks in advance, especially for weekend birthday parties and end-of-year corporate functions, which fill up quickly."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Secure Your Booking Date Today
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Bookings & <span className="text-primary">Contact</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to level up your event? Fill out our online request form or contact our event coordination team directly.
          </p>
        </div>
      </section>

      {/* Main Page Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Booking Contact Card */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Contact Our Cape Town Team</h2>
              <p className="text-muted-foreground leading-relaxed">
                Got questions about space requirements, package pricing, or game options? Reach out to us directly through any of our channels, and we will get back to you within 24 hours.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-md">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call or WhatsApp</p>
                  <a href="tel:+27717800323" className="font-bold hover:text-primary transition-colors text-lg block">
                    +27 71 780 0323
                  </a>
                  <a 
                    href="https://wa.me/27717800323?text=Hi%20Virtual%20Reality%20Guys!%20I%27d%20like%20to%20book%20a%20VR%20experience." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-[#25D366] hover:underline font-semibold flex items-center gap-1 mt-1 animate-pulse"
                  >
                    <span>Click to Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-md">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <a href="mailto:virtualrealityguyz@gmail.com" className="font-bold hover:text-primary transition-colors text-lg break-all">
                    virtualrealityguyz@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-md">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Local Coverage Area</p>
                  <p className="font-bold text-lg">
                    Cape Town CPT, Western Cape
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Packages Quick Grid */}
            <div className="bg-secondary/40 border border-border p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-lg border-b border-border/40 pb-2">Quick Packages</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Starter Package</span>
                  <span className="text-primary font-bold">R 499</span>
                </div>
                <p className="text-xs text-muted-foreground">2 headsets, 2 hours, up to 10 players, trained supervisor</p>
                
                <div className="flex justify-between items-center pt-2 border-t border-border/20">
                  <span className="font-semibold text-foreground">Standard Package</span>
                  <span className="text-primary font-bold">R 899</span>
                </div>
                <p className="text-xs text-muted-foreground">4 headsets, 3 hours, up to 20 players, 2 trained supervisors</p>
                
                <div className="flex justify-between items-center pt-2 border-t border-border/20">
                  <span className="font-semibold text-foreground">Premium Package</span>
                  <span className="text-primary font-bold">R 1299</span>
                </div>
                <p className="text-xs text-muted-foreground">6 headsets, 4 hours, up to 40 players, 3 supervisors, custom tournament</p>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed border-t border-border/20 pt-4">
                <strong>*Note:</strong> Free delivery/transport to Kraaifontein, Brackenfell, Durbanville, Bellville, Kuils River, Joostenberg Vlakte, Pinehurst, and Buh-Rein Estate. Other areas require transport fees.
              </p>
            </div>

            {/* Why Book With Us Section */}
            <div className="bg-secondary/20 border border-border/40 p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-primary" /> Why Book With Us
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>100% Mobile:</strong> We deliver, set up, supervise, and clean up at your venue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Safety First:</strong> Active virtual safety walls plus full session sanitation protocols.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Expert Team:</strong> Passionate supervisors who keep players engaged and safe.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Great Variety:</strong> Access to a library of over 100+ highly rated VR games.</span>
                </li>
              </ul>
            </div>

            {/* Quick Links to Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explore Our Services</h4>
              <div className="flex flex-wrap gap-2">
                <Link href="/vr-team-building" className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Team Building</Link>
                <Link href="/kids-parties" className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Kids Parties</Link>
                <Link href="/corporate-events" className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Corporate Events</Link>
                <Link href="/mobile-vr-hire" className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Mobile VR Hire</Link>
                <Link href="/vr-games-catalogue" className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Games Catalogue</Link>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="bg-card/40 border border-border/60 p-2 sm:p-6 rounded-3xl">
            <BookingForm />
          </div>

        </div>
      </section>

      {/* Service Area list */}
      <section className="py-16 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Serving All Suburbs in the Greater Cape Town Area</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            We deliver the ultimate VR experience directly to Sea Point, Green Point, Camps Bay, Hout Bay, Constantia, Rondebosch, Claremont, Bellville, Durbanville, Century City, Milnerton, Bloubergstrand, Somerset West, and Stellenbosch.
          </p>
        </div>
      </section>

      {/* Booking FAQs */}
      <section className="py-16 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Booking FAQs</h2>
          <div className="space-y-6">
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How quickly do you respond to booking inquiries?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We respond to all online booking requests, emails, and WhatsApp messages within 24 hours (usually much faster). We will confirm availability for your date and time.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We accept EFT (bank transfers) and secure card payments. Bookings require a deposit to secure your date, with the balance due before or on the event day.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How far in advance should we book?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We recommend booking at least 2 to 3 weeks in advance, especially for weekend birthday parties and end-of-year corporate functions, which fill up quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
