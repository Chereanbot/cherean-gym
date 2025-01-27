import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Blog from "@/models/Blog";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        // Get distinct categories from published posts
        const categories = await Blog.distinct('category', { status: 'Published' });
        
        if (!categories || categories.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No categories found"
            });
        }

        // Get post count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Blog.countDocuments({
                    category,
                    status: 'Published'
                });
                return { name: category, count };
            })
        );

        return NextResponse.json({
            success: true,
            data: categoriesWithCount
        });
    } catch (error) {
        console.error('Error in blog client categories route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching blog categories"
        });
    }
} 