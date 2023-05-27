import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useNextPhaseNeedsQueueing() {
  const { chainData } = useChainData();
  const { gameId } = useGameContext();

  return useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "nextPhaseNeedsQueueing",
    args: gameId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
