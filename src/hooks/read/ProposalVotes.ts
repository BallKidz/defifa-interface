import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProposalVotes(
  gameId: number,
  scorecardId: number,
  governor: string | undefined
) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "attestationCountOf",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    enabled: Boolean(governor && scorecardId),
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber | undefined,
  };
}
