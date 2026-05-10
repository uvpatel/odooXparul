import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { createTripSchema } from "@/schemas/trip.schema"
import { createTrip, getTripsByUser } from "@/controllers/trip.controller"

export async function GET() {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const trips = await getTripsByUser(userId)
    return NextResponse.json(trips)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const validated = createTripSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(validated.error.flatten(), { status: 400 })
    }
    const trip = await createTrip({ ...validated.data, userId })
    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
}
