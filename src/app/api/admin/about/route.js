import { NextResponse } from 'next/server';
import connectToDB from '@/database';
import About from '@/models/About';

export async function PUT(req) {
    try {
        await connectToDB();
        const data = await req.json();

        // Find the existing about document or create a new one
        let about = await About.findOne();
        if (!about) {
            about = new About();
        }

        // Update the fields
        Object.assign(about, data);

        // Save the changes
        await about.save();

        return NextResponse.json({
            success: true,
            message: 'About information updated successfully',
            data: about
        });
    } catch (error) {
        console.error('Error updating about information:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update about information' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDB();
        const about = await About.findOne();
        
        return NextResponse.json({
            success: true,
            data: about || {}
        });
    } catch (error) {
        console.error('Error fetching about information:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch about information' },
            { status: 500 }
        );
    }
} 