import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";
import DefifaDeployer from "@jbx-protocol/juice-defifa/out/DefifaDeployer.sol/DefifaDeployer.json";

export function useDeployerDuration() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const defifaDeployer = chainData.defifaDeployer;

  return useContractRead({
    addressOrName: defifaDeployer,
    contractInterface: DefifaDeployer.abi,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });
}
