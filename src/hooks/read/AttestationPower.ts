import { useGameContext } from "contexts/GameContext";
import { useEffect, useState } from "react";
import { DEFAULT_NFT_MAX_SUPPLY } from "../NftRewards";

export function useAttestationPower(tierId: number, mintsHeldFromTier: number) {
  const {
    nfts: { tiers },
  } = useGameContext();
  const [attestationPower, setAttestationPower] = useState<string>("");

  useEffect(() => {
    if (!tiers) return;

    const tier = tiers.find((t) => t?.id == tierId);
    if (!tier) return;

    const maxSupply =
      tier?.initialQuantity === DEFAULT_NFT_MAX_SUPPLY
        ? DEFAULT_NFT_MAX_SUPPLY
        : tier.initialQuantity;

    const totalMints = maxSupply - tier?.remainingQuantity;
    const attestationPower = (100 / 32 / totalMints) * mintsHeldFromTier;
    const attestationPowerPercentage =
      attestationPower < 1
        ? attestationPower.toFixed(2)
        : attestationPower.toFixed();
    setAttestationPower(attestationPowerPercentage);
  }, [tierId, mintsHeldFromTier, tiers]);

  return attestationPower;
}
