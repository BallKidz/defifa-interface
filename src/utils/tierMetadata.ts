import { uploadJsonToIpfs } from "lib/uploadToIPFS";
import { getIpfsUrl } from "utils/ipfs";

export interface TierMetadata {
  name: string;
  description: string;
  image: string;
  external_link?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  [key: string]: unknown;
}

export interface ParsedTierMetadata {
  tierName: string;
  gameName: string;
  description: string;
  image: string;
  external_link?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Creates NFT metadata JSON for a tier and uploads it to IPFS
 * @param tierName - The name of the tier (e.g., "Alpha", "Beta", "Gamma")
 * @param imageIpfsUri - The IPFS URI of the tier image (e.g., "ipfs://QmHash...")
 * @param gameName - The name of the game (e.g., "Premier League 2025")
 * @param gameId - The game ID for external link
 * @param chainId - The chain ID for external link
 * @returns Promise<string> - The IPFS URI of the metadata JSON
 */
export async function createTierMetadata(
  tierName: string,
  imageIpfsUri: string,
  gameName: string,
  gameId: number,
  chainId: number
): Promise<string> {
  const metadata: TierMetadata = {
    name: `${gameName} — ${tierName}`,
    description: `NFT for ${tierName} in ${gameName} prediction game may have redeemable value.`,
    image: imageIpfsUri,
    external_link: getIpfsUrl(imageIpfsUri),
    attributes: [
      {
        trait_type: "Tier",
        value: tierName
      },
      {
        trait_type: "Game",
        value: gameName
      },
      {
        trait_type: "Game ID",
        value: gameId
      }
    ]
  };

  try {
    const metadataCid = await uploadJsonToIpfs(metadata);
    if (!metadataCid) {
      throw new Error("Failed to upload metadata to IPFS");
    }
    
    return `ipfs://${metadataCid}`;
  } catch (error) {
    console.error("Error creating tier metadata:", error);
    throw error;
  }
}

/**
 * Parses NFT metadata JSON from IPFS URI
 * @param metadataIpfsUri - The IPFS URI of the metadata JSON
 * @returns Promise<ParsedTierMetadata | null> - The parsed metadata with separate tier and game names, or null if failed
 */
export async function parseTierMetadata(metadataIpfsUri: string): Promise<ParsedTierMetadata | null> {
  try {
    // Convert IPFS URI to gateway URL
    const cid = metadataIpfsUri.replace("ipfs://", "");
    const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;
    
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const metadata = await response.json() as TierMetadata;
    
    // Extract tier name and game name from the full name
    // Format is typically "Game Name — Tier Name"
    const fullName = metadata.name;
    const separator = " — ";
    let tierName = fullName;
    let gameName = "";
    
    if (fullName.includes(separator)) {
      const parts = fullName.split(separator);
      gameName = parts[0]?.trim() || "";
      tierName = parts[1]?.trim() || fullName;
    }
    
    // If no separator found, try to extract from attributes
    if (!fullName.includes(separator) && metadata.attributes) {
      const tierAttr = metadata.attributes.find(attr => attr.trait_type === "Tier");
      const gameAttr = metadata.attributes.find(attr => attr.trait_type === "Game");
      
      if (tierAttr) {
        tierName = String(tierAttr.value);
      }
      if (gameAttr) {
        gameName = String(gameAttr.value);
      }
    }
    
    return {
      tierName,
      gameName,
      description: metadata.description,
      image: metadata.image,
      external_link: metadata.external_link,
      attributes: metadata.attributes,
    };
  } catch (error) {
    console.error("Error parsing tier metadata:", error);
    return null;
  }
}
