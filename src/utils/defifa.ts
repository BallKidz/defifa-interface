import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";
import { BigNumber, BigNumberish } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";

/**
 * Return the redemption weight for a given percentage.
 * @param percentage a number between 0 to 100.
 * @returns redemption weight.
 */
export function percentageToRedemptionWeight(percentage: number): BigNumber {
  if (percentage === undefined || percentage === null || isNaN(percentage)) {
    return BigNumber.from(0);
  }
  
  return !percentage
    ? BigNumber.from(0)
    : BigNumber.from(percentage).mul(TOTAL_REDEMPTION_WEIGHT).div(100);
}

/**
 * Return the redemption weight for a given percentage.
 * @param redemptionWeight a number between 0 and TOTAL_REDEMPTION_WEIGHT.
 * @returns percentage, number between 0 and 100.
 */
export function redemptionWeightToPercentage(
  redemptionWeight: BigNumberish
): number {
  const weight = BigInt(redemptionWeight.toString());
  const totalWeight = BigInt(TOTAL_REDEMPTION_WEIGHT.toString());
  
  return weight === 0n
    ? 0
    : Number((weight * 100n) / totalWeight);
}

export function tokenNumberToTierId(tokenNumber: string) {
  const tierId = Math.floor(parseInt(tokenNumber) / DEFAULT_NFT_MAX_SUPPLY);

  return tierId;
}
