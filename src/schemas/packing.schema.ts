import { z } from "zod"

export const createPackingSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  item_name: z.string().min(1, "Item name is required"),
  category: z.string().optional(),
  checked: z.boolean().optional(),
})

export const updatePackingSchema = z.object({
  item_name: z.string().min(1).optional(),
  category: z.string().optional(),
  checked: z.boolean().optional(),
})

export type CreatePackingInput = z.infer<typeof createPackingSchema>
export type UpdatePackingInput = z.infer<typeof updatePackingSchema>
