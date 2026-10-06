"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, CheckCircle, ExternalLink, MessageSquare, Award, MessageCircle } from "lucide-react"
import ScrollReveal from "@/components/motion/ScrollReveal"
import { CyberButton } from "@/components/ui/cyber-button"

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

export interface RealGoogleReview {
  id: string
  author: string
  avatarUrl?: string
  avatarInitials: string
  avatarBg: string
  authorMeta: string
  isLocalGuide?: boolean
  category: "birthday" | "school" | "service"
  rating: number
  date: string
  text: string
  highlightBadge: string
  ownerResponse?: string
}

const GOOGLE_REVIEWS_URL = "https://share.google/H4n0ieB80TKFBp6IS"

const realReviews: RealGoogleReview[] = [
  {
    id: "review-francois",
    author: "Francois Du Plessis",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocIZTgdmBQI_51daW15BoedapLYx9NcbzFq8jwMcca7AQsoxqQ=s64-c-rp-mo-br100",
    avatarInitials: "FP",
    avatarBg: "from-blue-500 to-indigo-600",
    authorMeta: "4 reviews · 4 photos",
    isLocalGuide: false,
    category: "birthday",
    rating: 5,
    date: "2 weeks ago",
    highlightBadge: "Son's 9th Birthday",
    text: "What an amazing experience! The VR guys went above and beyond to create the best birthday experience for my son’s 9th birthday. 🎉🎮 The service was fantastic, the kids had an absolute blast, and the guys were amazing — friendly, professional, energetic, and great with the kids. My son and his friends had so much fun and are still talking about it! 😄 Highly recommended for an unforgettable birthday experience! Thank you to the VR reality guys for making his 9th birthday so special! 🥳🎮👏"
  },
  {
    id: "review-leon",
    author: "Leon Botha",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocIFcyU1vponlLboSRR-Nw0BE8RSaBdsqy57G8ZOV_M-hpT4BQ=s64-c-rp-mo-ba12-br100",
    avatarInitials: "LB",
    avatarBg: "from-amber-500 to-orange-600",
    authorMeta: "Local Guide · 65 reviews · 2 photos",
    isLocalGuide: true,
    category: "birthday",
    rating: 5,
    date: "a month ago",
    highlightBadge: "Local Guide · Birthday Party",
    text: "Great experience, and an fantastic entertainment for n birthday party. Boys had an blast, friendly and professional service. On time, and gone the extra mile for the kids. Highly recommend!",
    ownerResponse: "Thank you so much for the wonderful review! 🙏 We’re thrilled to hear that the boys had such a fantastic time and that you were happy with our service. It was a pleasure being part of the birthday celebration! 🎉🥳 We truly appreciate your recommendation and look forward to creating more unforgettable experiences in the future! 🚀🥽"
  },
  {
    id: "review-carine",
    author: "Carine Malan",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWlkWN4G9fPM4pQG3JR8xI82maDrTWEk80VA0AsCf2VY9LIk0KZ=s64-c-rp-mo-br100",
    avatarInitials: "CM",
    avatarBg: "from-emerald-500 to-teal-600",
    authorMeta: "2 reviews · 1 photo",
    isLocalGuide: false,
    category: "school",
    rating: 5,
    date: "2 weeks ago",
    highlightBadge: "School Recommendation",
    text: "Our kids loved it! Definitely a MUST for schools."
  },
  {
    id: "review-tj",
    author: "TJ Ford",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXed04i3WC2_VEamQx50p7vKC4L05GzbwXXDIIO44YmsVodA7J0AA=s64-c-rp-mo-ba12-br100",
    avatarInitials: "TF",
    avatarBg: "from-cyan-500 to-blue-600",
    authorMeta: "Local Guide · 46 reviews · 12 photos",
    isLocalGuide: true,
    category: "birthday",
    rating: 5,
    date: "a month ago",
    highlightBadge: "Local Guide · Family Gaming",
    text: "My son had so much fun. A really great experience and he will definitely be back again. A great range of games to play."
  },
  {
    id: "review-kimberly",
    author: "Kimberly Budge",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocKb_UUvCJye7RbxOFpdcXZgCBZDfq5akikf49k2L-R3wMjYvA=s64-c-rp-mo-br100",
    avatarInitials: "KB",
    avatarBg: "from-purple-500 to-indigo-600",
    authorMeta: "3 reviews",
    isLocalGuide: false,
    category: "service",
    rating: 5,
    date: "a month ago",
    highlightBadge: "Knowledgeable & Friendly",
    text: "Very cool experience and very friendly and knowledgable."
  },
  {
    id: "review-zanele",
    author: "zanele phangwa",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUrh922JSdaRSk07xk_JFi7b2Bc6nNIH7pw4U2ZZ5gsV0i2F2gi=s64-c-rp-mo-br100",
    avatarInitials: "ZP",
    avatarBg: "from-pink-500 to-rose-600",
    authorMeta: "1 review",
    isLocalGuide: false,
    category: "birthday",
    rating: 5,
    date: "a week ago",
    highlightBadge: "Kids Loved It",
    text: "my kids really enjoyed the games ,amazing"
  },
  {
    id: "review-tinashe",
    author: "Tinashe Sabora",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWO6EskrYtPYGJLGz-gyz_QWukIMbDD26sDMTOmpjfBj7ppCX0=s64-c-rp-mo-br100",
    avatarInitials: "TS",
    avatarBg: "from-violet-500 to-purple-600",
    authorMeta: "2 reviews",
    isLocalGuide: false,
    category: "service",
    rating: 5,
    date: "a month ago",
    highlightBadge: "Great With Kids",
    text: "These guys are amazing, your work with the children is spectacular"
  },
  {
    id: "review-mainas",
    author: "Mainas Chirwa",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXd50OKR5GIjAYn7sxyfKSJExx3Y9ZJgvMrE7kqzq7ZPFegJjVn=s64-c-rp-mo-br100",
    avatarInitials: "MC",
    avatarBg: "from-sky-500 to-cyan-600",
    authorMeta: "2 reviews",
    isLocalGuide: false,
    category: "service",
    rating: 5,
    date: "a month ago",
    highlightBadge: "Verified Client",
    text: "Great experience 🙏"
  },
  {
    id: "review-taryn",
    author: "Taryn Owen - Davies",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocLIVbb_lLKtKFPDPPYXFtxdNm9PJz1kRvrNgXmel2ZQ-zBOXQ=s64-c-rp-mo-br100",
    avatarInitials: "TO",
    avatarBg: "from-teal-500 to-emerald-600",
    authorMeta: "Verified Google Reviewer",
    isLocalGuide: false,
    category: "service",
    rating: 5,
    date: "a month ago",
    highlightBadge: "5-Star Rating",
    text: "5-Star Google rating for Virtual Reality Guyz mobile gaming & entertainment services in Cape Town."
  },
  {
    id: "review-panashe",
    author: "Panashe Majinga",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocIh_pBx36DRE9KKhDGr973MTl7Jhx0o_asDCFihHpY9KL4m0g=s64-c-rp-mo-br100",
    avatarInitials: "PM",
    avatarBg: "from-indigo-500 to-blue-600",
    authorMeta: "3 reviews · 4 photos",
    isLocalGuide: false,
    category: "service",
    rating: 5,
    date: "5 months ago",
    highlightBadge: "Event Photos Added",
    text: "5-Star Google review with event photos celebrating our mobile VR setup and gaming experiences."
  }
]

