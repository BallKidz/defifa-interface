import { useContractRead, useNetwork } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { useGameContext } from "contexts/GameContext";

export function useDeployerDuration() {
  const { chainData } = useChainData();
  const { gameId } = useGameContext();

  const { data: deployerDates } = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: gameId,
    chainId: chainData.chainId,
  });

  return deployerDates;
}
