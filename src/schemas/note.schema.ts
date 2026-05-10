import { z } from "zod"

export const createNoteSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
})

export const updateNoteSchema = createNoteSchema.partial().omit({ tripId: true })

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
