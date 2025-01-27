import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Experience from "@/models/Experience";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        const experienceData = await Experience.find({})
            .sort({ createdAt: -1 }); // Get all experiences, sorted by newest first
        
        if (!experienceData || experienceData.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No experience data found"
            });
        }

        return NextResponse.json({
            success: true,
            data: experienceData
        });
    } catch (error) {
        console.error('Error in experience client route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching experience data"
        });
    }
} 