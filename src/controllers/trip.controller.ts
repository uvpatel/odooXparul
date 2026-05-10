import { Trip } from "@/models/Trip"

export async function getTripsByUser(userId: string) {
  return Trip.find({ userId }).sort({ createdAt: -1 })
}

export async function createTrip(data: any) {
  return Trip.create(data)
}
