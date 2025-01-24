import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Featured from '@/models/Featured'

export const dynamic = 'force-dynamic'

// Get single featured project
export async function GET(request, { params }) {
  try {
    await connectToDB()
    const featured = await Featured.findById(params.id)
    
    if (!featured) {
      return NextResponse.json({
        success: false,
        message: 'Featured project not found'
      })
    }

    return NextResponse.json({
      success: true,
      data: featured
    })
  } catch (error) {
    console.error('Error in featured GET[id] route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching featured project'
    })
  }
}

// Update featured project
export async function PUT(request, { params }) {
  try {
    await connectToDB()
    const data = await request.json()

    const featured = await Featured.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )

    if (!featured) {
      return NextResponse.json({
        success: false,
        message: 'Featured project not found'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Featured project updated successfully',
      data: featured
    })
  } catch (error) {
    console.error('Error in featured PUT route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating featured project'
    })
  }
}

// Delete featured project
export async function DELETE(request, { params }) {
  try {
    await connectToDB()
    const featured = await Featured.findByIdAndDelete(params.id)

    if (!featured) {
      return NextResponse.json({
        success: false,
        message: 'Featured project not found'
      })
    }

    // Reorder remaining projects
    await Featured.updateMany(
      { order: { $gt: featured.order } },
      { $inc: { order: -1 } }
    )

    return NextResponse.json({
      success: true,
      message: 'Featured project deleted successfully'
    })
  } catch (error) {
    console.error('Error in featured DELETE route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error deleting featured project'
    })
  }
} 