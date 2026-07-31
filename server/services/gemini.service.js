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

export const VALID_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Other',
];

// Asks Gemini to categorize a transaction based on its title
export const categorizeTransaction = async (title) => {
  const prompt = `You are a strict classification function. Given a transaction title, respond with EXACTLY ONE category name from this list, and nothing else — no punctuation, no explanation:

${VALID_CATEGORIES.join(', ')}

Transaction title: "${title}"

Category:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });

    const rawReply = response.text.trim();

    // Case-insensitive match against our known list
    const matched = VALID_CATEGORIES.find(
      (cat) => cat.toLowerCase() === rawReply.toLowerCase()
    );

    return matched || 'Other';
  } catch (error) {
    console.error('Gemini categorization error:', error.message);
    return 'Other';
  }
};