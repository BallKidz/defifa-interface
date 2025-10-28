import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";
import { DefifaScorecardState } from "types/defifa";

export function useScorecardState(
  gameId: number,
  scorecardId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const { data, isLoading, error } = useReadContract({
    address: (governorAddress ?? "") as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "stateOf",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress && !!scorecardId,
    },
  });


  return {
    data: data as DefifaScorecardState | undefined,
    isLoading,
    error,
  };
}
