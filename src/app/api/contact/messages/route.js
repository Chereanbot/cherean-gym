import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Contact from '@/models/Contact'

// GET /api/contact/messages - Get all contact messages
export async function GET(request) {
  try {
    await connectToDB()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const read = searchParams.get('read')
    
    // Build query
    const query = {}
    if (read !== null && read !== undefined) {
      query.read = read === 'true'
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Get total count for pagination
    const total = await Contact.countDocuments(query)
    
    // Get messages with pagination and sorting
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + messages.length < total
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch messages'
    }, { status: 500 })
  }
} 