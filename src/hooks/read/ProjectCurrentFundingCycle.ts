import { useContractRead, useNetwork } from "wagmi"; 
import { getChainData } from "../../constants/addresses";

export function useProjectCurrentFundingCycle() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  const { JBController, projectId } = chainData;

  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.abi,
    functionName: "currentFundingCycleOf",
    args: projectId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
