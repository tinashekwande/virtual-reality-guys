import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Virtual Reality Guys. Read our booking terms, cancellation policy, and service conditions.',
  alternates: {
    canonical: '/terms-of-service',
  },
}

export default function TermsOfServicePage() {
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
        "name": "Terms of Service",
        "item": "https://virtualrealityguyz.co.za/terms-of-service"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-primary max-w-none space-y-6">
          <p className="text-muted-foreground">
            <strong>Last Updated: {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</strong>
          </p>

          <p>
            Welcome to Virtual Reality Guys. By booking our services or using our website, you agree to be bound by the following Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">1. Service Description</h2>
          <p>
            Virtual Reality Guys provides mobile VR gaming entertainment services in the Cape Town area. We deliver, set up, supervise, and pack up Virtual Reality equipment (including Meta Quest headsets) at the client's requested venue.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">2. Bookings and Payment</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>A booking is only confirmed once we receive your deposit or full payment, as agreed upon during the booking process.</li>
            <li>Pricing displayed on our website is indicative and may be subject to travel fees depending on your specific location outside our free delivery zones.</li>
            <li>Full payment must be completed prior to the start of the event setup unless otherwise arranged.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">3. Cancellation Policy</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Cancellations made with more than 48 hours' notice will receive a full refund of any deposits paid, or you may choose to reschedule.</li>
            <li>Cancellations made within 48 hours of the event start time are non-refundable, as we have already committed our staff and equipment to your time slot.</li>
            <li>We reserve the right to cancel or postpone an event due to severe weather (for outdoor setups) or unforeseen circumstances. In such cases, a full refund or rescheduling will be offered.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">4. Age Restrictions & Supervision</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Our VR equipment is suitable for players aged 8 and older.</li>
            <li>For minors under the age of 18, parental or guardian consent is required.</li>
            <li>An adult must be present at all times during events involving children to assist with general supervision, while our staff focuses on VR operation and safety.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">5. Space & Setup Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>The client must provide adequate clear space (approximately 2.5m x 2.5m per headset) free from tripping hazards.</li>
            <li>If the event is outdoors, a fully covered area (e.g., gazebo, tent, or patio roof) is strictly required to protect the equipment from direct sunlight and weather. Direct sunlight damages VR lenses permanently.</li>
            <li>We require access to standard electrical outlets within a reasonable distance from the setup area.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">6. Equipment Care & Liability</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Our staff provides full instructions on the safe handling of VR equipment.</li>
            <li>The client accepts liability for any malicious, intentional, or negligent damage caused to the equipment by attendees during the rental period.</li>
            <li>Virtual Reality Guys is not liable for any minor injuries (such as motion sickness or bumping into objects) resulting from failure to follow our staff's safety instructions.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">7. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of South Africa. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of South Africa.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">8. Contact Information</h2>
          <p>
            If you have any questions regarding these Terms of Service, please contact us:
          </p>
          <div className="bg-secondary/20 p-6 rounded-lg border border-border mt-4">
            <p><strong>Email:</strong> <a href="mailto:virtualrealityguyz@gmail.com" className="text-primary hover:underline">virtualrealityguyz@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+27717800323" className="text-primary hover:underline">+27 71 780 0323</a></p>
            <p><strong>Location:</strong> Cape Town, South Africa</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
