import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

// PUT /api/notifications/mark-all-read - Mark all notifications as read
export async function PUT() {
  try {
    await connectDB()
    
    // Update all unread notifications
    const result = await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    )

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        message: 'All notifications marked as read'
      }
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to mark all notifications as read'
    }, { status: 500 })
  }
} 