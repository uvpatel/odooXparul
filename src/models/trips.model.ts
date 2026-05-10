import mongoose, { Schema, models, model } from "mongoose";

export interface TripInterface {
  userId: string; // Clerk user ID
  title: string;
  destination: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  status?: string;
  coverImage?: string;
}

const tripSchema = new Schema<TripInterface>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  budget: { type: Number },
  travelers: { type: Number, default: 1 },
  status: { type: String, enum: ["planning", "upcoming", "ongoing", "completed"], default: "planning" },
  coverImage: { type: String },
}, { timestamps: true });

export const Trip = models.Trip || model<TripInterface>("Trip", tripSchema);
