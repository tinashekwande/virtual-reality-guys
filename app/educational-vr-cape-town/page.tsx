import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Users, Headset, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Educational VR Experiences Cape Town | Schools & Learning Programmes',
  description: 'Transform classroom learning with educational virtual reality in Cape Town. Curriculum-aligned VR demos for schools, science fairs, and educational events.',
  alternates: {
    canonical: '/educational-vr-cape-town',
  },
  openGraph: {
    title: 'Educational VR Experiences Cape Town | Schools & Learning Programmes',
    description: 'Bring science, biology, and history to life with immersive virtual reality experiences for schools and educational programs in Cape Town.',
    url: 'https://www.virtualrealityguyz.co.za/educational-vr-cape-town',
    images: [{ url: '/images/vr-school.jpg', alt: 'Educational VR Experience Cape Town' }],
  }
}

export default function EducationalVrCapeTownPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Educational VR Experiences",
    "serviceType": "Educational Technology Support",
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
    "description": "Curriculum-aligned educational virtual reality demonstrations, science fairs, and STEM school workshops. Safe, supervised, and highly interactive."
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
        "name": "Educational VR Cape Town",
        "item": "https://www.virtualrealityguyz.co.za/educational-vr-cape-town"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What educational subjects can VR cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cover a wide array of STEM and humanities subjects. Key experiences include traveling through the Solar System, exploring human biology (inside cells, organs, and blood vessels), diving into ocean depths to study marine ecosystems, visiting historic world landmarks, and conducting virtual chemistry experiments."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe for primary school children?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we prioritize safety above all. We recommend educational VR sessions for children aged 8 (Grade 3) and up. Our supervisors set up strict guardian boundaries, select non-violent, age-appropriate content, and manage screen time carefully to prevent any eye strain or dizziness."
        }
      },
      {
        "@type": "Question",
        "name": "Can VR be used for matric exam preparation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Indeed. VR provides excellent spatial representations for complex biology topics (like protein synthesis, DNA structure, and cell division) and physics concepts (electromagnetism, atomic structure) which can help matric students visualize abstract syllabus requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide worksheets or lesson guides?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We coordinate with teachers beforehand to align our VR sessions with current classroom topics. We can provide summary sheets or recommend specific educational video extensions to help integrate the VR experience into your lesson plan."
        }
      },
      {
        "@type": "Question",
        "name": "How many students can participate in a school session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We structure school events based on your needs. For standard class demonstrations, we rotate groups of 10 to 15 students through our headsets in scheduled blocks. For school carnivals, science days, and fairs, we run high-capacity setups where dozens of students can experience short 5-minute educational journeys throughout the day."
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
            src="/images/vr-school.jpg"
            alt="Educational Virtual Reality Experience Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Transforming Learning Through Virtual Reality
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Educational <span className="text-primary">VR</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Take your students beyond the classroom walls! We deliver complete mobile VR stations to Cape Town schools, offering fully supervised, curriculum-aligned educational experiences.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book a School Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/school-vr-demonstrations">View VR Demos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Curriculum-Aligned Content</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Visual resources for science, history, geography, and biology. Let them stand on the moon or walk inside a human cell.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <GraduationCap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">CAPS & IEB Compatible</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Complement South African syllabus targets with spatial simulations that turn abstract concepts into easy-to-understand experiences.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Safe & Supervised</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Trained supervisors manage every session, ensuring child safety, headset sanitation, and curriculum guidance.
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
                Engage Students Like Never Before with STEM VR
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Traditional textbooks are excellent, but nothing matches the retention rate of active experience. Educational virtual reality places students directly inside their subject matter. Instead of just reading about the Solar System, they stand next to the rings of Saturn and watch planets orbit in real scale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We work alongside local educators in Cape Town to design scheduled class rotations, science fair exhibits, and high-throughput school carnival stages. We support critical learning areas including:
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Solar System & Space</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Human Body & Cells</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Geography & Geology</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Virtual Lab Experiments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>History & Archaeosites</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Deep Ocean Ecosystems</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 p-8 border border-border rounded-3xl space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground italic leading-relaxed">
                "We brought the VR guys out for our Grade 6 science module on space and ecosystems. The engagement level was absolutely off the charts. Students who usually struggle with reading were answering complex orbital questions after their virtual tour. An incredible tool that we'll be booking annually."
              </p>
              <div>
                <p className="font-bold text-foreground">Mrs. Patricia N.</p>
                <p className="text-xs text-muted-foreground">Grade 6 Teacher, Rondebosch Primary</p>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/school-vr-demonstrations">School VR Demonstrations <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-games-catalogue">Games Catalogue <ArrowRight className="ml-1 h-4 w-4" /></Link>
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
              <h3 className="font-bold text-lg text-foreground">What educational subjects can VR cover?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We cover a wide array of STEM and humanities subjects. Key experiences include traveling through the Solar System, exploring human biology (inside cells, organs, and blood vessels), diving into ocean depths to study marine ecosystems, visiting historic world landmarks, and conducting virtual chemistry experiments.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is it safe for primary school children?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we prioritize safety above all. We recommend educational VR sessions for children aged 8 (Grade 3) and up. Our supervisors set up strict guardian boundaries, select non-violent, age-appropriate content, and manage screen time carefully to prevent any eye strain or dizziness.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can VR be used for matric exam preparation?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Indeed. VR provides excellent spatial representations for complex biology topics (like protein synthesis, DNA structure, and cell division) and physics concepts (electromagnetism, atomic structure) which can help matric students visualize abstract syllabus requirements.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you provide worksheets or lesson guides?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We coordinate with teachers beforehand to align our VR sessions with current classroom topics. We can provide summary sheets or recommend specific educational video extensions to help integrate the VR experience into your lesson plan.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How many students can participate in a school session?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We structure school events based on your needs. For standard class demonstrations, we rotate groups of 10 to 15 students through our headsets in scheduled blocks. For school carnivals, science days, and fairs, we run high-capacity setups where dozens of students can experience short 5-minute educational journeys throughout the day.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure an Educational VR Session</h2>
            <p className="text-muted-foreground leading-relaxed">
              We coordinate setups with schools and educational institutions across Cape Town. Let us know your grade level and curriculum targets.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Fully vetted, safe, and professional school support</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Subsidized educational rates available</span>
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
