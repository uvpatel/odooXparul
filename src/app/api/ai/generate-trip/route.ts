import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { generateTripWithAI } from "@/services/ai.service"
import { createTrip } from "@/controllers/trip.controller"
import { createActivity } from "@/controllers/activity.controller"
import { createPackingItem } from "@/controllers/packing.controller"
import { createExpense } from "@/controllers/expense.controller"

interface GenerateTripRequestBody {
  prompt?: string
  travelStyle?: string
  pace?: string
  startingPoint?: string
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, travelStyle, pace, startingPoint } = (await req.json()) as GenerateTripRequestBody

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a detailed trip description" }, { status: 400 })
    }

    // Generate trip with AI
    const aiResult = await generateTripWithAI({ prompt, travelStyle, pace, startingPoint })

    // Save the trip to DB
    const trip = await createTrip({
      userId,
      title: aiResult.title,
      destination: aiResult.destination,
      description: aiResult.description,
      startDate: aiResult.startDate,
      endDate: aiResult.endDate,
      budget: aiResult.budget,
      travelers: aiResult.travelers || 1,
      status: "planning",
    })

    const tripId = String(trip._id)

    // Save activities from itinerary
    if (aiResult.itinerary && Array.isArray(aiResult.itinerary)) {
      for (const day of aiResult.itinerary) {
        if (day.activities && Array.isArray(day.activities)) {
          for (const activity of day.activities) {
            await createActivity({
              userId,
              tripId,
              title: activity.title,
              type: activity.type,
              cost: activity.cost,
              duration: activity.duration,
              time: activity.time,
              location: activity.location,
              day: day.day,
            })
          }
        }
      }
    }

    // Save packing list
    if (aiResult.packingList && Array.isArray(aiResult.packingList)) {
      for (const item of aiResult.packingList) {
        await createPackingItem({
          userId,
          tripId,
          item_name: item.item,
          category: item.category,
        })
      }
    }

    // Save budget breakdown as expenses
    if (aiResult.budgetBreakdown && Array.isArray(aiResult.budgetBreakdown)) {
      for (const entry of aiResult.budgetBreakdown) {
        if (entry.amount > 0) {
          await createExpense({
            userId,
            tripId,
            category: entry.category,
            amount: entry.amount,
            description: `AI estimated ${entry.category} budget`,
          })
        }
      }
    }

    return NextResponse.json({
      trip,
      itinerary: aiResult.itinerary,
      packingList: aiResult.packingList,
      budgetBreakdown: aiResult.budgetBreakdown,
    }, { status: 201 })
  } catch (error) {
    console.error("AI generate trip error:", error)
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    )
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to generate trip"
}
