import { z } from "zod"

export const createPackingSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  item_name: z.string().min(1, "Item name is required").optional(),
  title: z.string().min(1, "Item title is required").optional(),
  category: z.string().optional(),
  checked: z.boolean().optional(),
}).refine((data) => data.item_name || data.title, {
  message: "Item name is required",
  path: ["item_name"],
}).transform((data) => ({
  ...data,
  item_name: data.item_name || data.title || "",
}))

export const updatePackingSchema = z.object({
  item_name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  category: z.string().optional(),
  checked: z.boolean().optional(),
}).transform((data) => ({
  ...data,
  item_name: data.item_name || data.title,
}))

export type CreatePackingInput = z.infer<typeof createPackingSchema>
export type UpdatePackingInput = z.infer<typeof updatePackingSchema>
