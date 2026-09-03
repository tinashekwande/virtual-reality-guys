import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Sparkles, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Educational VR School Demonstrations Cape Town | Mobile Setup',
  description: 'Bring science and history to life! Interactive, educational, and safe Virtual Reality school demonstrations and carnivals in Cape Town.',
  alternates: {
    canonical: '/school-vr-demonstrations',
  },
  openGraph: {
    title: 'Educational VR School Demonstrations Cape Town | Mobile Setup',
    description: 'Looking for engaging school demonstrations in Cape Town? We deliver fully supervised educational VR setups directly to your classroom or school hall.',
    url: 'https://virtualrealityguyz.co.za/school-vr-demonstrations',
    images: [{ url: '/images/vr-school.jpg', alt: 'VR School Demonstration Cape Town' }],
  }
}

export default function SchoolVRPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Educational VR School Demonstrations",
    "serviceType": "Educational Event & Amusement",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "image": "https://virtualrealityguyz.co.za/images/logo.png",
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
    "description": "Safe, fully supervised educational virtual reality installations for schools, classrooms, and school carnivals in Cape Town. Science, history, and interactive learning."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What educational subjects do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a diverse range of educational experiences, including space exploration (walking on the Moon or exploring the solar system), human biology (traveling inside a cell or the bloodstream), history walkthroughs (explaining ancient Egypt or Rome), oceanography, and interactive physics labs."
        }
      },
      {
        "@type": "Question",
        "name": "Are your supervisors cleared to work with children?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, safety and trust are paramount. All of our friendly event facilitators and supervisors are background-checked, fully vetted, and highly experienced in working with school-aged children and student groups."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer school carnival or sports day entertainment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we regularly set up at school fundraisers, fun fairs, carnivals, and cultural days. We establish multiple high-throughput gaming booths where students can play quick, fun games (like Beat Saber or sports challenges) with all proceeds or tickets supporting the school."
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
        "item": "https://virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "School VR Demonstrations",
        "item": "https://virtualrealityguyz.co.za/school-vr-demonstrations"
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
            src="/images/vr-school.jpg"
            alt="Educational VR School Demonstrations in Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Immersive Learning & School Carnivals
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            School VR <span className="text-primary">Demonstrations</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Take learning beyond the textbook! We deliver highly engaging, educational, and safe Virtual Reality demonstrations and fun carnivals directly to Cape Town schools.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Inquire for School</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kids-parties">Explore Kids Parties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Curriculum-Aligned Learning</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Take students inside the solar system, ancient Rome, or the human heart. High-retention experiences that perfectly complement class learning.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <GraduationCap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Vetted & Cleared Staff</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Safety and professionalism first. All of our friendly event supervisors are background-checked and highly trained in working with students.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">School Carnivals & Fairs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Draw huge crowds at school carnivals. Our fast-throughput gaming booths (e.g. Beat Saber) are perfect fundraisers for student bodies.
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
                Safe, Supervised, and Sanitized Educational Experiences
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Looking for unique educational ideas or school demonstrations in Cape Town? Virtual Reality Guys provides fully supervised mobile stations. We map physical boundaries inside school halls or classrooms, handle hardware setup, deliver age-appropriate non-violent educational walkthroughs, and keep everything sanitized with medical wipes between users.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>30+ educational experiences (Space, Biology, History, Physics)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Spectator screens letting class groups watch their peers' gameplay in real time</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Strict anti-bacterial sanitation wiped down between every user</span>
                </li>
              </ul>
            </div>



          </div>
          
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <div className="w-full mb-4">
              <Link href="/educational-vr-cape-town" className="text-primary font-semibold hover:underline">
                Learn more about our Curriculum-Aligned Educational VR &rarr;
              </Link>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/educational-vr-cape-town">Educational VR <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/family-fun-day-experiences">Family Fun Days <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">School VR FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What educational subjects do you cover?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We offer a diverse range of educational experiences, including space exploration (walking on the Moon or exploring the solar system), human biology (traveling inside a cell or the bloodstream), history walkthroughs (explaining ancient Egypt or Rome), oceanography, and interactive physics labs.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Are your supervisors cleared to work with children?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, safety and trust are paramount. All of our friendly event facilitators and supervisors are background-checked, fully vetted, and highly experienced in working with school-aged children and student groups.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you offer school carnival or sports day entertainment?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we regularly set up at school fundraisers, fun fairs, carnivals, and cultural days. We establish multiple high-throughput gaming booths where students can play quick, fun games (like Beat Saber or sports challenges) with all proceeds or tickets supporting the school.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What VR activities are available for schools?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our school VR activities range from detailed, curriculum-aligned deep dives (like exploring the human body or the solar system for science classes) to high-energy, fun interactive sessions suitable for school carnivals and end-of-term celebrations. We tailor the activities to match your specific school event.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How do I book a VR demo for my school?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Booking a demo is easy! Simply fill out our contact form with your school's location, the number of students, and your preferred dates. Our team will get back to you to discuss space requirements, session scheduling, and a customized plan for your school VR activities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure a School Demonstration Date</h2>
            <p className="text-muted-foreground leading-relaxed">
              Planning a science week or a school bazaar? Contact us today to discuss subjects, group numbers, and classroom availability, and we will provide a specialized educational proposal.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive planning and coordination</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Budget-friendly pricing models for school budgets</span>
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
