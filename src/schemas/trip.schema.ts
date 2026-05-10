import { z } from "zod"

export const createTripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().positive().optional(),
  travelers: z.number().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["planning", "upcoming", "ongoing", "completed"]).optional(),
  coverImage: z.string().optional(),
})

export const updateTripSchema = createTripSchema.partial()

export type CreateTripInput = z.infer<typeof createTripSchema>
export type UpdateTripInput = z.infer<typeof updateTripSchema>
