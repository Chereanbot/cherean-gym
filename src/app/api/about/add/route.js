import connectToDB from "@/database";
import About from "@/models/About";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectToDB();
        const extractData = await req.json();
        
        // Validate required fields
        const requiredFields = ['aboutme', 'noofprojects', 'yearofexerience', 'noofclients', 'skills'];
        for (const field of requiredFields) {
            if (!extractData[field]) {
                return NextResponse.json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Create or update about data
        const newAbout = await About.findOneAndUpdate(
            {}, // Empty filter to match any document
            {
                $set: {
                    ...extractData,
                    education: extractData.education || [],
                    certifications: extractData.certifications || [],
                    languages: extractData.languages || [],
                    achievements: extractData.achievements || [],
                    socialLinks: extractData.socialLinks || {},
                    deviceImages: {
                        iPhone: extractData.deviceImages?.iPhone || '',
                        macBook: extractData.deviceImages?.macBook || ''
                    }
                }
            },
            { 
                upsert: true, // Create if doesn't exist
                new: true, // Return updated document
                runValidators: true // Run model validations
            }
        );

        if (newAbout) {
            return NextResponse.json({
                success: true,
                message: "About data saved successfully",
                data: newAbout
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to save about data"
            });
        }
    } catch (error) {
        console.error("Error in about/add:", error);
        return NextResponse.json({
            success: false,
            message: "Error saving about data: " + error.message
        });
    }
}