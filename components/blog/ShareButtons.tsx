// components/blog/ShareButtons.tsx
"use client"

import { useState, useEffect } from "react"
import { Facebook, Twitter, Link2, Check, Share2 } from "lucide-react"

interface ShareButtonsProps {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(`${window.location.origin}/blog/${slug}`)
  }, [slug])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-3 py-4 border-y border-border/60 my-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mr-2">
        <Share2 className="h-3.5 w-3.5" /> Share Article:
      </span>
      
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4 fill-current" />
      </a>

      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
        title="Share on X"
      >
        <Twitter className="h-4 w-4 fill-current" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
        title="Share on WhatsApp"
      >
        {/* Simple phone/whatsapp-like icon in Lucide is message-square or custom svg */}
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.499.99 6.062.99 1.635 5.36 1.631 10.79c-.001 1.724.453 3.41 1.32 4.916l-.997 3.639 3.731-.977-.02-.016zM17.65 14.96c-.328-.164-1.94-.957-2.24-1.067-.302-.11-.522-.164-.743.164-.22.33-.855 1.066-1.047 1.285-.193.22-.386.247-.714.083-.328-.164-1.385-.51-2.637-1.627-.974-.87-1.632-1.944-1.823-2.272-.193-.33-.02-.508.145-.671.147-.146.328-.384.492-.575.164-.192.219-.328.328-.548.11-.219.055-.411-.027-.575-.082-.164-.743-1.792-1.018-2.45-.268-.644-.542-.556-.743-.566-.19-.01-.41-.012-.628-.012-.22 0-.576.082-.878.411-.3.33-1.155 1.127-1.155 2.748 0 1.62 1.182 3.19 1.346 3.41.164.22 2.325 3.551 5.632 4.979.787.34 1.4.542 1.88.697.79.25 1.512.214 2.081.129.635-.095 1.94-.794 2.214-1.56.274-.767.274-1.424.192-1.56-.08-.135-.3-.219-.628-.383z"/>
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors ml-auto relative cursor-pointer"
        title="Copy link to clipboard"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-400" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded border border-border font-medium shadow-md">
              Copied!
            </span>
          </>
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
