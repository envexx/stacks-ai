import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ChatSession, Message } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  sessions: ChatSession[];
  setSessions: (sessions: ChatSession[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  currentView: 'landing' | 'chat';
  setCurrentView: (view: 'landing' | 'chat') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentSession,
        setCurrentSession,
        sessions,
        setSessions,
        messages,
        setMessages,
        isConnected,
        setIsConnected,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
