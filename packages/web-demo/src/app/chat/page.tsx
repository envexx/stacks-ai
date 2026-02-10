'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Menu, X, AlertCircle, DollarSign, Bot } from 'lucide-react'
import Link from 'next/link'
import { useWalletConnect } from '@/hooks/useWalletConnect'
import { useStacksPayment } from '@/hooks/useStacksPayment'
import { WalletButton } from '@/components/WalletButton'

const MODELS = [
  { id: 'gpt4', name: 'GPT-4 Turbo', price: 0.1, description: 'Most capable', color: 'from-purple-500 to-pink-500' },
  { id: 'claude', name: 'Claude 3 Opus', price: 0.12, description: 'Advanced reasoning', color: 'from-orange-500 to-red-500' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', price: 0.02, description: 'Fast & efficient', color: 'from-green-500 to-teal-500' },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ChatSession {
  id: string
  title: string
  model: string
  messages: Message[]
  createdAt: Date
}

export default function Playground() {
  const [selectedModel, setSelectedModel] = useState('gpt4')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [paymentRequired, setPaymentRequired] = useState<any>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { walletData, isConnected } = useWalletConnect()
  const { makePayment, waitForConfirmation, isPaying } = useStacksPayment()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const saved = localStorage.getItem('chat-sessions')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSessions(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })))
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat-sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      model: selectedModel,
      messages: [],
      createdAt: new Date()
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
  }

  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setSelectedModel(session.model)
      setIsSidebarOpen(false)
    }
  }

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
      setMessages([])
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || loading || isPaying) return

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!currentSessionId) {
      createNewSession()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')
    setPaymentRequired(null)

    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: newMessages, title: newMessages[0]?.content.slice(0, 30) + '...' || 'New Chat' }
          : s
      ))
    }

    try {
      const response = await fetch(`${API_URL}/v1/prompt/${selectedModel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content })
      })

      if (response.status === 402) {
        const x402Response = await response.json()
        const paymentReqs = x402Response.paymentRequirements
        setPaymentRequired(paymentReqs)
        
        await handlePayment(paymentReqs, userMessage.content)
        return
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response',
        timestamp: new Date()
      }
      
      const updatedMessages = [...newMessages, aiMessage]
      setMessages(updatedMessages)
      
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: updatedMessages }
            : s
        ))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (paymentReqs: any, originalPrompt: string) => {
    try {
      console.log('💰 Payment required:', paymentReqs)
      
      const txId = await makePayment({
        recipient: paymentReqs.payTo,
        amount: paymentReqs.amount,
        memo: paymentReqs.description || 'StacksAI Payment'
      })

      console.log('✅ Payment sent:', txId)
      console.log('⏳ Waiting for confirmation...')

      await waitForConfirmation(txId)

      console.log('✅ Payment confirmed! Retrying request...')

      const paymentPayload = {
        paymentRequirements: paymentReqs,
        signature: '',
        publicKey: '',
        txId: txId
      }

      const retryResponse = await fetch(`${API_URL}/v1/prompt/${selectedModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-SIGNATURE': Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
        },
        body: JSON.stringify({ prompt: originalPrompt })
      })

      const data = await retryResponse.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response',
        timestamp: new Date()
      }
      
      setMessages(prev => {
        const finalMessages = [...prev, aiMessage]
        
        if (currentSessionId) {
          setSessions(sessions => sessions.map(s => 
            s.id === currentSessionId 
              ? { ...s, messages: finalMessages }
              : s
          ))
        }
        
        return finalMessages
      })
      setPaymentRequired(null)

    } catch (err: any) {
      setError(`Payment failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const selectedModelData = MODELS.find(m => m.id === selectedModel)

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Orange Glow Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6D29] via-[#FF8C4A] to-[#FF6D29] rounded-full blur-[200px] opacity-30" />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 bg-black/50 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-white/10 flex justify-between items-center">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <img src="/icon.png" alt="StacksAI" className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">StacksAI</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:block p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <Menu className="w-4 h-4 text-white/70" />
                ) : (
                  <X className="w-4 h-4 text-white/70" />
                )}
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {!isSidebarCollapsed && (
            <>
              <div className="p-3 border-b border-white/10">
                <button
                  onClick={createNewSession}
                  className="w-full px-3 py-2 bg-[#FF6D29] text-white rounded-lg text-sm font-medium hover:bg-[#FF8C4A] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D29]/30"
                >
                  <img src="/icon.png" alt="New Chat" className="w-4 h-4" />
                  New Chat
                </button>
              </div>

              <div className="px-3 py-2 border-b border-white/10">
                <div className="text-xs font-semibold text-white/50 mb-2">MODEL</div>
                <div className="space-y-1">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-md transition-all text-xs ${
                        selectedModel === model.id
                          ? 'bg-[#FF6D29]/20 text-white font-medium border border-[#FF6D29]/50'
                          : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{model.name}</span>
                        <span className="text-xs opacity-60">{model.price} STX</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="text-xs font-semibold text-white/50 mb-2">HISTORY</div>
                {sessions.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-4">
                    No chat history yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`group relative p-2 rounded-lg transition-all cursor-pointer ${
                          currentSessionId === session.id
                            ? 'bg-white/10 border border-[#FF6D29]/50'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => loadSession(session.id)}
                      >
                        <div className="text-xs font-medium text-white truncate pr-6">
                          {session.title}
                        </div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {session.messages.length} messages
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        >
                          <X className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {isSidebarCollapsed && (
            <div className="flex-1 flex flex-col items-center py-4 gap-3">
              <button
                onClick={createNewSession}
                className="p-2 bg-[#FF6D29] text-white rounded-lg hover:bg-[#FF8C4A] transition-colors shadow-lg shadow-[#FF6D29]/30"
                title="New Chat"
              >
                <img src="/icon.png" alt="New Chat" className="w-5 h-5" />
              </button>
              {sessions.slice(0, 5).map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    currentSessionId === session.id
                      ? 'bg-[#FF6D29] text-white shadow-lg shadow-[#FF6D29]/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={session.title}
                >
                  {session.messages.length}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-xl flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-white/70 hover:text-white p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{selectedModelData?.name}</h2>
              {paymentRequired && (
                <span className="text-xs bg-[#FF6D29]/20 text-[#FF6D29] px-2 py-1 rounded border border-[#FF6D29]/50">
                  Payment: {parseInt(paymentRequired.amount) / 1_000_000} STX
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WalletButton />
            <Link href="/" className="text-white/50 hover:text-white p-1">
              <X className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-transparent relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3">
                  <img src="/icon.png" alt="StacksAI" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-medium mb-2 text-white">How can I help you today?</h3>
                <p className="text-sm text-white/60">
                  Using {selectedModelData?.name} • {selectedModelData?.price} STX per message
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 group ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center text-xs font-semibold text-blue-300">
                      AI
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#FF6D29]/20 to-[#FF8C4A]/20 border border-[#FF6D29]/30 backdrop-blur-sm'
                      : 'bg-white/5 border border-white/10 backdrop-blur-sm'
                  }`}>
                    <div className="text-xs font-medium mb-1.5 ${
                      message.role === 'user' ? 'text-[#FF6D29]' : 'text-blue-300'
                    }">
                      {message.role === 'user' ? 'You' : selectedModelData?.name}
                    </div>
                    <div className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6D29]/30 to-[#FF8C4A]/30 backdrop-blur-sm border border-[#FF6D29]/50 flex items-center justify-center text-xs font-semibold text-[#FF6D29]">
                      U
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center text-xs font-semibold text-blue-300">
                    AI
                  </div>
                  <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-xs font-medium text-blue-300 mb-1.5">{selectedModelData?.name}</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 pb-2 relative z-10">
            <div className="max-w-3xl mx-auto bg-red-500/20 border border-red-500/50 rounded-lg p-2 backdrop-blur-sm">
              <p className="text-xs text-red-200">{error}</p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0 z-10">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder="Message StacksAI..."
                disabled={loading}
                className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6D29]/50 focus:border-[#FF6D29]/50 disabled:opacity-50 text-sm text-white placeholder:text-white/40"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || isPaying || !input.trim() || !isConnected}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF6D29] text-white rounded-lg hover:bg-[#FF8C4A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#FF6D29] shadow-lg shadow-[#FF6D29]/30"
              >
                {loading || isPaying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/40 mt-2">
              {isPaying ? (
                <>
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Processing payment...</span>
                </>
              ) : loading ? (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  <span>Getting response...</span>
                </>
              ) : !isConnected ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                  <span>Connect wallet to continue</span>
                </>
              ) : (
                <span>{selectedModelData?.price} STX per message</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
