import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";

export function MintCard({
  mintedCount,
  tierId,
  ...props
}: { mintedCount: number; tierId: number } & Omit<PickCardProps, "extra">) {
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

  return (
    <PickCard
      extra={
        <>
          <div>{mintedCount} mints</div>
          <div>{supplyPortion}% of game mints</div>
          {nfts && nfts?.[tierId - 1]?.minted > 0 && (
            <div className="text-sm">{supplyPortionString}</div>
          )}
        </>
      }
      {...props}
    />
  );
}
