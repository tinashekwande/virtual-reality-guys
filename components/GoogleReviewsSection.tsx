"use client"

import React from "react"
import { Star, CheckCircle, ExternalLink, MessageCircle } from "lucide-react"
import ScrollReveal from "@/components/motion/ScrollReveal"
import { realReviews, GOOGLE_REVIEWS_URL } from "@/lib/reviews"

// Google 4-Color Icon SVG
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
)

export default function GoogleReviewsSection() {
  // Limit displayed reviews to only 3 as requested; visitors can view all reviews on Google
  const displayedReviews = realReviews.slice(0, 3)

  return (
    <section 
      id="google-reviews" 
      className="py-20 sm:py-28 bg-gradient-to-b from-background via-background/40 to-background relative z-10 border-t border-border/40 overflow-hidden"
    >
      {/* Neon Ambient Background Blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header with Google 5-Star Badge */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-semibold text-slate-200 shadow-sm">
              <GoogleIcon className="w-4 h-4" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white font-bold">5.0 Star Rating</span>
              <span className="text-muted-foreground">on Google</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-tech uppercase">
              What People Are Saying
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real verified reviews from parents, schools, and clients across Cape Town.
            </p>
          </div>
        </ScrollReveal>

        {/* Reviews Cards Grid — exactly 3 featured reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {displayedReviews.map((review, idx) => (
            <ScrollReveal key={review.id} variant="fade-up" delay={idx * 80}>
              <div className="h-full bg-card/35 backdrop-blur-md border border-border/70 hover:border-primary/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 group">
                
                {/* Review Header: User info & Google Badge */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with fallback to initials */}
                      <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-md">
                        {review.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={review.avatarUrl}
                            alt={review.author}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If Google profile image fails to load, fall back to colored initials
                              const target = e.currentTarget
                              target.style.display = "none"
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = "flex"
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full bg-gradient-to-br ${review.avatarBg} text-white font-bold flex items-center justify-center text-sm ${review.avatarUrl ? "hidden" : "flex"}`}
                        >
                          {review.avatarInitials}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {review.author}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {review.authorMeta}
                        </p>
                      </div>
                    </div>

                    {/* Google Mini Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border/80 text-[10px] text-slate-300 shrink-0">
                      <GoogleIcon className="w-3.5 h-3.5" />
                      <span>Google</span>
                    </div>
                  </div>

                  {/* Stars & Event Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <span className="text-[10px] font-semibold tracking-wide text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {review.highlightBadge}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Owner Response Block if available */}
                  {review.ownerResponse ? (
                    <div className="mt-4 p-3 rounded-2xl bg-primary/5 border border-primary/20 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <MessageCircle className="w-3 h-3" />
                        <span>Virtual Reality Guyz (Response)</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        &ldquo;{review.ownerResponse}&rdquo;
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Footer: Verified Review & Date */}
                <div className="pt-4 mt-5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Google Review
                  </span>
                  <span>{review.date}</span>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Direct Google Reviews Action — See More on Google */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="text-center space-y-4 pt-2">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-secondary/90 hover:bg-secondary border border-border/80 hover:border-primary/50 text-base font-bold text-white transition-all duration-300 shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 group"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>See More Reviews on Google</span>
              <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-xs text-muted-foreground">
              Rated 5.0 / 5.0 on Google · See all customer reviews & photos directly on Google
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
