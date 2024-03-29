import axios from "axios";
import { BigNumber } from "ethers";
import { useQuery } from "react-query";
import { DefifaTier } from "types/defifa";
import { JB721Tier } from "types/juicebox";
import { cidFromIpfsUri, getIpfsUrl } from "utils/ipfs";

export const ONE_BILLION = 1_000_000_000;
export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1;

async function fetchDefifaTier({
  tier,
}: {
  tier: JB721Tier;
}): Promise<DefifaTier | undefined> {
  const url = tier.resolvedUri;
  if (!url) return;

  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber();

  return {
    id: tier.id.toNumber(),
    description: "needs a description",
    teamName: "needs a name",
    teamImage: getIpfsUrl(cidFromIpfsUri(url)),
    maxSupply: maxSupply,
    price: tier.price,
    remainingQuantity: tier.remainingQuantity?.toNumber() ?? maxSupply,
    minted: maxSupply - (tier.remainingQuantity?.toNumber() ?? 0),
    initialQuantity: tier.initialQuantity.toNumber(),
  };
}

async function fetchSVGDefifaTier({
  tier,
}: {
  tier: JB721Tier;
}): Promise<DefifaTier | undefined> {
  const url = tier.resolvedUri;
  if (!url) return;

  const response = await axios.get(url);

  const svgRewardTier = response.data;
  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber();

  return {
    id: tier.id.toNumber(),
    description: svgRewardTier.description,
    teamName: svgRewardTier.name,
    teamImage: svgRewardTier.image,
    maxSupply: maxSupply,
    price: tier.price,
    remainingQuantity: tier.remainingQuantity?.toNumber() ?? maxSupply,
    minted: maxSupply - (tier.remainingQuantity?.toNumber() ?? 0),
    initialQuantity: tier.initialQuantity.toNumber(),
  };
}

export function useDefifaTiers(tiers: JB721Tier[]) {
  return useQuery(
    "nft-rewards",
    async () => {
      if (!tiers?.length) {
        return;
      }

      const defifaTiers = await Promise.all(
        tiers.map((tier) => {
          if (
            tier.encodedIPFSUri ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            return fetchSVGDefifaTier({
              tier,
            });
          } else {
            return fetchDefifaTier({
              tier,
            });
          }
        })
      );

      return defifaTiers.filter(
        (tier) => typeof tier !== "undefined"
      ) as DefifaTier[];
    },
    { enabled: Boolean(tiers?.length) }
  );
}
