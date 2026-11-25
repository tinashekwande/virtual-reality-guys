/** Real Google reviews from the Virtual Reality Guys business profile (shared data). */

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

export const GOOGLE_REVIEWS_URL = "https://share.google/H4n0ieB80TKFBp6IS"

export const realReviews: RealGoogleReview[] = [
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
