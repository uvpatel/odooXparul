import { Activity } from "@/models/activities.model"

export async function getActivitiesByTrip(userId: string, tripId: string) {
  return Activity.find({ userId, tripId }).sort({ day: 1, time: 1 }).lean()
}

export async function createActivity(data: any) {
  const activity = await Activity.create(data)
  return activity.toObject()
}

export async function updateActivity(id: string, userId: string, data: any) {
  return Activity.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteActivity(id: string, userId: string) {
  return Activity.findOneAndDelete({ _id: id, userId })
}
