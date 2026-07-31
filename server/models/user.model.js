import pool from '../db/pool.js';

// Find a user by email — used during login and registration (to check duplicates)
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// Find a user by their database ID — used when decoding JWT to fetch fresh user data
export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, full_name, email, auth_provider, profile_picture, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Create a new user for local (email/password) signup
export const createLocalUser = async (fullName, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password, auth_provider)
     VALUES ($1, $2, $3, 'local')
     RETURNING id, full_name, email, auth_provider, created_at`,
    [fullName, email, hashedPassword]
  );
  return result.rows[0];
};

// Find a user by their Google ID — used to check if they've signed in with Google before
export const findUserByGoogleId = async (googleId) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE google_id = $1',
    [googleId]
  );
  return result.rows[0];
};

// Link a Google account to an existing local account (same email)
export const linkGoogleAccount = async (email, googleId, profilePicture) => {
  const result = await pool.query(
    `UPDATE users
     SET google_id = $1, profile_picture = COALESCE(profile_picture, $2)
     WHERE email = $3
     RETURNING *`,
    [googleId, profilePicture, email]
  );
  return result.rows[0];
};

// Create a brand new user who signed up via Google (no password)
export const createGoogleUser = async (fullName, email, googleId, profilePicture) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, google_id, auth_provider, profile_picture)
     VALUES ($1, $2, $3, 'google', $4)
     RETURNING *`,
    [fullName, email, googleId, profilePicture]
  );
  return result.rows[0];
};