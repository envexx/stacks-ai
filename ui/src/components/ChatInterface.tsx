import { useState, useRef, useEffect } from 'react';
import { Send, Plus, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const ChatInterface = () => {
  const {
    user,
    setUser,
    currentSession,
    setCurrentSession,
    sessions,
    setSessions,
    messages,
    setMessages,
    setCurrentView,
    setIsConnected,
  } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setSessions(data);
      if (data.length > 0 && !currentSession) {
        setCurrentSession(data[0]);
      }
    }
  };

  const createNewSession = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: user.id,
          title: 'New Chat',
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setSessions([data, ...sessions]);
      setCurrentSession(data);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user || !currentSession || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const { data: userMsgData, error: userMsgError } = await supabase
      .from('messages')
      .insert([
        {
          session_id: currentSession.id,
          user_id: user.id,
          role: 'user',
          content: userMessage,
        },
      ])
      .select()
      .single();

    if (userMsgError) {
      setIsLoading(false);
      return;
    }

    setMessages([...messages, userMsgData]);

    setTimeout(async () => {
      const aiResponse = generateAIResponse(userMessage);

      const { data: aiMsgData, error: aiMsgError } = await supabase
        .from('messages')
        .insert([
          {
            session_id: currentSession.id,
            user_id: user.id,
            role: 'assistant',
            content: aiResponse,
          },
        ])
        .select()
        .single();

      if (!aiMsgError && aiMsgData) {
        setMessages((prev) => [...prev, aiMsgData]);
      }

      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);

      setIsLoading(false);
    }, 800);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `That's a great question about "${userMessage}". Let me think about this. This is a demo, but in production, this would connect to a real AI API.`,
      `Interesting point about "${userMessage}". I'd say that's a complex topic worth exploring further.`,
      `You're asking about "${userMessage}", which is definitely an important consideration.`,
      `That's something I can help with. Regarding "${userMessage}", there are several angles to look at.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleDisconnect = () => {
    setUser(null);
    setIsConnected(false);
    setCurrentSession(null);
    setSessions([]);
    setMessages([]);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <span className="text-lg font-semibold">Chats</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <button
              onClick={createNewSession}
              className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setCurrentSession(session);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentSession?.id === session.id
                    ? 'bg-slate-200 font-medium'
                    : 'hover:bg-slate-100'
                }`}
              >
                {session.title}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleDisconnect}
              className="w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold flex-1 text-center lg:text-left">
            {currentSession?.title || 'Select a chat'}
          </h2>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Start a conversation</h3>
                <p className="text-slate-600">Ask anything and get instant responses.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                disabled={isLoading || !currentSession}
                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || !currentSession}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
