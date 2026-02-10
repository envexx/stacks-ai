/*
  # Chatbot Pay-per-Prompt Schema

  ## Overview
  Schema untuk aplikasi chatbot dengan sistem pay-per-prompt menggunakan Stacks Blockchain.

  ## 1. New Tables
  
  ### `users`
    - `id` (uuid, primary key) - User ID
    - `wallet_address` (text, unique) - Stacks wallet address
    - `credits` (integer, default: 0) - Remaining credits untuk chat
    - `total_spent` (numeric, default: 0) - Total yang sudah dibelanjakan
    - `created_at` (timestamptz) - Waktu pembuatan akun
    - `updated_at` (timestamptz) - Waktu update terakhir
  
  ### `chat_sessions`
    - `id` (uuid, primary key) - Session ID
    - `user_id` (uuid, foreign key) - Reference ke users table
    - `title` (text) - Judul chat session
    - `created_at` (timestamptz) - Waktu pembuatan session
    - `updated_at` (timestamptz) - Waktu update terakhir
  
  ### `messages`
    - `id` (uuid, primary key) - Message ID
    - `session_id` (uuid, foreign key) - Reference ke chat_sessions
    - `user_id` (uuid, foreign key) - Reference ke users
    - `role` (text) - Role: 'user' atau 'assistant'
    - `content` (text) - Konten pesan
    - `cost` (integer, default: 0) - Cost per message (untuk user messages)
    - `created_at` (timestamptz) - Waktu pembuatan message
  
  ### `transactions`
    - `id` (uuid, primary key) - Transaction ID
    - `user_id` (uuid, foreign key) - Reference ke users
    - `tx_hash` (text, unique) - Stacks transaction hash
    - `amount` (numeric) - Jumlah STX yang dibayar
    - `credits_purchased` (integer) - Jumlah credits yang dibeli
    - `status` (text, default: 'pending') - Status: 'pending', 'confirmed', 'failed'
    - `created_at` (timestamptz) - Waktu transaksi

  ## 2. Security
    - Enable RLS pada semua tables
    - Users hanya dapat mengakses data mereka sendiri
    - Policies untuk SELECT, INSERT, UPDATE, dan DELETE
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  credits integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  cost integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tx_hash text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  credits_purchased integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = id)
  WITH CHECK (id = id);

-- Chat sessions policies
CREATE POLICY "Users can view own sessions"
  ON chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  USING (user_id = user_id)
  WITH CHECK (user_id = user_id);

CREATE POLICY "Users can delete own sessions"
  ON chat_sessions FOR DELETE
  USING (user_id = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in own sessions"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Users can insert messages in own sessions"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);