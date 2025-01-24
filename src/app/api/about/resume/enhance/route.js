import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request) {
  try {
    const cvData = await request.json()
    
    // Enhance summary
    const enhancedSummary = await generateSummary(cvData.personalInfo)
    
    // Enhance experience descriptions
    const enhancedExperience = await Promise.all(
      cvData.experience.map(async (exp) => ({
        ...exp,
        description: await enhanceDescription(exp)
      }))
    )

    // Enhance project descriptions
    const enhancedProjects = await Promise.all(
      cvData.projects.map(async (project) => ({
        ...project,
        description: await enhanceProjectDescription(project)
      }))
    )

    return NextResponse.json({
      success: true,
      data: {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          summary: enhancedSummary
        },
        experience: enhancedExperience,
        projects: enhancedProjects
      }
    })
  } catch (error) {
    console.error('Error enhancing CV:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to enhance CV content'
    }, { status: 500 })
  }
}

async function generateSummary(personalInfo) {
  const prompt = `Create a professional and compelling 2-3 sentence summary for a CV with the following information:
Name: ${personalInfo.fullName}
Title: ${personalInfo.title}
Current Summary: ${personalInfo.summary || 'None provided'}

The summary should be concise, highlight key strengths, and be written in first person.`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional CV writer who creates compelling and concise content."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  })

  return response.choices[0].message.content.trim()
}

async function enhanceDescription(experience) {
  const prompt = `Improve the following job description for a CV, focusing on achievements and impact. Use action verbs and quantify results where possible:

Role: ${experience.title}
Company: ${experience.company}
Current Description: ${experience.description || 'None provided'}

Format the response as 3-4 bullet points, each starting with an action verb.`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional CV writer who creates impactful job descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  })

  return response.choices[0].message.content.trim()
}

async function enhanceProjectDescription(project) {
  const prompt = `Create an impactful project description for a CV with the following information:
Project: ${project.name}
Technologies: ${project.technologies || 'Not specified'}
Current Description: ${project.description || 'None provided'}

Format the response as 2-3 sentences, highlighting the problem solved, technologies used, and measurable outcomes.`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional CV writer who creates compelling project descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  })

  return response.choices[0].message.content.trim()
} 