export default function GoogleReviewsSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "birthday" | "school" | "service">("all")

  const filteredReviews = activeCategory === "all"
    ? realReviews
    : realReviews.filter(r => r.category === activeCategory)

  return (
    <section 
      id="google-reviews" 
      className="py-20 sm:py-28 bg-gradient-to-b from-background via-background/40 to-background relative z-10 border-b border-border/40 overflow-hidden"
    >
      {/* Neon Ambient Background Blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Badge & Social Proof Ribbon */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            
            {/* Google Rating Pill Badge */}
            <a 
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/60 hover:bg-card/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-amber-500/5 transition-all group"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Google Verified Reviews</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="flex items-center gap-1 font-bold text-white">
                4.8
                <span className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-amber-300 transition-colors" />
            </a>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-tech uppercase">
              Rated <span className="text-primary">4.8 Stars</span> on Google
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Read real reviews from parents, schools, and clients across Cape Town who have experienced our mobile VR gaming setups firsthand.
            </p>
          </div>
        </ScrollReveal>

        {/* Quick Stats Banner */}
        <ScrollReveal variant="zoom-in" delay={150}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/60 mb-12 shadow-xl">
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-white flex items-center justify-center gap-1">
                4.8 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Google Rating</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-primary">
                10
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Verified Reviews</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-white">
                100%
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">5-Star Feedback</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-cyan-400">
                Turnkey
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Supervised Setup</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Reviews (10)" },
            { id: "birthday", label: "Birthdays & Kids" },
            { id: "school", label: "Schools & STEM" },
            { id: "service", label: "Client Experiences" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-black font-bold shadow-md shadow-primary/25"
                  : "bg-card/50 text-muted-foreground hover:text-white hover:bg-card border border-border/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {filteredReviews.map((review, idx) => (
            <ScrollReveal key={review.id} variant="fade-up" delay={idx * 60}>
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

        {/* Bottom CTA & Direct Google Reviews Action */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-card/60 via-card/80 to-card/60 border border-primary/30 text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-tech uppercase">
                Ready for an Unforgettable VR Experience?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Join our family of happy clients across Cape Town. We bring high-end VR gear, calibrated safety boundaries, and trained staff directly to your venue.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <CyberButton href="#contact" size="lg" variant="primary">
                Book Your Event Now
              </CyberButton>

              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/80 hover:border-primary/40 text-sm font-semibold text-white transition-all duration-300 shadow-md hover:shadow-primary/10"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>View All Reviews on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
