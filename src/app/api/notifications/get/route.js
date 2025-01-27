import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    // Get unread count
    const unreadCount = await Notification.countDocuments({ read: false })

    // Get latest notifications
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(10)

    // Format dates and add additional info
    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      category: notification.category,
      read: notification.read,
      link: notification.link,
      importance: notification.importance,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      formattedDate: new Date(notification.createdAt).toLocaleString()
    }))

    return NextResponse.json({
      success: true,
      data: {
        notifications: formattedNotifications,
        unreadCount
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 })
  }
} 