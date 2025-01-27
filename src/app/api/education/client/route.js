import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Education from "@/models/Education";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        const educationData = await Education.find({})
            .sort({ year: -1 }); // Get all education entries, sorted by year in descending order
        
        if (!educationData || educationData.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No education data found"
            });
        }

        return NextResponse.json({
            success: true,
            data: educationData
        });
    } catch (error) {
        console.error('Error in education client route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching education data"
        });
    }
} 