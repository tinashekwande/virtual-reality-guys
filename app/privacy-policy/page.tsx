import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Virtual Reality Guys. Learn how we collect, use, and protect your personal information in accordance with POPIA.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
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
        "name": "Privacy Policy",
        "item": "https://virtualrealityguyz.co.za/privacy-policy"
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
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-primary max-w-none space-y-6">
          <p className="text-muted-foreground">
            <strong>Last Updated: {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</strong>
          </p>

          <p>
            Virtual Reality Guys ("we", "us", or "our") operates the mobile VR entertainment service in Cape Town, South Africa, and the virtualrealityguyz.co.za website. We respect your privacy and are committed to protecting your personal information.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">1. POPIA Compliance</h2>
          <p>
            As a business operating in South Africa, we are committed to complying with the Protection of Personal Information Act (POPIA). This policy outlines how we collect, use, process, and protect your personal information when you use our website or services.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">2. Information We Collect</h2>
          <p>
            We only collect information that is necessary to provide our services to you. When you fill out our booking forms or contact us, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Your full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Event location and address details</li>
            <li>Information about your event (type, date, number of attendees)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">3. How We Use Your Information</h2>
          <p>
            We use the information we collect strictly for business purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Processing and confirming your VR entertainment bookings</li>
            <li>Responding to your enquiries and providing customer support</li>
            <li>Communicating with you regarding your scheduled event</li>
            <li>Improving our website and services</li>
          </ul>
          <p>
            <strong>We do not sell, rent, or trade your personal information to third parties.</strong>
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">4. Cookies and Analytics</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. We only use essential cookies required for the website to function properly, along with analytics (via Vercel Analytics) to understand how visitors interact with our site. These analytics tools collect anonymized data such as page views and general geographic location, helping us improve our user experience.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, loss, or destruction. We limit access to your data strictly to personnel who need it to fulfill their duties.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">6. Your Rights</h2>
          <p>
            Under POPIA, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction or deletion of your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>Withdraw consent at any time (where processing is based on consent)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, wish to exercise your data rights, or have concerns about how we handle your information, please contact us at:
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
