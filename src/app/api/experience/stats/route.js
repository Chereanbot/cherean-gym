import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Experience from '@/models/Experience'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

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