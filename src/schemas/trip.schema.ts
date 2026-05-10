import { z } from "zod"

export const createTripSchema = z.object({
  title: z.string().min(3),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().positive(),
  travelers: z.number().min(1),
  description: z.string().optional(),
})

export type CreateTripInput = z.infer<typeof createTripSchema>
