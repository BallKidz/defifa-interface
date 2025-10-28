import { BigNumber, constants } from "ethers";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useTotalSupply(
  dataSourceAddress: string | undefined,
  chainIdOverride?: number
) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  // First, get the store address from the DefifaDelegate contract
  const { data: storeAddress } = useReadContract({
    address: dataSourceAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "store",
    chainId: targetChainId,
    query: {
      enabled: hasDataSource,
    },
  });

  // Now query the total supply from that store
  const res = useReadContract({
    address: (storeAddress?.toString() ?? "") as `0x${string}`,
    abi: chainData.JBTiered721DelegateStore.interface as Abi,
    functionName: "totalSupplyOf",
    args: hasDataSource && storeAddress ? [dataSourceAddress as `0x${string}`] : undefined,
    chainId: targetChainId,
    query: {
      enabled: hasDataSource && !!storeAddress,
    },
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
