import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Sends a prompt to Gemini and returns the plain text response
export const generateContent = async (prompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
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
      model: 'gemini-flash-lite-latest',
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

// Generates structured AI insights based on a user's monthly financial summary
export const getMonthlyInsights = async (summaryData) => {
  const { totalIncome, totalExpense, balance, categoryBreakdown } = summaryData;

  const prompt = `You are a financial insights assistant. Based on the data below, respond with ONLY valid JSON (no markdown, no code fences, no explanation) in exactly this shape:

{
  "summary": "a 1-2 sentence plain-language overview of this month's finances",
  "highestSpendingCategory": "the category name with the most spending, or null if no expenses",
  "savingTip": "one specific, actionable saving tip based on the spending pattern",
  "budgetRecommendation": "one sentence recommending a reasonable budget adjustment"
}

Data:
Total Income: ${totalIncome}
Total Expense: ${totalExpense}
Balance: ${balance}
Spending by category: ${JSON.stringify(categoryBreakdown)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });

    let rawText = response.text.trim();

    // Strip markdown code fences if Gemini added them despite instructions
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

    const parsed = JSON.parse(rawText);

    return {
      summary: parsed.summary || 'No summary available.',
      highestSpendingCategory: parsed.highestSpendingCategory || null,
      savingTip: parsed.savingTip || 'No specific tip available right now.',
      budgetRecommendation: parsed.budgetRecommendation || 'No recommendation available right now.',
    };
  } catch (error) {
    console.error('Gemini insights error:', error.message);
    return {
      summary: 'AI insights are temporarily unavailable (daily usage limit reached). Please check back tomorrow.',
      highestSpendingCategory: null,
      savingTip: 'AI insights are temporarily unavailable (daily usage limit reached).',
      budgetRecommendation: 'AI insights are temporarily unavailable (daily usage limit reached).',
    };
  }
};

// Answers a user's financial question using their transaction summary as context
export const askChatbot = async (question, contextData) => {
  const { totalIncome, totalExpense, balance, categoryBreakdown, recentTransactions } = contextData;

  const prompt = `You are a financial assistant chatbot for an expense tracker app. Answer the user's question using ONLY the data provided below. Be concise (2-3 sentences max). If the question can't be answered from this data, say so honestly rather than guessing. Do not give generic financial/investment advice unrelated to this data.

Financial Summary:
Total Income: ${totalIncome}
Total Expense: ${totalExpense}
Balance: ${balance}
Spending by category: ${JSON.stringify(categoryBreakdown)}
Recent transactions: ${JSON.stringify(recentTransactions)}

User's question: "${question}"

Answer:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('Gemini chatbot error:', error.message);
    return "The AI chatbot has reached its daily usage limit on the free tier. Please check back tomorrow.";
  }
};