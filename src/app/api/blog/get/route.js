import connectToDB from "@/database"
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        await connectToDB();
        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        if (blogs) {
            return NextResponse.json({
                success: true,
                data: blogs
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "No blogs found!"
            });
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching blogs. Please try again!"
        });
    }
}; 