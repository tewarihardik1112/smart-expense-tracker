import {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../models/expense.model.js';

const VALID_TYPES = ['income', 'expense'];

// POST /api/expenses
export const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !type || !date) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, type, and date are required',
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'income' or 'expense'",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const transaction = await createTransaction(
      userId,
      title,
      amount,
      type,
      category || null,
      date,
      notes || null
    );

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      transaction,
    });
  } catch (error) {
    console.error('Add transaction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while adding the transaction',
    });
  }
};

// GET /api/expenses
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await getTransactionsByUser(userId);

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching transactions',
    });
  }
};

// GET /api/expenses/:id
export const getSingleTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await getTransactionById(id, userId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Get single transaction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching the transaction',
    });
  }
};

// PUT /api/expenses/:id
export const editTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !date) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, type, and date are required',
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'income' or 'expense'",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const updated = await updateTransaction(
      id,
      userId,
      title,
      amount,
      type,
      category || null,
      date,
      notes || null
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      transaction: updated,
    });
  } catch (error) {
    console.error('Edit transaction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating the transaction',
    });
  }
};

// DELETE /api/expenses/:id
export const removeTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await deleteTransaction(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      transaction: deleted,
    });
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the transaction',
    });
  }
};