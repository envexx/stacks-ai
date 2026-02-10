'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Connect } from '@stacks/connect-react'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Connect
        authOptions={{
          appDetails: {
            name: 'StacksAI Gateway',
            icon: '/logo.png',
          },
          redirectTo: '/',
          onFinish: () => {
            window.location.reload()
          },
        }}
      >
        {children}
      </Connect>
    </QueryClientProvider>
  )
}
