import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

// Function to fetch image
async function fileToGenerativePart(imageUrl) {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    return {
        inlineData: {
            data: Buffer.from(imageBuffer).toString('base64'),
            mimeType: response.headers.get('content-type') || 'image/jpeg'
        }
    };
}

// Function to clean JSON string from markdown formatting
function cleanJsonString(str) {
    // Remove markdown code blocks if present
    str = str.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    // Remove any leading/trailing whitespace
    str = str.trim();
    return str;
}

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({
                success: false,
                message: "Image URL is required"
            });
        }

        // Get the Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the image
        const imagePart = await fileToGenerativePart(imageUrl);

        // Create prompt parts
        const prompt = "Analyze this website/app screenshot and create a technical blog post about it. Return ONLY a JSON object (no markdown formatting) with the following fields:\n" +
            "1. title: A technical, SEO-friendly title that describes the UI/UX or functionality shown (max 60 characters)\n" +
            "2. excerpt: A technical summary focusing on the frameworks, technologies, or design patterns visible (max 160 characters)\n" +
            "3. content: Detailed technical analysis including:\n" +
            "   - UI/UX design patterns used\n" +
            "   - Technical implementation details\n" +
            "   - Framework-specific features visible\n" +
            "   - Best practices demonstrated\n" +
            "   - Potential improvements or alternatives\n" +
            "   (minimum 500 words)\n" +
            "4. category: Must be exactly one of these: 'Web Development', 'Mobile Development', 'UI/UX Design', 'Frontend Development', 'Backend Development', 'Full Stack Development'\n" +
            "5. tags: Array of 3-5 technical keywords (frameworks, technologies, design patterns used)\n" +
            "6. readTime: Estimated read time in minutes (based on average 200 words per minute)\n" +
            "7. author: Must be exactly 'Cherinet Afewerk'\n" +
            "8. status: Must be 'Draft'\n" +
            "Focus on technical aspects, implementation details, and development best practices.";

        // Generate content
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let content = response.text();

        // Clean the JSON string before parsing
        content = cleanJsonString(content);

        try {
            // Parse the response
            const blogData = JSON.parse(content);

            // Calculate read time if not provided
            if (!blogData.readTime) {
                const wordCount = blogData.content.split(/\s+/).length;
                blogData.readTime = Math.ceil(wordCount / 200);
            }

            // Generate slug from title
            const slug = generateSlug(blogData.title || '');

            // Ensure all required fields are present
            const completeData = {
                title: blogData.title || '',
                slug: slug,
                excerpt: blogData.excerpt || '',
                content: blogData.content || '',
                coverImage: imageUrl,
                category: blogData.category || 'Web Development',
                tags: blogData.tags || [],
                author: "Cherinet Afewerk",
                status: "Draft",
                readTime: blogData.readTime || 5,
                views: 0,
                date: new Date()
            };

            return NextResponse.json({
                success: true,
                data: completeData
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', content);
            throw new Error('Failed to parse AI response as JSON');
        }
    } catch (error) {
        console.error('Error analyzing image:', error);
        return NextResponse.json({
            success: false,
            message: "Error analyzing image. Please try again."
        });
    }
} 