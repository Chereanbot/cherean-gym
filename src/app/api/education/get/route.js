import { NextResponse } from 'next/server';
import connectDB from '@/database';
import Education from '@/models/Education';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        const education = await Education.find({}).sort({ year: -1 });
        
        return NextResponse.json({
            success: true,
            data: education
        });
    } catch (error) {
        console.error('Error in GET /api/education/get:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch education data' },
            { status: 500 }
        );
    }
}