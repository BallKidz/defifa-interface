import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";
import { BigNumber } from "ethers";
import { useTokenRedemptionWeight } from "./useTokenRedemptionWeight";
import { useGameContext } from "contexts/GameContext";
import { tokenNumberToTierId } from "utils/defifa";

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
  const { nfts } = useGameContext();
  const tierId = tokenNumberToTierId(tokenId);

  const tierInfo = nfts.tiers?.find((tier) => tier.id === tierId);
  const tierMintedCount = tierInfo?.minted ?? 0;

  const { data: redemptionWeight } = useTokenRedemptionWeight(
    dataSource,
    tokenId
  );

  // clone of contract algo
  // https://github.com/BallKidz/defifa-collection-deployer/blob/main/contracts/DefifaDelegate.sol#L454-L456
  const overflowBN = BigNumber.from(overflow || 0);
  const amountRedeemedBN = BigNumber.from(amountRedeemed || 0);
  const tierTotalValue = overflowBN
    .add(amountRedeemedBN)
    .mul(redemptionWeight ?? BigNumber.from(0))
    .div(TOTAL_REDEMPTION_WEIGHT);

  if (!tierMintedCount) {
    return BigNumber.from(0);
  }

  return tierTotalValue.div(BigNumber.from(tierMintedCount));
}
