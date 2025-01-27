import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import About from '@/models/About'

// Get resume
export async function GET() {
  try {
    await connectDB()
    const about = await About.findOne({})
    
    if (!about || !about.resume) {
      return NextResponse.json({
        success: false,
        message: 'No resume found'
      })
    }

    return NextResponse.json({
      success: true,
      data: about.resume
    })
  } catch (error) {
    console.error('Error fetching resume:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch resume'
    }, { status: 500 })
  }
}

// Delete resume
export async function DELETE() {
  try {
    await connectDB()
    const about = await About.findOne({})
    
    if (!about) {
      return NextResponse.json({
        success: false,
        message: 'About document not found'
      })
    }

    about.resume = null
    await about.save()

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete resume'
    }, { status: 500 })
  }
} 