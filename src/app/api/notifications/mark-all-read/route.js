import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

// PUT /api/notifications/mark-all-read - Mark all notifications as read
export async function PUT() {
  try {
    await connectToDB()
    
    const result = await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    )

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to mark all notifications as read'
    }, { status: 500 })
  }
} 