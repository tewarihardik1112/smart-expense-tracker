import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from './routes/test.routes.js';
import authRoutes from './routes/auth.routes.js';
import passport from './config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use(passport.initialize());

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Expense Tracker Backend is Running");
});
// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});