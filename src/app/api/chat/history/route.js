import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Chat from '@/models/Chat';
import ChatMessage from '@/models/ChatMessage';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const messages = await ChatMessage.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('chatId');

    const totalMessages = await ChatMessage.countDocuments({ chatId });
    const totalPages = Math.ceil(totalMessages / limit);

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
} 