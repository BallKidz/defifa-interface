import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useTokenRedemptionValue } from "hooks/read/useTokenRedemptionValue";

export function RedeemCard({
  tokenIds,
  overflow,
  amountRedeemed,
  ...props
}: {
  overflow: BigNumber;
  amountRedeemed: BigNumber;
  tokenIds: string[];
} & Omit<PickCardProps, "extra" | "selectionLimit">) {
  const { currentFundingCycle } = useGameContext();
  const tokenRedemptionValue = useTokenRedemptionValue({
    dataSource: currentFundingCycle?.metadata.dataSource,
    tokenId: tokenIds[0], // choose any token to source redemption value. all tokens in the same tier should be equivalent value.
    overflow,
    amountRedeemed,
  });

  const redemptionValueText = formatEther(tokenRedemptionValue);

  return (
    <PickCard
      extra={<>{redemptionValueText} ETH each</>}
      selectionLimit={tokenIds.length}
      {...props}
    />
  );
}
