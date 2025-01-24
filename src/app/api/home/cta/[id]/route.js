import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import CTA from '@/models/CTA'

export const dynamic = 'force-dynamic'

// Get single CTA
export async function GET(request, { params }) {
  try {
    await connectToDB()
    const cta = await CTA.findById(params.id)
    
    if (!cta) {
      return NextResponse.json({
        success: false,
        message: 'CTA not found'
      })
    }

    return NextResponse.json({
      success: true,
      data: cta
    })
  } catch (error) {
    console.error('Error in CTA GET[id] route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching CTA'
    })
  }
}

// Update CTA
export async function PUT(request, { params }) {
  try {
    await connectToDB()
    const data = await request.json()

    // If setting this CTA as active, deactivate all others
    if (data.isActive) {
      await CTA.updateMany(
        { _id: { $ne: params.id } },
        { isActive: false }
      )
    }

    const cta = await CTA.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )

    if (!cta) {
      return NextResponse.json({
        success: false,
        message: 'CTA not found'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'CTA updated successfully',
      data: cta
    })
  } catch (error) {
    console.error('Error in CTA PUT route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating CTA'
    })
  }
}

// Delete CTA
export async function DELETE(request, { params }) {
  try {
    await connectToDB()
    const cta = await CTA.findByIdAndDelete(params.id)

    if (!cta) {
      return NextResponse.json({
        success: false,
        message: 'CTA not found'
      })
    }

    // If deleted CTA was active, activate the most recently updated one
    if (cta.isActive) {
      const latestCTA = await CTA.findOne().sort({ updatedAt: -1 })
      if (latestCTA) {
        latestCTA.isActive = true
        await latestCTA.save()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'CTA deleted successfully'
    })
  } catch (error) {
    console.error('Error in CTA DELETE route:', error)
    return NextResponse.json({
      success: false,
      message: 'Error deleting CTA'
    })
  }
} 