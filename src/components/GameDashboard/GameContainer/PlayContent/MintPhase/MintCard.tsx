import { EthAmount } from "components/UI/EthAmount";
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

  return (
    <PickCard
      extra={
        <>
          <div className="mb-1 mt-1 font-medium">
            <EthAmount amountWei={price} />
          </div>
          <div className="text-xs">
            {typeof playerCount !== "undefined" ? (
              <div className="flex justify-between">
                <span className="text-neutral-300">Players</span>
                <span className="font-medium">{playerCount}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-neutral-300">Mints</span>
              <span className="font-medium">{mintedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-300">% of all mints</span>
              <span className="font-medium">{supplyPortion}%</span>
            </div>
          </div>
        </>
      }
      {...props}
    />
  );
}
