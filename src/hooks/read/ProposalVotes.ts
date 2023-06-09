import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalVotes(
  scorecardId: number,
  governor: string | undefined
) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "proposalVotes",
    args: [scorecardId],
    chainId: chainData.chainId,
    enabled: Boolean(governor && scorecardId),
  });
}
