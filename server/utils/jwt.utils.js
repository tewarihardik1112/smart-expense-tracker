import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Creates a signed JWT containing the user's id — used right after successful login/register
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verifies a token and returns its decoded payload — used later in auth middleware
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};