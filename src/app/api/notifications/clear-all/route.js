import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

// DELETE /api/notifications/clear-all - Delete all notifications
export async function DELETE() {
  try {
    await connectToDB()
    
    const result = await Notification.deleteMany({})

    return NextResponse.json({
      success: true,
      message: 'All notifications cleared',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error clearing all notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear all notifications'
    }, { status: 500 })
  }
} 