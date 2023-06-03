import { ScorecardProposalState } from "types/interfaces";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalState(
  proposalId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: governorAddress ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "state",
    args: [proposalId],
    chainId: chainData.chainId,
    enabled: !!governorAddress,
  });

  return {
    ...res,
    data: res.data as unknown as ScorecardProposalState,
  };
}
