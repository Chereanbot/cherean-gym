import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import Experience from '@/models/Experience'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const total = await Experience.countDocuments()

    return NextResponse.json({
      success: true,
      counts: {
        total
      }
    })
  } catch (error) {
    console.error('Error in experience stats route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching experience statistics'
    })
  }
} 