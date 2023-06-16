import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

export function MintCard({
  mintedCount,
  playerCount,
  tierId,
  price,
  ...props
}: {
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
  const supplyPortionString =
    nfts && nfts?.[tierId - 1]?.minted > 0 && totalSupply
      ? `${(mintedCount / nfts?.[tierId - 1]?.minted) * 100}% of this card`
      : `0%`;

  const playerText = playerCount === 1 ? "player" : "players";
  const mintedText = mintedCount === 1 ? "mint" : "mints";

  return (
    <PickCard
      extra={
        <>
          <div>{formatEther(price)} ETH</div>
          <div className="text-xs mt-2">
            {playerCount ? (
              <div>
                {playerCount} {playerText}
              </div>
            ) : null}
            <div>
              {mintedCount} {mintedText}
            </div>
            {/* <div>{supplyPortion}% of game mints</div> */}
          </div>
        </>
      }
      {...props}
    />
  );
}
