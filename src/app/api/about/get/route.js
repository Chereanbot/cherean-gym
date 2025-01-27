import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import About from '@/models/About';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        // Find the about document
        const about = await About.findOne({}).sort({ createdAt: -1 });
        
        if (!about) {
            return NextResponse.json({
                success: true,
                data: {} // Return empty object if no data found
            });
        }

        return NextResponse.json({
            success: true,
            data: about
        });
    } catch (error) {
        console.error('Error fetching about data:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fetch about data'
        }, { status: 500 });
    }
}