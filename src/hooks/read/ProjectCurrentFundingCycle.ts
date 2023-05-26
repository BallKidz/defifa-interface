import { useContractRead, useNetwork } from "wagmi";
import { useChainData } from "../useChainData";

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
