import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "config";

export function useDeployerDuration() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const { data: deployerDates } = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });

  return deployerDates;
}
