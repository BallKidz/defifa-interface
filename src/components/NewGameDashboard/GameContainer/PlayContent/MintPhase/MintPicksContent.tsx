import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintActions } from "./MintActions";
import { MintCard } from "./MintCard";
import { useMintSelection } from "./useMintSelection";
import { MINT_PRICE } from "constants/constants";
import { formatUnits } from "ethers/lib/utils";

export function MintPicksContent() {
  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
  } = useGameContext();
  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
  } = useMintSelection();

  return (
    <ActionContainer
      renderActions={
        totalSelected
          ? () => <MintActions selectedTiers={selectedTiers} />
          : undefined
      }
    >
      <p className="mb-4">
        Mint your picks. Your ETH is added to the total pot. At the end of the
        game, the pot is split between those who pick correctly.
      </p>
      <div className="mb-5 text-xl font-medium">
        {formatUnits(MINT_PRICE)} ETH / Pick
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {tiersLoading || currentFundingCycleLoading ? (
          <span>...</span>
        ) : (
          tiers?.map((t: any) => (
            <MintCard
              key={t.id}
              imageSrc={t.teamImage}
              mintedCount={t.minted}
              selectedCount={selectedTiers?.[t.id]?.count ?? 0}
              onIncrement={() => incrementTierSelection(t.id)}
              onDecrement={() => decrementTierSelection(t.id)}
            />
          ))
        )}
      </div>
    </ActionContainer>
  );
}
