import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { DefifaTimeData } from "types/defifa";
import { useContractRead } from "wagmi";

export function useGameTimes(gameId: number) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: gameId,
    chainId: chainData.chainId,
  });

  const { data } = res;
  if (!data) return res;

  const [start, mintPeriodDuration, refundPeriodDuration] = data as number[];
  const timeData: DefifaTimeData = {
    start,
    mintPeriodDuration,
    refundPeriodDuration,
  };

  return { ...res, data: timeData };
}
