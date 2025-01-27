import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import Search from "@/models/Search";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Contact from "@/models/Contact";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Map collection types to model names
const TYPE_TO_MODEL = {
    blog: 'Blog',
    project: 'Project',
    service: 'Service',
    message: 'Contact'
};

async function getEmbedding(text) {
    if (!GEMINI_API_KEY) return null;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(text);
        const response = await result.response;
        const responseText = response.text();

        // Create a simple numeric representation of the text
        const textEncoder = new TextEncoder();
        const encoded = textEncoder.encode(responseText);
        const embedding = Array.from(encoded).map(x => x / 255); // Normalize to 0-1

        return embedding;
    } catch (error) {
        console.error('Error getting Gemini embedding:', error);
        return null;
    }
}

async function searchCollection(collection, searchRegex, embedding, type) {
    try {
        const items = await collection.find({
            $or: [
                { title: searchRegex },
                { name: searchRegex },
                { content: searchRegex },
                { description: searchRegex },
                { tags: searchRegex },
                { category: searchRegex }
            ]
        }).sort({ createdAt: -1 }).limit(5);

        if (!embedding) {
            return items.map(item => ({
                ...item.toObject(),
                type,
                modelType: TYPE_TO_MODEL[type],
                score: 1
            }));
        }

        // Calculate similarity scores if embedding is available
        return items.map(item => ({
            ...item.toObject(),
            type,
            modelType: TYPE_TO_MODEL[type],
            score: calculateSimilarity(embedding, item.embedding || embedding)
        })).sort((a, b) => b.score - a.score);
    } catch (error) {
        console.error('Error searching collection:', error);
        return [];
    }
}

function calculateSimilarity(embedding1, embedding2) {
    try {
        if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
            return 0;
        }

        const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
        const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

        if (magnitude1 === 0 || magnitude2 === 0) return 0;

        return dotProduct / (magnitude1 * magnitude2);
    } catch (error) {
        console.error('Error calculating similarity:', error);
        return 0;
    }
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

        // Get embedding for the search query if possible
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
                results = await searchCollection(collection, searchRegex, queryEmbedding, type);
            }
        } else {
            // Search all collections
            const [blogs, projects, services, messages] = await Promise.all([
                searchCollection(Blog, searchRegex, queryEmbedding, 'blog'),
                searchCollection(Project, searchRegex, queryEmbedding, 'project'),
                searchCollection(Service, searchRegex, queryEmbedding, 'service'),
                searchCollection(Contact, searchRegex, queryEmbedding, 'message')
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

        // Save search to history without embedding if not available
        const searchRecord = new Search({
            query,
            type: type || 'all',
            results: results.items?.map(item => ({
                itemId: item._id,
                resultType: item.modelType || TYPE_TO_MODEL[item.type], // Use the correct model name
                score: item.score
            })) || []
        });

        // Only add embedding if available
        if (queryEmbedding) {
            searchRecord.embedding = queryEmbedding;
        }

        await searchRecord.save();

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({
            success: false,
            message: "Error performing search",
            error: error.message
        }, { status: 500 });
    }
}

// Get recent searches
export async function POST(request) {
    try {
        await connectDB();
        const { userId } = await request.json();

        const recentSearches = await Search.find(userId ? { userId } : {})
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