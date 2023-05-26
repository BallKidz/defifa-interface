import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../config";

export function useFetchGovernor(dataSource: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "owner",
    chainId: chainData.chainId,
  });
}
