import { UserInterface } from "@/types/user.types";
import mongoose, { Schema, models, model} from "mongoose";



const userSchema = new Schema<UserInterface>({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


export const User = models.User || model<UserInterface>("User", userSchema)

