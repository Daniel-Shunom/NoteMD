import { NextResponse } from "next/server"


export async function POST(req) {
    try {
        const {name, lname, email, password} = await req.json()
        const hashedPassword =  await bcrypt.hash()
        return NextResponse.json({message: "User registered!"}, {status: 201})
    } catch (error) {
        NextResponse.json({message: "An error occurred while registering the user"}, {status: 500})
    }
}