import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import round from "lodash/round";

export const WAD_DECIMALS = 18;

export const parseWad = (value?: BigNumberish) =>
  parseUnits(value?.toString() || "0", WAD_DECIMALS);
