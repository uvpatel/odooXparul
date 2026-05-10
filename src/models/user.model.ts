import mongoose, { Schema, models, model } from "mongoose";

export interface UserInterface {
  clerkId: string;
  name: string;
  email: string;
  image?: string;
}

const userSchema = new Schema<UserInterface>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

export const User = models.User || model<UserInterface>("User", userSchema);
