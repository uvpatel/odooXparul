import mongoose, { Schema, models, model } from "mongoose";

export interface PackingItemInterface {
  trip_id: mongoose.Types.ObjectId;
  item_name: string;
  checked: boolean;
}

const packingItemSchema = new Schema<PackingItemInterface>({
  trip_id: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
  item_name: { type: String, required: true },
  checked: { type: Boolean, default: false },
}, { timestamps: true });

export const PackingItem = models.PackingItem || model<PackingItemInterface>("PackingItem", packingItemSchema);
