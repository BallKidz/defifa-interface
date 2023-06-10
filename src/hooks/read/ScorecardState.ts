import { DefifaScorecardState } from "types/defifa";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useScorecardState(
  gameId: number,
  scorecardId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: governorAddress ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "stateOf",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    enabled: !!governorAddress,
  });

  return {
    ...res,
    data: res.data as unknown as DefifaScorecardState,
  };
}
