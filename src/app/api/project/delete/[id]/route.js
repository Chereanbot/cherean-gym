import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
    try {
        const connected = await connectDB();
        if (!connected) {
            return NextResponse.json({
                success: false,
                message: "Database connection failed"
            }, { status: 500 });
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Project ID is required"
            }, { status: 400 });
        }

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }

        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return NextResponse.json({
                success: false,
                message: "Failed to delete project"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({
            success: false,
            message: "Error deleting project: " + error.message
        }, { status: 500 });
    }
} 