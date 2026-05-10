import mongoose, { Schema, models, model } from "mongoose";

export interface ActivityInterface {
  userId: string;
  tripId: string;
  title: string;
  type?: string;
  cost?: number;
  duration?: string;
  time?: string;
  location?: string;
  day?: number;
}

const activitySchema = new Schema<ActivityInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  type: { type: String },
  cost: { type: Number },
  duration: { type: String },
  time: { type: String },
  location: { type: String },
  day: { type: Number },
}, { timestamps: true });

export const Activity = models.Activity || model<ActivityInterface>("Activity", activitySchema);
