import mongoose, { Schema, models, model } from "mongoose";

export interface TripStopInterface {
  trip_id: mongoose.Types.ObjectId;
  city_id: string;
  arrival_date?: Date;
  departure_date?: Date;
  order_index: number;
}

const tripStopSchema = new Schema<TripStopInterface>({
  trip_id: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
  city_id: { type: String, required: true },
  arrival_date: { type: Date },
  departure_date: { type: Date },
  order_index: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export const TripStop = models.TripStop || model<TripStopInterface>("TripStop", tripStopSchema);
