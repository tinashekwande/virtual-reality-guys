import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Calendar, Sparkles, Monitor, Star, ArrowRight, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Corporate Event Entertainment Cape Town | Premium VR Hire',
  description: 'Elevate your corporate events in Cape Town with premium mobile Virtual Reality hire. Ideal for year-end parties, product launches, and event entertainment.',
  alternates: {
    canonical: '/corporate-events',
  },
  openGraph: {
    title: 'Corporate Event Entertainment Cape Town | Premium VR Hire',
    description: 'Provide futuristic, premium event entertainment for your Cape Town corporate function. Multiplayer gaming setups and large spectator screens delivered.',
    url: 'https://www.virtualrealityguyz.co.za/corporate-events',
    images: [{ url: '/images/vr-corporate.jpg', alt: 'Corporate Event Entertainment Cape Town' }],
  }
}

export default function CorporateEventsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Corporate Event VR Entertainment",
    "serviceType": "Event Entertainment",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
      "telephone": "+27717800323",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA"
      }
    },
    "areaServed": {
      "@type": "Place",
      "name": "Cape Town and surrounding Western Cape suburbs"
    },
    "description": "High-capacity virtual reality setups for large-scale corporate functions, conferences, end-of-year celebrations, and trade shows in Cape Town."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What kinds of corporate events do you cater to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cater to a wide range of corporate functions in Cape Town, including year-end parties, product launches, conferences, trade shows, office openings, and company family fun days."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle crowd flow and throughput at busy events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For high-traffic events, we focus on shorter, high-impact experiences (e.g., 2-3 minutes per player) like rhythm games or simulator rides. Our trained supervisors manage the queue efficiently, keeping wait times low and engagement high."
        }
      },
      {
        "@type": "Question",
        "name": "Is branding available for our company event?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we can work with you to display company logos on secondary spectator displays, custom in-game leaderboard names, and match our physical setup styling to your brand colors."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-corporate.jpg"
            alt="Corporate Event Entertainment Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Immersive Corporate Event Entertainment
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Corporate <span className="text-primary">Events</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Wow your clients, colleagues, and guests. We provide high-end, turn-key mobile VR setups that add a major "wow factor" to year-end parties, launches, and trade shows across Cape Town.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Request Event Proposal</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/vr-team-building">Explore Team Building</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Premium VR Entertainment Engineered for Corporate Venues
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Year-End Functions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Add an unforgettable highlight to your annual celebration. Great for getting managers, staff, and directors playing and laughing together.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Monitor className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Trade Shows & Launches</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Draw massive crowds directly to your exhibition stand. Use the immersive visual power of VR to engage visitors and generate leads.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Interactive Brand Feeds</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Perfect for showcasing your modern tech-savvy culture. Broaden your appeal with high-tech spectator setups and tournament brackets.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                High Capacity, Maximum Safety, Strict Cleanliness
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We know how important smooth logistics and event safety are to corporate hosts. Our team sets up professional safety zoning with velvet-style barrier markers, handles crowd management with precision, and enforces a strict single-use headset cleaning protocol using premium medical-grade sanitizing wipes.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Interactive leaderboard setups for competitive year-end awards</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Live visual screens showing what the active player sees in real time</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Public liability cover and expert supervisors managing every event</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/30 p-8 border border-border rounded-3xl space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground italic leading-relaxed">
                "Our product launch was an absolute success, and a large part of that was the buzz around the Virtual Reality Guys' setups. Guests were queuing up to play and watch, and it gave our brand the modern, high-tech image we wanted. Highly recommended!"
              </p>
              <div>
                <p className="font-bold text-foreground">Gavin D.</p>
                <p className="text-xs text-muted-foreground">Marketing Director, Western Cape Tech Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Event Entertainment FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What kinds of corporate events do you cater to?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We cater to a wide range of corporate functions in Cape Town, including year-end parties, product launches, conferences, trade shows, office openings, and company family fun days.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How do you handle crowd flow and throughput at busy events?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                For high-traffic events, we focus on shorter, high-impact experiences (e.g., 2-3 minutes per player) like rhythm games or simulator rides. Our trained supervisors manage the queue efficiently, keeping wait times low and engagement high.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is branding available for our company event?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we can work with you to display company logos on secondary spectator displays, custom in-game leaderboard names, and match our physical setup styling to your brand colors.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure Premium Entertainment for Your Event</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dates during year-end function seasons (October - December) book out months in advance. Get in touch early to discuss package options and secure standard-setting entertainment for your Cape Town corporate function.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local coordination in Western Cape</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Scalable setups from 2 up to 10 VR headset stations</span>
              </p>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
