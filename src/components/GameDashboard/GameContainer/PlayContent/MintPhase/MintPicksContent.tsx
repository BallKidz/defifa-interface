import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintActions } from "./MintActions";
import { MintCard } from "./MintCard";
import { useMintSelection } from "./useMintSelection";

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
      <p className="mb-4 text-sm text-neutral-400 flex items-start gap-2">
        <QuestionMarkCircleIcon className="h-4 w-4 inline" /> Mint NFTs to buy
        in. Your ETH is added to the total pot. When minting is over, vote on
        the game's outcome. The pot is split based on the outcome with the most
        votes.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {tiersLoading || currentFundingCycleLoading ? (
          <span>...</span>
        ) : (
          tiers?.map((t) => (
            <MintCard
              price={t.price}
              tierId={t.id}
              key={t.id}
              imageSrc={t.teamImage}
              mintedCount={t.minted}
              selectedCount={selectedTiers?.[t.id]?.count ?? 0}
              onIncrement={() => incrementTierSelection(t.id.toString())}
              onDecrement={() => decrementTierSelection(t.id.toString())}
            />
          ))
        )}
      </div>
    </ActionContainer>
  );
}
