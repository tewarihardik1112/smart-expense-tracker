import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Sends a prompt to Gemini and returns the plain text response
export const generateContent = async (prompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  return response.text;
};