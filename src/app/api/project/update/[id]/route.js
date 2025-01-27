import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
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

        const formData = await req.json();

        // Check if project exists first
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }

        // Update the project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { ...formData },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return NextResponse.json({
                success: false,
                message: "Failed to update project"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Error updating project'
        }, { status: 500 });
    }
} 