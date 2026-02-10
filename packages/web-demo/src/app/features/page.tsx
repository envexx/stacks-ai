'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Coins, Code2, Lock, Wallet, CheckCircle2, ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Instant Access',
    description: 'Connect your wallet, pay, and get AI responses in seconds. No waiting, no subscriptions required.',
    benefits: ['No setup required', 'Instant wallet connection', 'Real-time responses', 'Pay as you go']
  },
  {
    icon: <Shield className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Blockchain Verified',
    description: 'Every payment is verified on-chain with complete transparency and immutable proof.',
    benefits: ['On-chain verification', 'Transparent transactions', 'Immutable records', 'Secure payments']
  },
  {
    icon: <Coins className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Micro-Payments',
    description: 'Pay as low as $0.04 per prompt. Only pay for what you actually use.',
    benefits: ['Starting at $0.04', 'No monthly fees', 'No commitments', 'Fair pricing']
  },
  {
    icon: <Code2 className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Premium AI Models',
    description: 'Access GPT-4, Claude 3, and more. Enterprise-grade AI at your fingertips.',
    benefits: ['GPT-4 access', 'Claude 3 Opus', 'Multiple models', 'Latest versions']
  },
  {
    icon: <Lock className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never stored. Complete privacy guaranteed.',
    benefits: ['End-to-end encryption', 'No data storage', 'Privacy first', 'Secure infrastructure']
  },
  {
    icon: <Wallet className="w-8 h-8 text-[#FF6D29]" />,
    title: 'Easy Integration',
    description: 'Simple SDK for developers to integrate pay-per-prompt AI into their apps.',
    benefits: ['Simple API', 'SDK available', 'Documentation', 'Developer friendly']
  },
];

export default function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/features" className="text-sm text-white hover:text-white transition-colors">Features</Link>
            <Link href="/docs" className="text-sm text-white/70 hover:text-white transition-colors">Docs</Link>
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
              <Link href="/features" className="text-sm text-white hover:text-white transition-colors py-2">Features</Link>
              <Link href="/docs" className="text-sm text-white/70 hover:text-white transition-colors py-2">Docs</Link>
              <a href="https://www.stacks.co/" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#FF6D29] text-white text-sm font-medium rounded-lg hover:bg-[#FF8C4A] transition-all text-center">
                Stacks →
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-6 text-white">
            Powerful Features for <span className="text-[#FF6D29]">Modern AI Access</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto px-4">
            Everything you need to access premium AI models with blockchain-verified payments
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#FF6D29]/50 transition-all duration-300"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-32 text-center"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-medium mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-white/60 mb-8 text-lg">Start using premium AI models with blockchain payments today</p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#FF6D29] text-white rounded-xl font-medium hover:bg-[#FF8C4A] transition-all duration-300 shadow-xl shadow-[#FF6D29]/30"
          >
            Start Chatting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
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
