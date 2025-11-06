import { EthAmount } from "components/UI/EthAmount";
import { PickCard, PickCardProps } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";

export function MintCard({
  mintedCount,
  playerCount,
  tierId,
  price,
  title,
  userMintCount = 0,
  tierMaxSupply,
  tierInitialQuantity,
  totalTierMinted,
  showChance = true,
  ...props
}: {
  title: string;
  mintedCount: number;
  playerCount?: number;
  tierId: number;
  price: bigint;
  userMintCount?: number;
  tierMaxSupply?: number;
  tierInitialQuantity?: number;
  totalTierMinted?: number;
  showChance?: boolean;
} & Omit<PickCardProps, "extra">) {
  const {
    nfts: { totalSupply, tiers: nfts },
  } = useGameContext();

  const supplyPortion =
    mintedCount > 0 && totalSupply
      ? ((mintedCount / Number(totalSupply)) * 100).toFixed(0)
      : 0;

  const mintText = mintedCount === 1 ? "mint" : "mints";

  // Calculate user's percentage of tier
  // Use initialQuantity if available, otherwise maxSupply
  // But if maxSupply is DEFAULT_NFT_MAX_SUPPLY (999999999), use initialQuantity
  const DEFAULT_NFT_MAX_SUPPLY = 999_999_999;
  const tierSupply = tierInitialQuantity || (tierMaxSupply && tierMaxSupply < DEFAULT_NFT_MAX_SUPPLY ? tierMaxSupply : undefined);

  const percentageDenominator = showChance
    ? tierSupply
    : totalTierMinted ?? tierSupply;

  const userTierPercentage = percentageDenominator && userMintCount > 0
    ? ((userMintCount / percentageDenominator) * 100).toFixed(0)
    : 0;
  

  return (
    <PickCard
      title={title}
      extra={
        <>
          <div className="mb-1 mt-1 text-left font-medium text-pink-500">
            <EthAmount amountWei={price} />
          </div>
          <div className="text-xs space-y-1">
            {showChance && (
              <div className="flex justify-between">
                <span className="text-neutral-300">
                  {supplyPortion}% chance implied
                </span>
              </div>
            )}
            {userMintCount > 0 && (
              <div className="text-lime-400 font-medium">
                {showChance
                  ? `You hold ${userMintCount}`
                  : `You hold ${userMintCount} (${userTierPercentage}% of this outcome)`}
              </div>
            )}
          </div>
        </>
      }
      {...props}
    />
  );
}
