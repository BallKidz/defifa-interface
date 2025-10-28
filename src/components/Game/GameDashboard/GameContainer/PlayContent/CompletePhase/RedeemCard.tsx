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
        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-400">
            {tokenIds.length} NFT{tokenIds.length > 1 ? "s" : ""}
          </div>
          {tokenRedemptionValue && !tokenRedemptionValue.isZero() ? (
            <div className="flex items-center gap-2">
              <EthAmount amountWei={tokenRedemptionValue} className="text-sm" />
              <span className="text-xs text-neutral-400">each</span>
            </div>
          ) : (
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <span className="w-3 h-3 bg-neutral-600 rounded-full"></span>
              <span>No value (0% in scorecard)</span>
            </div>
          )}
        </div>
      }
      selectionLimit={tokenIds.length}
      {...props}
    />
  );
}
