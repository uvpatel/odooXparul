import { z } from "zod"

export const createActivitySchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  title: z.string().min(1, "Title is required"),
  type: z.string().optional(),
  cost: z.number().optional(),
  duration: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  day: z.number().optional(),
})

export const updateActivitySchema = createActivitySchema.partial().omit({ tripId: true })

export type CreateActivityInput = z.infer<typeof createActivitySchema>
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>
