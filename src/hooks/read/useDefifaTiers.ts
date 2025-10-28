import { useReadContract } from "wagmi";
import { Abi } from "viem";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { JB721Tier } from "types/juicebox";

/**
 * Hook to fetch Defifa v5 tiers using the efficient batch tiersOf function.
 * 
 * This hook uses the batch tiersOf function to fetch all tiers at once.
 * Tier names are fetched separately from the DefifaDelegate contract.
 * 
 * The returned data is then processed by the useDefifaTiers hook in hooks/useDefifaTiers.ts
 * to transform it into UI-friendly DefifaTier[] format.
 */
export function useDefifaTiers(
  delegateAddress: string | undefined,
  chainIdOverride?: number
) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  // Get the store address from the delegate
  const { data: storeAddress, error: storeError } = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "store",
    chainId: targetChainId,
    query: {
      enabled: !!delegateAddress,
    },
  });

  // Batch fetch all tiers (without TokenUriResolver since it's missing fonts)
         const { data: rawTiers, error: tiersError, isLoading: tiersLoading } = useReadContract({
    address: storeAddress as `0x${string}`,
    abi: chainData.JBTiered721DelegateStore.interface as Abi,
           functionName: "tiersOf",
           args: delegateAddress && storeAddress ? [
             delegateAddress as `0x${string}`, 
             [], // categoryIds - empty array to get all tiers
             false, // includeResolvedUri - false because TokenUriResolver is missing fonts
             0,   // sortDirection - 0 for ascending
             48   // maxReturnedTiers - support up to 48 tiers
           ] : undefined,
    chainId: targetChainId,
    query: {
      enabled: !!storeAddress && !!delegateAddress,
    },
  });

  const tierCount = rawTiers ? (rawTiers as any[]).length : 0;

  // Fetch tier names for up to 10 tiers (we call hooks unconditionally, enable based on tierCount)
  const tierName1 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [1n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 1 },
  });

  const tierName2 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [2n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 2 },
  });

  const tierName3 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [3n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 3 },
  });

  const tierName4 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [4n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 4 },
  });

  const tierName5 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [5n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 5 },
  });

  const tierName6 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [6n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 6 },
  });

  const tierName7 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [7n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 7 },
  });

  const tierName8 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [8n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 8 },
  });

  const tierName9 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [9n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 9 },
  });

  const tierName10 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [10n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 10 },
  });

  const tierName11 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [11n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 11 },
  });

  const tierName12 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [12n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 12 },
  });

  const tierName13 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [13n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 13 },
  });

  const tierName14 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [14n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 14 },
  });

  const tierName15 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [15n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 15 },
  });

  const tierName16 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [16n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 16 },
  });

  const tierName17 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [17n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 17 },
  });

  const tierName18 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [18n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 18 },
  });

  const tierName19 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [19n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 19 },
  });

  const tierName20 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [20n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 20 },
  });

  const tierName21 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [21n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 21 },
  });

  const tierName22 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [22n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 22 },
  });

  const tierName23 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [23n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 23 },
  });

  const tierName24 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [24n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 24 },
  });

  const tierName25 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [25n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 25 },
  });

  const tierName26 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [26n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 26 },
  });

  const tierName27 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [27n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 27 },
  });

  const tierName28 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [28n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 28 },
  });

  const tierName29 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [29n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 29 },
  });

  const tierName30 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [30n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 30 },
  });

  const tierName31 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [31n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 31 },
  });

  const tierName32 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [32n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 32 },
  });

  const tierName33 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [33n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 33 },
  });

  const tierName34 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [34n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 34 },
  });

  const tierName35 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [35n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 35 },
  });

  const tierName36 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [36n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 36 },
  });

  const tierName37 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [37n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 37 },
  });

  const tierName38 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [38n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 38 },
  });

  const tierName39 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [39n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 39 },
  });

  const tierName40 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [40n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 40 },
  });

  const tierName41 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [41n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 41 },
  });

  const tierName42 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [42n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 42 },
  });

  const tierName43 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [43n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 43 },
  });

  const tierName44 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [44n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 44 },
  });

  const tierName45 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [45n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 45 },
  });

  const tierName46 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [46n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 46 },
  });

  const tierName47 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [47n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 47 },
  });

  const tierName48 = useReadContract({
    address: delegateAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tierNameOf",
    args: [48n],
    chainId: targetChainId,
    query: { enabled: !!delegateAddress && tierCount >= 48 },
  });

  const tierNameQueries = [
    tierName1, tierName2, tierName3, tierName4, tierName5,
    tierName6, tierName7, tierName8, tierName9, tierName10,
    tierName11, tierName12, tierName13, tierName14, tierName15,
    tierName16, tierName17, tierName18, tierName19, tierName20,
    tierName21, tierName22, tierName23, tierName24, tierName25,
    tierName26, tierName27, tierName28, tierName29, tierName30,
    tierName31, tierName32, tierName33, tierName34, tierName35,
    tierName36, tierName37, tierName38, tierName39, tierName40,
    tierName41, tierName42, tierName43, tierName44, tierName45,
    tierName46, tierName47, tierName48
  ];

  // Calculate loading state
  const tierNameLoading = tierNameQueries.some(q => q.isLoading);
  const isLoading = tiersLoading || tierNameLoading;

  // Combine tier data with names
  const tiers = rawTiers ? (rawTiers as any[]).map((tier, index) => {
    const tierName = tierNameQueries[index]?.data as string;
    return {
      ...tier,
      id: BigInt(index + 1),
      name: tierName || tier.name,
    };
  }) : undefined;

  // Debug logging
  if (storeError) {
    console.error(`useDefifaTiers: Error fetching store address:`, storeError);
  } else if (delegateAddress && storeAddress) {
    console.log(`useDefifaTiers: Store address for ${delegateAddress}: ${storeAddress}`);
  }

  if (tiersError) {
    console.error(`useDefifaTiers: Error fetching tiers for ${delegateAddress}:`, tiersError);
  } else if (tiers) {
    console.log(`useDefifaTiers: Found ${tiers.length} tiers for ${delegateAddress}`);
    tiers.forEach((tier, index) => {
      console.log(`  Tier ${index + 1}: name="${tier.name || 'N/A'}"`);
    });
  }

  return {
    data: tiers as JB721Tier[] | undefined,
    isLoading,
    tierCount: tiers ? tiers.length : 0,
    error: tiersError || storeError,
  };
}
