import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Contact from "@/models/Contact";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const type = searchParams.get('type');

        if (!query) {
            return NextResponse.json({
                success: false,
                message: "Search query is required"
            });
        }

        await connectToDB();

        let results = [];
        const searchRegex = new RegExp(query, 'i');

        switch (type) {
            case 'blog':
                results = await Blog.find({
                    $or: [
                        { title: searchRegex },
                        { content: searchRegex },
                        { tags: searchRegex }
                    ]
                }).limit(10);
                break;
            case 'project':
                results = await Project.find({
                    $or: [
                        { name: searchRegex },
                        { description: searchRegex },
                        { technologies: searchRegex }
                    ]
                }).limit(10);
                break;
            case 'service':
                results = await Service.find({
                    $or: [
                        { name: searchRegex },
                        { description: searchRegex }
                    ]
                }).limit(10);
                break;
            case 'contact':
                results = await Contact.find({
                    $or: [
                        { name: searchRegex },
                        { email: searchRegex },
                        { message: searchRegex }
                    ]
                }).limit(10);
                break;
            default:
                // Search across all collections
                const [blogs, projects, services, contacts] = await Promise.all([
                    Blog.find({
                        $or: [
                            { title: searchRegex },
                            { content: searchRegex }
                        ]
                    }).limit(5),
                    Project.find({
                        $or: [
                            { name: searchRegex },
                            { description: searchRegex }
                        ]
                    }).limit(5),
                    Service.find({
                        $or: [
                            { name: searchRegex },
                            { description: searchRegex }
                        ]
                    }).limit(5),
                    Contact.find({
                        $or: [
                            { name: searchRegex },
                            { email: searchRegex }
                        ]
                    }).limit(5)
                ]);

                results = {
                    blogs,
                    projects,
                    services,
                    contacts
                };
        }

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({
            success: false,
            message: "Error performing search"
        }, { status: 500 });
    }
}

// Save recent search
export async function POST(request) {
    try {
        await connectToDB();
        const { query, type } = await request.json();

        // Here you could implement saving recent searches to user preferences
        // or a dedicated searches collection if needed

        return NextResponse.json({
            success: true,
            message: 'Search saved successfully'
        });
    } catch (error) {
        console.error('Error saving search:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save search' },
            { status: 500 }
        );
    }
} 