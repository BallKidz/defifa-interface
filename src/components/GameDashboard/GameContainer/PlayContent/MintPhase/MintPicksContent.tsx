import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintActions } from "./MintActions";
import { MintCard } from "./MintCard";
import { useMintSelection } from "./useMintSelection";
import { useGameMints } from "./useGameMints";
import { tokenNumberToTierId } from "utils/defifa";

function usePlayersInTiers(gameMints: any[] | undefined) {
  return gameMints?.reduce((acc, token) => {
    const tierId = tokenNumberToTierId(token.number);
    const tier = acc[tierId] ?? [];
    if (!tier.includes(token.owner.id)) {
      tier.push(token.owner.id);
    }
    acc[tierId] = tier;
    return acc;
  }, {});
}

export function MintPicksContent() {
  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
    gameId,
  } = useGameContext();
  const { data: gameMints } = useGameMints(gameId);
  const playersInTiers = usePlayersInTiers(gameMints);

  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
  } = useMintSelection();

  return (
    <ActionContainer
      renderActions={() => <MintActions selectedTiers={selectedTiers} />}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
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
              playerCount={playersInTiers?.[t.id]?.length ?? 0}
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
