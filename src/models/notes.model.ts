import mongoose, { Schema, models, model } from "mongoose";

export interface NoteInterface {
  userId: string;
  tripId: string;
  content: string;
  title?: string;
}

const noteSchema = new Schema<NoteInterface>({
  userId: { type: String, required: true, index: true },
  tripId: { type: String, required: true, index: true },
  title: { type: String },
  content: { type: String, required: true },
}, { timestamps: true });

export const Note = models.Note || model<NoteInterface>("Note", noteSchema);
