import { NextResponse } from "next/server";
import { analyzeProjectUrl, generateProjectScreenshots, generateProjectTestimonials } from "@/utils/gemini";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({
                success: false,
                message: "URL is required"
            }, { status: 400 });
        }

        // Validate Gemini API key first
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                message: "Gemini API key is not configured"
            }, { status: 500 });
        }

        // Run analyses sequentially to better handle errors
        const projectAnalysis = await analyzeProjectUrl(url);
        if (!projectAnalysis.success) {
            return NextResponse.json({
                success: false,
                message: "Failed to analyze project",
                error: projectAnalysis.error
            }, { status: 500 });
        }

        const screenshotGuide = await generateProjectScreenshots(url);
        const testimonials = await generateProjectTestimonials(url);
        
        return NextResponse.json({
            success: true,
            data: {
                projectDetails: projectAnalysis.data,
                screenshotGuide: screenshotGuide.data || [],
                testimonials: testimonials.data || []
            }
        });
    } catch (error) {
        console.error("Error in project/analyze:", error);
        
        // Handle specific API errors
        if (error.message?.includes('API_KEY_INVALID')) {
            return NextResponse.json({
                success: false,
                message: "Invalid Gemini API key. Please check your configuration."
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: "Error analyzing project: " + error.message
        }, { status: 500 });
    }
} 