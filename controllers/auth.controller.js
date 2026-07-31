import bcrypt from 'bcrypt';
import { findUserByEmail, createLocalUser } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.utils.js';

const SALT_ROUNDS = 10;

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Basic validation — never trust client input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are all required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check for existing account with this email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Hash the password before ever storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createLocalUser(fullName, email, hashedPassword);

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during registration',
    });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await findUserByEmail(email);

    // Same error message for "no user" and "wrong password" — don't reveal which one failed
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        authProvider: user.auth_provider,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during login',
    });
  }
};