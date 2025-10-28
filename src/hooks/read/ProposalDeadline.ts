import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useProposalDeadline(scorecardId: number, governor: string) {
  const { chainData } = useChainData();

  return useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "proposalDeadline",
    args: [scorecardId],
    chainId: chainData.chainId,
  });
}
