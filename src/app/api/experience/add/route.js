import { connectDB } from '@/lib/database';
import Experience from "@/models/Experience";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectDB();
        const extractData = await req.json();
        
        const saveData = await Experience.create(extractData);
        
        if (saveData) {
            return NextResponse.json({
                success: true,
                message: "Experience added successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to add experience. Please try again"
            });
        }
    } catch (error) {
        console.error("Error in experience/add:", error);
        return NextResponse.json({
            success: false,
            message: "Error adding experience: " + error.message
        });
    }
}