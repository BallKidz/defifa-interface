import { useAccount, useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useHasVoted(proposalId: number, governor: string) {
  const { address } = useAccount();
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.defifaGovernor.interface,
    functionName: "hasVoted",
    args: [proposalId, address],
    chainId: chainData.chainId,
  });
}
