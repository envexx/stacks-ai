'use client'

import { ArrowRight, Shield, Zap, Coins, CheckCircle2, Wallet, Code2, Menu, X, Sparkles, Rocket, Brain } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Ripple } from '@/components/magicui/ripple'
import { Marquee } from '@/components/magicui/marquee'
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: <Zap className="w-6 h-6 text-[#FF6D29]" />,
    title: 'Instant Access',
    description: 'Connect wallet, pay, and get AI responses in seconds. No waiting, no subscriptions.',
  },
  {
    icon: <Shield className="w-6 h-6 text-[#453027]" />,
    title: 'Blockchain Verified',
    description: 'Every payment verified on-chain. Complete transparency and immutable proof.',
  },
  {
    icon: <Coins className="w-6 h-6 text-[#161316]" />,
    title: 'Micro-Payments',
    description: 'Pay as low as $0.04 per prompt. Only pay for what you actually use.',
  },
  {
    icon: <Code2 className="w-6 h-6 text-[#BABABA]" />,
    title: 'Premium Models',
    description: 'Access GPT-4, Claude 3, and more. Enterprise-grade AI at your fingertips.',
  },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Orange Glow Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6D29] via-[#FF8C4A] to-[#FF6D29] rounded-full blur-[200px] opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF6D29] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#FF6D29] rounded-full blur-[150px] opacity-20" />
      </div>
      
      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />

      {/* Navigation - Absolute positioned on top */}
      <motion.nav 
        className="absolute top-0 left-0 right-0 z-50 container mx-auto px-6 py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <img src="/icon.png" alt="StacksAI" className="w-5 h-5" />
            </div>
            <div className="text-xl font-medium text-white">
              StacksAI
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/chat" className="text-sm text-white/70 hover:text-white transition-colors">
              Chat
            </Link>
            <Link href="/features" className="text-sm text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/docs" className="text-sm text-white/70 hover:text-white transition-colors">
              Docs
            </Link>
            <a
              href="https://www.stacks.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-[#FF6D29] text-white text-sm font-medium rounded-lg hover:bg-[#FF8C4A] transition-all duration-300 shadow-lg shadow-[#FF6D29]/30"
            >
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
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              <Link href="/chat" className="text-sm text-white/70 hover:text-white transition-colors py-2">
                Chat
              </Link>
              <Link href="/features" className="text-sm text-white/70 hover:text-white transition-colors py-2">
                Features
              </Link>
              <Link href="/docs" className="text-sm text-white/70 hover:text-white transition-colors py-2">
                Docs
              </Link>
              <a
                href="https://www.stacks.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#FF6D29] text-white text-sm font-medium rounded-lg hover:bg-[#FF8C4A] transition-all duration-300 shadow-lg shadow-[#FF6D29]/30 text-center"
              >
                Stacks →
              </a>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section - Full Width */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        <Ripple />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TypingAnimation className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-white">
            Pay-per-Prompt AI Access on Stacks Blockchain
          </TypingAnimation>
          
          <p className="text-base sm:text-lg text-white/60 mb-12 max-w-2xl mx-auto px-4">
            A comprehensive guide to understanding pay-per-prompt AI access with blockchain-verified payments on Stacks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap px-4">
            <Link href="/chat" className="w-full sm:w-auto">
              <InteractiveHoverButton className="w-full">
                Chat
              </InteractiveHoverButton>
            </Link>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 w-full sm:w-auto justify-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-black" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/90 font-medium">Trusted by over 150K</div>
                <div className="text-xs text-white/50">people in the World</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-32 relative z-10">

          {/* Feature Cards - Single Line */}
        <motion.div 
          id="features"
          className="mb-20 max-w-7xl mx-auto"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#FF6D29]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* AI Models Marquee - Full Width */}
      <motion.div
        className="mb-32 relative w-full py-16"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12 container mx-auto px-6">
          <h2 className="text-3xl font-medium mb-3 text-white">Supported AI Models</h2>
          <p className="text-white/60">Access premium AI models with blockchain payments</p>
        </div>
        
        <Marquee pauseOnHover className="[--duration:30s]">
          {[
            '/1.png',
            '/2.png',
            '/3.png',
            '/1.png',
            '/2.png',
            '/3.png',
            '/1.png',
            '/2.png',
            '/3.png',
          ].map((logo, idx) => (
            <div
              key={idx}
              className="mx-8 w-32 h-16 flex items-center justify-center bg-white rounded-xl p-3 hover:scale-110 transition-transform duration-300"
            >
              <img 
                src={logo} 
                alt={`AI Model ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </Marquee>
        
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent"></div>
      </motion.div>

      <main className="container mx-auto px-6 relative z-10">

          <motion.div
            id="docs"
            className="mb-32 max-w-4xl mx-auto"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-medium mb-4 text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-white/60 text-lg">
                Pay only for what you use. No hidden fees, no surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="relative w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/40 via-cyan-500/30 to-blue-600/40 backdrop-blur-xl border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Zap className="w-8 h-8 text-blue-300 relative z-10" />
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">GPT-3.5</h3>
                <div className="text-4xl font-bold mb-4 text-white">
                  0.02 STX
                </div>
                <p className="text-white/50 text-sm mb-4">~$0.04 per prompt</p>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Fast responses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Great for simple tasks
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-[#FF6D29]/50 hover:border-[#FF6D29] transition-all duration-300 relative"
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-3 right-4 px-3 py-1 bg-[#FF6D29] text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <div className="relative w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-orange-500/40 via-red-500/30 to-orange-600/40 backdrop-blur-xl border border-orange-400/50 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Rocket className="w-8 h-8 text-orange-300 relative z-10" />
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">GPT-4</h3>
                <div className="text-4xl font-bold mb-4 text-[#FF6D29]">
                  0.10 STX
                </div>
                <p className="text-white/50 text-sm mb-4">~$0.20 per prompt</p>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Most advanced model
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Complex reasoning
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="relative w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-purple-600/40 backdrop-blur-xl border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Brain className="w-8 h-8 text-purple-300 relative z-10" />
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">Claude 3</h3>
                <div className="text-4xl font-bold mb-4 text-white">
                  0.12 STX
                </div>
                <p className="text-white/50 text-sm mb-4">~$0.24 per prompt</p>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Long context window
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6D29]" />
                    Detailed analysis
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-32 text-center"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-medium mb-6 text-white">
                Ready to Experience AI on Blockchain?
              </h2>
              <p className="text-white/60 mb-10 text-lg">
                Connect your Stacks wallet and start chatting with premium AI models. 
                Pay only for what you use.
              </p>
              <Link href="/chat">
                <InteractiveHoverButton>
                  <Wallet className="w-5 h-5" />
                  Start Chatting
                </InteractiveHoverButton>
              </Link>
            </div>
          </motion.div>
      </main>

      <footer className="container mx-auto px-6 py-12 mt-32 border-t border-white/10 relative z-10">
        <div className="text-center text-sm text-white/40">
          <p>Built with ❤️ on Stacks blockchain • Secured by Bitcoin</p>
        </div>
      </footer>
    </div>
  )
}
