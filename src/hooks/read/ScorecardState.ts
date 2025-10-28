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
    },
  });
  
  return {
    ...res,
    data: res.data as unknown as DefifaScorecardState,
  };
}
