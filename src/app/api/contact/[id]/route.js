import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import mongoose from 'mongoose'

const Contact = mongoose.models.Contact

// GET /api/contact/[id] - Get a single contact message
export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const message = await Contact.findById(params.id)
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message
    })
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch message'
    }, { status: 500 })
  }
}

// PATCH /api/contact/[id] - Mark message as read/unread
export async function PATCH(request, { params }) {
  try {
    await connectDB()
    
    const body = await request.json()
    const message = await Contact.findByIdAndUpdate(
      params.id,
      { $set: { read: body.read } },
      { new: true }
    )

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update message'
    }, { status: 500 })
  }
}

// DELETE /api/contact/[id] - Delete a message
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    
    const message = await Contact.findByIdAndDelete(params.id)
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete message'
    }, { status: 500 })
  }
}