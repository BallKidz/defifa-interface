import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useGameQuorum(gameId: number, governor: string | undefined) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "quorum",
    args: [gameId],
    chainId: chainData.chainId,
    enabled: !!governor,
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
