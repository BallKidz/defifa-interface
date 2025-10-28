'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function useFarcasterContext() {
  const [context, setContext] = useState<any>(null)
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)

  useEffect(() => {
    const checkContext = async () => {
      try {
        const miniAppStatus = await sdk.isInMiniApp()
        setIsInMiniApp(miniAppStatus)
        
                if (miniAppStatus) {
                  // Safely extract only serializable data from context
                  const contextData = await sdk.context
                  const safeContext = {
                    user: contextData?.user || null,
                    location: contextData?.location || null,
                  }
                  setContext(safeContext)
                }
      } catch (error) {
        console.warn('Failed to get Farcaster context:', error)
        setIsInMiniApp(false)
        setContext(null)
      }
    }

    checkContext()
  }, [])

  return {
    context,
    isInMiniApp,
    user: context?.user,
    client: context?.client,
    location: context?.location,
  }
}

