import { z } from "zod"

export const createExpenseSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().optional(),
})

export const updateExpenseSchema = createExpenseSchema.partial().omit({ tripId: true })

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
