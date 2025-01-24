import connectToDB from "@/database"
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const POST = async (request) => {
    try {
        await connectToDB();
        const blogData = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'slug', 'excerpt', 'content', 'coverImage', 'category', 'author'];
        const missingFields = requiredFields.filter(field => !blogData[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Set default values if not provided
        const defaultData = {
            status: blogData.status || "Draft",
            readTime: blogData.readTime || 5,
            tags: blogData.tags || [],
            views: 0,
            date: new Date()
        };

        // Create blog with merged data
        const newBlog = await Blog.create({
            ...blogData,
            ...defaultData
        });

        if (newBlog) {
            return NextResponse.json({
                success: true,
                message: "Blog created successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to create blog. Please try again!"
            });
        }
    } catch (error) {
        console.error("Error in blog creation:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong. Please try again!"
        });
    }
}; 