import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Users, Headset, Heart, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Birthday Parties Cape Town | Unforgettable Gaming Celebrations',
  description: 'Plan the ultimate VR birthday party in Cape Town! Immersive virtual reality gaming packages for kids, teens, and adults delivered to your venue. Book today.',
  alternates: {
    canonical: '/vr-birthday-parties',
  },
  openGraph: {
    title: 'VR Birthday Parties Cape Town | Unforgettable Gaming Celebrations',
    description: 'Immersive virtual reality birthday gaming experiences for kids, teens, and adults in Cape Town. We deliver premium setups to your venue.',
    url: 'https://www.virtualrealityguyz.co.za/vr-birthday-parties',
    images: [{ url: '/images/vr-party.jpg', alt: 'VR Birthday Party Cape Town' }],
  }
}

export default function VrBirthdayPartiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "VR Birthday Party Entertainment",
    "serviceType": "Amusement & Party Entertainment",
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
    "description": "Premium mobile virtual reality birthday party setups delivered directly to your home or venue in Cape Town. Fun multiplayer gaming for all ages, fully supervised."
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
        "name": "VR Birthday Parties",
        "item": "https://www.virtualrealityguyz.co.za/vr-birthday-parties"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many kids or guests can play at a VR party?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our setups accommodate different group sizes. Our Starter package (2 headsets) is great for up to 10 players, Standard (4 headsets) serves up to 20, and Premium (6 headsets) handles up to 40 players. Because players take turns and spectators can watch on TV displays, everyone stays thoroughly entertained."
        }
      },
      {
        "@type": "Question",
        "name": "What age is VR suitable for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend virtual reality experiences for children aged 8 and up, teens, and adults. For younger kids, we select simple, intuitive, and non-violent games like Fruit Ninja and Job Simulator. Teens and adults can participate in multiplayer combat, sports tournaments, and co-op adventures."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide party add-ons?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All our standard setups come with high-definition TV displays so that spectators can watch the player's perspective in real-time. We also offer customizable tournament brackets and digital photo packages to capture the memories of the day."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a VR party last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Packages range from 2 to 4 hours of pure gaming time. This excludes our setup and pack-down time, which we do beforehand and afterward at no extra charge. We recommend 2 hours for smaller groups (up to 10 players) and 3 to 4 hours for larger parties."
        }
      },
      {
        "@type": "Question",
        "name": "Can we choose the games beforehand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We have a broad library of over 100+ titles categorized by theme. When booking, you can specify preferences (e.g., rhythm games, action, sports, or strictly kid-friendly content), and our supervisors will load the appropriate game selections."
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
            src="/images/vr-party.jpg"
            alt="VR Birthday Party Entertainment Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Cape Town's #1 VR Birthday Entertainment
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            VR Birthday <span className="text-primary">Parties</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bring the ultimate gaming festival to your next birthday celebration! We deliver, set up, and manage a complete mobile virtual reality arcade at your home or chosen venue in Cape Town.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Your Party</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/vr-games-catalogue">Browse Our Games</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <PartyPopper className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Choose Your Package</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Flexible mobile VR packages starting from just R399. Options include 2 to 6 headsets, spectator displays, and tournament coordination.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Any Age, Any Venue</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Perfect for kids (8+), teenagers, and adults. We set up in living rooms, double garages, backyards, or hired community venues.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Hassle-Free Setup</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our expert supervisors handle transport, physical area mapping, headset sanitization, guest training, and complete cleanup.
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
                Plan an Absolutely Unforgettable Birthday Party
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Throwing a birthday party can be stressful, but it doesn't have to be. With Virtual Reality Guys, we turn your home into a futuristic gaming center. While the birthday boy or girl is dodging laser fire in space, their friends are cheering them on, watching the live gameplay on our spectator screens.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you want to coordinate a friendly Beat Saber tournament, host a multiplayer racing challenge, or let guests explore high-definition solo adventures, we tailor the game roster to match the age group and energy of your event.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Suitable for children, teenagers, and adult milestones</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Interactive spectator setups keep all guests highly engaged</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Professional supervisors manage crowd flow, teaching, and safety boundaries</span>
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
                "We booked the Standard package for our daughter's 10th birthday party in Camps Bay, and it was a massive success! The kids were completely captivated, and the supervisors did an incredible job teaching everyone how to play and keeping the space safe. Best birthday choice we've ever made!"
              </p>
              <div>
                <p className="font-bold text-foreground">Amanda K.</p>
                <p className="text-xs text-muted-foreground">Parent, Camps Bay</p>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/kids-parties">Explore Kids Parties <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/birthday-party-activities">Explore Party Activities <ArrowRight className="ml-1 h-4 w-4" /></Link>
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
              <h3 className="font-bold text-lg text-foreground">How many kids or guests can play at a VR party?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our setups accommodate different group sizes. Our Starter package (2 headsets) is great for up to 10 players, Standard (4 headsets) serves up to 20, and Premium (6 headsets) handles up to 40 players. Because players take turns and spectators can watch on TV displays, everyone stays thoroughly entertained.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What age is VR suitable for?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We recommend virtual reality experiences for children aged 8 and up, teens, and adults. For younger kids, we select simple, intuitive, and non-violent games like Fruit Ninja and Job Simulator. Teens and adults can participate in multiplayer combat, sports tournaments, and co-op adventures.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you provide party add-ons?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes! All our standard setups come with high-definition TV displays so that spectators can watch the player's perspective in real-time. We also offer customizable tournament brackets and digital photo packages to capture the memories of the day.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How long does a VR party last?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Packages range from 2 to 4 hours of pure gaming time. This excludes our setup and pack-down time, which we do beforehand and afterward at no extra charge. We recommend 2 hours for smaller groups (up to 10 players) and 3 to 4 hours for larger parties.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can we choose the games beforehand?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Absolutely. We have a broad library of over 100+ titles categorized by theme. When booking, you can specify preferences (e.g., rhythm games, action, sports, or strictly kid-friendly content), and our supervisors will load the appropriate game selections.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Book Your VR Birthday Party Today</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dates during school holidays and weekends fill up extremely quickly. Contact us today with your preferred event date, location, and approximate guest counts to secure your booking.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive booking and customization support</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Packages starting from just R399</span>
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
