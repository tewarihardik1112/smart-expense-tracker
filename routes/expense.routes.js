import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  addTransaction,
  getAllTransactions,
  getSingleTransaction,
  editTransaction,
  removeTransaction,
} from '../controllers/expense.controller.js';

const router = express.Router();

// Every route below requires a valid JWT
router.use(protect);

router.post('/', addTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getSingleTransaction);
router.put('/:id', editTransaction);
router.delete('/:id', removeTransaction);

export default router;