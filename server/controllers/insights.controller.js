import { getSummaryTotals, getCategoryBreakdown } from '../models/dashboard.model.js';
import { getMonthlyInsights } from '../services/gemini.service.js';

// GET /api/insights/monthly
export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totals, categoryBreakdown] = await Promise.all([
      getSummaryTotals(userId),
      getCategoryBreakdown(userId),
    ]);

    const totalIncome = Number(totals.total_income);
    const totalExpense = Number(totals.total_expense);

    const insights = await getMonthlyInsights({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown: categoryBreakdown.map((row) => ({
        category: row.category,
        total: Number(row.total),
      })),
    });

    res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('Get insights error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while generating insights',
    });
  }
};