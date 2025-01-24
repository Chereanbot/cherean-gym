import connectToDB from "@/database";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        let projects;
        if (id) {
            // Get a single project by ID
            projects = await Project.findById(id);
            if (!projects) {
                return NextResponse.json({
                    success: false,
                    message: "Project not found"
                }, { status: 404 });
            }
        } else {
            // Get all projects, sorted by status and creation date
            projects = await Project.find()
                .sort({
                    // Sort by status priority: Completed > In Progress > Planned
                    status: -1,
                    // Then by creation date, newest first
                    createdAt: -1
                });
        }

        return NextResponse.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error("Error in project/get:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching projects: " + error.message
        }, { status: 500 });
    }
}