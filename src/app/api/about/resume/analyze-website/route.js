import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL format'
      }, { status: 400 })
    }

    // Fetch website content with timeout and error handling
    let response
    try {
      response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
    } catch (error) {
      console.error('Fetch error:', error.message)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch website content. Please check the URL and try again.'
      }, { status: 422 })
    }

    const html = response.data
    const $ = cheerio.load(html)

    // Initialize data object
    const data = {
      fullName: '',
      email: '',
      phone: '',
      websites: {
        portfolio: '',
        linkedin: '',
        github: ''
      }
    }

    try {
      // Extract name (looking for common patterns)
      $('h1, .name, #name, [itemprop="name"], .profile-name, .user-name, .fullname, title').each((_, el) => {
        const text = $(el).text().trim()
        if (text && !data.fullName && text.length > 1) {
          data.fullName = text
        }
      })

      // Extract email with better pattern matching
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      const emailContent = $.html()
      const emailMatches = emailContent.match(emailRegex)
      if (emailMatches) {
        data.email = emailMatches[0]
      }

      // Extract phone with better pattern matching
      const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/
      const phoneContent = $.html()
      const phoneMatches = phoneContent.match(phoneRegex)
      if (phoneMatches) {
        data.phone = phoneMatches[0]
      }

      // Extract social links with better pattern matching
      $('a').each((_, el) => {
        const href = $(el).attr('href')
        if (!href) return

        try {
          const fullUrl = new URL(href, url).href
          
          // LinkedIn
          if (fullUrl.includes('linkedin.com') && !data.websites.linkedin) {
            data.websites.linkedin = fullUrl
          }
          // GitHub
          else if (fullUrl.includes('github.com') && !data.websites.github) {
            data.websites.github = fullUrl
          }
          // Portfolio (if it matches the main domain)
          else if (fullUrl.includes(new URL(url).hostname) && !data.websites.portfolio) {
            data.websites.portfolio = fullUrl
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      })

    } catch (error) {
      console.error('Parsing error:', error.message)
    }

    // Check if any data was found
    const hasData = data.fullName || data.email || data.phone || 
                    Object.values(data.websites).some(url => url)

    if (!hasData) {
      return NextResponse.json({
        success: false,
        error: 'No relevant information found on the website'
      }, { status: 404 })
    }

    // Clean up the data
    if (data.fullName) {
      // Remove common website suffixes
      data.fullName = data.fullName
        .replace(/- .+$/, '')
        .replace(/\| .+$/, '')
        .trim()
    }

    console.log('Extracted data:', data)

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error analyzing website:', error.message)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze website'
    }, { status: 500 })
  }
} 