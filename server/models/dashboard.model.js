import pool from '../db/pool.js';

// Total income, total expense, and balance for a user
export const getSummaryTotals = async (userId) => {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS total_income,
       COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense
     FROM transactions
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

// Most recent 5 transactions (any type)
export const getRecentTransactions = async (userId, limit = 5) => {
  const result = await pool.query(
    `SELECT * FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC, created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};
// The single category with the highest total spend (expenses only)
export const getHighestSpendingCategory = async (userId) => {
  const result = await pool.query(
    `SELECT category, SUM(amount) AS total
     FROM transactions
     WHERE user_id = $1 AND type = 'expense' AND category IS NOT NULL
     GROUP BY category
     ORDER BY total DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

// Monthly income vs expense totals for the current year
export const getMonthlyBreakdown = async (userId) => {
  const result = await pool.query(
    `SELECT
       EXTRACT(MONTH FROM date) AS month,
       COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS income,
       COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
     FROM transactions
     WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
     GROUP BY EXTRACT(MONTH FROM date)
     ORDER BY month ASC`,
    [userId]
  );
  return result.rows;
};

// Total spending grouped by category (expenses only) — for the Pie Chart
export const getCategoryBreakdown = async (userId) => {
  const result = await pool.query(
    `SELECT category, SUM(amount) AS total
     FROM transactions
     WHERE user_id = $1 AND type = 'expense' AND category IS NOT NULL
     GROUP BY category
     ORDER BY total DESC`,
    [userId]
  );
  return result.rows;
};