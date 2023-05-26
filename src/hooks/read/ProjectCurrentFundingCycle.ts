import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useProjectCurrentFundingCycle() {
  const { chainData } = useChainData();

  const { JBController, projectId } = chainData;

  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.interface,
    functionName: "currentFundingCycleOf",
    args: projectId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
