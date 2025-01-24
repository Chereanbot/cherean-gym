import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Project from "@/models/Project";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDB();
        
        const projectData = await Project.find({})
            .sort({ createdAt: -1 }) // Get all projects, sorted by newest first
            .select('-testimonials -challengesFaced -solutions'); // Exclude some heavy fields for initial load
        
        if (!projectData || projectData.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No project data found"
            });
        }

        return NextResponse.json({
            success: true,
            data: projectData
        });
    } catch (error) {
        console.error('Error in project client route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching project data"
        });
    }
} 