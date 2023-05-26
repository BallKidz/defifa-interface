import { useContractRead, useNetwork } from "wagmi";
import { useChainData } from "hooks/useChainData";

export function useDeployerDuration() {
  const { chainData } = useChainData();
  const { data: deployerDates } = useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });

  return deployerDates;
}
