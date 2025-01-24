import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

    const notifications = await Notification.find({})
      .sort({ date: -1 })
      .limit(10)

    return NextResponse.json({
      success: true,
      data: notifications
    })
  } catch (error) {
    console.error('Error in notifications route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching notifications'
    })
  }
} 