'use client'

import { useState, useEffect } from 'react'
import { AppConfig, showConnect, UserSession } from '@stacks/connect'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

if (typeof window !== 'undefined' && !window.StacksProvider) {
  console.warn('Hiro Wallet extension not detected. Please install from https://wallet.hiro.so/')
}

export interface WalletData {
  address: string
  network: 'testnet' | 'mainnet'
  userData: any
}

export function useWalletConnect() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
        setWalletData({
          address: userData.profile.stxAddress[network],
          network,
          userData
        })
      })
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
      setWalletData({
        address: userData.profile.stxAddress[network],
        network,
        userData
      })
    }
  }, [])

  const connect = () => {
    setIsConnecting(true)
    showConnect({
      appDetails: {
        name: 'StacksAI Gateway',
        icon: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        setIsConnecting(false)
        window.location.reload()
      },
      onCancel: () => {
        setIsConnecting(false)
      },
      userSession,
    })
  }

  const disconnect = () => {
    userSession.signUserOut()
    setWalletData(null)
    window.location.reload()
  }

  return {
    walletData,
    isConnected: !!walletData,
    isConnecting,
    connect,
    disconnect,
  }
}
