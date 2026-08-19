import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Users, Sparkles, Trophy, Star, ArrowRight, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Team Building Activities Cape Town | Corporate Event Ideas',
  description: 'Boost team collaboration and morale with cutting-edge Virtual Reality team building activities in Cape Town. Multiplayer VR games delivered to your corporate venue.',
  alternates: {
    canonical: '/vr-team-building',
  },
  openGraph: {
    title: 'VR Team Building Activities Cape Town | Corporate Event Ideas',
    description: 'Looking for unique corporate team building ideas in Cape Town? We deliver multiplayer VR setups, leaderboards, and expert team coordination directly to your office.',
    url: 'https://www.virtualrealityguyz.co.za/vr-team-building',
    images: [{ url: '/images/vr-corporate.jpg', alt: 'VR Team Building Activities Cape Town' }],
  }
}

export default function TeamBuildingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "VR Corporate Team Building Activities",
    "serviceType": "Corporate Entertainment & Team Building",
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
      "name": "Cape Town and surrounding Western Cape regions"
    },
    "description": "Premium virtual reality team building setups brought directly to your Cape Town corporate venue. Collaborative multiplayer gaming, real-time leaderboard tournaments, and professional facilitation included."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why is VR a great team building activity?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Virtual reality breaks down workplace barriers by throwing teams into fully immersive, cooperative environments. Whether navigating cooperative escape rooms, competing in rhythm-slashing tournaments, or solving high-pressure logic puzzles together, VR demands real-time communication, trust, and creative thinking."
        }
      },
      {
        "@type": "Question",
        "name": "Can you set up the VR team building at our offices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We are 100% mobile and regularly set up inside corporate offices, boardrooms, parking facilities, or conference halls across Cape Town. We just require indoor space or complete canopy cover."
        }
      },
      {
        "@type": "Question",
        "name": "What size groups can you accommodate for corporate events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our corporate setups are highly scalable. We can support anything from small executive sessions of 10 players to large-scale department tournaments of 50+ participants. We utilize spectator displays so observers are fully engaged while others play."
        }
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "VR Team Building Activities",
        "item": "https://www.virtualrealityguyz.co.za/vr-team-building"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-corporate.jpg"
            alt="Corporate VR Team Building Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Unique Corporate Event Ideas in Cape Town
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            VR Team Building <span className="text-primary">Activities</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Break the corporate mold! Empower your team with highly engaging, collaborative, and competitive virtual reality experiences delivered straight to your Cape Town venue.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Request Corporate Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/corporate-events">Explore Corporate Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Corporate Value Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Enhance Cooperation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Cooperative escape environments and high-stress problem-solving scenarios require seamless verbal communication and real-time leadership adjustments.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Trophy className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Friendly Competition</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Host department tournaments with live leaderboard rankings in rhythm actions or racing titles. Boost engagement with high-energy challenges and prizes.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Engaged Spectators</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We broadcast live gameplay feeds onto secondary monitor screens, ensuring coworkers who are not in headsets are fully immersed, cheering, and laughing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                High-Energy, Low-Stress: We Handle the Entire Event
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Organizing a corporate event can be exhausting. That's why the Virtual Reality Guys offer a completely turn-key service. We handle the logistics, equipment delivery, space mapping, hygiene management, and tournament moderation, leaving you free to join in the fun with your team.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Customizable multiplayer packages tailored to space & group size</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Expert supervisors who guarantee safety and ease-of-use</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Sanitized leather-insert headsets wiped down between every user</span>
                </li>
              </ul>
            </div>



          </div>
          
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <div className="w-full mb-4">
              <Link href="/corporate-events" className="text-primary font-semibold hover:underline">
                Looking for broader corporate entertainment? See our Corporate Events packages &rarr;
              </Link>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/kids-parties">Kids Parties <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/family-fun-day-experiences">Family Fun Days <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service specific FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Corporate VR FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Why is VR a great team building activity?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Virtual reality breaks down workplace barriers by throwing teams into fully immersive, cooperative environments. Whether navigating cooperative escape rooms, competing in rhythm-slashing tournaments, or solving high-pressure logic puzzles together, VR demands real-time communication, trust, and creative thinking.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can you set up the VR team building at our offices?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Absolutely! We are 100% mobile and regularly set up inside corporate offices, boardrooms, parking facilities, or conference halls across Cape Town. We just require indoor space or complete canopy cover.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What size groups can you accommodate for corporate events?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our corporate setups are highly scalable. We can support anything from small executive sessions of 10 players to large-scale department tournaments of 50+ participants. We utilize spectator displays so observers are fully engaged while others play.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Lead Capture */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Request a Corporate Package Proposal</h2>
            <p className="text-muted-foreground leading-relaxed">
              Contact us to discuss your event goals, number of guests, and venue location. We will draft a custom team-building program and quotation tailored specifically for your business.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Flexible B2B payment terms</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Available for morning sessions, half-days, or full-day corporate retreats</span>
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
