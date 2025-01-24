import { NextResponse } from "next/server";
import connectToDB from "@/database";
import About from "@/models/About";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDB();
        
        const aboutData = await About.findOne({}).sort({ createdAt: -1 });
        
        if (!aboutData) {
            return NextResponse.json({
                success: false,
                message: "No about data found"
            });
        }

        return NextResponse.json({
            success: true,
            data: aboutData
        });
    } catch (error) {
        console.error('Error in about client route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching about data"
        });
    }
} 