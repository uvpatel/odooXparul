import mongoose, { Schema, models, model } from "mongoose";

export interface ExpenseInterface {
  trip_id: mongoose.Types.ObjectId;
  category?: string;
  amount: number;
}

const expenseSchema = new Schema<ExpenseInterface>({
  trip_id: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
  category: { type: String },
  amount: { type: Number, required: true },
}, { timestamps: true });

export const Expense = models.Expense || model<ExpenseInterface>("Expense", expenseSchema);
