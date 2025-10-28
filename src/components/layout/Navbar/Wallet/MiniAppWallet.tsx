'use client'

import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { useFarcasterContext } from 'hooks/useFarcasterContext'
import Button from "components/UI/Button";

export function MiniAppWallet() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { isInMiniApp } = useFarcasterContext()

  // Auto-connect when in Mini App environment
  useEffect(() => {
    if (isInMiniApp === true && !isConnected && connectors.length > 0) {
      // Find the Farcaster Mini App connector
      const farcasterConnector = connectors.find(connector => 
        connector.name === 'Farcaster Mini App' || 
        connector.name.includes('Farcaster') ||
        connector.id === 'farcasterMiniApp'
      )
      
      if (farcasterConnector) {
        connect({ connector: farcasterConnector })
      }
    }
  }, [isInMiniApp, isConnected, connect, connectors])

  // Show loading state while checking Mini App status
  if (isInMiniApp === null) {
    return (
      <Button category="secondary" disabled>
        Loading...
      </Button>
    )
  }

  // In Mini App context
  if (isInMiniApp) {
    if (isConnected && address) {
      return (
        <Button category="secondary" className="w-full">
          {address.slice(0, 6)}...{address.slice(-4)}
        </Button>
      )
    }
    
    return (
      <Button category="secondary" disabled>
        Connecting...
      </Button>
    )
  }

  // Not in Mini App - return null to let the regular Wallet component handle it
  return null
}
