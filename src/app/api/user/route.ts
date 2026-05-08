import { connectDB } from "@/db/connection.db";
import { User } from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest) {
        try {
            await connectDB()

            const user = User.find()
            return NextResponse.json({
                user
            }, { status: 200 })
        } catch (error) {
            console.log(error)
            return NextResponse.json({
                error: "Failed to fetch user"
        }, { status: 500 })
        
    }
}


export async function POST(request: NextRequest) {



}