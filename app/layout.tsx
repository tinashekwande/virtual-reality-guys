import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.virtualrealityguys.co.za'),
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
    'VR team building'
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
    url: 'https://www.virtualrealityguys.co.za',
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
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  verification: {
    google: 'cyxybVOhDbj04MxSzK7uCW5nEUcQmcjwlkLKFDzTSIU',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <body className={`${geist.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
