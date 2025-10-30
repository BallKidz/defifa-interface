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

  const totalRedemptionValue =
    tokenRedemptionValue && !tokenRedemptionValue.isZero()
      ? tokenRedemptionValue.mul(tokenIds.length)
      : undefined;

  return (
    <PickCard
      title={title}
      extra={
        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-400 uppercase tracking-wide">
            {tokenIds.length} NFT{tokenIds.length > 1 ? "s" : ""} held
          </div>
          {totalRedemptionValue ? (
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2">
                <EthAmount
                  amountWei={totalRedemptionValue}
                  className="text-base font-medium"
                  iconClassName="h-4 w-4"
                />
                <span className="text-xs text-neutral-400">total</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <EthAmount
                  amountWei={tokenRedemptionValue}
                  className="text-xs"
                  iconClassName="h-3 w-3"
                  precision={6}
                />
                <span>per NFT</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <span className="w-3 h-3 bg-neutral-600 rounded-full"></span>
              <span>No redemption value (0% in scorecard)</span>
            </div>
          )}
        </div>
      }
      selectionLimit={tokenIds.length}
      {...props}
    />
  );
}
