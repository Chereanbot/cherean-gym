import { connectDB } from '@/lib/database';
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const validateProjectData = (data) => {
    const requiredFields = ['name', 'shortDescription', 'description', 'technologies', 'category', 'status'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        return {
            isValid: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
        };
    }

    // Validate URLs if provided
    const urlFields = ['website', 'github', 'demoVideo', 'liveDemoUrl'];
    for (const field of urlFields) {
        if (data[field]) {
            try {
                new URL(data[field]);
            } catch (error) {
                return {
                    isValid: false,
                    error: `Invalid URL for ${field}`
                };
            }
        }
    }

    // Validate arrays
    if (data.screenshots && !Array.isArray(data.screenshots)) {
        return {
            isValid: false,
            error: 'Screenshots must be an array'
        };
    }

    if (data.features && !Array.isArray(data.features)) {
        return {
            isValid: false,
            error: 'Features must be an array'
        };
    }

    if (data.challengesFaced && !Array.isArray(data.challengesFaced)) {
        return {
            isValid: false,
            error: 'Challenges must be an array'
        };
    }

    // Validate category
    const validCategories = [
        'Web App', 'Mobile App', 'Desktop App', 'E-commerce', 
        'Portfolio', 'Blog', 'Social Media', 'Educational', 
        'Enterprise', 'API/Backend', 'Library', 'Game', 
        'AI/ML', 'Blockchain', 'IoT', 'Other'
    ];
    if (!validCategories.includes(data.category)) {
        return {
            isValid: false,
            error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        };
    }

    // Validate status
    const validStatuses = ['Completed', 'In Progress', 'Planned', 'Beta', 'Maintenance'];
    if (!validStatuses.includes(data.status)) {
        return {
            isValid: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        };
    }

    // Validate teamSize if provided
    if (data.teamSize !== undefined) {
        const teamSize = Number(data.teamSize);
        if (isNaN(teamSize) || teamSize < 1) {
            return {
                isValid: false,
                error: 'Team size must be a positive number'
            };
        }
    }

    // Validate screenshots structure
    if (data.screenshots) {
        for (const screenshot of data.screenshots) {
            if (!screenshot.url || !screenshot.title) {
                return {
                    isValid: false,
                    error: 'Each screenshot must have a url and title'
                };
            }
        }
    }

    // Validate testimonials if provided
    if (data.testimonials) {
        if (!Array.isArray(data.testimonials)) {
            return {
                isValid: false,
                error: 'Testimonials must be an array'
            };
        }

        for (const testimonial of data.testimonials) {
            if (!testimonial.name || !testimonial.role || !testimonial.comment) {
                return {
                    isValid: false,
                    error: 'Each testimonial must have a name, role, and comment'
                };
            }
        }
    }

    return { isValid: true };
};

export async function POST(req) {
    try {
        await connectDB();
        const projectData = await req.json();

        // Validate the data
        const validationResult = validateProjectData(projectData);
        if (!validationResult.isValid) {
            return NextResponse.json({
                success: false,
                message: validationResult.error
            }, { status: 400 });
        }

        // Transform challenges if they're in string format
        const transformedData = {
            ...projectData,
            challengesFaced: projectData.challengesFaced?.map(challenge => 
                typeof challenge === 'string' 
                    ? { challenge, solution: '', impact: '' }
                    : challenge
            ) || [],
            features: projectData.features?.filter(f => f) || [],
            screenshots: projectData.screenshots?.filter(s => s.url && s.title) || [],
            testimonials: projectData.testimonials?.filter(t => t.name && t.role && t.comment) || [],
            teamSize: projectData.teamSize ? Number(projectData.teamSize) : undefined,
            // Ensure proper structure for nested objects
            deploymentDetails: projectData.deploymentDetails || {},
            metrics: projectData.metrics || {},
            links: projectData.links || {},
            seoMetadata: projectData.seoMetadata || {},
            analytics: projectData.analytics || { views: 0, likes: 0, shares: 0 },
            techStack: projectData.techStack || {}
        };

        const savedProject = await Project.create(transformedData);

        if (savedProject) {
            return NextResponse.json({
                success: true,
                message: "Project added successfully",
                data: savedProject
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to add project"
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in project/add:", error);
        return NextResponse.json({
            success: false,
            message: "Error adding project: " + error.message
        }, { status: 500 });
    }
}