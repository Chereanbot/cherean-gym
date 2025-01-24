import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Education from '@/models/Education'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDB()

    const total = await Education.countDocuments()

    return NextResponse.json({
      success: true,
      counts: {
        total
      }
    })
  } catch (error) {
    console.error('Error in education stats route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching education statistics'
    })
  }
} 