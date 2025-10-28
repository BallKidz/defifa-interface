import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";
import { BigNumber } from "ethers";
import { useTokenRedemptionWeight } from "./useTokenRedemptionWeight";

export function useTokenRedemptionValue({
  dataSource,
  tokenId,
  amountRedeemed,
  overflow,
}: {
  dataSource: string | undefined;
  tokenId: string;
  overflow: BigNumber;
  amountRedeemed: BigNumber;
}) {
  const { data: redemptionWeight } = useTokenRedemptionWeight(
    dataSource,
    tokenId
  );

  // clone of contract algo
  // https://github.com/BallKidz/defifa-collection-deployer/blob/main/contracts/DefifaDelegate.sol#L454-L456
  const overflowBN = BigNumber.from(overflow || 0);
  const amountRedeemedBN = BigNumber.from(amountRedeemed || 0);
  
  const result = overflowBN
    .add(amountRedeemedBN)
    .mul(redemptionWeight ?? BigNumber.from(0))
    .div(TOTAL_REDEMPTION_WEIGHT);

  console.log("🔥 useTokenRedemptionValue calculation", {
    tokenId,
    dataSource,
    overflow: overflow?.toString(),
    amountRedeemed: amountRedeemed?.toString(),
    redemptionWeight: redemptionWeight?.toString(),
    TOTAL_REDEMPTION_WEIGHT: TOTAL_REDEMPTION_WEIGHT.toString(),
    totalPool: overflowBN.add(amountRedeemedBN).toString(),
    numerator: overflowBN.add(amountRedeemedBN).mul(redemptionWeight ?? BigNumber.from(0)).toString(),
    result: result?.toString(),
    resultInWei: result ? result.toString() : "0",
    resultInEth: result ? (parseFloat(result.toString()) / 1e18).toFixed(10) : "0"
  });

  return result;
}
