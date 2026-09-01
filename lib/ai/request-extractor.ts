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
    reason: string
  }
  intent_level: 'High' | 'Medium' | 'Low'
  missing_fields: string[]
  suggested_reply: string
}

/**
 * Parses unstructured natural-language enquiries into structured business parameters.
 */
export async function extractRequestDetails(
  rawMessage: string,
  senderName?: string,
  senderEmail?: string,
  senderPhone?: string
): Promise<ExtractedRequestData> {
  // Heuristic baseline defaults
  let eventType = 'Birthday Party'
  let playerCount = 12
  let location = 'Cape Town'
  let targetDate = ''

  const msgLower = rawMessage.toLowerCase()
  if (msgLower.includes('school') || msgLower.includes('student') || msgLower.includes('curriculum')) {
    eventType = 'School VR Demonstration'
    playerCount = 30
  } else if (msgLower.includes('corporate') || msgLower.includes('team') || msgLower.includes('staff')) {
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

  // Determine package recommendation
  let recPackage = {
    name: 'Standard Package',
    price_zar: 899,
    headset_count: 4,
    reason: 'Ideal for 15-20 players with multiplayer tournament modes and 2 staff supervisors.',
  }

  if (playerCount <= 10) {
    recPackage = {
      name: 'Starter Package',
      price_zar: 499,
      headset_count: 2,
      reason: 'Perfect for small, intimate gatherings with 2 headsets and 1 supervisor.',
    }
  } else if (playerCount > 20) {
    recPackage = {
      name: 'Premium Package',
      price_zar: 1299,
      headset_count: 6,
      reason: 'High player throughput with 6 VR headsets, 3 supervisors, and custom tournament brackets.',
    }
  }

  const missingFields: string[] = []
  if (!senderName) missingFields.push('Customer Name')
  if (!senderPhone) missingFields.push('Phone Number')
  if (!targetDate) missingFields.push('Preferred Event Date & Start Time')
  if (!rawMessage.match(/\b(in|at|venue|location|area)\b/i)) missingFields.push('Exact Venue Address')

  // Generate Suggested Response
  const suggestedReply = `Hi ${senderName || 'there'}! 👋\n\nThank you for reaching out to Virtual Reality Guys! We would love to bring our mobile VR experience to your event.\n\nBased on your group of approximately ${playerCount} players, we recommend our **${recPackage.name} (R${recPackage.price_zar} Incl. VAT)** which includes ${recPackage.headset_count} VR Headsets, dedicated supervisors, and 60+ games.\n\nCould you please let us know:\n1. Your preferred event date & start time?\n2. The venue address in Cape Town?\n\nLooking forward to hearing from you!`

  // AI refinement if Gemini is reachable
  try {
    const sysInstruction = await getMasterSystemInstruction()
    const prompt = `Analyze this customer enquiry and return a strict JSON object with:
- event_type (string)
- event_date (string or empty)
- player_count (number or null)
- location (string or empty)
- intent_level ("High" | "Medium" | "Low")
- missing_fields (array of strings)
- suggested_reply (polite, professional message asking ONLY for missing fields and presenting the package)

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
        missing_fields: parsed.missing_fields || missingFields,
        suggested_reply: parsed.suggested_reply || suggestedReply,
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
    suggested_reply: suggestedReply,
  }
}
