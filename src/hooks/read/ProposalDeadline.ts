import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useProposalDeadline(proposalId: number, governor: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.defifaGovernor.interface,
    functionName: "proposalDeadline",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
