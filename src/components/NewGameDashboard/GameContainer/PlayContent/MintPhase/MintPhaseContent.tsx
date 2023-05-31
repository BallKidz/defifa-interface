import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintCard } from "./MintCard";
import { useState } from "react";
import { useMintSelection } from "./useMintSelection";
import { MintActions } from "./MintActions";

export function MintPhaseContent() {
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
      shouldRenderActions={totalSelected > 0}
      renderActions={() => <MintActions selectedTiers={selectedTiers} />}
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
