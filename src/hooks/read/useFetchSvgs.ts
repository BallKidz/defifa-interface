import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useFetchSvgs(tokenId: string, dataSource: string) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : null,
    chainId: chainData.chainId,
  });
}
