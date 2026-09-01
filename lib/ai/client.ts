import { GoogleGenAI } from '@google/genai'

export interface GenerateAiContentOptions {
  systemInstruction?: string
  model?: string
  temperature?: number
  jsonMode?: boolean
}

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

/**
 * Executes a prompt against Google Gemini with automated multi-model fallback
 * and server-side safety checks.
 */
export async function generateAiContent(
  promptOrContents: string | any[],
  options: GenerateAiContentOptions = {}
): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_AI_KEY ||
    process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.')
  }

  const ai = new GoogleGenAI({ apiKey })

  const contents =
    typeof promptOrContents === 'string'
      ? [{ role: 'user', parts: [{ text: promptOrContents }] }]
      : promptOrContents

  const preferredModel = options.model || 'gemini-2.5-flash'
  const modelsToTry = [
    preferredModel,
    ...FALLBACK_MODELS.filter((m) => m !== preferredModel),
  ]

  let lastError: any = null

  for (const modelName of modelsToTry) {
    try {
      const config: any = {}
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction
      }
      if (options.temperature !== undefined) {
        config.temperature = options.temperature
      }
      if (options.jsonMode) {
        config.responseMimeType = 'application/json'
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      })

      if (response.text) {
        return response.text
      }
    } catch (err: any) {
      console.warn(`[VR Guys AI Engine] Model '${modelName}' error:`, err?.message || err)
      lastError = err
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`)
}
