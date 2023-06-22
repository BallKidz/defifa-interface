import { EthAmount } from "components/UI/EthAmount";
import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";

export function MintCard({
  mintedCount,
  playerCount,
  tierId,
  price,
  title,
  ...props
}: {
  title: string;
  mintedCount: number;
  playerCount?: number;
  tierId: number;
  price: BigNumber;
} & Omit<PickCardProps, "extra">) {
  const {
    nfts: { totalSupply, tiers: nfts },
  } = useGameContext();

  const supplyPortion =
    mintedCount > 0 && totalSupply
      ? ((mintedCount / totalSupply?.toNumber()) * 100).toFixed(0)
      : 0;

  return (
    <PickCard
      title={title}
      extra={
        <>
          <div className="mb-1 mt-1 text-left font-medium text-pink-500">
            <EthAmount amountWei={price} />
          </div>
          <div className="text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-300">
                {supplyPortion}% of all mints
              </span>
            </div>

            {typeof playerCount !== "undefined" ? (
              <div className="flex justify-between">
                <span className="text-neutral-300">{playerCount} owners</span>
              </div>
            ) : null}
          </div>
        </>
      }
      {...props}
    />
  );
}
