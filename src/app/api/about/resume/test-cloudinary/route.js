import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = cloudinary.config()
    
    // Return configuration (without sensitive data)
    return NextResponse.json({
      success: true,
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? 'configured' : 'missing',
        api_secret: config.api_secret ? 'configured' : 'missing',
        secure: config.secure
      }
    })
  } catch (error) {
    console.error('Cloudinary configuration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 