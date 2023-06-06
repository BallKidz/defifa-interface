import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useQuorum(proposalId: number, governor: string | undefined) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "quorum",
    args: [proposalId],
    chainId: chainData.chainId,
    enabled: !!governor,
  });
}
