import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../config";

export function useNextPhaseNeedsQueueing() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "nextPhaseNeedsQueueing",
    args: chainData.projectId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
