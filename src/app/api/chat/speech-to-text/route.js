import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert audio to text using Gemini's speech-to-text
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Convert audio file to base64
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Audio = buffer.toString('base64');

    // Send to Gemini for transcription
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: 'Please transcribe this audio to text',
          audio: { data: base64Audio }
        }]
      }]
    });

    const transcription = await result.response.text();

    return NextResponse.json({
      success: true,
      text: transcription,
    });
  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    return NextResponse.json(
      { error: 'Failed to convert speech to text' },
      { status: 500 }
    );
  }
} 