import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getInsights } from '../controllers/insights.controller.js';

const router = express.Router();

router.use(protect);

router.get('/monthly', getInsights);

export default router;