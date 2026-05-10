import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { createActivitySchema } from "@/schemas/activity.schema"
import { getActivitiesByTrip, createActivity } from "@/controllers/activity.controller"
import { Activity } from "@/models/activities.model"

export async function GET(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")
    const activities = tripId
      ? await getActivitiesByTrip(userId, tripId)
      : await Activity.find({ userId }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(activities)
  } catch {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
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

    const activity = await createActivity({ ...validated.data, userId })
    return NextResponse.json(activity, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
