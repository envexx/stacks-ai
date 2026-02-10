import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const LandingPage = () => {
  const { setCurrentView, setIsConnected, setUser } = useApp();

  const handleConnect = async () => {
    const mockWalletAddress = 'SP' + Math.random().toString(36).substring(2, 15).toUpperCase();

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', mockWalletAddress)
      .maybeSingle();

    let userData = existingUser;

    if (!userData) {
      const { data: newUser } = await supabase
        .from('users')
        .insert([
          {
            wallet_address: mockWalletAddress,
          },
        ])
        .select()
        .single();

      userData = newUser;
    }

    if (userData) {
      setUser(userData);
      setIsConnected(true);
      setCurrentView('chat');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-semibold">QuantumChat</span>
          </div>
          <button
            onClick={handleConnect}
            className="px-6 py-2 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        </nav>

        <main className="container mx-auto px-6 py-32 max-w-2xl">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Chat with AI, powered by <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">Stacks</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Simple, minimal, and powered by blockchain. Connect your wallet and start conversations instantly. No credit cards. No limits.
            </p>
            <button
              onClick={handleConnect}
              className="group px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              Start Chatting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20 pt-20 border-t border-slate-200">
            <div>
              <div className="text-2xl font-bold mb-2">Instant</div>
              <p className="text-sm text-slate-600">No signup. Connect and chat immediately.</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">Transparent</div>
              <p className="text-sm text-slate-600">Blockchain-secured transactions on every message.</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">Private</div>
              <p className="text-sm text-slate-600">Your conversations stay yours, always.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
