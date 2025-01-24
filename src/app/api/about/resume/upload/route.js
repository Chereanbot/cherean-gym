import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import About from '@/models/About'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const file = formData.get('resume')

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resume',
          public_id: 'my_resume',
          overwrite: true,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Update or create About document
    let about = await About.findOne({})
    if (!about) {
      about = new About({})
    }

    about.resume = {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      updatedAt: new Date()
    }

    await about.save()

    return NextResponse.json({
      success: true,
      data: about.resume
    })
  } catch (error) {
    console.error('Error uploading resume:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to upload resume'
    }, { status: 500 })
  }
} 