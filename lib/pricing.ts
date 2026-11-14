// Single place for public party pricing on the website.
//
// SHOW_PRICES = false  → the site shows packages without prices ("free quote").
// SHOW_PRICES = true   → the prices below show everywhere (cards, FAQs, titles,
//                         booking form, chatbot, structured data).
// To test different prices, change the numbers below and set SHOW_PRICES = true.
//
// Price test log:
//   until 27 Sep 2026  Starter R999 / Standard R1,499 / Premium R1,999
//   27 Sep – 6 Nov     Starter R899 / Standard R1,299 / Premium R1,499 (no transport fee shown)
//   6 Nov – 14 Nov     Starter R999 / Standard R1,499 / Premium R1,999 + transport fees shown
//   from 14 Nov        prices hidden (this switch), one-week test

export const SHOW_PRICES = false

export const PRICES = {
  starter: 999,
  standard: 1499,
  premium: 1999,
  extraHour: 350,
  extraHeadset: 150,
  transportNear: 200, // venues up to ~25 km outside the free zone
  transportFarMin: 350,
  transportFarMax: 500,
}

/** 1499 → "R1,499" */
export const rand = (n: number) => `R${n.toLocaleString("en-US")}`

export const FROM_PRICE = rand(PRICES.starter)

/** " From R999" when prices are shown, otherwise "" — for titles and taglines. */
export const fromSuffix = (sep = " ") => (SHOW_PRICES ? `${sep}From ${FROM_PRICE}` : "")

export const FREE_TRANSPORT_AREAS =
  "Kraaifontein, Brackenfell, Durbanville, Bellville, Kuils River, Joostenberg Vlakte, Pinehurst and Buh-Rein Estate"

export const PACKAGES_PRICE_TEXT = SHOW_PRICES
  ? `Our party packages are Starter ${rand(PRICES.starter)} (4 headsets, 2 hours, up to 8 players), Standard ${rand(PRICES.standard)} (5 headsets, 3 hours, up to 12 players) and Premium ${rand(PRICES.premium)} (6 headsets, 4 hours, up to 20 players). All include setup, trained supervisors and cleanup. Schools and corporate events are quoted separately.`
  : "Pricing depends on your package, group size and location. Tell us about your event and we'll send you a free, no-obligation quote. Every package includes setup, trained supervisors and cleanup."

export const ADDONS_TEXT = `extra hour ${rand(PRICES.extraHour)} · extra headset ${rand(PRICES.extraHeadset)}`

export const TRANSPORT_TEXT = SHOW_PRICES
  ? `Transport is free in ${FREE_TRANSPORT_AREAS}. Venues up to about 25 km away pay ${rand(PRICES.transportNear)}, and further areas (e.g. Somerset West, Constantia, Fish Hoek, Simon’s Town) pay ${rand(PRICES.transportFarMin)}–${rand(PRICES.transportFarMax)}.`
  : `Transport is free in ${FREE_TRANSPORT_AREAS}. For other areas, tell us your suburb and we'll include transport in your quote.`

/** Offer price fields for JSON-LD; empty when prices are hidden. */
export const offerPrice = (n: number) =>
  SHOW_PRICES ? { price: String(n), priceCurrency: "ZAR" } : {}

/** Extra instruction for the website chatbot when prices are hidden. */
export const CHATBOT_PRICE_RULE = SHOW_PRICES
  ? ""
  : `
TEMPORARY PRICING POLICY (overrides the price figures above):
- Do NOT state any package, add-on or transport prices, even if asked directly, and even though they appear in the knowledge base.
- If someone asks about price, say pricing depends on the package, group size and location, and offer to send a free, no-obligation quote.
- Then collect what is needed for the quote: event date, suburb, number of players, and a phone number or email.
`
