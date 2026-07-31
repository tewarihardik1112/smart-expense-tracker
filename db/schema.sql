-- Users table (supports local + Google auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255),                    -- nullable: Google users won't have one
    google_id VARCHAR(255) UNIQUE,            -- Google's stable user ID (sub claim)
    auth_provider VARCHAR(20) NOT NULL DEFAULT 'local'
        CHECK (auth_provider IN ('local', 'google')),
    profile_picture VARCHAR(500),             -- optional: Google avatar URL
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (covers both income and expense)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100),
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Speeds up "get all transactions for a user" — our most common query
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);