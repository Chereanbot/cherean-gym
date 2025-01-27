import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Experience from '@/models/Experience';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const formData = await req.json();

        const experience = await Experience.findByIdAndUpdate(
            id,
            { ...formData },
            { new: true, runValidators: true }
        );
        
        if (!experience) {
            return NextResponse.json(
                { success: false, message: 'Experience not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: experience },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating experience:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating experience' },
            { status: 500 }
        );
    }
} 