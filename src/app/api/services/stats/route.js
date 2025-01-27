import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Service from '@/models/Service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const total = await Service.countDocuments()

    return NextResponse.json({
      success: true,
      counts: {
        total
      }
    })
  } catch (error) {
    console.error('Error in services stats route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching services statistics'
    })
  }
} 