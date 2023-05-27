import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProjectCurrentFundingCycle() {
  const { chainData } = useChainData();
  const { JBController } = chainData;
  const { gameId } = useGameContext();

  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.interface,
    functionName: "currentFundingCycleOf",
    args: gameId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
