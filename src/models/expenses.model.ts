import mongoose, { Schema, models, model } from "mongoose";

export interface ExpenseInterface {
  userId: string;
  tripId: string;
  category: string;
  description?: string;
  amount: number;
  date?: string;
}

const expenseSchema = new Schema<ExpenseInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  category: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  date: { type: String },
}, { timestamps: true });

export const Expense = models.Expense || model<ExpenseInterface>("Expense", expenseSchema);
