import { constants } from "ethers";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { JB721Tier } from "types/juicebox";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Abi } from "viem";

export function useTiersOf(dataSourceAddress: string | undefined, chainIdOverride?: number) {
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

  console.log(`useTiersOf - store address for ${dataSourceAddress}:`, storeAddress);

  // Try the batch tiersOf function first
  const batchRes = useReadContract({
    address: (storeAddress?.toString() ?? "") as `0x${string}`,
    abi: chainData.JBTiered721DelegateStore.interface as Abi,
    functionName: "tiersOf",
    args: hasDataSource && storeAddress ? [dataSourceAddress as `0x${string}`, [], true, 0, 32] : undefined,
    chainId: targetChainId,
    query: {
      enabled: hasDataSource && !!storeAddress,
    },
  });

  // If batch fails, try fetching individual tiers using tierOf (singular)
  // Most Defifa games have 3-10 tiers, so let's query up to 32
  const [manualTiers, setManualTiers] = useState<JB721Tier[] | undefined>(undefined);
  const [isManualLoading, setIsManualLoading] = useState(false);

  useEffect(() => {
    if (batchRes.error && storeAddress && dataSourceAddress && !isManualLoading) {
      console.log("useTiersOf: batch query failed, trying individual tier queries...");
      setIsManualLoading(true);
      
      // This is a fallback - we'll need to implement individual tier fetching
      // For now, return empty to avoid infinite errors
      setManualTiers([]);
      setIsManualLoading(false);
    }
  }, [batchRes.error, storeAddress, dataSourceAddress, isManualLoading]);

  if (batchRes.error) {
    console.error(`useTiersOf batch error for dataSource ${dataSourceAddress}:`, batchRes.error);
    console.log("useTiersOf: falling back to manual tier fetching (not yet implemented)");
  }

  console.log(`useTiersOf(${dataSourceAddress}):`, {
    storeAddress: storeAddress?.toString(),
    chainId: targetChainId,
    hasDataSource,
    enabled: hasDataSource && !!storeAddress,
    data: batchRes.data || manualTiers,
    error: batchRes.error,
    isLoading: batchRes.isLoading || isManualLoading,
  });

  return {
    ...batchRes,
    data: (batchRes.data || manualTiers) as unknown as JB721Tier[] | undefined,
    isLoading: batchRes.isLoading || isManualLoading,
  };
}
