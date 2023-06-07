import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";
import { BigNumber } from "ethers";

/**
 * Return the redemption weight for a given percentage.
 * @param percentage a number between 0 to 100.
 * @returns redemption weight.
 */
export function percentageToRedemptionWeight(percentage: number): BigNumber {
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
  redemptionWeight: BigNumber
): number {
  return redemptionWeight.eq(0)
    ? 0
    : redemptionWeight.mul(100).div(TOTAL_REDEMPTION_WEIGHT).toNumber();
}
