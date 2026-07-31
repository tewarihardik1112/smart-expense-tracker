import {
  getSummaryTotals,
  getRecentTransactions,
  getHighestSpendingCategory,
  getMonthlyBreakdown,
  getCategoryBreakdown,
} from '../models/dashboard.model.js';

// GET /api/dashboard/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Run all four queries concurrently instead of one-by-one — they're independent
const [totals, recentTransactions, highestCategory, monthlyBreakdown, categoryBreakdown] = await Promise.all([
  getSummaryTotals(userId),
  getRecentTransactions(userId),
  getHighestSpendingCategory(userId),
  getMonthlyBreakdown(userId),
  getCategoryBreakdown(userId),
]);

    const totalIncome = Number(totals.total_income);
    const totalExpense = Number(totals.total_expense);

    res.status(200).json({
      success: true,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      recentTransactions,
      highestSpendingCategory: highestCategory
        ? { category: highestCategory.category, total: Number(highestCategory.total) }
        : null,
      monthlyBreakdown: monthlyBreakdown.map((row) => ({
        month: Number(row.month),
        income: Number(row.income),
        expense: Number(row.expense),
      })),
      categoryBreakdown: categoryBreakdown.map((row) => ({
  category: row.category,
  total: Number(row.total),
})),
    });
  } catch (error) {
    console.error('Dashboard summary error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching dashboard data',
    });
  }
};