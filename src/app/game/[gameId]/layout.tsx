'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseNetworkGameId } from "lib/networks";
import { useChainValidation } from "hooks/useChainValidation";
import { ChainMismatchWarning } from "components/UI/ChainMismatchWarning";
import GameContextProvider from "contexts/GameContext/GameContextProvider";
import Head from "next/head";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { gameId: networkGameId } = params;
  

  // Parse the game ID first to get the target chain
  let targetChainId: number | undefined;
  let parsed: { network: any; gameId: number } | null = null;
  
  if (networkGameId) {
    const decodedGameId = decodeURIComponent(networkGameId as string);
    parsed = parseNetworkGameId(decodedGameId);
    targetChainId = parsed?.network.chainId;
  }

  // Always call hooks at the top level
  const chainValidation = useChainValidation(targetChainId);
  const [hasAttemptedSwitch, setHasAttemptedSwitch] = useState(false);
  
  useEffect(() => {
    // Auto-switch immediately when route is accessed directly
    if (parsed && chainValidation.needsSwitch && !chainValidation.isSwitching && !hasAttemptedSwitch) {
      setHasAttemptedSwitch(true);
      chainValidation.switchChain().catch((error) => {
        console.error('Failed to auto-switch chain:', error);
        setHasAttemptedSwitch(false); // Reset on error so user can try again
      });
    }
  }, [parsed, chainValidation.needsSwitch, chainValidation.isSwitching, chainValidation.switchChain, hasAttemptedSwitch]);

  if (!networkGameId) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!parsed) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Game</h1>
        <p>Invalid game ID format. Expected format: network:gameId (e.g., sep:32)</p>
        <p className="text-sm text-gray-500 mt-2">Received: {networkGameId}</p>
      </div>
    );
  }

  const { network, gameId } = parsed;

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://defifa.net'
  const gameImageUrl = `${baseUrl}/assets/defifa-og.png` // 1200x800 - perfect 3:2 ratio for social sharing
  const iconUrl = `${baseUrl}/assets/defifa-icon.png` // 200x200 - splash screen

  // Show loading state while switching chains
  if (chainValidation.isSwitching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
        <p className="text-lg">Switching to {network.name}...</p>
        <p className="text-sm text-gray-400 mt-2">Please confirm the network switch in your wallet</p>
      </div>
    );
  }

  return (
    <GameContextProvider gameId={gameId} chainId={network.chainId}>
      <Head>
        <meta name="fc:miniapp" content={JSON.stringify({
          version: "1",
          imageUrl: gameImageUrl,
          button: {
            title: "🎮 Play Game",
            action: {
              type: "launch_frame",
              name: "Defifa",
              url: `${baseUrl}/game/${networkGameId}`,
              splashImageUrl: iconUrl,
              splashBackgroundColor: "#000000"
            }
          }
        })} />
        <meta name="fc:frame" content={JSON.stringify({
          version: "1",
          imageUrl: gameImageUrl,
          button: {
            title: "🎮 Play Game",
            action: {
              type: "launch_frame",
              name: "Defifa",
              url: `${baseUrl}/game/${networkGameId}`,
              splashImageUrl: iconUrl,
              splashBackgroundColor: "#000000"
            }
          }
        })} />
      </Head>
      
      {/* Only show chain mismatch warning if auto-switch failed and user is not switching */}
      {chainValidation.needsSwitch && !chainValidation.isValid && !chainValidation.isSwitching && hasAttemptedSwitch && (
        <div className="p-4">
          <ChainMismatchWarning gameChainId={network.chainId} />
        </div>
      )}
      
      {children}
    </GameContextProvider>
  );
}
