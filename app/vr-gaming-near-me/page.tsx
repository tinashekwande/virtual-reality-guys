import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Users, Headset, MapPin, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Gaming Near Me Cape Town | Mobile Virtual Reality Delivered',
  description: 'Looking for VR gaming near you in Cape Town? We deliver premium mobile virtual reality setups to your door across all suburbs. No arcade needed!',
  alternates: {
    canonical: '/vr-gaming-near-me',
  },
  openGraph: {
    title: 'VR Gaming Near Me Cape Town | Mobile Virtual Reality Delivered',
    description: 'Looking for premium virtual reality entertainment in Cape Town? We deliver interactive VR headsets, displays, and supervisors directly to your venue.',
    url: 'https://www.virtualrealityguyz.co.za/vr-gaming-near-me',
    images: [{ url: '/images/vr-hero.jpg', alt: 'VR Gaming Near Me Cape Town' }],
  }
}

export default function VrGamingNearMePage() {
  const suburbs = [
    "City Bowl", "Sea Point", "Camps Bay", "Green Point", "Hout Bay",
    "Claremont", "Rondebosch", "Constantia", "Bellville", "Durbanville",
    "Century City", "Milnerton", "Bloubergstrand", "Somerset West",
    "Stellenbosch", "Strand", "Gordon's Bay", "Paarl", "Franschhoek"
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Virtual Reality Guys",
    "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
    "telephone": "+27717800323",
    "email": "virtualrealityguyz@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "addressCountry": "ZA"
    },
    "areaServed": suburbs.map(suburb => ({
      "@type": "Place",
      "name": suburb
    })),
    "description": "Mobile virtual reality rental and setup services delivered directly to your doorstep in Somerset West, Stellenbosch, Atlantic Seaboard, Southern Suburbs, and Northern Suburbs."
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
        "name": "VR Gaming Near Me",
        "item": "https://www.virtualrealityguyz.co.za/vr-gaming-near-me"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How far do you travel to set up VR gaming?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve the entire Greater Cape Town region, Helderberg (Somerset West, Strand, Gordon's Bay), Winelands (Stellenbosch, Franschhoek, Paarl), and Cape Peninsula suburbs. We deliver directly to your private home, office, school, or community hall."
        }
      },
      {
        "@type": "Question",
        "name": "Is there an extra travel fee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Travel within our standard Cape Town service areas is included in our package pricing. For locations further out (e.g. deep parts of Paarl, Franschhoek, or beyond), a small, transparent travel fee may be calculated to cover fuel costs."
        }
      },
      {
        "@type": "Question",
        "name": "How much space do you need for a mobile VR setup?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We need approximately 2.5m x 2.5m of clear floor space per active VR headset. A double garage, living room, covered patio, or small classroom works perfectly. We map out digital boundaries to ensure players stay inside the safe zone."
        }
      },
      {
        "@type": "Question",
        "name": "Can we set up the VR equipment outdoors?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, but with strict conditions. To prevent sun damage to the headset lenses and ensure proper tracking, outdoor setups must be fully shaded (under a marquee, stretch tent, or deep verandah) and on a flat surface. Indoor setups are always preferred."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book a mobile VR experience near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply fill out our booking form with your venue address, preferred package, and event date. Our coordination team will check local availability and confirm details with you within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "How much does VR gaming cost in Cape Town?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Packages start from R399 for a Starter session with 2 headsets."
        }
      },
      {
        "@type": "Question",
        "name": "What VR games can I play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a wide variety of genres including action, horror, sports, educational, multiplayer, and rhythm games like Beat Saber."
        }
      },
      {
        "@type": "Question",
        "name": "Can I play VR games at home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we bring the equipment to your home or venue."
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
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-hero.jpg"
            alt="VR Gaming Experience Near Me in Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            We Bring VR Gaming Directly to You
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            VR Gaming <span className="text-primary">Near Me</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Forget traveling to a shopping center arcade. Virtual Reality Guys is Cape Town's premier mobile VR service, delivering high-end virtual reality gear and supervisors directly to your venue.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Find Out More</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/virtual-reality-cape-town">View Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Truck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">No Travel Needed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enjoy premium gaming in the comfort of your own home, office, or school. We handle all logistics and setup work.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">All Cape Town Suburbs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prompt delivery across City Bowl, Southern Suburbs, Northern Suburbs, Stellenbosch, Somerset West, and surrounds.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Professional Setup</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Trained team members handle safety zoning, explain gameplay, clean headsets between uses, and run tournaments.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                Mobile VR Staging: The Best Gaming Setup Brought to Your Door
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Why go through the hassle of booking transport, paying for expensive arcade tickets, and waiting in lines? Our mobile VR entertainment model brings the exact same top-tier hardware (Oculus/Meta Quest headsets), a library of over 100+ games, and live display monitors directly to you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We design a complete virtual reality zone right at your venue, whether that is a school hall, a company boardroom, or your living room. We service all major suburbs, ensuring local, responsive support for any event scale.
              </p>

              <h3 className="text-lg font-bold">Suburbs We Serve in Cape Town:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                {suburbs.map(suburb => (
                  <div key={suburb} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{suburb}</span>
                  </div>
                ))}
              </div>
            </div>



          </div>

          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/virtual-reality-cape-town">All Service Areas <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/virtual-reality-somerset-west">Somerset West & Helderberg <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular VR Games */}
      <section className="py-20 bg-secondary/10 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Popular VR Games</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Beat Saber", "Superhot VR", "Job Simulator", "Richie's Plank Experience", "Space Pirate Trainer", "Creed: Rise to Glory", "Keep Talking and Nobody Explodes", "Walkabout Mini Golf"].map((game, i) => (
              <div key={i} className="bg-background border border-border/50 p-6 rounded-xl hover:border-primary/50 transition-colors group">
                <h3 className="font-bold mb-2">{game}</h3>
                <p className="text-muted-foreground text-sm mb-4">A top-rated VR experience offering immersive gameplay suitable for parties and events.</p>
                <Link href="/vr-games-catalogue" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Game <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <Button asChild size="sm">
              <Link href="/vr-games-catalogue">Browse All Games <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-birthday-parties">Gaming Parties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How far do you travel to set up VR gaming?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We serve the entire Greater Cape Town region, Helderberg (Somerset West, Strand, Gordon's Bay), Winelands (Stellenbosch, Franschhoek, Paarl), and Cape Peninsula suburbs. We deliver directly to your private home, office, school, or community hall.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is there an extra travel fee?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Travel within our standard Cape Town service areas is included in our package pricing. For locations further out (e.g. deep parts of Paarl, Franschhoek, or beyond), a small, transparent travel fee may be calculated to cover fuel costs.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How much space do you need for a mobile VR setup?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We need approximately 2.5m x 2.5m of clear floor space per active VR headset. A double garage, living room, covered patio, or small classroom works perfectly. We map out digital boundaries to ensure players stay inside the safe zone.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can we set up the VR equipment outdoors?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, but with strict conditions. To prevent sun damage to the headset lenses and ensure proper tracking, outdoor setups must be fully shaded (under a marquee, stretch tent, or deep verandah) and on a flat surface. Indoor setups are always preferred.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How do I book a mobile VR experience near me?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Simply fill out our booking form with your venue address, preferred package, and event date. Our coordination team will check local availability and confirm details with you within 24 hours.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How much does VR gaming cost in Cape Town?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Packages start from R399 for a Starter session with 2 headsets.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What VR games can I play?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We offer a wide variety of genres including action, horror, sports, educational, multiplayer, and rhythm games like Beat Saber.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can I play VR games at home?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we bring the equipment to your home or venue.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure Mobile VR Setup Near You</h2>
            <p className="text-muted-foreground leading-relaxed">
              We travel to all locations across the Western Cape. Secure your date with our local booking coordinator today.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Zero hassle: We handle setup, safety, and pack-away</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Local rates with no hidden fees</span>
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
