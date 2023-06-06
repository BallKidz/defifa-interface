import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export enum DefifaGamePhase {
  COUNTDOWN,
  MINT,
  REFUND,
  SCORING,
  COMPLETE,
  NO_CONTEST_INEVITABLE,
  NO_CONTEST,
}

export function useCurrentGamePhase(gameId: number) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "currentGamePhaseOf",
    args: gameId,
    chainId: chainData.chainId,
    watch: true,
  });

  return {
    ...res,
    data: res.data as unknown as DefifaGamePhase,
  };
}
