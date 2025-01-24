import connectToDB from "@/database";
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDB();
        const homeData = await Home.findOne({}).sort({ createdAt: -1 });

        if (homeData) {
            return NextResponse.json({
                success: true,
                data: homeData
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "No home data found"
            });
        }
    } catch (error) {
        console.error("Error in home/get:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching home data: " + error.message
        });
    }
}