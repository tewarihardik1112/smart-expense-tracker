import pool from '../db/pool.js';

// Create a new expense/income transaction for a specific user
export const createTransaction = async (userId, title, amount, type, category, date, notes) => {
  const result = await pool.query(
    `INSERT INTO transactions (user_id, title, amount, type, category, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, title, amount, type, category, date, notes]
  );
  return result.rows[0];
};

// Get all transactions belonging to a specific user, most recent first
export const getTransactionsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Get a single transaction — scoped to the owning user, so no one else can fetch it by guessing an ID
export const getTransactionById = async (id, userId) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0];
};

// Update a transaction — only if it belongs to the requesting user
export const updateTransaction = async (id, userId, title, amount, type, category, date, notes) => {
  const result = await pool.query(
    `UPDATE transactions
     SET title = $1, amount = $2, type = $3, category = $4, date = $5, notes = $6
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [title, amount, type, category, date, notes, id, userId]
  );
  return result.rows[0];
};

// Delete a transaction — only if it belongs to the requesting user
export const deleteTransaction = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
};