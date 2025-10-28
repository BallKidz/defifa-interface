import { useGameContext } from "contexts/GameContext";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { DefifaTimeData } from "types/defifa";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useGameTimes(gameId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  const res = useReadContract({
    address: chainData.DefifaDeployer.address as `0x${string}`,
    abi: chainData.DefifaDeployer.interface as Abi,
    functionName: "timesFor",
    args: [BigInt(gameId)],
    chainId: targetChainId,
  });

  const { data } = res;
  if (!data) return { ...res, data: undefined };

  const [start, mintPeriodDuration, refundPeriodDuration] = data as [bigint, number, number];
  const timeData: DefifaTimeData = {
    start: Number(start),
    mintPeriodDuration,
    refundPeriodDuration,
  };

  return { ...res, data: timeData };
}
