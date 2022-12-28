import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useProposalState(proposalId: number) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: chainData.defifaGovernor.address,
    contractInterface: chainData.defifaGovernor.interface,
    functionName: "state",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
