import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "config";

export function useProposalState(proposalId: number, governor: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "state",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
