import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalDeadline(scorecardId: number, governor: string) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "proposalDeadline",
    args: [scorecardId],
    chainId: chainData.chainId,
  });
}
