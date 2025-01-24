import { NextResponse } from "next/server";
import connectDB from "@/database";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Contact from "@/models/Contact";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const query = searchParams.get('q') || '';
        const types = searchParams.get('types')?.split(',') || ['blogs', 'projects', 'services', 'messages'];
        const limit = parseInt(searchParams.get('limit')) || 5;

        const results = { total: 0, items: [] };
        const searchRegex = new RegExp(query, 'i');

        // Parallel search across all enabled content types
        const searchPromises = [];

        if (types.includes('blogs')) {
            searchPromises.push(
                Blog.find({
                    $or: [
                        { title: searchRegex },
                        { content: searchRegex },
                        { tags: searchRegex }
                    ]
                })
                .select('title status createdAt slug')
                .limit(limit)
                .then(items => items.map(item => ({
                    ...item.toObject(),
                    type: 'blog'
                })))
            );
        }

        if (types.includes('projects')) {
            searchPromises.push(
                Project.find({
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex },
                        { technologies: searchRegex }
                    ]
                })
                .select('title status createdAt slug')
                .limit(limit)
                .then(items => items.map(item => ({
                    ...item.toObject(),
                    type: 'project'
                })))
            );
        }

        if (types.includes('services')) {
            searchPromises.push(
                Service.find({
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex }
                    ]
                })
                .select('title createdAt slug')
                .limit(limit)
                .then(items => items.map(item => ({
                    ...item.toObject(),
                    type: 'service'
                })))
            );
        }

        if (types.includes('messages')) {
            searchPromises.push(
                Contact.find({
                    $or: [
                        { name: searchRegex },
                        { email: searchRegex },
                        { message: searchRegex }
                    ]
                })
                .select('name email message createdAt')
                .limit(limit)
                .then(items => items.map(item => ({
                    ...item.toObject(),
                    type: 'message',
                    title: `Message from ${item.name}`
                })))
            );
        }

        // Wait for all searches to complete
        const searchResults = await Promise.all(searchPromises);

        // Combine and sort results
        results.items = searchResults
            .flat()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        results.total = results.items.length;

        // Group results by type
        const groupedResults = results.items.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                query,
                total: results.total,
                grouped: groupedResults,
                items: results.items
            }
        });
    } catch (error) {
        console.error('Error performing search:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to perform search' },
            { status: 500 }
        );
    }
}

// Save recent search
export async function POST(request) {
    try {
        await connectDB();
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