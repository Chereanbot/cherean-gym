import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import About from '@/models/About'

export const dynamic = 'force-dynamic'

export async function PUT(req) {
    try {
        await connectToDB()
        const extractData = await req.json()

        const {
            headline,
            shortBio,
            aboutme,
            vision,
            principles,
            journey,
            expertise,
            uniqueSellingPoints,
            noofprojects,
            yearofexerience,
            noofclients,
            skills,
            education,
            certifications,
            languages,
            achievements,
            socialLinks,
            deviceImages
        } = extractData

        const updatedAbout = await About.findOneAndUpdate(
            {},
            {
                headline,
                shortBio,
                aboutme,
                vision,
                principles,
                journey,
                expertise,
                uniqueSellingPoints,
                noofprojects,
                yearofexerience,
                noofclients,
                skills,
                education,
                certifications,
                languages,
                achievements,
                socialLinks,
                deviceImages
            },
            { new: true, upsert: true }
        )

        if (updatedAbout) {
            return NextResponse.json({
                success: true,
                message: 'About information updated successfully',
                data: updatedAbout
            })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to update about information'
            })
        }
    } catch (error) {
        console.error('Error updating about information:', error)
        return NextResponse.json({
            success: false,
            message: 'Error updating about information'
        })
    }
} 