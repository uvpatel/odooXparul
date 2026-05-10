import mongoose, { Schema, model, models } from "mongoose"

const tripSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  budget: { type: Number, required: true },
  travelers: { type: Number, required: true },
  description: { type: String },
}, { timestamps: true })

export const Trip = models.Trip || model("Trip", tripSchema)
