import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Experience from '@/models/Experience';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        const experiences = await Experience.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: experiences
        });
    } catch (error) {
        console.error('Error in GET /api/experience/get:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
}