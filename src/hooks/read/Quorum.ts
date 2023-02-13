import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useQuorum(proposalId: number) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: chainData.defifaGovernor.address,
    contractInterface: chainData.defifaGovernor.interface,
    functionName: "quorum",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}

export function useQuorumReached(proposalId: number) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: chainData.defifaGovernor.address,
    contractInterface: chainData.defifaGovernor.interface,
    functionName: "_quorumReached",
    args: [proposalId],
    chainId: chainData.chainId,
  });
}
