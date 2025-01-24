import { NextResponse } from "next/server";
import connectToDB from "@/database";
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
        await connectToDB();

        // Get counts from all collections
        const [
            blogCount,
            projectCount,
            serviceCount,
            experienceCount,
            educationCount,
            contactCount,
            settings
        ] = await Promise.all([
            Blog.countDocuments(),
            Project.countDocuments(),
            Service.countDocuments(),
            Experience.countDocuments(),
            Education.countDocuments(),
            Contact.countDocuments(),
            DashboardSettings.findOne()
        ]);

        // Get recent items
        const [
            recentBlogs,
            recentProjects,
            recentMessages
        ] = await Promise.all([
            Blog.find().sort({ createdAt: -1 }).limit(5),
            Project.find().sort({ createdAt: -1 }).limit(5),
            Contact.find().sort({ createdAt: -1 }).limit(5)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                counts: {
                    blogs: blogCount,
                    projects: projectCount,
                    services: serviceCount,
                    experience: experienceCount,
                    education: educationCount,
                    messages: contactCount
                },
                recent: {
                    blogs: recentBlogs,
                    projects: recentProjects,
                    messages: recentMessages
                },
                settings: settings || {}
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching admin stats"
        }, { status: 500 });
    }
} 