import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Extract data from formData
    const fullName = formData.get('fullName')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const websites = JSON.parse(formData.get('websites'))
    const experience = JSON.parse(formData.get('experience') || '[]')
    const education = JSON.parse(formData.get('education') || '[]')

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Set initial position
    let y = 20

    // Name and Title
    doc.setFontSize(24)
    doc.text(fullName, 20, y)
    y += 10

    // Contact Information
    doc.setFontSize(12)
    if (email) {
      doc.text(`Email: ${email}`, 20, y)
      y += 7
    }
    if (phone) {
      doc.text(`Phone: ${phone}`, 20, y)
      y += 7
    }
    y += 5

    // Websites
    if (Object.values(websites).some(url => url)) {
      doc.setFontSize(14)
      doc.text('Online Profiles', 20, y)
      y += 7
      doc.setFontSize(12)

      if (websites.portfolio) {
        doc.text(`Portfolio: ${websites.portfolio}`, 20, y)
        doc.link(20, y - 5, 150, 7, { url: websites.portfolio })
        y += 7
      }
      if (websites.linkedin) {
        doc.text(`LinkedIn: ${websites.linkedin}`, 20, y)
        doc.link(20, y - 5, 150, 7, { url: websites.linkedin })
        y += 7
      }
      if (websites.github) {
        doc.text(`GitHub: ${websites.github}`, 20, y)
        doc.link(20, y - 5, 150, 7, { url: websites.github })
        y += 7
      }
      y += 5
    }

    // Separator line
    doc.line(20, y, 190, y)
    y += 10

    // Experience Section
    if (experience.length > 0) {
      doc.setFontSize(16)
      doc.text('Professional Experience', 20, y)
      y += 10

      experience.forEach((job) => {
        doc.setFontSize(14)
        doc.text(job.title, 20, y)
        y += 7
        doc.setFontSize(12)
        doc.text(job.company, 20, y)
        y += 5
        doc.text(`${job.startDate} - ${job.endDate || 'Present'}`, 20, y)
        y += 7

        // Handle multiline description
        const splitDescription = doc.splitTextToSize(job.description, 170)
        doc.text(splitDescription, 20, y)
        y += splitDescription.length * 7 + 5

        // Add page if needed
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
    }

    // Education Section
    if (education.length > 0) {
      doc.setFontSize(16)
      doc.text('Education', 20, y)
      y += 10

      education.forEach((edu) => {
        doc.setFontSize(14)
        doc.text(edu.degree, 20, y)
        y += 7
        doc.setFontSize(12)
        doc.text(edu.institution, 20, y)
        y += 5
        doc.text(edu.year, 20, y)
        y += 7

        if (edu.description) {
          const splitDescription = doc.splitTextToSize(edu.description, 170)
          doc.text(splitDescription, 20, y)
          y += splitDescription.length * 7 + 5
        }

        // Add page if needed
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
    }

    try {
      // Get the PDF as a buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      // Upload PDF to Cloudinary using upload_stream
      const pdfResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cv-documents',
            resource_type: 'raw',
            format: 'pdf',
            public_id: `cv_${Date.now()}`,
            type: 'upload',
            access_mode: 'public'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error)
              reject(error)
            } else {
              console.log('Cloudinary upload success:', result)
              resolve(result)
            }
          }
        )

        // Write the buffer to the upload stream
        uploadStream.end(pdfBuffer)
      })

      // Return success response with PDF URL
      return NextResponse.json({
        success: true,
        pdfUrl: pdfResult.secure_url,
        message: 'CV generated successfully'
      })

    } catch (uploadError) {
      console.error('Error uploading to Cloudinary:', uploadError)
      
      // Return the PDF as a direct download if Cloudinary upload fails
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cv.pdf"`,
          'Cache-Control': 'no-cache'
        }
      })
    }

  } catch (error) {
    console.error('Error generating CV:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate CV: ' + error.message
    }, { status: 500 })
  }
} 