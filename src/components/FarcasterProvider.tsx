'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Call ready() as soon as the app is loaded to hide the splash screen
    sdk.actions.ready()
  }, [])

  return <>{children}</>
}
