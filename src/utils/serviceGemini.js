import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeServiceType(serviceType) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze and provide detailed information about the following service type: "${serviceType}".
    Please provide the response in the following JSON format:
    {
      "title": "Service title",
      "description": "Detailed service description (2-3 sentences)",
      "icon": "Suggested React Icon name from react-icons/fa",
      "technologies": "Comma-separated list of relevant technologies, tools, and frameworks",
      "status": "Active"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    console.error('Error in analyzeServiceType:', error);
    throw new Error(error.message || 'Error analyzing service type');
  }
}

export async function enhanceServiceDescription(description) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Enhance and improve the following service description while maintaining its core meaning. 
    Make it more professional, engaging, and comprehensive (2-3 sentences):
    "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error in enhanceServiceDescription:', error);
    throw new Error(error.message || 'Error enhancing description');
  }
}

export async function suggestServiceTechnologies(serviceType, currentTech = '') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Suggest a comprehensive list of current and relevant technologies for the following service type: "${serviceType}"
    ${currentTech ? `Current technologies: ${currentTech}` : ''}
    
    Please provide only a comma-separated list of technologies, focusing on:
    - Most popular and widely used tools
    - Current industry standards
    - Essential frameworks and platforms
    - Complementary technologies to existing ones (if any provided)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error in suggestServiceTechnologies:', error);
    throw new Error(error.message || 'Error suggesting technologies');
  }
} 