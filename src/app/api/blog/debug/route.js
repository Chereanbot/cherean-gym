import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Blog from '@/models/Blog'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

    const [total, published, draft] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'Published' }),
      Blog.countDocuments({ status: 'Draft' })
    ])

    return NextResponse.json({
      success: true,
      counts: {
        total,
        published,
        draft
      }
    })
  } catch (error) {
    console.error('Error in blog debug route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching blog statistics'
    })
  }
} 