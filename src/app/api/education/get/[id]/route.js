import { NextResponse } from 'next/server';
import { connectToDB } from '@/database';
import Education from '@/models/Education';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = params;

        const education = await Education.findById(id);
        
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
        console.error('Error fetching education:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching education' },
            { status: 500 }
        );
    }
} 