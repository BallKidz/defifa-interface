import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export enum DefifaGamePhase {
  COUNTDOWN,
  MINT,
  REFUND,
  SCORING,
  COMPLETE,
  NO_CONTEST_INEVITABLE,
  NO_CONTEST,
}

export function useCurrentGamePhase(gameId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  // Use the provided chainId if available, otherwise use the connected wallet's chain
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  const res = useReadContract({
    address: chainData.DefifaDeployer.address as `0x${string}`,
    abi: chainData.DefifaDeployer.interface as Abi,
    functionName: "currentGamePhaseOf",
    args: [BigInt(gameId)],
    chainId: targetChainId,
    query: {
      refetchInterval: 30000, // Poll every 30 seconds to reduce subgraph load
    },
  });

  return {
    ...res,
    data: res.data as unknown as DefifaGamePhase,
  };
}
