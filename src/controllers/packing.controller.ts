import { PackingItem } from "@/models/packingItems.model"

export async function getPackingByTrip(userId: string, tripId: string) {
  return PackingItem.find({ userId, tripId }).sort({ category: 1 }).lean()
}

export async function createPackingItem(data: any) {
  const item = await PackingItem.create(data)
  return item.toObject()
}

export async function updatePackingItem(id: string, userId: string, data: any) {
  return PackingItem.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deletePackingItem(id: string, userId: string) {
  return PackingItem.findOneAndDelete({ _id: id, userId })
}
