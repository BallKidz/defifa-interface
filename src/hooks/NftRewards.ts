// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)

import { useQuery, UseQueryResult } from "react-query";
import {
  decodeEncodedIPFSUri,
  getIpfsUrl,
  restrictedIpfsUrl,
} from "../utils/ipfs";

import axios from "axios";
import { Result } from "ethers/lib/utils";
import { cidFromIpfsUri } from "../utils/cid";
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
  const decodedIPFSURI = decodeEncodedIPFSUri(tier.encodedIPFSUri);

  const url = getIpfsUrl(decodedIPFSURI);

  const response = await axios.get(url);

  const ipfsRewardTier: any = response.data;
  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber();

  return {
    id: ipfsRewardTier.identifier,
    description: ipfsRewardTier.description,
    teamName: ipfsRewardTier.attributes[0].value,
    teamImage: getIpfsUrl(cidFromIpfsUri(ipfsRewardTier.image)),
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
        return;
      }

      return await Promise.all(
        tiers.map((tier, index) =>
          getRewardTierFromIPFS({
            tier,
            index,
          })
        )
      );
    },
    { enabled: Boolean(tiers?.length) }
  );
}
