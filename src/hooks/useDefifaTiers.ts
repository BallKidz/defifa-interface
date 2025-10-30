import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DefifaTier } from "types/defifa";
import { JB721Tier } from "types/juicebox";
import { cidFromIpfsUri, getIpfsUrl } from "utils/ipfs";
import { parseTierMetadata, ParsedTierMetadata } from "utils/tierMetadata";
import { useReadContracts, useReadContract } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { Abi } from "viem";
import { useGameContext } from "contexts/GameContext";
import { useGameMints } from "components/Game/GameDashboard/GameContainer/PlayContent/MintPhase/useGameMints";

export const ONE_BILLION = 1_000_000_000;
export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1;

export function useDefifaTiers(tiers: JB721Tier[], nftAddress?: string, gameId?: number) {
  const { chainData } = useChainData();
  
  
  // Create a serializable key from tier IDs AND names (so query re-runs when names change)
  const tierIds = tiers?.map(t => t.id?.toString()).join(',') || '';
  const tierNames = tiers?.map(t => (t as any).name || '').join(',') || '';
  
  // Fetch outstanding mints from subgraph to calculate accurate minted counts
  const { data: gameMints, isLoading: gameMintsLoading, error: gameMintsError } = useGameMints(gameId || 0);
  
  
  
  // Calculate outstanding mints per tier (mints - refunds)
  const outstandingMintsPerTier = gameMints?.reduce((acc: { [tierId: number]: number }, token) => {
    const tierId = Math.floor(parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY);
    acc[tierId] = (acc[tierId] || 0) + 1;
    return acc;
  }, {}) || {};
  
  
  // For each tier, calculate the token ID (tierNumber × 1,000,000,000)
  // Use this to call tokenURI on the NFT contract
  const tokenUriCalls = tiers?.map((tier) => ({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as any,
    functionName: "tokenURI" as const,
    args: [BigInt(Number(tier.id) * ONE_BILLION)],
    chainId: chainData.chainId,
  })) || [];

  // Fetch all tokenURIs in parallel
  const { data: tokenUris, isLoading: tokenUrisLoading } = useReadContracts({
    contracts: tokenUriCalls,
    query: {
      enabled: Boolean(tiers?.length && nftAddress),
    },
  });

  
  return useQuery({
    queryKey: ["nft-rewards", nftAddress, tierIds, tierNames, gameMints?.length || 0],
    queryFn: async () => {
      
      if (!tiers?.length || !tokenUris?.length) {
        return;
      }

      const defifaTiers = await Promise.all(
        tiers.map(async (tier, index) => {
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

          // If tokenURI call succeeded, fetch and parse the metadata
          if (tokenUriResult?.status === "success" && tokenUriResult.result) {
            try {
              const tokenUri = tokenUriResult.result as string;
              
              // Check if this is a data URI (embedded SVG or image)
              if (tokenUri.startsWith("data:")) {
                return {
                  ...baseTier,
                  description: (tier as any).name || `Tier ${Number(tier.id)}`,
                  teamName: (tier as any).name || `Tier ${Number(tier.id)}`,
                  teamImage: tokenUri, // Use data URI directly
                };
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

      const filteredTiers = defifaTiers.filter(
        (tier) => typeof tier !== "undefined"
      ) as DefifaTier[];

      return filteredTiers;
    },
    enabled: Boolean(tiers?.length && tokenUris && !tokenUrisLoading),
    // Simple 5-second polling - no complex caching
    refetchInterval: 10 * 1000, // 30 seconds to reduce RPC load
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
