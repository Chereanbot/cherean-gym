import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Blog from "@/models/Blog";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        
        // Get URL parameters
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: "Blog post slug is required"
            });
        }

        // Find blog post by slug
        const blogPost = await Blog.findOne({ 
            slug: slug,
            status: 'Published'
        });
        
        if (!blogPost) {
            return NextResponse.json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Increment views
        blogPost.views += 1;
        await blogPost.save();

        return NextResponse.json({
            success: true,
            data: blogPost
        });
    } catch (error) {
        console.error('Error in blog client post route:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching blog post"
        });
    }
} 