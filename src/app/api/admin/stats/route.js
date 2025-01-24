import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Contact from "@/models/Contact";
import DashboardSettings from "@/models/DashboardSettings";
import DashboardMetrics from "@/models/DashboardMetrics";
import DashboardActivity from "@/models/DashboardActivity";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDB();

        // Get counts and status from all collections
        const [
            blogs,
            projects,
            services,
            experiences,
            educations,
            messages,
            settingsData,
            recentActivity,
            metricsData
        ] = await Promise.all([
            Blog.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
                        draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } }
                    }
                }
            ]),
            Project.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
                    }
                }
            ]),
            Service.countDocuments(),
            Experience.countDocuments(),
            Education.countDocuments(),
            Contact.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        unread: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
                    }
                }
            ]),
            DashboardSettings.findOne(),
            DashboardActivity.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('type action title description status importance createdAt'),
            DashboardMetrics.findOne().sort({ timestamp: -1 })
        ]);

        // Get recent items with their status
        const [
            recentBlogs,
            recentProjects,
            recentMessages
        ] = await Promise.all([
            Blog.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title slug status createdAt'),
            Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name slug status createdAt'),
            Contact.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email message read createdAt')
        ]);

        // Extract counts from aggregation results
        const blogStats = blogs[0] || { total: 0, published: 0, draft: 0 };
        const projectStats = projects[0] || { total: 0, active: 0, completed: 0 };
        const messageStats = messages[0] || { total: 0, unread: 0 };

        // Initialize metrics if none exist
        let metrics = metricsData;
        if (!metrics) {
            metrics = await DashboardMetrics.create({
                timestamp: new Date(),
                interval: 'daily',
                metrics: {
                    visitors: { total: 0, unique: 0, returning: 0 },
                    pageViews: { total: 0, perVisitor: 0 },
                    engagement: { bounceRate: 0, avgSessionDuration: 0 },
                    content: {
                        blogs: blogStats,
                        projects: projectStats,
                        services: { total: services },
                        messages: messageStats
                    }
                }
            });
        }

        // Create default settings if none exist
        let settings = settingsData;
        if (!settings) {
            settings = await DashboardSettings.create({
                theme: {
                    mode: 'light',
                    primaryColor: 'green',
                    accentColor: 'blue'
                },
                layout: {
                    compactMode: false,
                    showGreeting: true,
                    cardSize: 'medium',
                    gridColumns: 3,
                    stickyHeader: true,
                    showSearch: true
                },
                widgets: {
                    blogs: {
                        visible: true,
                        order: 1,
                        showDrafts: true,
                        showPublished: true,
                        bgColor: 'blue',
                        refreshInterval: 0
                    },
                    projects: {
                        visible: true,
                        order: 2,
                        showActive: true,
                        showCompleted: true,
                        bgColor: 'green',
                        refreshInterval: 0
                    },
                    services: {
                        visible: true,
                        order: 3,
                        showCount: true,
                        bgColor: 'purple',
                        refreshInterval: 0
                    },
                    experience: {
                        visible: true,
                        order: 4,
                        showCount: true,
                        bgColor: 'orange',
                        refreshInterval: 0
                    },
                    education: {
                        visible: true,
                        order: 5,
                        showCount: true,
                        bgColor: 'pink',
                        refreshInterval: 0
                    },
                    messages: {
                        visible: true,
                        order: 6,
                        showUnread: true,
                        showTotal: true,
                        bgColor: 'yellow',
                        refreshInterval: 30
                    }
                },
                quickActions: {
                    newBlog: { visible: true, order: 1, showDescription: true },
                    newProject: { visible: true, order: 2, showDescription: true },
                    manageServices: { visible: true, order: 3, showDescription: true },
                    updateExperience: { visible: true, order: 4, showDescription: true },
                    viewMessages: { visible: true, order: 5, showDescription: true },
                    editProfile: { visible: true, order: 6, showDescription: true }
                },
                notifications: {
                    showInDashboard: true,
                    position: 'top-right',
                    autoHide: true,
                    duration: 5000
                }
            });
        }

        // Create initial activity if none exists
        if (!recentActivity || recentActivity.length === 0) {
            await DashboardActivity.create({
                type: 'system',
                action: 'settings',
                title: 'Dashboard Initialized',
                description: 'Dashboard settings and metrics have been initialized.',
                status: 'success',
                importance: 'low'
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                blogs: {
                    total: blogStats.total,
                    draft: blogStats.draft,
                    published: blogStats.published,
                    visible: true,
                    order: 1
                },
                projects: {
                    total: projectStats.total,
                    active: projectStats.active,
                    completed: projectStats.completed,
                    visible: true,
                    order: 2
                },
                services: {
                    total: services,
                    visible: true,
                    order: 3
                },
                experience: {
                    total: experiences,
                    visible: true,
                    order: 4
                },
                education: {
                    total: educations,
                    visible: true,
                    order: 5
                },
                messages: {
                    total: messageStats.total,
                    unread: messageStats.unread,
                    visible: true,
                    order: 6
                },
                recent: {
                    blogs: recentBlogs,
                    projects: recentProjects,
                    messages: recentMessages
                },
                activity: recentActivity || [],
                metrics: metrics?.metrics || {},
                settings: settings?.toObject() || {}
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