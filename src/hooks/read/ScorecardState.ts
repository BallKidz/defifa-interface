import { DefifaScorecardState } from "types/defifa";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useScorecardState(
  gameId: number,
  scorecardId: bigint,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: governorAddress as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "stateOf",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress && !!gameId && !!scorecardId,
      refetchInterval: 5 * 1000, // Poll every 5 seconds for state changes (Pending → Active)
      staleTime: 0, // Always consider stale to ensure fresh data
    },
  });
  
  return {
    ...res,
    data: res.data as unknown as DefifaScorecardState,
  };
}
