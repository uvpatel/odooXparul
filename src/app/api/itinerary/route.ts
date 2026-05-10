import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { createActivitySchema } from "@/schemas/activity.schema"
import { Activity } from "@/models/activities.model"

export async function GET(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")
    if (!tripId) return NextResponse.json({ error: "tripId is required" }, { status: 400 })

    const activities = await Activity.find({ userId, tripId }).sort({ day: 1, time: 1 }).lean()
    const days = new Map<number, typeof activities>()
    for (const activity of activities) {
      const day = activity.day || 1
      days.set(day, [...(days.get(day) || []), activity])
    }

    return NextResponse.json(Array.from(days, ([day, dayActivities]) => ({ day, activities: dayActivities })))
  } catch {
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const validated = createActivitySchema.safeParse(body)
    if (!validated.success) return NextResponse.json(validated.error.flatten(), { status: 400 })

    const activity = await Activity.create({ ...validated.data, userId })
    return NextResponse.json(activity.toObject(), { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create itinerary activity" }, { status: 500 })
  }
}
