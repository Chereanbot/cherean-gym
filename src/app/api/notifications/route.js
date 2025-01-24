import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

// Get notifications with pagination and filtering
export async function GET(request) {
  try {
    await connectToDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const read = searchParams.get('read')
    const importance = searchParams.get('importance')

    // Build query
    const query = {}
    if (category) query.category = category
    if (type) query.type = type
    if (read !== null) query.read = read === 'true'
    if (importance) query.importance = importance

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await Notification.countDocuments(query)

    // Get notifications with pagination and sorting
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total
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

// Create a new notification
export async function POST(request) {
  try {
    await connectToDB()
    
    const data = await request.json()
    
    // Validate required fields
    if (!data.message) {
      return NextResponse.json({
        success: false,
        error: 'Message is required'
      }, { status: 400 })
    }

    // Create notification
    const notification = await Notification.create({
      message: data.message,
      type: data.type || 'info',
      category: data.category || 'general',
      link: data.link,
      importance: data.importance || 'low',
      metadata: data.metadata,
      expiresAt: data.expiresAt
    })

    return NextResponse.json({
      success: true,
      data: notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
} 