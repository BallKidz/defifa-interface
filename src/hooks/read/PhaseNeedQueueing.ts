import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useNextPhaseNeedsQueueing() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  const { defifaDeployer, defifaDeployerInterface, projectId } = chainData;

  return useContractRead({
    addressOrName: defifaDeployer,
    contractInterface: defifaDeployerInterface,
    functionName: "nextPhaseNeedsQueueing",
    args: projectId,
    chainId: chainData.chainId,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
