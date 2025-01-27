import { connectDB } from '@/lib/database'
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function DELETE(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const deleteData = await Blog.findByIdAndDelete(id)

    if (deleteData) {
      return NextResponse.json({
        success: true,
        message: "Blog post deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete blog post. Please try again"
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