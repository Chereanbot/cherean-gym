import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Featured from '@/models/Featured'

export const dynamic = 'force-dynamic'

// Get all featured projects
export async function GET() {
  try {
    await connectDB()
    const featured = await Featured.find({ isActive: true }).sort({ order: 1 })
    
    return NextResponse.json({
      success: true,
      data: featured
    })
  } catch (error) {
    console.error('Error in featured GET route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching featured projects'
    })
  }
}

// Add new featured project
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Get highest order number
    const lastProject = await Featured.findOne().sort({ order: -1 })
    const newOrder = lastProject ? lastProject.order + 1 : 0

    const featured = new Featured({
      ...data,
      order: newOrder
    })
    await featured.save()

    return NextResponse.json({
      success: true,
      message: 'Featured project added successfully',
      data: featured
    })
  } catch (error) {
    console.error('Error in featured POST route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error adding featured project'
    })
  }
} 