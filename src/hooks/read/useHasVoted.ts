import { useChainData } from "hooks/useChainData";
import { useAccount, useContractRead } from "wagmi";

export function useHasVoted(proposalId: number, governor: string) {
  const { address } = useAccount();
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "hasVoted",
    args: [proposalId, address],
    chainId: chainData.chainId,
  });
}
