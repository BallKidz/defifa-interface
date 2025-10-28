import { BigNumber } from "ethers";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useGamePotBalance(gameId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;
  const { DefifaDeployer } = chainData;

  // Use the deployer's currentGamePotOf function which includes fulfilled commitments
  const res = useReadContract({
    address: DefifaDeployer.address as `0x${string}`,
    abi: DefifaDeployer.interface as Abi,
    functionName: "currentGamePotOf",
    args: gameId ? [BigInt(gameId), true] : undefined, // true = include commitments
    chainId: targetChainId,
    query: {
      enabled: !!gameId,
    },
  });

  // Minimal debug for pot balance
  if (res.error) {
    console.log(`💰 Pot Balance Error (Game ${gameId}):`, res.error.message);
  }

  return {
    ...res,
    data: (res.data as any)?.[0] as unknown as BigNumber | undefined, // First return value is the pot amount
  };
}
