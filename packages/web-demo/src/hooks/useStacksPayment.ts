'use client'

import { useState } from 'react'
import { openSTXTransfer } from '@stacks/connect'
import { StacksTestnet, StacksMainnet } from '@stacks/network'
import { AnchorMode } from '@stacks/transactions'

export interface PaymentOptions {
  recipient: string
  amount: string
  memo?: string
}

export function useStacksPayment() {
  const [isPaying, setIsPaying] = useState(false)
  const [txId, setTxId] = useState<string>('')
  const [error, setError] = useState<string>('')

  const makePayment = async (options: PaymentOptions): Promise<string> => {
    setIsPaying(true)
    setError('')

    const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
      ? new StacksMainnet() 
      : new StacksTestnet()

    return new Promise((resolve, reject) => {
      openSTXTransfer({
        network,
        recipient: options.recipient,
        amount: options.amount,
        anchorMode: AnchorMode.Any,
        
        onFinish: (data) => {
          console.log('✅ Payment transaction broadcast:', data.txId)
          setTxId(data.txId)
          setIsPaying(false)
          resolve(data.txId)
        },
        
        onCancel: () => {
          console.log('❌ Payment canceled by user')
          setError('Payment canceled')
          setIsPaying(false)
          reject(new Error('Payment canceled'))
        },
      })
    })
  }

  const waitForConfirmation = async (txId: string): Promise<void> => {
    const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
    const apiUrl = network === 'mainnet' 
      ? 'https://api.hiro.so' 
      : 'https://api.testnet.hiro.so'

    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`)
        const data = await response.json()

        if (data.tx_status === 'success') {
          console.log('✅ Transaction confirmed!')
          return
        }

        if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          throw new Error('Transaction failed')
        }

        console.log(`⏳ Waiting for confirmation... (${attempts + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 5000))
        attempts++

      } catch (error) {
        console.log(`Checking transaction status... (${attempts + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 5000))
        attempts++
      }
    }

    throw new Error('Transaction confirmation timeout')
  }

  return {
    makePayment,
    waitForConfirmation,
    isPaying,
    txId,
    error,
  }
}
