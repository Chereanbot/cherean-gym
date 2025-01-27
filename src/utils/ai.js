import { GoogleGenerativeAI } from '@google/generative-ai';
import { defaultPromptManager } from './prompts';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Initialize Deepseek configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function getGeminiResponse(message, chatHistory = [], context = {}) {
  try {
    // Generate appropriate prompt based on message and context
    const prompt = await defaultPromptManager.getContextualPrompt(message, context);

    // Format chat history for Gemini
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add system prompt as first message
    formattedHistory.unshift({
      role: 'model',
      parts: [{ text: prompt }],
    });

    // Add current message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Get response from Gemini
    const result = await geminiModel.generateContent({
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response.text();
    return defaultPromptManager.formatResponse(response);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function getDeepseekResponse(message, chatHistory = [], context = {}) {
  try {
    // Generate appropriate prompt based on message and context
    const prompt = await defaultPromptManager.getContextualPrompt(message, context);

    // Format chat history for Deepseek
    const messages = [
      { role: 'system', content: prompt },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Get response from Deepseek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const data = await response.json();
    return defaultPromptManager.formatResponse(data.choices[0].message.content);
  } catch (error) {
    console.error('Deepseek API Error:', error);
    throw error;
  }
}

// Function to get response from both models and combine them
export async function getCombinedAIResponse(message, chatHistory = [], context = {}) {
  try {
    // Try Deepseek first
    try {
      return await getDeepseekResponse(message, chatHistory, context);
    } catch (deepseekError) {
      console.warn('Deepseek failed, falling back to Gemini:', deepseekError);
      // Fall back to Gemini
      return await getGeminiResponse(message, chatHistory, context);
    }
  } catch (error) {
    console.error('Combined AI Error:', error);
    throw error;
  }
} 