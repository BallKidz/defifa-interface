'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { useChainData } from './useChainData'
import { useCallback } from 'react'

export interface ChainValidationResult {
  isValid: boolean
  needsSwitch: boolean
  currentChainId: number
  targetChainId: number
  switchChain: () => Promise<void>
  error?: string
  isSwitching: boolean
}

/**
 * Hook to validate and handle chain switching for transactions
 * @param targetChainId - The chain ID where the transaction should be executed
 * @returns ChainValidationResult with validation status and switch function
 */
export function useChainValidation(targetChainId?: number): ChainValidationResult {
  const { isConnected, chainId: walletChainId } = useAccount()
  const { chainData } = useChainData()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  // Use targetChainId if provided, otherwise use current wallet chain
  const currentChainId = walletChainId || chainData.chainId
  const needsSwitch = targetChainId ? currentChainId !== targetChainId : false
  const isValid = !needsSwitch && isConnected

  const handleSwitchChain = useCallback(async () => {
    if (!targetChainId) {
      throw new Error('No target chain ID provided')
    }
    
    try {
      await switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }, [targetChainId, switchChain])

  return {
    isValid,
    needsSwitch,
    currentChainId,
    targetChainId: targetChainId || currentChainId,
    switchChain: handleSwitchChain,
    error: isSwitching ? 'Switching chain...' : undefined,
    isSwitching
  }
}

/**
 * Hook specifically for game transactions that validates the game's chain
 * @param gameChainId - The chain ID where the game is deployed
 * @returns ChainValidationResult
 */
export function useGameChainValidation(gameChainId: number): ChainValidationResult {
  return useChainValidation(gameChainId)
}
