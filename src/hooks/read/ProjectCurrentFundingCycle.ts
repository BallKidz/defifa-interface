import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../config";

export function useProjectCurrentFundingCycle() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

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
