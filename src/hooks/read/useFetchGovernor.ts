import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useFetchGovernor(dataSource: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegateABI,
    functionName: "owner",
    chainId: chainData.chainId,
  });
}
