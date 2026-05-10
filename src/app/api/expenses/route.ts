import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/lib/mongodb"
import { createExpenseSchema } from "@/schemas/expense.schema"
import { getExpensesByTrip, createExpense } from "@/controllers/expense.controller"
import { Expense } from "@/models/expenses.model"

export async function GET(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")
    const expenses = tripId
      ? await getExpensesByTrip(userId, tripId)
      : await Expense.find({ userId }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(expenses)
  } catch {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const validated = createExpenseSchema.safeParse(body)
    if (!validated.success) return NextResponse.json(validated.error.flatten(), { status: 400 })

    const expense = await createExpense({ ...validated.data, userId })
    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
