import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VRCatalogueClient from "@/components/VRCatalogueClient"

export const metadata: Metadata = {
  title: 'VR Games & Experiences Catalogue | Virtual Reality Guys',
  description: 'Explore our immersive virtual reality games catalogue! Grouped by category, including horror, combat, sports, racing, shooting, and educational experiences.',
  alternates: {
    canonical: '/vr-games-catalogue',
  },
  openGraph: {
    title: 'VR Games & Experiences Catalogue | Virtual Reality Guys',
    description: 'Browse the ultimate virtual reality entertainment library perfect for birthday parties, schools, corporate events, and festivals in Cape Town.',
    url: 'https://www.virtualrealityguyz.co.za/vr-games-catalogue',
    images: [{ url: '/images/vr-hero.jpg', alt: 'VR Games Catalogue Hub' }],
  }
}

export default function VRCataloguePage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <Header />
      <main className="print:m-0 print:p-0">
        <VRCatalogueClient />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
