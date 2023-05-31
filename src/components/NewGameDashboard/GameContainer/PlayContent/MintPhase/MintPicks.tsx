import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintActions } from "./MintActions";
import { MintCard } from "./MintCard";
import { useMintSelection } from "./useMintSelection";

export function MintPicksContent() {
  const {
    nfts: { tiers },
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tiers?.map((t: any) => (
          <MintCard
            key={t.id}
            imageSrc={t.teamImage}
            mintedCount={t.minted}
            selectedCount={selectedTiers?.[t.id]?.count ?? 0}
            onIncrement={() => incrementTierSelection(t.id)}
            onDecrement={() => decrementTierSelection(t.id)}
          />
        ))}
      </div>
    </ActionContainer>
  );
}
