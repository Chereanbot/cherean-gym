import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

// DELETE /api/notifications/clear-all - Delete all notifications
export async function DELETE() {
  try {
    await connectDB()
    
    // Delete all notifications
    const result = await Notification.deleteMany({})

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: 'All notifications cleared'
      }
    })
  } catch (error) {
    console.error('Error clearing notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear notifications'
    }, { status: 500 })
  }
} 