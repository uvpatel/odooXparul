import { Trip } from "@/models/trips.model"
import type { CreateTripInput, UpdateTripInput } from "@/schemas/trip.schema"

export async function getTripsByUser(userId: string) {
  return Trip.find({ userId }).sort({ createdAt: -1 }).lean()
}

export async function getTripById(id: string, userId: string) {
  return Trip.findOne({ _id: id, userId }).lean()
}

export async function createTrip(data: CreateTripInput & { userId: string }) {
  const trip = await Trip.create(data)
  return trip.toObject()
}

export async function updateTrip(id: string, userId: string, data: UpdateTripInput) {
  return Trip.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteTrip(id: string, userId: string) {
  return Trip.findOneAndDelete({ _id: id, userId })
}
