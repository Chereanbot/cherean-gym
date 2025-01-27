import { connectDB } from '@/lib/database';
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();
        const count = await Home.countDocuments();
        const homeData = await Home.find({});

        return NextResponse.json({
            success: true,
            count,
            data: homeData
        });
    } catch (error) {
        console.error("Error checking home data:", error);
        return NextResponse.json({
            success: false,
            message: "Error checking home data: " + error.message
        });
    }
} 