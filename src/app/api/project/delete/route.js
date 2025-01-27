import { connectDB } from "@/lib/database";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Project ID is required"
            }, { status: 400 });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (deletedProject) {
            return NextResponse.json({
                success: true,
                message: "Project deleted successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in project/delete:", error);
        return NextResponse.json({
            success: false,
            message: "Error deleting project: " + error.message
        }, { status: 500 });
    }
} 