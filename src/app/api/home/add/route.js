import connectToDB from "@/database";
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function POST(req) {
    try {
        await connectToDB();
        const extractData = await req.json();
        
        // Validate required fields
        if (!extractData.heading || !extractData.summary) {
            return NextResponse.json({
                success: false,
                message: "Heading and summary are required"
            });
        }

        // Check if there's existing data
        const existingData = await Home.findOne({});
        let saveData;

        if (existingData) {
            // Update existing data
            saveData = await Home.findByIdAndUpdate(
                existingData._id,
                extractData,
                { new: true }
            );
        } else {
            // Create new data
            saveData = await Home.create(extractData);
        }

        if (saveData) {
            return NextResponse.json({
                success: true,
                message: existingData ? "Data updated successfully" : "Data saved successfully",
                data: saveData
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Something went wrong. Please try again"
            });
        }
    } catch (error) {
        console.error("Error in home/add:", error)
        return NextResponse.json({
            success: false,
            message: "Error saving data: " + error.message
        });
    }
}