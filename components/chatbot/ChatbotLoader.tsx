'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const ChatbotWidget = dynamic(
  () => import('@/components/chatbot/ChatbotWidget'),
  { ssr: false },
)

export default function ChatbotLoader() {
  const pathname = usePathname()
  // The public-site chatbot must not appear in the admin portal, which has its own AI assistant
  if (pathname === '/admin' || pathname?.startsWith('/admin/')) return null
  return <ChatbotWidget />
}
