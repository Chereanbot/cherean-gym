import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from '@/lib/database';
import DashboardActivity from "@/models/DashboardActivity";

export const dynamic = 'force-dynamic';

// Get activities with filtering and pagination
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const type = searchParams.get('type');
        const action = searchParams.get('action');
        const status = searchParams.get('status');
        const importance = searchParams.get('importance');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build query
        const query = {};
        if (type) query.type = type;
        if (action) query.action = action;
        if (status) query.status = status;
        if (importance) query.importance = importance;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const [activities, total] = await Promise.all([
            DashboardActivity.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email'),
            DashboardActivity.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                activities,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

// Create new activity
export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        
        // Get IP and user agent
        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');
        const userAgent = headersList.get('user-agent');

        // Create activity with additional info
        const activity = await DashboardActivity.create({
            ...data,
            ip,
            userAgent
        });

        return NextResponse.json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create activity' },
            { status: 500 }
        );
    }
}

// Delete activities (with filters)
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const type = searchParams.get('type');
        const action = searchParams.get('action');
        const status = searchParams.get('status');
        const importance = searchParams.get('importance');
        const olderThan = searchParams.get('olderThan'); // Date string

        // Build query
        const query = {};
        if (type) query.type = type;
        if (action) query.action = action;
        if (status) query.status = status;
        if (importance) query.importance = importance;
        if (olderThan) {
            query.createdAt = { $lt: new Date(olderThan) };
        }

        const result = await DashboardActivity.deleteMany(query);

        return NextResponse.json({
            success: true,
            data: {
                deleted: result.deletedCount
            }
        });
    } catch (error) {
        console.error('Error deleting activities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete activities' },
            { status: 500 }
        );
    }
} 