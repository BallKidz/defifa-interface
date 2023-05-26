import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalState(proposalId: number, governor: string) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "state",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
