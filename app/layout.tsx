import type { Metadata } from 'next'
import { Orbitron, Mina } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import ChatbotLoader from '@/components/chatbot/ChatbotLoader'
import AtmosphericBackground from '@/components/motion/AtmosphericBackground'
import PageTransition from '@/components/motion/PageTransition'
import './globals.css'

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const mina = Mina({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-mina",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.virtualrealityguyz.co.za'),
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
    url: 'https://www.virtualrealityguyz.co.za',
    siteName: 'Virtual Reality Guys',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Virtual Reality Guys Logo',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Reality Guys | Mobile VR Gaming Experiences for Events',
    description: 'Bring the future of gaming to your event! VR Guys provides immersive mobile VR experiences in Cape Town.',
    images: ['/images/logo.png'],
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
    "url": "https://www.virtualrealityguyz.co.za",
    "logo": "https://www.virtualrealityguyz.co.za/images/logo.png",
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

  return (
    <html lang="en" className="scroll-smooth bg-background" suppressHydrationWarning>
      <body className={`${mina.className} ${orbitron.variable} antialiased relative overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AtmosphericBackground />
        <PageTransition>{children}</PageTransition>
        <ChatbotLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
