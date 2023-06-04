import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";

/**
 * Return the redemption weight for a given percentage.
 * @param percentage a number between 0 to 100.
 * @returns redemption weight.
 */
export function percentageToRedemptionWeight(percentage: number) {
  return percentage === 0 ? 0 : (percentage / 100) * TOTAL_REDEMPTION_WEIGHT;
}

/**
 * Return the redemption weight for a given percentage.
 * @param redemptionWeight a number between 0 and TOTAL_REDEMPTION_WEIGHT.
 * @returns percentage, number between 0 and 100.
 */
export function redemptionWeightToPercentage(redemptionWeight: number) {
  return redemptionWeight === 0
    ? 0
    : (redemptionWeight / TOTAL_REDEMPTION_WEIGHT) * 100;
}
