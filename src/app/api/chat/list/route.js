import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Chat from '@/models/Chat';
import ChatMessage from '@/models/ChatMessage';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get the latest message for each chat
    const chatsWithLatestMessage = await Promise.all(
      chats.map(async (chat) => {
        const latestMessage = await ChatMessage.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .select('content createdAt');
        return {
          ...chat.toObject(),
          latestMessage
        };
      })
    );

    const totalChats = await Chat.countDocuments({ userId });
    const totalPages = Math.ceil(totalChats / limit);

    return NextResponse.json({
      success: true,
      chats: chatsWithLatestMessage,
      pagination: {
        currentPage: page,
        totalPages,
        totalChats,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
} 