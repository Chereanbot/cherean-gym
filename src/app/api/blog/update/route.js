import connectToDB from "@/database"
import Blog from "@/models/Blog"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function PUT(req) {
  try {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const extractData = await req.json()

    // Update slug if title changed
    if (extractData.title && !extractData.slug) {
      extractData.slug = extractData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    const updateData = await Blog.findByIdAndUpdate(id, extractData, { new: true })

    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Blog post updated successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to update blog post. Please try again"
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