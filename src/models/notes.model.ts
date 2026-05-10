import mongoose, { Schema, models, model } from "mongoose";

export interface NoteInterface {
  trip_id: mongoose.Types.ObjectId;
  content: string;
}

const noteSchema = new Schema<NoteInterface>({
  trip_id: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Note = models.Note || model<NoteInterface>("Note", noteSchema);
