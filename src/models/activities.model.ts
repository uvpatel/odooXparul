import mongoose, { Schema, models, model } from "mongoose";

export interface ActivityInterface {
  stop_id: mongoose.Types.ObjectId;
  title: string;
  type?: string;
  cost?: number;
  duration?: number;
  time?: string;
}

const activitySchema = new Schema<ActivityInterface>({
  stop_id: { type: Schema.Types.ObjectId, ref: "TripStop", required: true },
  title: { type: String, required: true },
  type: { type: String },
  cost: { type: Number },
  duration: { type: Number },
  time: { type: String },
}, { timestamps: true });

export const Activity = models.Activity || model<ActivityInterface>("Activity", activitySchema);
