import { connectToDB } from "@/database";
import { NextResponse } from "next/server";
import { rateLimit } from '@/utils/rateLimit';
import bcrypt from 'bcryptjs';

export const dynamic = "force-dynamic";

// Create limiter instance
const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500 // Max 500 users per second
});

export async function POST(req) {
    try {
        // Apply rate limiting
        try {
            await limiter.check(req, 5); // 5 requests per minute
        } catch {
            return NextResponse.json({
                success: false,
                message: "Too many requests. Please try again later."
            }, { status: 429 });
        }

        const { username, password } = await req.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Check for specific admin credentials
        const validUsername = 'chereandeveloper';
        const hashedValidPassword = '$2a$10$3kwUPh49HnCMqOueBGi91uNuXmEHLqNmnHQ2qMoBGsbKMgVpDyOVy';

        if (username !== validUsername) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, hashedValidPassword);
        
        if (!isValidPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Return success response for admin
        return NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                username: validUsername,
                email: 'admin@cherean.com',
                role: 'admin'
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred during login. Please try again."
        }, { status: 500 });
    }
}