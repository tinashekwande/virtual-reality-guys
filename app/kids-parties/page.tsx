import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Users, Headset, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Kids Parties Cape Town | Epic Gaming & Party Ideas',
  description: 'Throw the ultimate kids gaming party in Cape Town! Fully supervised, safe, and exciting virtual reality birthday entertainment delivered to your venue.',
  alternates: {
    canonical: '/kids-parties',
  },
  openGraph: {
    title: 'VR Kids Parties Cape Town | Epic Gaming & Party Ideas',
    description: 'Looking for unique kids party ideas in Cape Town? We deliver multiplayer VR setups, fun rhythm games, and expert supervisors directly to your home.',
    url: 'https://www.virtualrealityguyz.co.za/kids-parties',
    images: [{ url: '/images/vr-party.jpg', alt: 'Kids VR Gaming Party Cape Town' }],
  }
}

export default function KidsPartiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "VR Kids Parties Entertainment",
    "serviceType": "Children's Amusement",
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
    "description": "Safe, fully supervised virtual reality birthday party gaming packages delivered to your home or private event venue in Cape Town. Ideal for kids, teens, and families."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is VR safe for kids' eyes and development?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we prioritize children's safety. We recommend VR experiences for children aged 8 and up. Our trained supervisors manage screen time, set up safe virtual boundary walls (guardian systems) to prevent physical bumps, and ensure age-appropriate, non-violent game selections."
        }
      },
      {
        "@type": "Question",
        "name": "Do parents have to supervise the kids during the event?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nope, you can sit back and relax! Our packages include professional, friendly VR supervisors who handle the entire setup, guide each child through the gameplay, and supervise the gaming arena. You can focus on enjoying the party."
        }
      },
      {
        "@type": "Question",
        "name": "What games do the kids play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a wide library of extremely popular kid-friendly VR titles including Beat Saber, Job Simulator, Fruit Ninja, safe multiplayer shooters, sports games, and creative paint programs. We tailor the list based on the age group."
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
            src="/images/vr-party.jpg"
            alt="Kids VR Gaming Party in Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Cape Town's Coolest Kids Gaming Parties
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Kids <span className="text-primary">Parties</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Give them an absolutely unforgettable birthday experience! We bring premium mobile VR gaming, amazing kids' games, and expert supervisors directly to your home venue in Cape Town.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Birthday Party</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/birthday-party-activities">View Party Activities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Supervised & Safe</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Trained supervisors guide every kid through gameplay. Safe physical space mapping prevents collisions, ensuring stress-free entertainment for parents.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Kid-Friendly Game Library</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Over 30+ highly-curated, non-violent, age-appropriate VR titles including Beat Saber, Job Simulator, Fruit Ninja, and multiplayer sports games.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Total Peace of Mind</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We manage everything! Delivery, technical set up, hardware checks, sanitation wipes, safety zoning, game training, and final clean up.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                Throw an Epic Gaming Party in Cape Town
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Looking for unique kids party ideas or exciting indoor activities for kids in Cape Town? Virtual Reality Guys delivers a premium gaming festival directly to your garage, garden, or local venue. Watch the kids jump, laugh, and compete as they slice blocks in Beat Saber or challenge each other to high-score multiplayer face-offs.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Suitable for birthdays, end-of-term celebrations, & school holidays</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Spectator display screens showing parent & kid viewers what the player sees</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Leather-insert sanitization masks wiped down with anti-bacterial agents between rounds</span>
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
                "Virtual Reality Guys were brilliant for my son's 11th birthday! The kids were completely obsessed with Beat Saber and the multiplayer setup. The staff were incredibly patient and handled everything perfectly. I didn't have to worry about a thing!"
              </p>
              <div>
                <p className="font-bold text-foreground">Sarah M.</p>
                <p className="text-xs text-muted-foreground">Parent, Southern Suburbs CPT</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Kids Gaming FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is VR safe for kids' eyes and development?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we prioritize children's safety. We recommend VR experiences for children aged 8 and up. Our trained supervisors manage screen time, set up safe virtual boundary walls (guardian systems) to prevent physical bumps, and ensure age-appropriate, non-violent game selections.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do parents have to supervise the kids during the event?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Nope, you can sit back and relax! Our packages include professional, friendly VR supervisors who handle the entire setup, guide each child through the gameplay, and supervise the gaming arena. You can focus on enjoying the party.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What games do the kids play?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We offer a wide library of extremely popular kid-friendly VR titles including Beat Saber, Job Simulator, Fruit Ninja, safe multiplayer shooters, sports games, and creative paint programs. We tailor the list based on the age group.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure the Best Birthday Entertainment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dates during school holidays and weekends fill up extremely quickly. Contact us today with your preferred event date and approximate player numbers to secure your booking.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local planning across the Western Cape</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Affordable packages starting from just R999</span>
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
