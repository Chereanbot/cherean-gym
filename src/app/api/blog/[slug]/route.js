import { connectDB } from '@/lib/database'
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req, { params }) {
  try {
    await connectDB()
    
    const blog = await Blog.findOne({ slug: params.slug })
    
    if (blog) {
      // Increment views
      blog.views += 1
      await blog.save()
      
      return NextResponse.json({
        success: true,
        data: blog
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Blog post not found"
      })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again"
    })
  }
} 