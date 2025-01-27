import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Search from "@/models/Search";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Contact from "@/models/Contact";

export const dynamic = 'force-dynamic';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/embeddings";

async function getEmbedding(text) {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-ai/deepseek-coder-1.3b-instruct",
                input: text
            })
        });

        const data = await response.json();
        return data.data[0].embedding;
    } catch (error) {
        console.error('Error getting embedding:', error);
        return null;
    }
}

async function searchCollection(collection, searchRegex, embedding) {
    const items = await collection.find({
        $or: [
            { title: searchRegex },
            { name: searchRegex },
            { content: searchRegex },
            { description: searchRegex }
        ]
    }).limit(10);

    // Calculate similarity scores
    return items.map(item => ({
        ...item.toObject(),
        score: calculateSimilarity(embedding, item.embedding || [])
    })).sort((a, b) => b.score - a.score);
}

function calculateSimilarity(embedding1, embedding2) {
    if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
        return 0;
    }

    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
}

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

        await connectDB();

        // Get embedding for the search query
        const queryEmbedding = await getEmbedding(query);
        const searchRegex = new RegExp(query, 'i');

        let results = {};

        if (type && type !== 'all') {
            // Search specific collection
            const collection = {
                blog: Blog,
                project: Project,
                service: Service,
                message: Contact
            }[type];

            if (collection) {
                results = await searchCollection(collection, searchRegex, queryEmbedding);
            }
        } else {
            // Search all collections
            const [blogs, projects, services, messages] = await Promise.all([
                searchCollection(Blog, searchRegex, queryEmbedding),
                searchCollection(Project, searchRegex, queryEmbedding),
                searchCollection(Service, searchRegex, queryEmbedding),
                searchCollection(Contact, searchRegex, queryEmbedding)
            ]);

            results = {
                grouped: {
                    blog: blogs,
                    project: projects,
                    service: services,
                    message: messages
                },
                items: [...blogs, ...projects, ...services, ...messages]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
            };
        }

        // Save search to history
        const searchRecord = new Search({
            query,
            embedding: queryEmbedding,
            type: type || 'all',
            results: results.items?.map(item => ({
                itemId: item._id,
                resultType: item.constructor.modelName,
                score: item.score
            })) || []
        });
        await searchRecord.save();

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

// Get recent searches
export async function POST(request) {
    try {
        await connectDB();
        const { userId } = await request.json();

        const recentSearches = await Search.find({ userId })
            .sort({ timestamp: -1 })
            .limit(5)
            .populate('results.itemId');

        return NextResponse.json({
            success: true,
            data: recentSearches
        });
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get recent searches' },
            { status: 500 }
        );
    }
} 