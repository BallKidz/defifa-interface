import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useProposalVotes(
  gameId: number,
  scorecardId: bigint,
  governor: string | undefined
) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "attestationCountOf",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    query: {
      enabled: Boolean(governor && scorecardId),
      refetchInterval: 30 * 1000, // Refetch every 15 seconds to reduce RPC load
      staleTime: 1 * 1000, // Cache for 1 second to ensure fresh data
      keepPreviousData: true,
    },
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber | undefined,
  };
}
