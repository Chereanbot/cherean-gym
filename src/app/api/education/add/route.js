import { connectDB } from '@/lib/database';
import Education from "@/models/Education";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectDB();
        const extractData = await req.json();
        
        const saveData = await Education.create(extractData);
        
        if (saveData) {
            return NextResponse.json({
                success: true,
                message: "Education added successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to add education. Please try again"
            });
        }
    } catch (error) {
        console.error("Error in education/add:", error);
        return NextResponse.json({
            success: false,
            message: "Error adding education: " + error.message
        });
    }
}