import { connectDB } from '@/lib/database'
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req, { params }) {
  try {
    await connectDB()
    
    const post = await Blog.findOne({ 
      slug: params.slug,
      status: 'Published'
    })
    
    if (post) {
      // Increment views
      post.views += 1
      await post.save()
      
      // Get related posts from the same category
      const relatedPosts = await Blog.find({
        category: post.category,
        _id: { $ne: post._id },
        status: 'Published'
      })
        .select('title excerpt coverImage slug')
        .limit(3)
      
      return NextResponse.json({
        success: true,
        data: {
          post,
          relatedPosts
        }
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