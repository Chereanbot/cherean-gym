import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Project from '@/models/Project'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

    const [total, active] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Active' })
    ])

    return NextResponse.json({
      success: true,
      counts: {
        total,
        active
      }
    })
  } catch (error) {
    console.error('Error in project stats route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching project statistics'
    })
  }
} 