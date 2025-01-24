import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API key validation
const initializeGemini = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }
    return new GoogleGenerativeAI(apiKey);
};

// Get Gemini instance with error handling
const getGeminiInstance = () => {
    try {
        return initializeGemini();
    } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        throw error;
    }
};

export async function analyzeProjectUrl(url) {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Analyze this project URL: ${url}
        Please extract and provide the following information in JSON format:
        {
            "name": "Project name",
            "shortDescription": "A brief one-line description",
            "description": "Detailed project description with key points and objectives",
            "technologies": "Comma-separated list of technologies, frameworks, and tools used",
            "features": ["Comprehensive list of main features and functionalities"],
            "category": "One of: Web App, Mobile App, Desktop App, E-commerce, Portfolio, Blog, Social Media, Educational, Enterprise, API/Backend, Library, Game, AI/ML, Blockchain, IoT, Other",
            "subCategory": "Specific type within the main category (e.g., CMS, Dashboard, Analytics, etc.)",
            "status": "One of: Completed, In Progress, Planned, Beta, Maintenance",
            "challengesFaced": [
                "Detailed technical challenges faced during development",
                "Architecture decisions and trade-offs",
                "Performance bottlenecks encountered",
                "Security considerations"
            ],
            "solutions": [
                "Detailed solutions to each challenge",
                "Architectural solutions implemented",
                "Optimization techniques used",
                "Security measures implemented"
            ],
            "role": "Your specific role and responsibilities in the project",
            "teamSize": number,
            "duration": "Project duration",
            "targetAudience": "Who is this project built for?",
            "businessImpact": "What business problems does it solve?",
            "technicalHighlights": [
                "Key technical achievements",
                "Innovative solutions",
                "Performance metrics",
                "Scalability features"
            ],
            "deploymentDetails": {
                "hosting": "Where is it hosted",
                "infrastructure": "Infrastructure details",
                "cicd": "CI/CD pipeline information"
            },
            "metrics": {
                "performance": "Key performance metrics",
                "scalability": "Scalability numbers",
                "userBase": "Number of users/clients if applicable"
            },
            "futureEnhancements": ["Planned future improvements"],
            "links": {
                "website": "Live website URL",
                "github": "GitHub repository URL",
                "documentation": "Documentation URL",
                "demo": "Demo video URL"
            }
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const projectData = JSON.parse(jsonMatch[0]);
                return {
                    success: true,
                    data: projectData
                };
            }
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
        }

        return {
            success: false,
            error: "Could not parse project information"
        };
    } catch (error) {
        console.error("Error analyzing project:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function generateProjectScreenshots(url) {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `For this project URL: ${url}
        Please suggest comprehensive screenshots that should be captured to showcase the project effectively.
        Format the response as a JSON array of objects, each containing:
        {
            "section": "Which section of the project (e.g., Landing Page, Dashboard, Features)",
            "description": "What specific elements or functionality the screenshot should show",
            "importance": "Why this screenshot is crucial for showcasing the project",
            "captureGuide": "Detailed steps to capture this screenshot effectively",
            "elements": ["Key elements that should be visible"],
            "tips": ["Technical tips for capturing high-quality screenshot"],
            "alternatives": ["Alternative angles or states to consider"],
            "userStory": "How this screenshot relates to user journey"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const screenshotGuide = JSON.parse(jsonMatch[0]);
                return {
                    success: true,
                    data: screenshotGuide
                };
            }
        } catch (error) {
            console.error("Error parsing screenshot guide:", error);
        }

        return {
            success: false,
            error: "Could not generate screenshot guide"
        };
    } catch (error) {
        console.error("Error generating screenshot guide:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function generateProjectTestimonials(url) {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Based on this project URL: ${url}
        Please suggest potential testimonials that could be collected from different stakeholders.
        Format the response as a JSON array of objects, each containing:
        {
            "stakeholderType": "Type of stakeholder (e.g., Client, User, Team Member)",
            "name": "Suggested name",
            "role": "Professional role",
            "comment": "Detailed testimonial focusing on specific value and impact",
            "focusArea": "What aspect of the project they're commenting on",
            "impact": "Specific benefits or results they experienced",
            "credibilityFactors": ["Elements that make this testimonial credible"]
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const testimonials = JSON.parse(jsonMatch[0]);
                return {
                    success: true,
                    data: testimonials
                };
            }
        } catch (error) {
            console.error("Error parsing testimonials:", error);
        }

        return {
            success: false,
            error: "Could not generate testimonials"
        };
    } catch (error) {
        console.error("Error generating testimonials:", error);
        return {
            success: false,
            error: error.message
        };
    }
} 