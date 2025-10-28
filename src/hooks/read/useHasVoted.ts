import { useChainData } from "hooks/useChainData";
import { useAccount, useReadContract } from "wagmi";
import { Abi } from "viem";

export function useHasVoted(scorecardId: number, governor: string) {
  const { address } = useAccount();
  const { chainData } = useChainData();

  return useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "hasVoted",
    args: [scorecardId, address],
    chainId: chainData.chainId,
  });
}
