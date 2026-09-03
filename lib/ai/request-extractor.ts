import { generateAiContent } from './client'
import { getMasterSystemInstruction } from './context'

export interface ExtractedRequestData {
  client_name?: string
  client_email?: string
  client_phone?: string
  event_type: string
  event_date?: string
  player_count?: number
  location?: string
  recommended_package: {
    name: string
    price_zar: number
    headset_count: number
    duration_hours?: number
    reason: string
  }
  intent_level: 'High' | 'Medium' | 'Low'
  missing_fields: string[]
  suggested_reply: string
}

/**
 * Parses unstructured natural-language enquiries into structured business parameters
 * using website package baselines:
 * - Starter: R499 (2 headsets, 2 hours, <= 10 players)
 * - Standard: R899 (4 headsets, 3 hours, 11-20 players)
 * - Premium: R1,299 (6 headsets, 4 hours, 21-40 players)
 * - Corporate: R1,499 (6-8 headsets, 4 hours)
 * - School: R899 (demo) or custom
 */
export async function extractRequestDetails(
  rawMessage: string,
  senderName?: string,
  senderEmail?: string,
  senderPhone?: string
): Promise<ExtractedRequestData> {
  // Deterministic baseline heuristics
  let eventType = 'Birthday Party'
  let playerCount = 12
  let location = 'Cape Town'
  let targetDate = ''

  const msgLower = rawMessage.toLowerCase()
  if (msgLower.includes('school') || msgLower.includes('student') || msgLower.includes('curriculum')) {
    eventType = 'School VR Demonstration'
    playerCount = 30
  } else if (msgLower.includes('corporate') || msgLower.includes('team') || msgLower.includes('company') || msgLower.includes('staff')) {
    eventType = 'Corporate Team Building'
    playerCount = 20
  } else if (msgLower.includes('festival') || msgLower.includes('expo') || msgLower.includes('activation')) {
    eventType = 'Brand Expo / Festival'
    playerCount = 50
  }

  // Extract date mention if present
  const dateMatch = rawMessage.match(/\b(20\d{2}-\d{2}-\d{2})\b/) || rawMessage.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})\b/)
  if (dateMatch) {
    targetDate = dateMatch[0]
  }

  // Extract player count if specified
  const numMatch = rawMessage.match(/\b(\d{1,3})\s*(kids|children|players|people|guests|adults|participants|students)\b/i)
  if (numMatch) {
    playerCount = parseInt(numMatch[1], 10)
  }

  // Default baseline package recommendation
  let recPackage = {
    name: 'Standard Package',
    price_zar: 899,
    headset_count: 4,
    duration_hours: 3,
    reason: 'Ideal for 11–20 players with 4 VR headsets, 3 hours of play, and 2 dedicated supervisors.',
  }

  if (eventType.includes('School')) {
    recPackage = {
      name: 'School / Educational VR Experience',
      price_zar: 899,
      headset_count: 4,
      duration_hours: 3,
      reason: 'Structured educational science & exploration VR stations for students.',
    }
  } else if (eventType.includes('Corporate') || eventType.includes('Expo')) {
    recPackage = {
      name: 'Corporate Event VR Package',
      price_zar: 1499,
      headset_count: 6,
      duration_hours: 4,
      reason: 'High-energy corporate activation with spectator displays and multiplayer leaderboards.',
    }
  } else if (playerCount <= 10) {
    recPackage = {
      name: 'Starter Package',
      price_zar: 499,
      headset_count: 2,
      duration_hours: 2,
      reason: 'Perfect for intimate gatherings up to 10 players with 2 headsets and 1 supervisor.',
    }
  } else if (playerCount > 20) {
    recPackage = {
      name: 'Premium Package',
      price_zar: 1299,
      headset_count: 6,
      duration_hours: 4,
      reason: 'Maximum throughput for 20–40 players with 6 headsets, 4 hours, and 3 supervisors.',
    }
  }

  const missingFields: string[] = []
  if (!senderName) missingFields.push('Customer Name')
  if (!senderPhone) missingFields.push('Phone Number / WhatsApp')
  if (!targetDate && !rawMessage.match(/\b(today|tomorrow|saturday|sunday|weekend|next week|\d{1,2}(st|nd|rd|th)?)\b/i)) {
    missingFields.push('Preferred Event Date & Start Time')
  }
  if (!rawMessage.match(/\b(in|at|venue|location|suburb|durbanville|bellville|brackenfell|cape town|stellenbosch|somerset|camps bay|constantia)\b/i)) {
    missingFields.push('Exact Venue Address in Cape Town')
  }
  if (!numMatch) {
    missingFields.push('Estimated Number of Players / Age Group')
  }

  // AI extraction and package recommendation using Gemini
  try {
    const sysInstruction = await getMasterSystemInstruction()
    const prompt = `You are the chief booking specialist for Virtual Reality Guys in Cape Town.
Analyze this customer enquiry and return a strict JSON object.

OUR OFFICIAL PACKAGES ON THE WEBSITE (BASELINE PRICING INCL. 15% VAT):
1. Starter Package: R499 (2 VR Headsets, 2 Hours, up to 10 players, 1 Supervisor) - for small birthdays / intimate groups.
2. Standard Package: R899 (4 VR Headsets, 3 Hours, up to 20 players, 2 Supervisors) - our most popular package for birthdays & demos.
3. Premium Package: R1,299 (6 VR Headsets, 4 Hours, up to 40 players, 3 Supervisors) - for large parties & tournaments.
4. Corporate Event VR Package: R1,499 (6-8 VR Headsets, 4 Hours, tournament bracket & display mirrors).
5. School / Educational VR Experience: R899 (baseline for up to 30 students) or R1,499 (larger groups).

RETURN A STRICT JSON OBJECT WITH THESE EXACT KEYS:
{
  "event_type": "string (e.g. 'Birthday Party', 'Kids Party', 'School VR Demo', 'Corporate Event')",
  "event_date": "string (extracted date or empty string)",
  "player_count": number or null,
  "location": "string (extracted suburb/address or empty string)",
  "recommended_package": {
    "name": "string (exact package name chosen from our official packages above)",
    "price_zar": number (e.g. 499, 899, 1299, 1499),
    "headset_count": number (2, 4, 6, or 8),
    "duration_hours": number (2, 3, or 4),
    "reason": "string (specific explanation referencing their player count, venue, and event type)"
  },
  "intent_level": "High" | "Medium" | "Low",
  "missing_fields": ["array of specific missing details required to finalize the quote/booking"],
  "suggested_reply": "string (a warm, highly intelligent, personalized response that acknowledges their specific request, recommends the package with price, and politely asks for the missing information)"
}

Customer Message: "${rawMessage}"
Sender Name: "${senderName || ''}"
Sender Email: "${senderEmail || ''}"
Sender Phone: "${senderPhone || ''}"`

    const aiRes = await generateAiContent(prompt, {
      systemInstruction: sysInstruction,
      jsonMode: true,
      temperature: 0.2,
    })

    if (aiRes) {
      const parsed = JSON.parse(aiRes)
      if (parsed.recommended_package && typeof parsed.recommended_package.price_zar === 'number') {
        recPackage = {
          name: parsed.recommended_package.name || recPackage.name,
          price_zar: parsed.recommended_package.price_zar || recPackage.price_zar,
          headset_count: parsed.recommended_package.headset_count || recPackage.headset_count,
          duration_hours: parsed.recommended_package.duration_hours || recPackage.duration_hours,
          reason: parsed.recommended_package.reason || recPackage.reason,
        }
      }

      return {
        client_name: senderName,
        client_email: senderEmail,
        client_phone: senderPhone,
        event_type: parsed.event_type || eventType,
        event_date: parsed.event_date || targetDate,
        player_count: parsed.player_count || playerCount,
        location: parsed.location || location,
        recommended_package: recPackage,
        intent_level: parsed.intent_level || 'High',
        missing_fields: parsed.missing_fields && parsed.missing_fields.length > 0 ? parsed.missing_fields : missingFields,
        suggested_reply: parsed.suggested_reply || '',
      }
    }
  } catch (err) {
    console.warn('[Request Extractor] AI parsing fallback to deterministic regex:', err)
  }

  return {
    client_name: senderName,
    client_email: senderEmail,
    client_phone: senderPhone,
    event_type: eventType,
    event_date: targetDate,
    player_count: playerCount,
    location,
    recommended_package: recPackage,
    intent_level: 'High',
    missing_fields: missingFields,
    suggested_reply: `Hi ${senderName || 'there'}! 👋\n\nThank you for reaching out to Virtual Reality Guys! We would love to bring our mobile VR experience to your event.\n\nBased on your group of approximately ${playerCount} players, we recommend our **${recPackage.name} (R${recPackage.price_zar} Incl. VAT)** which includes ${recPackage.headset_count} VR Headsets, dedicated supervisors, and 60+ games.\n\nCould you please confirm:\n${missingFields.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nLooking forward to hearing from you!`,
  }
}
