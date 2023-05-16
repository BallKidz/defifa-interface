// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)

import { useQuery, UseQueryResult } from "react-query";
import {
  cidFromIpfsUri,
  decodeEncodedIPFSUri,
  getIpfsUrl,
} from "../utils/ipfs";

import axios from "axios";
import { Result } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export const ONE_BILLION = 1_000_000_000;
export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1;

async function getRewardTierFromIPFS({
  tier,
  index,
}: {
  tier: Result;
  index: number;
}): Promise<any> {
  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber();

  return {
    id: tier.id.toNumber(),
    description: "needs a description",
    teamName: "needs a name",
    teamImage: getIpfsUrl(cidFromIpfsUri(tier.resolvedUri)),
    maxSupply: maxSupply,
    remainingQuantity: tier.remainingQuantity?.toNumber() ?? maxSupply,
    minted: maxSupply - tier.remainingQuantity?.toNumber(),
  };
}

async function getRewardTierFromSVG({
  tier,
  index,
}: {
  tier: Result;
  index: number;
}): Promise<any> {
  const url = tier.resolvedUri;
  const response = await axios.get(url);

  console.log({ tier });

  const ipfsRewardTier: any = response.data;
  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber();
  return {
    id: tier.id.toNumber(),
    description: ipfsRewardTier.description,
    teamName: ipfsRewardTier.name,
    teamImage: ipfsRewardTier.image,
    maxSupply: maxSupply,
    remainingQuantity: tier.remainingQuantity?.toNumber() ?? maxSupply,
    minted: maxSupply - tier.remainingQuantity?.toNumber(),
  };
}

// Returns an array of NftRewardTiers
export default function useNftRewards(tiers: Result): UseQueryResult<Result> {
  return useQuery(
    "nft-rewards",
    async () => {
      if (!tiers?.length) {
        return null;
      }

      return await Promise.all(
        tiers.map((tier, index) => {
          if (
            tier.encodedIPFSUri ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            return getRewardTierFromSVG({
              tier,
              index,
            });
          } else {
            return getRewardTierFromIPFS({
              tier,
              index,
            });
          }
        })
      );
    },
    { enabled: Boolean(tiers?.length) }
  );
}
