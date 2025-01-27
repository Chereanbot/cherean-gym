import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Home from "@/models/Home";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        const homeData = await Home.findOne({}).sort({ createdAt: -1 });
        
        if (!homeData) {
            return NextResponse.json({
                success: false,
                message: "No home data found"
            });
        }

        return NextResponse.json({
            success: true,
            data: homeData
        });
    } catch (error) {
        console.error('Error in home client route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching home data"
        });
    }
} 