import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

// GET /api/notifications - Get all notifications
export async function GET() {
  try {
    await connectToDB()
    
    const notifications = await Notification.find({})
      .sort({ date: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 })
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request) {
  try {
    await connectToDB()
    
    const body = await request.json()
    const notification = await Notification.create(body)

    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
} 