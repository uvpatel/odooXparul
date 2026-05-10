import mongoose, { Schema, models, model } from "mongoose";

export interface SharedTripInterface {
  trip_id: mongoose.Types.ObjectId;
  share_token: string;
  visibility: string;
}

const sharedTripSchema = new Schema<SharedTripInterface>({
  trip_id: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
  share_token: { type: String, required: true, unique: true },
  visibility: { type: String, enum: ["public", "private", "link"], default: "private" },
}, { timestamps: true });

export const SharedTrip = models.SharedTrip || model<SharedTripInterface>("SharedTrip", sharedTripSchema);
