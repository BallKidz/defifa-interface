import { BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export const WAD_DECIMALS = 18;

export const parseWad = (value?: BigNumberish) =>
  parseUnits(value?.toString() || "0", WAD_DECIMALS);

export const fromWad = (wadValue?: BigNumberish) => {
  const result = formatUnits(wadValue ?? "0");
  return result.substring(result.length - 2) === ".0"
    ? result.substring(0, result.length - 2)
    : result;
};
