import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RepairsClient from "@/components/RepairsClient"
import { repairsData, fromPriceZar } from "@/lib/repairsData"

export const metadata: Metadata = {
  title: "VR Headset Repairs Cape Town | Meta Quest, PSVR2 & Valve Index",
  description:
    "Every repair we offer for VR headsets and controllers — Meta Quest 1, 2, 3, 3S & Pro, PSVR2 and Valve Index. Approve the exact price before any work starts.",
  alternates: { canonical: "/repairs" },
  openGraph: {
    title: "VR Headset Repairs Cape Town | Virtual Reality Guys",
    description:
      "Screen, charge port, battery, speaker, camera and controller repairs for Meta Quest, PSVR2 and Valve Index.",
    url: "https://virtualrealityguyz.co.za/repairs",
    images: [{ url: "/images/vr-hero.jpg", alt: "VR headset repairs Cape Town" }],
  },
}

export default function RepairsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualrealityguyz.co.za" },
      { "@type": "ListItem", position: 2, name: "All Repairs", item: "https://virtualrealityguyz.co.za/repairs" },
    ],
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "VR Headset & Controller Repairs",
    numberOfItems: repairsData.length,
    itemListElement: repairsData.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: r.title,
        description: r.desc,
        provider: { "@type": "LocalBusiness", name: "Virtual Reality Guys", areaServed: "Cape Town" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: fromPriceZar(r),
          availability: r.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Header />
      <main>
        <RepairsClient />
      </main>
      <Footer />
    </div>
  )
}
