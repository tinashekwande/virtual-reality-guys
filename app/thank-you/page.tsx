import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Phone, Mail, Home, Gamepad2, GraduationCap } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CyberButton } from "@/components/ui/cyber-button"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Thank You — Enquiry Received",
  description: "Thank you for contacting Virtual Reality Guys. We have received your enquiry and will get back to you within 24 hours.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/thank-you",
  },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-2xl w-full bg-card/90 backdrop-blur-md border border-primary/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-primary/10">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto text-primary shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-semibold tracking-wider uppercase inline-block">
              Submission Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-tech tracking-tight text-foreground">
              Thank You! We&apos;ve Received Your Request.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Our team has received your details and is reviewing availability and requirements. We will get back to you within <strong className="text-foreground">24 hours</strong> with your tailored response or quotation.
            </p>
          </div>

          {/* Direct Contact / Fast-Track Box */}
          <div className="bg-secondary/40 border border-border rounded-2xl p-5 text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Need an Urgent Response?
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If your event or school session is coming up soon, feel free to reach out to us directly on WhatsApp or by phone:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm">
              <a
                href="https://wa.me/27717800323"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-emerald-400 hover:underline"
              >
                <Phone className="h-4 w-4" />
                WhatsApp / Call: +27 71 780 0323
              </a>
              <a
                href="mailto:info@virtualrealityguyz.co.za"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                info@virtualrealityguyz.co.za
              </a>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4">
            <CyberButton href="/" size="default" variant="primary">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </CyberButton>
            <Button asChild variant="outline" size="default">
              <Link href="/vr-games-catalogue">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Explore VR Catalogue
              </Link>
            </Button>
            <Button asChild variant="outline" size="default">
              <Link href="/school-vr-demonstrations">
                <GraduationCap className="mr-2 h-4 w-4" />
                School VR Experiences
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
