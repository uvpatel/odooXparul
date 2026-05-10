interface GenerateTripParams {
  prompt: string
  travelStyle?: string
  pace?: string
  startingPoint?: string
}

export interface GeneratedTripActivity {
  time?: string
  title: string
  location?: string
  cost?: number
  type?: string
  duration?: string
}

export interface GeneratedTripDay {
  day: number
  date?: string
  city?: string
  activities: GeneratedTripActivity[]
}

export interface GeneratedPackingItem {
  item: string
  category?: string
}

export interface GeneratedBudgetEntry {
  category: string
  amount: number
}

export interface GeneratedTrip {
  title: string
  destination: string
  description?: string
  startDate?: string
  endDate?: string
  budget?: number
  travelers?: number
  itinerary: GeneratedTripDay[]
  packingList: GeneratedPackingItem[]
  budgetBreakdown: GeneratedBudgetEntry[]
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

const tripResponseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    destination: { type: "STRING" },
    description: { type: "STRING" },
    startDate: { type: "STRING" },
    endDate: { type: "STRING" },
    budget: { type: "NUMBER" },
    travelers: { type: "NUMBER" },
    itinerary: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "NUMBER" },
          date: { type: "STRING" },
          city: { type: "STRING" },
          activities: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                time: { type: "STRING" },
                title: { type: "STRING" },
                location: { type: "STRING" },
                cost: { type: "NUMBER" },
                type: { type: "STRING" },
                duration: { type: "STRING" },
              },
              required: ["title"],
            },
          },
        },
        required: ["day", "activities"],
      },
    },
    packingList: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          item: { type: "STRING" },
          category: { type: "STRING" },
        },
        required: ["item"],
      },
    },
    budgetBreakdown: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          amount: { type: "NUMBER" },
        },
        required: ["category", "amount"],
      },
    },
  },
  required: ["title", "destination", "itinerary", "packingList", "budgetBreakdown"],
}

export async function generateTripWithAI({ prompt, travelStyle, pace, startingPoint }: GenerateTripParams) {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY")
  }

  const systemPrompt = `You are TravelLoop AI, an expert travel planner. Generate a complete trip itinerary based on the user's request.

Return a JSON object with this exact structure:
{
  "title": "Trip title",
  "destination": "Primary destination",
  "description": "Brief trip description",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "budget": 0,
  "travelers": 1,
  "itinerary": [
    {
      "day": 1,
      "date": "Month DD, YYYY",
      "city": "City name",
      "activities": [
        {
          "time": "HH:MM AM/PM",
          "title": "Activity title",
          "location": "Specific location",
          "cost": 0,
          "type": "Food|Sightseeing|Activity|Stay|Transport",
          "duration": "Xh"
        }
      ]
    }
  ],
  "packingList": [
    { "item": "Item name", "category": "Clothing|Toiletries|Electronics|Documents|Misc" }
  ],
  "budgetBreakdown": [
    { "category": "Accommodation|Food|Transport|Activities|Shopping|Misc", "amount": 0 }
  ]
}

Travel style: ${travelStyle || "balanced"}
Pace: ${pace || "medium"}
Starting point: ${startingPoint || "not specified"}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation. Just the JSON object.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: `User request: ${prompt}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: tripResponseSchema,
        },
      }),
    }
  )

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = (await res.json()) as GeminiGenerateContentResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("No response from Gemini")
  }

  const parsed = parseJsonFromGeminiText(text)
  return normalizeGeneratedTrip(parsed)
}

function parseJsonFromGeminiText(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON")
    }

    return JSON.parse(jsonMatch[1].trim())
  }
}

function normalizeGeneratedTrip(value: unknown): GeneratedTrip {
  if (!isRecord(value)) {
    throw new Error("AI response was not a JSON object")
  }

  const title = readString(value.title)
  const destination = readString(value.destination)

  if (!title || !destination) {
    throw new Error("AI response was missing required trip details")
  }

  return {
    title,
    destination,
    description: readString(value.description),
    startDate: readString(value.startDate),
    endDate: readString(value.endDate),
    budget: readPositiveNumber(value.budget),
    travelers: readPositiveNumber(value.travelers) || 1,
    itinerary: readItinerary(value.itinerary),
    packingList: readPackingList(value.packingList),
    budgetBreakdown: readBudgetBreakdown(value.budgetBreakdown),
  }
}

function readItinerary(value: unknown): GeneratedTripDay[] {
  if (!Array.isArray(value)) return []

  return value.filter(isRecord).map((day, index) => ({
    day: readPositiveNumber(day.day) || index + 1,
    date: readString(day.date),
    city: readString(day.city),
    activities: Array.isArray(day.activities)
      ? day.activities.filter(isRecord).map((activity) => ({
          time: readString(activity.time),
          title: readString(activity.title) || "Planned activity",
          location: readString(activity.location),
          cost: readNonNegativeNumber(activity.cost),
          type: readString(activity.type),
          duration: readString(activity.duration),
        }))
      : [],
  }))
}

function readPackingList(value: unknown): GeneratedPackingItem[] {
  if (!Array.isArray(value)) return []

  return value.filter(isRecord).map((item) => ({
    item: readString(item.item) || "Travel essential",
    category: readString(item.category),
  }))
}

function readBudgetBreakdown(value: unknown): GeneratedBudgetEntry[] {
  if (!Array.isArray(value)) return []

  return value.filter(isRecord).map((entry) => ({
    category: readString(entry.category) || "Misc",
    amount: readNonNegativeNumber(entry.amount) || 0,
  }))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function readPositiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined
}

function readNonNegativeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined
}
