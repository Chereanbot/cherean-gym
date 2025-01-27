import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import About from '@/models/About'
import PDFDocument from 'pdfkit'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    const cvData = await request.json()
    
    // Create PDF with custom page size and margins
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
      }
    })
    
    let buffers = []
    doc.on('data', buffers.push.bind(buffers))
    
    // Generate PDF content with modern layout
    await generateModernPDF(doc, cvData)
    
    doc.end()
    const pdfBuffer = Buffer.concat(buffers)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resume',
          public_id: 'generated_resume',
          overwrite: true,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(pdfBuffer)
    })

    // Update About document
    await connectDB()
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
    console.error('Error generating resume:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to generate resume'
    }, { status: 500 })
  }
}

async function generateModernPDF(doc, cvData) {
  // Define colors and styles
  const colors = {
    primary: '#1e40af', // Deep blue
    text: '#1f2937',    // Dark gray
    light: '#6b7280',   // Light gray
    accent: '#3b82f6'   // Bright blue
  }

  // Page dimensions
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const leftColumnWidth = pageWidth * 0.35
  const rightColumnWidth = pageWidth * 0.65
  const rightColumnX = doc.page.margins.left + leftColumnWidth + 20

  // Left Column Content
  let currentY = doc.page.margins.top

  // Profile Photo (if available)
  if (cvData.personalInfo.photo) {
    doc.image(cvData.personalInfo.photo, doc.page.margins.left, currentY, {
      width: leftColumnWidth,
      height: leftColumnWidth // Make it square
    })
    currentY += leftColumnWidth + 20
  }

  // Contact Information
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(colors.primary)
     .text('CONTACT', doc.page.margins.left, currentY)
  
  currentY += 20
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(colors.text)
  
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location
  ].filter(Boolean)

  contactInfo.forEach(info => {
    doc.text(info, doc.page.margins.left, currentY)
    currentY += 15
  })

  // Skills Section
  currentY += 20
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(colors.primary)
     .text('SKILLS', doc.page.margins.left, currentY)
  
  currentY += 20
  
  // Technical Skills
  if (cvData.skills.technical.length > 0) {
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor(colors.text)
       .text('Technical', doc.page.margins.left, currentY)
    
    currentY += 15
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor(colors.light)
    
    cvData.skills.technical.forEach(skill => {
      doc.text(`• ${skill}`, doc.page.margins.left + 10, currentY)
      currentY += 15
    })
  }

  // Soft Skills
  if (cvData.skills.soft.length > 0) {
    currentY += 10
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor(colors.text)
       .text('Soft Skills', doc.page.margins.left, currentY)
    
    currentY += 15
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor(colors.light)
    
    cvData.skills.soft.forEach(skill => {
      doc.text(`• ${skill}`, doc.page.margins.left + 10, currentY)
      currentY += 15
    })
  }

  // Languages
  if (cvData.skills.languages.length > 0) {
    currentY += 10
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor(colors.text)
       .text('Languages', doc.page.margins.left, currentY)
    
    currentY += 15
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor(colors.light)
    
    cvData.skills.languages.forEach(lang => {
      doc.text(`• ${lang.name} (${lang.proficiency})`, doc.page.margins.left + 10, currentY)
      currentY += 15
    })
  }

  // Right Column Content
  currentY = doc.page.margins.top

  // Name and Title
  doc.font('Helvetica-Bold')
     .fontSize(24)
     .fillColor(colors.primary)
     .text(cvData.personalInfo.fullName, rightColumnX, currentY)
  
  currentY += 30
  doc.font('Helvetica')
     .fontSize(16)
     .fillColor(colors.text)
     .text(cvData.personalInfo.title, rightColumnX, currentY)
  
  // Professional Summary
  currentY += 40
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(colors.primary)
     .text('PROFESSIONAL SUMMARY', rightColumnX, currentY)
  
  currentY += 20
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(colors.text)
     .text(cvData.personalInfo.summary, rightColumnX, currentY, {
       width: rightColumnWidth,
       align: 'justify'
     })

  // Experience Section
  currentY += 40
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(colors.primary)
     .text('PROFESSIONAL EXPERIENCE', rightColumnX, currentY)
  
  currentY += 20
  cvData.experience.forEach(exp => {
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .fillColor(colors.text)
       .text(exp.title, rightColumnX, currentY)
    
    currentY += 15
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor(colors.light)
       .text([
         exp.company,
         `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`
       ].join(' | '), rightColumnX, currentY)
    
    currentY += 15
    doc.font('Helvetica')
       .fontSize(10)
       .fillColor(colors.text)
       .text(exp.description, rightColumnX, currentY, {
         width: rightColumnWidth,
         align: 'justify'
       })
    
    currentY += 30
  })

  // Education Section
  if (cvData.education.length > 0) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .fillColor(colors.primary)
       .text('EDUCATION', rightColumnX, currentY)
    
    currentY += 20
    cvData.education.forEach(edu => {
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .fillColor(colors.text)
         .text(edu.degree, rightColumnX, currentY)
      
      currentY += 15
      doc.font('Helvetica')
         .fontSize(10)
         .fillColor(colors.light)
         .text([edu.institution, edu.year].join(' | '), rightColumnX, currentY)
      
      if (edu.description) {
        currentY += 15
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor(colors.text)
           .text(edu.description, rightColumnX, currentY, {
             width: rightColumnWidth,
             align: 'justify'
           })
      }
      
      currentY += 30
    })
  }

  // Projects Section
  if (cvData.projects.length > 0) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .fillColor(colors.primary)
       .text('PROJECTS', rightColumnX, currentY)
    
    currentY += 20
    cvData.projects.forEach(project => {
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .fillColor(colors.text)
         .text(project.name, rightColumnX, currentY)
      
      currentY += 15
      doc.font('Helvetica')
         .fontSize(10)
         .fillColor(colors.text)
         .text(project.description, rightColumnX, currentY, {
           width: rightColumnWidth,
           align: 'justify'
         })
      
      if (project.technologies) {
        currentY += 15
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor(colors.light)
           .text(`Technologies: ${project.technologies}`, rightColumnX, currentY)
      }
      
      if (project.link) {
        currentY += 15
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor(colors.accent)
           .text(project.link, rightColumnX, currentY)
      }
      
      currentY += 30
    })
  }
} 