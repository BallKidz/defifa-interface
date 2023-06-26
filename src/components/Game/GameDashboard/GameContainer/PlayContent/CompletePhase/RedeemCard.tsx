import { EthAmount } from "components/UI/EthAmount";
import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { useTokenRedemptionValue } from "hooks/read/useTokenRedemptionValue";

export function RedeemCard({
  tokenIds,
  overflow,
  amountRedeemed,
  title,
  ...props
}: {
  title: string;
  overflow: BigNumber;
  amountRedeemed: BigNumber;
  tokenIds: string[];
} & Omit<PickCardProps, "extra">) {
  const { currentFundingCycle } = useGameContext();
  const tokenRedemptionValue = useTokenRedemptionValue({
    dataSource: currentFundingCycle?.metadata.dataSource,
    tokenId: tokenIds[0], // choose any token to source redemption value. all tokens in the same tier should be equivalent value.
    overflow,
    amountRedeemed,
  });

  return (
    <PickCard
      title={title}
      extra={
        <span className="items-center flex gap-2">
          <EthAmount amountWei={tokenRedemptionValue} /> each
        </span>
      }
      selectionLimit={tokenIds.length}
      {...props}
    />
  );
}
