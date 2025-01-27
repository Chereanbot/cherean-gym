import { connectDB } from '@/lib/database'
import User from "@/models/User"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req) {
    try {
        await connectDB()
        const { username, email, password } = await req.json()

        // Only allow registration of the specific admin user
        if (username !== 'chereandeveloper') {
            return NextResponse.json({
                success: false,
                message: "Unauthorized registration attempt"
            })
        }

        // Check if admin user already exists
        const existingUser = await User.findOne({ username: 'chereandeveloper' })

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "Admin user already exists"
            })
        }

        // Hash password
        const hashedPassword = await hash('chereancher', 12)

        // Create admin user
        const newUser = await User.create({
            username: 'chereandeveloper1',
            email: email || 'admin@cherean.com',
            password: hashedPassword,
            role: 'admin'
        })

        if (newUser) {
            return NextResponse.json({
                success: true,
                message: "Admin registration successful"
            })
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to create admin user"
            })
        }

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({
            success: false,
            message: "Error during registration"
        })
    }
} 