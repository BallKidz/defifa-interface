import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useNextPhaseNeedsQueueing() {
  const { chainData } = useChainData();
  const { gameId } = useGameContext();

  const res = useReadContract({
    address: chainData.DefifaDeployer.address as `0x${string}`,
    abi: chainData.DefifaDeployer.interface as Abi,
    functionName: "nextPhaseNeedsQueueing",
    args: gameId ? [BigInt(gameId)] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: !!gameId,
    },
  });

  return {
    ...res,
    data: res.data as unknown,
  };
}
