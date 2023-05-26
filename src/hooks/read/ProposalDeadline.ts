import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalDeadline(proposalId: number, governor: string) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "proposalDeadline",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
