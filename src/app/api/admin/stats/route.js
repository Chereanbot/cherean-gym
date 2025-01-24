import { NextResponse } from "next/server";
import connectDB from "@/database";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Contact from "@/models/Contact";
import DashboardSettings from "@/models/DashboardSettings";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        // Get dashboard settings or create default if not exists
        let settings = await DashboardSettings.findOne();
        if (!settings) {
            settings = await DashboardSettings.create({});
        }
        
        // Fetch all stats in parallel for better performance
        const [
            blogStats,
            projectStats,
            serviceCount,
            experienceCount,
            educationCount,
            contactCount
        ] = await Promise.all([
            // Blog stats with published/draft counts
            Promise.all([
                Blog.countDocuments(),
                Blog.countDocuments({ status: 'published' }),
                Blog.countDocuments({ status: 'draft' })
            ]),
            
            // Project stats with active/completed counts
            Promise.all([
                Project.countDocuments(),
                Project.countDocuments({ status: 'active' }),
                Project.countDocuments({ status: 'completed' })
            ]),
            
            // Simple counts for other collections
            Service.countDocuments(),
            Experience.countDocuments(),
            Education.countDocuments(),
            Contact.countDocuments()
        ]);

        const [blogTotal, blogPublished, blogDraft] = blogStats;
        const [projectTotal, projectActive, projectCompleted] = projectStats;

        return NextResponse.json({
            success: true,
            data: {
                blogs: {
                    total: blogTotal,
                    published: blogPublished,
                    draft: blogDraft,
                    visible: settings.widgets.blogs.visible,
                    order: settings.widgets.blogs.order
                },
                projects: {
                    total: projectTotal,
                    active: projectActive,
                    completed: projectCompleted,
                    visible: settings.widgets.projects.visible,
                    order: settings.widgets.projects.order
                },
                services: {
                    total: serviceCount,
                    visible: settings.widgets.services.visible,
                    order: settings.widgets.services.order
                },
                experience: {
                    total: experienceCount,
                    visible: settings.widgets.experience.visible,
                    order: settings.widgets.experience.order
                },
                education: {
                    total: educationCount,
                    visible: settings.widgets.education.visible,
                    order: settings.widgets.education.order
                },
                messages: {
                    total: contactCount,
                    unread: contactCount,
                    visible: settings.widgets.messages.visible,
                    order: settings.widgets.messages.order
                },
                quickActions: settings.quickActions
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch dashboard statistics'
            },
            { status: 500 }
        );
    }
} 