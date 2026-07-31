import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import {
  findUserByGoogleId,
  findUserByEmail,
  linkGoogleAccount,
  createGoogleUser,
} from '../models/user.model.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const profilePicture = profile.photos?.[0]?.value || null;

        // Case 1: already signed in with Google before
        const existingGoogleUser = await findUserByGoogleId(googleId);
        if (existingGoogleUser) {
          return done(null, existingGoogleUser);
        }

        // Case 2: local account exists with this email — link accounts
        const existingLocalUser = await findUserByEmail(email);
        if (existingLocalUser) {
          const linkedUser = await linkGoogleAccount(email, googleId, profilePicture);
          return done(null, linkedUser);
        }

        // Case 3: brand new user
        const newUser = await createGoogleUser(fullName, email, googleId, profilePicture);
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;