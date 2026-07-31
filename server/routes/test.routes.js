import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      success: true,
      message: 'Database connected successfully',
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

export default router;