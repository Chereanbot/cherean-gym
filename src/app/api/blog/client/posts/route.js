import { connectDB } from '@/lib/database';
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        await connectDB();

        // Get URL parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const limit = 9; // Posts per page

        // Build query
        let query = { status: 'Published' };
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Get total count for pagination
        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Get posts with pagination
        const posts = await Blog.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get categories with counts
        const categories = await Blog.aggregate([
            { $match: { status: 'Published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { name: '$_id', count: 1, _id: 0 } }
        ]);

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                pages: totalPages,
                total
            },
            categories
        });
    } catch (error) {
        console.error('Error in blog client posts route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching blog posts"
        });
    }
} 