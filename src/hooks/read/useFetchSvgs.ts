import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useFetchSvgs(dataSource: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegateABI,
    functionName: "tokenURI",
    args: ["1000000001"],
    chainId: chainData.chainId,
  });
}
