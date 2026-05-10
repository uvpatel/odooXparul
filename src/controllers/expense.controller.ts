import { Expense } from "@/models/expenses.model"

export async function getExpensesByTrip(userId: string, tripId: string) {
  return Expense.find({ userId, tripId }).sort({ createdAt: -1 }).lean()
}

export async function createExpense(data: any) {
  const expense = await Expense.create(data)
  return expense.toObject()
}

export async function updateExpense(id: string, userId: string, data: any) {
  return Expense.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteExpense(id: string, userId: string) {
  return Expense.findOneAndDelete({ _id: id, userId })
}
