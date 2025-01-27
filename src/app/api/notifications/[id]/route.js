import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

// GET /api/notifications/[id] - Get a single notification
export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const notification = await Notification.findById(params.id)
    if (!notification) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Error fetching notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification'
    }, { status: 500 })
  }
}

// DELETE /api/notifications/[id] - Delete a notification
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    
    const notification = await Notification.findByIdAndDelete(params.id)
    if (!notification) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete notification'
    }, { status: 500 })
  }
}

// PATCH /api/notifications/[id] - Update a notification
export async function PATCH(request, { params }) {
  try {
    await connectDB()
    
    const body = await request.json()
    const notification = await Notification.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!notification) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification'
    }, { status: 500 })
  }
} 