import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalVotes(
  proposalId: number,
  governor: string | undefined
) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "proposalVotes",
    args: [proposalId],
    chainId: chainData.chainId,
    enabled: Boolean(governor && proposalId),
  });
}
