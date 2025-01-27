import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Education from '@/models/Education';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const formData = await req.json();

        const education = await Education.findByIdAndUpdate(
            id,
            { ...formData },
            { new: true, runValidators: true }
        );
        
        if (!education) {
            return NextResponse.json(
                { success: false, message: 'Education not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: education },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating education:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating education' },
            { status: 500 }
        );
    }
} 