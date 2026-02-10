'use client';

import { motion } from 'framer-motion';
import { Zap, Book, Code, Wallet, CheckCircle2, ArrowRight, Copy, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Orange Glow Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6D29] via-[#FF8C4A] to-[#FF6D29] rounded-full blur-[200px] opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 container mx-auto px-6 py-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <img src="/icon.png" alt="StacksAI" className="w-5 h-5" />
            </div>
            <div className="text-xl font-medium text-white">StacksAI</div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/chat" className="text-sm text-white/70 hover:text-white transition-colors">Chat</Link>
            <Link href="/features" className="text-sm text-white/70 hover:text-white transition-colors">Features</Link>
            <Link href="/docs" className="text-sm text-white hover:text-white transition-colors">Docs</Link>
            <a href="https://www.stacks.co/" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-[#FF6D29] text-white text-sm font-medium rounded-lg hover:bg-[#FF8C4A] transition-all">
              Stacks →
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 p-4 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-4">
              <Link href="/chat" className="text-sm text-white/70 hover:text-white transition-colors py-2">Chat</Link>
              <Link href="/features" className="text-sm text-white/70 hover:text-white transition-colors py-2">Features</Link>
              <Link href="/docs" className="text-sm text-white hover:text-white transition-colors py-2">Docs</Link>
              <a href="https://www.stacks.co/" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#FF6D29] text-white text-sm font-medium rounded-lg hover:bg-[#FF8C4A] transition-all text-center">
                Stacks →
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4 text-white">Documentation</h1>
            <p className="text-lg sm:text-xl text-white/60">Learn how to use StacksAI for pay-per-prompt AI access</p>
          </motion.div>

          {/* Quick Start */}
          <motion.section
            className="mb-16"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-medium mb-6 text-white flex items-center gap-3">
              <Book className="w-8 h-8 text-[#FF6D29]" />
              Quick Start Guide
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-medium mb-3 text-white">Step 1: Install Hiro Wallet</h3>
                <p className="text-white/60 mb-4">Download and install the Hiro Wallet browser extension to manage your STX tokens.</p>
                <a 
                  href="https://wallet.hiro.so/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF6D29] hover:text-[#FF8C4A] transition-colors"
                >
                  Download Hiro Wallet
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-medium mb-3 text-white">Step 2: Get Testnet STX</h3>
                <p className="text-white/60 mb-4">For testing, get free testnet STX tokens from the Stacks faucet.</p>
                <a 
                  href="https://explorer.hiro.so/sandbox/faucet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF6D29] hover:text-[#FF8C4A] transition-colors"
                >
                  Get Testnet STX
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-medium mb-3 text-white">Step 3: Connect & Chat</h3>
                <p className="text-white/60 mb-4">Navigate to the chat page, connect your wallet, and start using AI models.</p>
                <Link 
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6D29] text-white rounded-lg hover:bg-[#FF8C4A] transition-all"
                >
                  <Wallet className="w-4 h-4" />
                  Go to Chat
                </Link>
              </div>
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            className="mb-16"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-medium mb-6 text-white">How It Works</h2>
            
            <div className="space-y-4">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#FF6D29] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Select AI Model</h3>
                    <p className="text-white/60">Choose from GPT-4, Claude 3, or GPT-3.5 based on your needs.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#FF6D29] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Enter Your Prompt</h3>
                    <p className="text-white/60">Type your question or request in the chat interface.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#FF6D29] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Approve Payment</h3>
                    <p className="text-white/60">Confirm the micro-payment in your Hiro Wallet (starting from 0.02 STX).</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#FF6D29] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Get AI Response</h3>
                    <p className="text-white/60">Receive your AI-generated response instantly after payment confirmation.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Pricing */}
          <motion.section
            className="mb-16"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-medium mb-6 text-white">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-2">GPT-3.5</h3>
                <div className="text-3xl font-bold text-[#FF6D29] mb-2">0.02 STX</div>
                <p className="text-white/60 text-sm">~$0.04 per prompt</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-[#FF6D29]">
                <div className="text-xs font-bold text-[#FF6D29] mb-2">POPULAR</div>
                <h3 className="text-xl font-medium text-white mb-2">GPT-4</h3>
                <div className="text-3xl font-bold text-[#FF6D29] mb-2">0.10 STX</div>
                <p className="text-white/60 text-sm">~$0.20 per prompt</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-2">Claude 3</h3>
                <div className="text-3xl font-bold text-[#FF6D29] mb-2">0.12 STX</div>
                <p className="text-white/60 text-sm">~$0.24 per prompt</p>
              </div>
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-medium mb-6 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">Do I need a subscription?</h3>
                <p className="text-white/60">No! You only pay for what you use. No monthly fees or commitments.</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">How are payments verified?</h3>
                <p className="text-white/60">All payments are verified on the Stacks blockchain, ensuring complete transparency and security.</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">What wallets are supported?</h3>
                <p className="text-white/60">Currently, we support Hiro Wallet for Stacks blockchain transactions.</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">Is my data private?</h3>
                <p className="text-white/60">Yes! Your conversations are encrypted and never stored. We prioritize your privacy.</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 mt-32 border-t border-white/10">
        <div className="text-center text-sm text-white/40">
          <p>Built with ❤️ on Stacks blockchain • Secured by Bitcoin</p>
        </div>
      </footer>
    </div>
  );
}
