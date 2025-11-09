import { useReadContract, useReadContracts } from "wagmi";
import { Abi } from "viem";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { JB721Tier } from "types/juicebox";
import { DefifaTier } from "types/defifa";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { cidFromIpfsUri, getIpfsUrl } from "utils/ipfs";
import { parseTierMetadata } from "utils/tierMetadata";
import { useGameMints } from "components/Game/GameDashboard/GameContainer/PlayContent/MintPhase/useGameMints";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { Buffer } from "buffer";

export const ONE_BILLION = 1_000_000_000;
export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1;

/**
 * Hook to fetch Defifa v5 tiers and transform them into UI-friendly DefifaTier[] format.
 * 
 * This hook:
 * 1. Fetches raw tiers from the store using tiersOf
 * 2. Fetches tier names from DefifaDelegate
 * 3. Fetches tokenURI metadata for images/SVGs
 * 4. Fetches game mints from subgraph for accurate mint counts
 * 5. Transforms everything into DefifaTier[] format
 */
export function useDefifaTiers(
  delegateAddress: string | undefined,
  chainIdOverride?: number,
  gameId?: number,
  currentPhase?: DefifaGamePhase
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

  // Batch fetch all tier names using useReadContracts for efficiency
  const tierNameCalls = useMemo(() => {
    if (!delegateAddress || tierCount === 0) return [];
    
    return Array.from({ length: tierCount }, (_, i) => ({
      address: delegateAddress as `0x${string}`,
      abi: chainData.DefifaDelegate.interface as Abi,
      functionName: "tierNameOf" as const,
      args: [BigInt(i + 1)],
      chainId: targetChainId,
    }));
  }, [delegateAddress, tierCount, chainData.DefifaDelegate.interface, targetChainId]);

  const { data: tierNameResults, isLoading: tierNameLoading } = useReadContracts({
    contracts: tierNameCalls,
    query: {
      enabled: tierNameCalls.length > 0,
    },
  });

  // Combine tier data with names to get JB721Tier[]
  const jbTiers = rawTiers ? (rawTiers as any[]).map((tier, index) => {
    const tierNameResult = tierNameResults?.[index];
    const tierName = tierNameResult?.status === "success" && tierNameResult.result 
      ? (tierNameResult.result as string)
      : undefined;
    return {
      ...tier,
      id: BigInt(index + 1),
      name: tierName || tier.name,
    };
  }) : undefined;

  // Create serializable keys for query dependencies
  const tierIds = jbTiers?.map(t => t.id?.toString()).join(',') || '';
  const tierNames = jbTiers?.map(t => (t as any).name || '').join(',') || '';

  // Fetch outstanding mints from subgraph to calculate accurate minted counts
  const { data: gameMints, isLoading: gameMintsLoading } = useGameMints(gameId || 0, chainIdOverride, {
    currentPhase,
  });

  // Calculate outstanding mints per tier
  const outstandingMintsPerTier = gameMints?.reduce((acc: { [tierId: number]: number }, token) => {
    const tierId = Math.floor(parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY);
    acc[tierId] = (acc[tierId] || 0) + 1;
    return acc;
  }, {}) || {};

  // Batch fetch all tokenURIs for metadata/images
  const tokenUriCalls = useMemo(() => {
    if (!jbTiers?.length || !delegateAddress) return [];
    
    return jbTiers.map((tier) => ({
      address: delegateAddress as `0x${string}`,
      abi: chainData.DefifaDelegate.interface as Abi,
      functionName: "tokenURI" as const,
      args: [BigInt(Number(tier.id) * ONE_BILLION)],
      chainId: targetChainId,
    }));
  }, [jbTiers, delegateAddress, chainData.DefifaDelegate.interface, targetChainId]);

  const { data: tokenUris, isLoading: tokenUrisLoading } = useReadContracts({
    contracts: tokenUriCalls,
    query: {
      enabled: tokenUriCalls.length > 0,
    },
  });

  // Transform to DefifaTier[] using useQuery for async metadata parsing
  // Poll during MINT (for minting updates), SCORING (for pot updates), and COMPLETE (for final pot values)
  const shouldPoll = currentPhase !== undefined
    ? currentPhase === DefifaGamePhase.MINT || 
      currentPhase === DefifaGamePhase.SCORING || 
      currentPhase === DefifaGamePhase.COMPLETE
    : true;

  const { data: defifaTiers, isLoading: metadataLoading } = useQuery({
    queryKey: ["defifa-tiers", delegateAddress, tierIds, tierNames, gameMints?.length || 0, targetChainId],
    queryFn: async () => {
      if (!jbTiers?.length || !tokenUris?.length) {
        return undefined;
      }

      const defifaTiers = await Promise.all(
        jbTiers.map(async (tier, index) => {
          const tokenUriResult = tokenUris[index];
          const initialQty = (tier as any).initialSupply ?? tier.initialQuantity ?? BigInt(DEFAULT_NFT_MAX_SUPPLY);
          const remainingQty = (tier as any).remainingSupply ?? tier.remainingQuantity ?? initialQty;
          const maxSupply = initialQty === BigInt(DEFAULT_NFT_MAX_SUPPLY) ? DEFAULT_NFT_MAX_SUPPLY : Number(initialQty);
          const reserveFrequencyRaw = (tier as any).reserveFrequency;
          const reserveFrequency =
            typeof reserveFrequencyRaw === "number"
              ? reserveFrequencyRaw
              : typeof reserveFrequencyRaw === "bigint"
              ? Number(reserveFrequencyRaw)
              : Number(reserveFrequencyRaw ?? 0);
          const reserveBeneficiaryRaw = (tier as any).reserveBeneficiary;
          const reserveBeneficiary =
            typeof reserveBeneficiaryRaw === "string"
              ? reserveBeneficiaryRaw
              : undefined;
          const mintedCount =
            outstandingMintsPerTier[Number(tier.id)] ??
            (maxSupply - Number(remainingQty));

          const baseTier = {
            id: Number(tier.id),
            maxSupply,
            price: BigInt(tier.price.toString()),
            remainingQuantity: Number(remainingQty),
            minted: mintedCount,
            initialQuantity: Number(initialQty),
            reserveFrequency,
            reserveBeneficiary,
          };
          console.log("tokenUriResult", tokenUriResult);
          // If tokenURI call succeeded, fetch and parse the metadata
          // Note: tokenURI may revert for tokens that have resolver errors eg non font not found onchain
          if (tokenUriResult?.status === "success" && tokenUriResult.result) {
            try {
              const tokenUri = tokenUriResult.result as string;
              
              // Check if this is a data URI (embedded SVG or image)
              if (tokenUri.startsWith("data:")) {
                try {
                  const [, dataPart] = tokenUri.split(",");
                  const isBase64 = tokenUri.includes(";base64,");
                  const jsonString = isBase64
                    ? (typeof globalThis !== "undefined" && typeof globalThis.atob === "function"
                        ? globalThis.atob(dataPart || "")
                        : Buffer.from(dataPart || "", "base64").toString("utf-8"))
                    : decodeURIComponent(dataPart || "");

                  const metadata = JSON.parse(jsonString || "{}") as {
                    name?: string;
                    description?: string;
                    image?: string;
                    [key: string]: unknown;
                  };

                  const teamImageRaw = metadata.image || "";
                  const resolvedImage = teamImageRaw.startsWith("ipfs://")
                    ? getIpfsUrl(cidFromIpfsUri(teamImageRaw))
                    : teamImageRaw;

                  return {
                    ...baseTier,
                    description: metadata.description || (tier as any).name || `Tier ${Number(tier.id)}`,
                    teamName: metadata.name || (tier as any).name || `Tier ${Number(tier.id)}`,
                    teamImage: resolvedImage,
                  };
                } catch (error) {
                  console.error(`❌ Failed to parse data URI metadata for tier ${tier.id}:`, error);
                  return {
                    ...baseTier,
                    description: (tier as any).name || `Tier ${Number(tier.id)}`,
                    teamName: (tier as any).name || `Tier ${Number(tier.id)}`,
                    teamImage: "",
                  };
                }
              }
              
              // Convert IPFS URI to gateway URL
              const metadataUrl = tokenUri.startsWith("ipfs://") 
                ? getIpfsUrl(cidFromIpfsUri(tokenUri))
                : tokenUri;
              
              // Try to parse as NFT metadata JSON first
              try {
                const metadata = await parseTierMetadata(tokenUri);
                
                if (metadata) {
                  const teamImage = metadata.image 
                    ? (metadata.image.startsWith("ipfs://") 
                        ? getIpfsUrl(cidFromIpfsUri(metadata.image))
                        : metadata.image)
                    : "";
                  
                  return {
                    ...baseTier,
                    description: metadata.description || (tier as any).name,
                    teamName: (tier as any).name || metadata.tierName,
                    teamImage: teamImage,
                  };
                } else {
                  // Failed to parse metadata, try fallback JSON parsing
                  const response = await axios.get(metadataUrl, {
                    headers: { 'Accept': 'application/json' }
                  });
                  const fallbackMetadata = response.data;
                  
                  if (fallbackMetadata && typeof fallbackMetadata === 'object' && (fallbackMetadata.name || fallbackMetadata.image || fallbackMetadata.description)) {
                    // Extract tier name from fallback metadata (remove game name prefix if present)
                    let tierName = fallbackMetadata.name || (tier as any).name || `Tier ${Number(tier.id)}`;
                    if (tierName.includes(" — ")) {
                      const parts = tierName.split(" — ");
                      tierName = parts[1]?.trim() || tierName;
                    }
                    
                    const teamImage = fallbackMetadata.image 
                      ? (fallbackMetadata.image.startsWith("ipfs://") 
                          ? getIpfsUrl(cidFromIpfsUri(fallbackMetadata.image))
                          : fallbackMetadata.image)
                      : "";
                    
                    return {
                      ...baseTier,
                      description: fallbackMetadata.description || (tier as any).name,
                      teamName: (tier as any).name || tierName,
                      teamImage: teamImage,
                    };
                  } else {
                    // Not proper metadata JSON, treat tokenURI as direct image URL
                    return {
                      ...baseTier,
                      description: (tier as any).name,
                      teamName: (tier as any).name,
                      teamImage: metadataUrl, // Use the URL directly as image
                    };
                  }
                }
              } catch (error) {
                // Failed to parse as JSON, assume it's a direct image URL
                return {
                  ...baseTier,
                  description: (tier as any).name,
                  teamName: (tier as any).name,
                  teamImage: metadataUrl,
                };
              }
            } catch (error) {
              console.error(`❌ Failed to fetch metadata for tier ${tier.id}:`, error);
              // Fall through to use tier name only
            }
          }

          // Fallback: use tier name only
          return {
            ...baseTier,
            description: (tier as any).name,
            teamName: (tier as any).name,
            teamImage: "",
          };
        })
      );

      return defifaTiers.filter(
        (tier) => typeof tier !== "undefined"
      ) as DefifaTier[];
    },
    enabled: Boolean(jbTiers?.length && tokenUris && !tokenUrisLoading && !gameMintsLoading),
    refetchInterval: shouldPoll ? 10 * 1000 : false,
    refetchIntervalInBackground: shouldPoll ? true : undefined,
    refetchOnWindowFocus: shouldPoll,
    staleTime: shouldPoll ? 0 : 5 * 60 * 1000,
  });

  const isLoading = tiersLoading || tierNameLoading || tokenUrisLoading || gameMintsLoading || metadataLoading;

  // Debug logging
  if (storeError) {
    console.error(`useDefifaTiers: Error fetching store address:`, storeError);
  }

  if (tiersError) {
    console.error(`useDefifaTiers: Error fetching tiers for ${delegateAddress}:`, tiersError);
  } else if (defifaTiers) {
    console.log(`useDefifaTiers: Found ${defifaTiers.length} tiers for ${delegateAddress}`);
  }

  return {
    data: defifaTiers,
    isLoading,
    tierCount: defifaTiers ? defifaTiers.length : 0,
    error: tiersError || storeError,
  };
}
