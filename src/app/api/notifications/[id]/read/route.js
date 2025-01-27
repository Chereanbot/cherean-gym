import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

// PUT /api/notifications/[id]/read - Mark a notification as read
export async function PUT(request, { params }) {
  try {
    await connectDB()
    
    const notification = await Notification.findByIdAndUpdate(
      params.id,
      { $set: { read: true } },
      { new: true }
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
    console.error('Error marking notification as read:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to mark notification as read'
    }, { status: 500 })
  }
} 