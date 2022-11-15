import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { DEFAULT_NFT_MAX_SUPPLY } from "../NftRewards";
import { useNftRewardTiersOf } from "./NftRewardsTiers";
import { useProjectCurrentFundingCycle } from "./ProjectCurrentFundingCycle";

export function useAttestationPower(id: number, mintsHeldFromTier: number) {
  const { data } = useProjectCurrentFundingCycle();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const [attestationPower, setAttestationPower] = useState<string>("");

  useEffect(() => {
    if (!tiers) return;
    const tier = tiers.find((t) => t.id.toNumber() == id);

    const maxSupply = tier.initialQuantity.eq(
      BigNumber.from(DEFAULT_NFT_MAX_SUPPLY)
    )
      ? DEFAULT_NFT_MAX_SUPPLY
      : tier.initialQuantity.toNumber();

    const totalMints = maxSupply - tier.remainingQuantity?.toNumber();

    setAttestationPower(
      ((100 / 32 / totalMints) * mintsHeldFromTier).toFixed(2)
    );
  }, [id, mintsHeldFromTier, tiers]);

  return attestationPower;
}
