import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Experience from '@/models/Experience';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const experience = await Experience.findById(id);
        
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
        console.error('Error fetching experience:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching experience' },
            { status: 500 }
        );
    }
} 