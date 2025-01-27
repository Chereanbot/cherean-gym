import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

// Get notifications with pagination and filtering
export async function GET(request) {
  try {
    await connectDB()
    
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
export async function POST(req) {
  try {
    await connectDB()
    const data = await req.json()
    
    // Create notification in database
    const notification = await Notification.create({
      message: data.message,
      type: data.type || 'info',
      category: data.category || 'general',
      link: data.link,
      importance: data.importance || 'low',
      metadata: data.metadata || {}
    })

    return NextResponse.json({ 
      success: true, 
      notification 
    })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    )
  }
} 