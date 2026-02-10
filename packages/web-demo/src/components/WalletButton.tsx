'use client'

import { Wallet } from 'lucide-react'
import { useWalletConnect } from '@/hooks/useWalletConnect'

export function WalletButton() {
  const { walletData, isConnected, isConnecting, connect, disconnect } = useWalletConnect()

  if (isConnected && walletData) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
          {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
