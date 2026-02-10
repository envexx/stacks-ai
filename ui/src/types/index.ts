export interface User {
  id: string;
  wallet_address: string;
  credits: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  cost: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  tx_hash: string;
  amount: number;
  credits_purchased: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}
