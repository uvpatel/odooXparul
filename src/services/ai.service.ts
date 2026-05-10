const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface GenerateTripParams {
  prompt: string
  travelStyle?: string
  pace?: string
  startingPoint?: string
}

export async function generateTripWithAI({ prompt, travelStyle, pace, startingPoint }: GenerateTripParams) {
  if (!GEMINI_API_KEY) {
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
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
        },
      }),
    }
  )

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("No response from Gemini")
  }

  try {
    return JSON.parse(text)
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim())
    }
    throw new Error("Failed to parse AI response as JSON")
  }
}
