import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../config";

export function useFetchSvgs(tokenId: string, dataSource: string) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : null,
    chainId: chainData.chainId,
  });
}
