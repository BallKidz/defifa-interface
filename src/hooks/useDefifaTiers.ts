import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DefifaTier } from "types/defifa";
import { JB721Tier } from "types/juicebox";
import { cidFromIpfsUri, getIpfsUrl } from "utils/ipfs";
import { parseTierMetadata, ParsedTierMetadata } from "utils/tierMetadata";
import { useReadContracts } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { Abi } from "viem";

export const ONE_BILLION = 1_000_000_000;
export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1;

export function useDefifaTiers(tiers: JB721Tier[], nftAddress?: string) {
  const { chainData } = useChainData();
  
  // Create a serializable key from tier IDs AND names (so query re-runs when names change)
  const tierIds = tiers?.map(t => t.id?.toString()).join(',') || '';
  const tierNames = tiers?.map(t => (t as any).name || '').join(',') || '';
  
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

  console.log("🔍 useDefifaTiers tokenURI calls:", {
    nftAddress,
    tiersCount: tiers?.length,
    tokenUris: tokenUris?.map((r, i) => ({
      tierId: tiers[i]?.id,
      tokenId: Number(tiers[i]?.id) * ONE_BILLION,
      status: r.status,
      result: r.result,
      error: r.error
    }))
  });
  
  return useQuery({
    queryKey: ["nft-rewards", nftAddress, tierIds, tierNames],
    queryFn: async () => {
      console.log("🔍 useDefifaTiers transformation starting");
      
      if (!tiers?.length || !tokenUris?.length) {
        console.log("🔍 No tiers or tokenURIs available");
        return;
      }

      const defifaTiers = await Promise.all(
        tiers.map(async (tier, index) => {
          const tokenUriResult = tokenUris[index];
          const initialQty = (tier as any).initialSupply ?? tier.initialQuantity ?? BigInt(DEFAULT_NFT_MAX_SUPPLY);
          const remainingQty = (tier as any).remainingSupply ?? tier.remainingQuantity ?? initialQty;
          const maxSupply = initialQty === BigInt(DEFAULT_NFT_MAX_SUPPLY) ? DEFAULT_NFT_MAX_SUPPLY : Number(initialQty);

          // If tokenURI call succeeded, fetch and parse the metadata
          if (tokenUriResult?.status === "success" && tokenUriResult.result) {
            try {
              const tokenUri = tokenUriResult.result as string;
              console.log(`🔍 Tier ${tier.id} tokenURI:`, tokenUri);
              
              // Check if this is a data URI (embedded SVG or image)
              if (tokenUri.startsWith("data:")) {
                console.log(`🔍 Tier ${tier.id} has data URI (embedded content)`);
                return {
                  id: Number(tier.id),
                  description: (tier as any).name || `Tier ${Number(tier.id)}`,
                  teamName: (tier as any).name || `Tier ${Number(tier.id)}`,
                  teamImage: tokenUri, // Use data URI directly
                  maxSupply: maxSupply,
                  price: BigInt(tier.price.toString()),
                  remainingQuantity: Number(remainingQty),
                  minted: maxSupply - Number(remainingQty),
                  initialQuantity: Number(initialQty),
                };
              }
              
              // Convert IPFS URI to gateway URL
              const metadataUrl = tokenUri.startsWith("ipfs://") 
                ? getIpfsUrl(cidFromIpfsUri(tokenUri))
                : tokenUri;
              
              console.log(`🔍 Fetching from:`, metadataUrl);
              
              // Try to parse as NFT metadata JSON first
              try {
                const metadata = await parseTierMetadata(tokenUri);
                
                if (metadata) {
                  console.log(`🔍 Tier ${tier.id} parsed metadata:`, { 
                    tierName: metadata.tierName, 
                    gameName: metadata.gameName,
                    hasImage: !!metadata.image,
                    description: metadata.description 
                  });
                  
                  const teamImage = metadata.image 
                    ? (metadata.image.startsWith("ipfs://") 
                        ? getIpfsUrl(cidFromIpfsUri(metadata.image))
                        : metadata.image)
                    : "";
                  
                  return {
                    id: Number(tier.id),
                    description: metadata.description || (tier as any).name,
                    teamName: metadata.tierName || (tier as any).name,
                    teamImage: teamImage,
                    maxSupply: maxSupply,
                    price: BigInt(tier.price.toString()),
                    remainingQuantity: Number(remainingQty),
                    minted: maxSupply - Number(remainingQty),
                    initialQuantity: Number(initialQty),
                  };
                } else {
                  // Failed to parse metadata, try fallback JSON parsing
                  const response = await axios.get(metadataUrl, {
                    headers: { 'Accept': 'application/json' }
                  });
                  const fallbackMetadata = response.data;
                  
                        if (fallbackMetadata && typeof fallbackMetadata === 'object' && (fallbackMetadata.name || fallbackMetadata.image || fallbackMetadata.description)) {
                          console.log(`🔍 Tier ${tier.id} fallback metadata:`, { name: fallbackMetadata.name, hasImage: !!fallbackMetadata.image });
                          
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
                            id: Number(tier.id),
                            description: fallbackMetadata.description || (tier as any).name,
                            teamName: tierName || (tier as any).name,
                            teamImage: teamImage,
                            maxSupply: maxSupply,
                            price: BigInt(tier.price.toString()),
                            remainingQuantity: Number(remainingQty),
                            minted: maxSupply - Number(remainingQty),
                            initialQuantity: Number(initialQty),
                          };
                        } else {
                    // Not proper metadata JSON, treat tokenURI as direct image URL
                    console.log(`🔍 Tier ${tier.id} tokenURI points directly to image`);
                    return {
                      id: Number(tier.id),
                      description: (tier as any).name,
                      teamName: (tier as any).name,
                      teamImage: metadataUrl, // Use the URL directly as image
                      maxSupply: maxSupply,
                      price: BigInt(tier.price.toString()),
                      remainingQuantity: Number(remainingQty),
                      minted: maxSupply - Number(remainingQty),
                      initialQuantity: Number(initialQty),
                    };
                  }
                }
              } catch (error) {
                // Failed to parse as JSON, assume it's a direct image URL
                console.log(`🔍 Tier ${tier.id} tokenURI is direct image (not JSON):`, error);
                return {
                  id: Number(tier.id),
                  description: (tier as any).name,
                  teamName: (tier as any).name,
                  teamImage: metadataUrl,
                  maxSupply: maxSupply,
                  price: BigInt(tier.price.toString()),
                  remainingQuantity: Number(remainingQty),
                  minted: maxSupply - Number(remainingQty),
                  initialQuantity: Number(initialQty),
                };
              }
            } catch (error) {
              console.error(`❌ Failed to fetch metadata for tier ${tier.id}:`, error);
              // Fall through to use tier name only
            }
          }

          // Fallback: use tier name only
          return {
            id: Number(tier.id),
            description: (tier as any).name,
            teamName: (tier as any).name,
            teamImage: "",
            maxSupply: maxSupply,
            price: BigInt(tier.price.toString()),
            remainingQuantity: Number(remainingQty),
            minted: maxSupply - Number(remainingQty),
            initialQuantity: Number(initialQty),
          };
        })
      );

      const filteredTiers = defifaTiers.filter(
        (tier) => typeof tier !== "undefined"
      ) as DefifaTier[];

      console.log("🔍 Final transformed tiers:", filteredTiers);
      return filteredTiers;
    },
    enabled: Boolean(tiers?.length && tokenUris && !tokenUrisLoading),
    // Simple 5-second polling - no complex caching
    refetchInterval: 5 * 1000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
