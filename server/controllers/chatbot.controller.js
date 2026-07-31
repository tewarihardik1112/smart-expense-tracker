import { getSummaryTotals, getCategoryBreakdown, getRecentTransactions } from '../models/dashboard.model.js';
import { askChatbot } from '../services/gemini.service.js';

// POST /api/chatbot/ask
export const askQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A question is required',
      });
    }

    const [totals, categoryBreakdown, recentTransactions] = await Promise.all([
      getSummaryTotals(userId),
      getCategoryBreakdown(userId),
      getRecentTransactions(userId),
    ]);

    const totalIncome = Number(totals.total_income);
    const totalExpense = Number(totals.total_expense);

    const answer = await askChatbot(question, {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown: categoryBreakdown.map((row) => ({
        category: row.category,
        total: Number(row.total),
      })),
      recentTransactions,
    });

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while processing your question',
    });
  }
};