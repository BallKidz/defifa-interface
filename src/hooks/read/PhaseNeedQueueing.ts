import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useNextPhaseNeedsQueueing() {
  const { chainData } = useChainData();
  const { gameId } = useGameContext();

  const res = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "nextPhaseNeedsQueueing",
    args: gameId,
    chainId: chainData.chainId,
    watch: true,
    onSuccess: (data) => {},
    onError: (error) => {},
  });

  return {
    ...res,
    data: res.data as unknown,
  };
}
