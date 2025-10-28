'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArcadeWrapper from "../../../components/Arcade";
import { useChainValidation } from "hooks/useChainValidation";
import { getNetworkName } from "lib/networks";

const NetworkArcade = () => {
  const params = useParams();
  const router = useRouter();
  const { network } = params;
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (network) {
      // Map network names to chain IDs
      const networkToChainId: { [key: string]: number } = {
        'eth': 1,        // Ethereum Mainnet
        'mainnet': 1,    // Ethereum Mainnet (alternative)
        'opt': 10,       // Optimism
        'arb': 42161,    // Arbitrum One
        'base': 8453,    // Base
        'sep': 11155111, // Sepolia Testnet
        'sepolia': 11155111, // Sepolia Testnet (alternative)
        'optsep': 11155420,  // Optimism Sepolia
        'arbsep': 421614,    // Arbitrum Sepolia
        'basesep': 84532,    // Base Sepolia
      };

      const mappedChainId = networkToChainId[network as string];
      
      if (mappedChainId) {
        setChainId(mappedChainId);
      } else {
        // Invalid network, redirect to home
        router.push('/');
      }
    }
  }, [network, router]);

  // Auto-switch chain when navigating to arcade
  const chainValidation = useChainValidation(chainId || undefined);
  
  useEffect(() => {
    // Auto-switch immediately when route is accessed directly
    if (chainId && chainValidation.needsSwitch && !chainValidation.isSwitching) {
      console.log(`🔄 Auto-switching to ${getNetworkName(chainId)} for arcade`);
      chainValidation.switchChain().catch((error) => {
        console.error('Failed to auto-switch chain:', error);
      });
    }
  }, [chainId, chainValidation.needsSwitch, chainValidation.isSwitching, chainValidation.switchChain]);

  if (!chainId) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Show loading state while switching chains
  if (chainValidation.isSwitching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
        <p className="text-lg">Switching to {getNetworkName(chainId)}...</p>
        <p className="text-sm text-gray-400 mt-2">Please confirm the network switch in your wallet</p>
      </div>
    );
  }

  return <ArcadeWrapper chainId={chainId} />;
};

export default NetworkArcade;
