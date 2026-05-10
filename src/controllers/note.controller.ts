import { Note } from "@/models/notes.model"

export async function getNotesByTrip(userId: string, tripId: string) {
  return Note.find({ userId, tripId }).sort({ createdAt: -1 }).lean()
}

export async function createNote(data: any) {
  const note = await Note.create(data)
  return note.toObject()
}

export async function updateNote(id: string, userId: string, data: any) {
  return Note.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteNote(id: string, userId: string) {
  return Note.findOneAndDelete({ _id: id, userId })
}
