import mongoose, { Schema, models, model } from "mongoose";

export interface PackingItemInterface {
  userId: string;
  tripId: string;
  item_name: string;
  category?: string;
  checked: boolean;
}

const packingItemSchema = new Schema<PackingItemInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  item_name: { type: String, required: true },
  category: { type: String },
  checked: { type: Boolean, default: false },
}, { timestamps: true });

export const PackingItem = models.PackingItem || model<PackingItemInterface>("PackingItem", packingItemSchema);
