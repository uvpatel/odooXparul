import { Note } from "@/models/notes.model"
import type { CreateNoteInput, UpdateNoteInput } from "@/schemas/note.schema"

export async function getNotesByTrip(userId: string, tripId: string) {
  return Note.find({ userId, tripId }).sort({ createdAt: -1 }).lean()
}

export async function createNote(data: CreateNoteInput & { userId: string }) {
  const note = await Note.create(data)
  return note.toObject()
}

export async function updateNote(id: string, userId: string, data: UpdateNoteInput) {
  return Note.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
}

export async function deleteNote(id: string, userId: string) {
  return Note.findOneAndDelete({ _id: id, userId })
}
