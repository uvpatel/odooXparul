import { connectDB } from "@/db/connection.db";
import { User } from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";

// GET ALL USERS
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const users = await User.find();

        return NextResponse.json(
            {
                success: true,
                users,
                message: "Users fetched successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch users",
            },
            { status: 500 }
        );
    }
}

// CREATE USER
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const { name, email, password } = body;

        // validation
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            );
        }

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 409 }
            );
        }

        // create user
        const newUser = await User.create({
            name,
            email,
            password,
        });

        return NextResponse.json(
            {
                success: true,
                user: newUser,
                message: "User created successfully",
            },
            { status: 201 }
        );

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create user",
            },
            { status: 500 }
        );
    }
}