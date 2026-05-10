import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { Trip } from "@/models/trips.model"
import { Expense } from "@/models/expenses.model"

const budgetPostSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  totalBudget: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  description: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")
    if (!tripId) return NextResponse.json({ error: "tripId is required" }, { status: 400 })

    const trip = await Trip.findOne({ _id: tripId, userId }).lean()
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 })

    const expenses = await Expense.find({ userId, tripId }).sort({ createdAt: -1 }).lean()
    const spent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    const totalBudget = trip.budget || 0

    return NextResponse.json({
      tripId,
      totalBudget,
      spent,
      remaining: totalBudget - spent,
      expenses,
      categories: buildCategoryTotals(expenses),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const validated = budgetPostSchema.safeParse(body)
    if (!validated.success) return NextResponse.json(validated.error.flatten(), { status: 400 })

    const { tripId, totalBudget, category, amount, description } = validated.data
    const trip = await Trip.findOne({ _id: tripId, userId })
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 })

    if (typeof totalBudget === "number") {
      trip.budget = totalBudget
      await trip.save()
    }

    const expense = category && amount
      ? await Expense.create({ userId, tripId, category, amount, description })
      : null

    return NextResponse.json({ trip: trip.toObject(), expense }, { status: expense ? 201 : 200 })
  } catch {
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

function buildCategoryTotals(expenses: Array<{ category: string; amount: number }>) {
  const totals = new Map<string, number>()

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amount)
  }

  return Array.from(totals, ([category, amount]) => ({ category, amount }))
}
