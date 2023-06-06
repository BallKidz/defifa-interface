import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { DefifaTimeData } from "types/defifa";
import { useContractRead } from "wagmi";

export function useGameTimes() {
  const { chainData } = useChainData();
  const { gameId } = useGameContext();

  const res = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: gameId,
    chainId: chainData.chainId,
  });

  return { ...res, data: res.data as unknown as DefifaTimeData };
}
