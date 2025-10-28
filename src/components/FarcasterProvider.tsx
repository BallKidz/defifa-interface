'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Call ready() as soon as the app is loaded to hide the splash screen
    sdk.actions.ready()
    
    // Log Mini App context for debugging
    sdk.isInMiniApp().then((isInMiniApp) => {
      console.log('🔗 Farcaster Mini App detected:', isInMiniApp)
      if (isInMiniApp) {
        console.log('📱 Running in Farcaster Mini App context')
        console.log('👤 User context:', sdk.context)
      }
    }).catch((error) => {
      console.log('🌐 Running in regular web context:', error.message)
    })
  }, [])

  return <>{children}</>
}
