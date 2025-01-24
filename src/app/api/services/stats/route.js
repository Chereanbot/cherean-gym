import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Service from '@/models/Service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

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