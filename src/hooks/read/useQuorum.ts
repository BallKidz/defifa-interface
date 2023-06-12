import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useQuorum(
  gameId: number,
  scorecardId: number,
  governor: string | undefined
) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "quorum",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    enabled: !!governor,
  });
}
