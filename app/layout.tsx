import type { Metadata } from 'next'
import { Orbitron, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import ChatbotLoader from '@/components/chatbot/ChatbotLoader'
import MobileActionBar from '@/components/MobileActionBar'
import AtmosphericBackground from '@/components/motion/AtmosphericBackground'
import PageTransition from '@/components/motion/PageTransition'
import './globals.css'
import { HERO_PHOTO_URL } from '@/lib/contact'

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

// Orbitron stays for headings; Manrope keeps body copy easy to read
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://virtualrealityguyz.co.za'),
  title: {
    default: 'Virtual Reality Guys | Mobile VR Gaming Experiences for Events',
    template: '%s | Virtual Reality Guys',
  },
  description: 'Bring the future of gaming to your event! Virtual Reality Guys provides immersive VR experiences for schools, parties, corporate events, and festivals in Cape Town. Book your unforgettable VR adventure today.',
  keywords: [
    'VR', 
    'virtual reality', 
    'mobile gaming', 
    'event entertainment', 
    'party entertainment', 
    'corporate events', 
    'school events',
    'VR events Cape Town',
    'mobile VR rentals',
    'Cape Town gaming party',
    'VR team building',
    'VR birthday party Cape Town',
    'virtual reality near me',
    'educational VR Cape Town',
    'VR Somerset West',
    'VR gaming near me',
    'augmented reality Cape Town'
  ],
  authors: [{ name: 'Virtual Reality Guys' }],
  creator: 'Virtual Reality Guys',
  publisher: 'Virtual Reality Guys',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Virtual Reality Guys | Mobile VR Gaming Experiences for Events',
    description: 'Bring the future of gaming to your event! Virtual Reality Guys provides immersive VR experiences for schools, parties, corporate events, and festivals in Cape Town.',
    url: 'https://virtualrealityguyz.co.za',
    siteName: 'Virtual Reality Guys',
    images: [
      {
        url: HERO_PHOTO_URL,
        alt: 'Kids playing VR at a birthday party in Cape Town',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Reality Guys | Mobile VR Gaming Experiences for Events',
    description: 'Bring the future of gaming to your event! VR Guys provides immersive mobile VR experiences in Cape Town.',
    images: [HERO_PHOTO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'C18WppheTUHeXpkc63QkmGcybgoxKiZ2w-W2PcObO5c',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Virtual Reality Guys",
    "url": "https://virtualrealityguyz.co.za",
    "logo": "https://virtualrealityguyz.co.za/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+27717800323",
      "contactType": "customer service",
      "areaServed": "ZA",
      "availableLanguage": ["English", "Afrikaans"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61570997009743",
      "https://www.instagram.com/virtualrealityguyz/"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Virtual Reality Guys",
    "url": "https://virtualrealityguyz.co.za",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://virtualrealityguyz.co.za/vr-games-catalogue?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="scroll-smooth bg-background" suppressHydrationWarning>
      <body className={`${manrope.className} ${manrope.variable} ${orbitron.variable} antialiased relative overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AtmosphericBackground />
        <PageTransition>{children}</PageTransition>
        <MobileActionBar />
        <ChatbotLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
