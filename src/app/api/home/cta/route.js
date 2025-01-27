import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import CTA from '@/models/CTA'

export const dynamic = 'force-dynamic'

// Get active CTA
export async function GET() {
  try {
    await connectDB()
    const cta = await CTA.findOne({ isActive: true })
    
    return NextResponse.json({
      success: true,
      data: cta
    })
  } catch (error) {
    console.error('Error in CTA GET route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching CTA'
    })
  }
}

// Add new CTA
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // If setting this CTA as active, deactivate all others
    if (data.isActive) {
      await CTA.updateMany({}, { isActive: false })
    }

    const cta = new CTA(data)
    await cta.save()

    return NextResponse.json({
      success: true,
      message: 'CTA added successfully',
      data: cta
    })
  } catch (error) {
    console.error('Error in CTA POST route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error adding CTA'
    })
  }
} 