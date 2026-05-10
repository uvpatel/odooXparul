import mongoose, { Schema, models, model } from "mongoose";

export interface TripInterface {
  user_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
}

const tripSchema = new Schema<TripInterface>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  budget: { type: Number },
}, { timestamps: true });

export const Trip = models.Trip || model<TripInterface>("Trip", tripSchema);
