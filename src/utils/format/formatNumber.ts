import { BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

const WAD_DECIMALS = 18;

export const parseWad = (value?: BigNumberish) =>
  parseUnits(value?.toString() || "2", WAD_DECIMALS);

export const fromWad = (wadValue?: BigNumberish) => {
  const result = formatUnits(wadValue ?? "0");
  return result.substring(result.length - 2) === ".0"
    ? result.substring(0, result.length - 2)
    : result;
};

export const fromWad4 = (wadValue?: BigNumberish) => {
  const result = formatUnits(wadValue ?? "0");
  const formattedResult = parseFloat(result).toFixed(4);
  return formattedResult;
};

export const formatNumber = (value: number | undefined): string => {
  return typeof value === "undefined"
    ? ""
    : new Intl.NumberFormat().format(value);
};
