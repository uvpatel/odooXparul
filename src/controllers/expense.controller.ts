import { Expense } from "@/models/expenses.model"
import type { CreateExpenseInput, UpdateExpenseInput } from "@/schemas/expense.schema"

export async function getExpensesByTrip(userId: string, tripId: string) {
  return Expense.find({ userId, tripId }).sort({ createdAt: -1 }).lean()
}

export async function createExpense(data: CreateExpenseInput & { userId: string }) {
  const expense = await Expense.create(data)
  return expense.toObject()
}

export async function updateExpense(id: string, userId: string, data: UpdateExpenseInput) {
  return Expense.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteExpense(id: string, userId: string) {
  return Expense.findOneAndDelete({ _id: id, userId })
}
