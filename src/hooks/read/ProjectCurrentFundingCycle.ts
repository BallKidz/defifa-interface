import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { JBFundingCycle, JBFundingCycleMetadata } from "types/interfaces";
import { useContractRead } from "wagmi";

export function useProjectCurrentFundingCycle(projectId: number) {
  const { chainData } = useChainData();
  const { JBController } = chainData;

  const res = useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.interface,
    functionName: "currentFundingCycleOf",
    args: projectId,
    chainId: chainData.chainId,
  });

  return {
    ...res,
    data: res.data as unknown as
      | {
          fundingCycle: JBFundingCycle;
          metadata: JBFundingCycleMetadata;
        }
      | undefined,
  };
}
