import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import { createContactNotification } from '@/utils/notificationHelpers'

// Create Contact Message Schema if you don't have one
import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
})

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)

// POST /api/contact - Handle contact form submission
export async function POST(request) {
  try {
    await connectToDB()
    
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 })
    }

    // Create contact message in database
    const contactMessage = await Contact.create({
      name,
      email,
      subject,
      message
    })

    // Create notification for admin
    await createContactNotification(name, email, subject)

    // Optional: Send email notification to admin
    // await sendEmailNotification(...)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error handling contact form:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send message'
    }, { status: 500 })
  }
} 