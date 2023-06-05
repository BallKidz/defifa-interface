import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useAllDuration(gameId: number) {
  const { chainData } = useChainData();
  //const { gameId } = useGameContext();

  const { data: deployerDates } = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: gameId,
    chainId: chainData.chainId,
  });

  return deployerDates;
}
