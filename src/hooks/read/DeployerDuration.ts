import DefifaDeployer from "@jbx-protocol/juice-defifa/out/DefifaDeployer.sol/DefifaDeployer.json";
import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useDeployerDuration() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const defifaDeployer = chainData.defifaDeployer;
  const { data: deployerDates } = useContractRead({
    addressOrName: defifaDeployer,
    contractInterface: DefifaDeployer.abi,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });

  return deployerDates;
}
