import { PickCard, PickCardProps } from "components/PickCard";
import { useGameContext } from "contexts/GameContext";

export function MintCard({
  mintedCount,
  ...props
}: { mintedCount: number } & Omit<PickCardProps, "extra">) {
  const {
    nfts: { totalSupply },
  } = useGameContext();

  const supplyPortion =
    mintedCount > 0 && totalSupply
      ? ((mintedCount / totalSupply?.toNumber()) * 100).toFixed(0)
      : 0;

  return (
    <PickCard
      extra={
        <>
          {mintedCount} minted <span>({supplyPortion}% of total)</span>
        </>
      }
      {...props}
    />
  );
}
