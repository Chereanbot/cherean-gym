import { NextResponse } from 'next/server';
import connectToDB from '@/database';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Project ID is required'
            }, { status: 400 });
        }

        const project = await Project.findById(id);
        
        if (!project) {
            return NextResponse.json(
                { success: false, message: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: project },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching project: ' + error.message },
            { status: 500 }
        );
    }
} 