import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { createPackingSchema } from "@/schemas/packing.schema"
import { getPackingByTrip, createPackingItem } from "@/controllers/packing.controller"

export async function GET(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")
    if (!tripId) return NextResponse.json({ error: "tripId is required" }, { status: 400 })

    const items = await getPackingByTrip(userId, tripId)
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packing items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const validated = createPackingSchema.safeParse(body)
    if (!validated.success) return NextResponse.json(validated.error.flatten(), { status: 400 })

    const item = await createPackingItem({ ...validated.data, userId })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create packing item" }, { status: 500 })
  }
}
