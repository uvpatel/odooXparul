import { Schema, models, model } from "mongoose";

export interface BudgetCategoryInterface {
  name: string;
  amount: number;
}

export interface BudgetInterface {
  userId: string;
  tripId: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  categories: BudgetCategoryInterface[];
}

const budgetCategorySchema = new Schema<BudgetCategoryInterface>({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
}, { _id: false });

const budgetSchema = new Schema<BudgetInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  totalBudget: { type: Number, required: true, default: 0 },
  spent: { type: Number, required: true, default: 0 },
  remaining: { type: Number, required: true, default: 0 },
  categories: { type: [budgetCategorySchema], default: [] },
}, { timestamps: true });

export const Budget = models.Budget || model<BudgetInterface>("Budget", budgetSchema);
