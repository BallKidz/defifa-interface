'use client'

import { useGameChainValidation } from 'hooks/useChainValidation'
import { useChainData } from 'hooks/useChainData'
import { getNetworkName } from 'lib/networks'
import Button from 'components/UI/Button'

interface ChainMismatchWarningProps {
  gameChainId: number
  className?: string
}

export function ChainMismatchWarning({ gameChainId, className = '' }: ChainMismatchWarningProps) {
  const { chainData } = useChainData()
  const chainValidation = useGameChainValidation(gameChainId)

  // Don't show warning if chains match or if not connected
  if (chainValidation.isValid || !chainData.chainId) {
    return null
  }

  const handleSwitchChain = async () => {
    try {
      await chainValidation.switchChain()
    } catch (error) {
      console.error('Failed to switch chain:', error)
    }
  }

  return (
    <div className={`mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-200">
            Wrong Network Detected
          </h3>
          <div className="mt-2 text-sm text-yellow-200">
            <p>
              You're connected to <strong>{getNetworkName(chainData.chainId)}</strong> but this game is on{' '}
              <strong>{getNetworkName(gameChainId)}</strong>. Switch networks to interact with this game.
            </p>
          </div>
          <div className="mt-3">
            <Button
              onClick={handleSwitchChain}
              category="secondary"
              size="sm"
              disabled={chainValidation.isSwitching}
              loading={chainValidation.isSwitching}
            >
              {chainValidation.isSwitching 
                ? 'Switching...' 
                : `Switch to ${getNetworkName(gameChainId)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
