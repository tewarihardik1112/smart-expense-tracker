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
// Get transactions for a user, with optional filters, search, and pagination
export const getTransactionsByUser = async (userId, filters) => {
  const { type, category, startDate, endDate, search, page, limit } = filters;

  const conditions = ['user_id = $1'];
  const values = [userId];
  let paramIndex = 2;

  if (type) {
    conditions.push(`type = $${paramIndex}`);
    values.push(type);
    paramIndex++;
  }

  if (category) {
    conditions.push(`category = $${paramIndex}`);
    values.push(category);
    paramIndex++;
  }

  if (startDate) {
    conditions.push(`date >= $${paramIndex}`);
    values.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`date <= $${paramIndex}`);
    values.push(endDate);
    paramIndex++;
  }

  if (search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  // Get total count matching filters (for pagination metadata) — before applying LIMIT/OFFSET
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM transactions WHERE ${whereClause}`,
    values
  );
  const totalCount = parseInt(countResult.rows[0].count, 10);

  // Apply pagination
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const offset = (pageNumber - 1) * pageSize;

  values.push(pageSize, offset);

  const dataResult = await pool.query(
    `SELECT * FROM transactions
     WHERE ${whereClause}
     ORDER BY date DESC, created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );

  return {
    transactions: dataResult.rows,
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / pageSize),
  };
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