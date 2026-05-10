import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Virtual Reality Guys | Mobile VR Gaming Experiences for Events',
  description: 'Bring the future of gaming to your event! Virtual Reality Guys provides immersive VR experiences for schools, parties, corporate events, and festivals. Book your unforgettable VR adventure today.',
  keywords: ['VR', 'virtual reality', 'mobile gaming', 'event entertainment', 'party entertainment', 'corporate events', 'school events'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/logo.png',
        type: 'image/png',
        sizes: '192x192',
      },
    ],
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
