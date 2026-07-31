import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from './routes/test.routes.js';
import authRoutes from './routes/auth.routes.js';
import passport from './config/passport.js';
import expenseRoutes from './routes/expense.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use(passport.initialize());
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Expense Tracker Backend is Running");
});
// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});