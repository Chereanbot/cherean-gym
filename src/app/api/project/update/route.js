import { connectToDB } from "@/database";
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

    if (data.solutions && !Array.isArray(data.solutions)) {
        return {
            isValid: false,
            error: 'Solutions must be an array'
        };
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

    // Validate category
    const validCategories = ['Web App', 'Mobile App', 'Desktop App', 'Library', 'Other'];
    if (!validCategories.includes(data.category)) {
        return {
            isValid: false,
            error: 'Invalid category'
        };
    }

    // Validate status
    const validStatuses = ['Completed', 'In Progress', 'Planned'];
    if (!validStatuses.includes(data.status)) {
        return {
            isValid: false,
            error: 'Invalid status'
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

    return { isValid: true };
};

export async function PUT(req) {
    try {
        await connectToDB();
        const { _id, ...projectData } = await req.json();

        if (!_id) {
            return NextResponse.json({
                success: false,
                message: "Project ID is required"
            }, { status: 400 });
        }

        // Validate the data
        const validationResult = validateProjectData(projectData);
        if (!validationResult.isValid) {
            return NextResponse.json({
                success: false,
                message: validationResult.error
            }, { status: 400 });
        }

        // Clean up the data
        const cleanData = {
            ...projectData,
            features: projectData.features?.filter(f => f) || [],
            screenshots: projectData.screenshots?.filter(s => s) || [],
            challengesFaced: projectData.challengesFaced?.filter(c => c) || [],
            solutions: projectData.solutions?.filter(s => s) || [],
            testimonials: projectData.testimonials?.filter(t => t.name && t.role && t.comment) || [],
            teamSize: projectData.teamSize ? Number(projectData.teamSize) : undefined
        };

        const updatedProject = await Project.findByIdAndUpdate(
            _id,
            cleanData,
            { new: true, runValidators: true }
        );

        if (updatedProject) {
            return NextResponse.json({
                success: true,
                message: "Project updated successfully",
                data: updatedProject
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in project/update:", error);
        return NextResponse.json({
            success: false,
            message: "Error updating project: " + error.message
        }, { status: 500 });
    }
} 