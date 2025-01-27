import { NextResponse } from 'next/server';
import { getCombinedAIResponse } from '@/utils/ai';
import Chat from '@/models/Chat';
import ChatMessage from '@/models/ChatMessage';
import { connectDB } from '@/lib/db';

// GET /api/chat - Get chat history with pagination
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Validate chatId
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    // Get chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await ChatMessage.countDocuments({ chatId });

    // Get messages with pagination and sorting
    const messages = await ChatMessage.find({ chatId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      chat,
      messages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + messages.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Send a message
export async function POST(req) {
  try {
    await connectDB();
    const { message, chatId, userId } = await req.json();

    // Validate input message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Create or get existing chat
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
    } else {
      chat = await Chat.create({
        userId,
        status: 'active',
        subject: message.substring(0, 50) + '...',
      });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      content: message.trim(),
      sender: 'user',
      chatId: chat._id,
    });

    // Get chat history
    const chatHistory = await ChatMessage.find({ chatId: chat._id })
      .sort({ timestamp: 1 })
      .limit(10);

    try {
      // Get AI response with timeout
      const aiResponse = await Promise.race([
        getCombinedAIResponse(
          message,
          chatHistory.map(msg => ({
            content: msg.content,
            sender: msg.sender,
          }))
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI response timeout')), 30000)
        )
      ]);

      // Validate AI response
      if (!aiResponse || typeof aiResponse !== 'string' || !aiResponse.trim()) {
        throw new Error('Empty or invalid AI response received');
      }

      // Save AI response
      const aiMessage = await ChatMessage.create({
        content: aiResponse.trim(),
        sender: 'ai',
        chatId: chat._id,
      });

      return NextResponse.json({
        success: true,
        chat,
        messages: [userMessage, aiMessage],
      });
    } catch (aiError) {
      console.error('AI Response Error:', aiError);
      
      // Save error message as AI response
      const errorMessage = await ChatMessage.create({
        content: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        sender: 'ai',
        chatId: chat._id,
      });

      return NextResponse.json({
        success: false,
        chat,
        messages: [userMessage, errorMessage],
        error: 'Failed to get AI response'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 