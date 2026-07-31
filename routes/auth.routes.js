import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { generateToken } from '../utils/jwt.utils.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Step 1: redirect user to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Step 2: Google redirects back here after user approves
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    // At this point, req.user is the authenticated user (set by our Passport strategy)
    const token = generateToken(req.user.id);

    // Redirect back to frontend with token as a query param
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

export default router;