import { Schema, models, model } from "mongoose";

export interface ItineraryActivityInterface {
  title: string;
  category?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  cost?: number;
  notes?: string;
}

export interface ItineraryInterface {
  userId: string;
  tripId: string;
  day: number;
  city?: string;
  date?: string;
  activities: ItineraryActivityInterface[];
}

const itineraryActivitySchema = new Schema<ItineraryActivityInterface>({
  title: { type: String, required: true },
  category: { type: String },
  location: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  cost: { type: Number },
  notes: { type: String },
}, { _id: false });

const itinerarySchema = new Schema<ItineraryInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  day: { type: Number, required: true },
  city: { type: String },
  date: { type: String },
  activities: { type: [itineraryActivitySchema], default: [] },
}, { timestamps: true });

export const Itinerary = models.Itinerary || model<ItineraryInterface>("Itinerary", itinerarySchema);
