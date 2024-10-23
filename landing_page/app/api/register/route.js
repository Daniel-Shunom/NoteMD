import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const {name, lname, email, password} = await req.json()

        console.log("Name:", name)
        console.log("lame:", lname)
        console.log("email:", email)
        console.log("password:", password)

        return NextResponse.json({message: "User registered!"}, {status: 201})
    } catch (error) {
        NextResponse.json({message: "An error occurred while registering the user"}, {status: 500})
    }
}