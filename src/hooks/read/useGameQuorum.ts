import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useGameQuorum(gameId: number, governor: string | undefined) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "quorum",
    args: [gameId],
    chainId: chainData.chainId,
    query: {
      enabled: !!governor,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });


  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
