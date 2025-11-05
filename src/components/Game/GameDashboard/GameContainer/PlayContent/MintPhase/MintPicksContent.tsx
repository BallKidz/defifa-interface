import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintActions } from "./MintActions";
import { MintCard } from "./MintCard";
import { useMintSelection } from "./useMintSelection";
import { useGameMints } from "./useGameMints";
import { useMyMints } from "./useMyMints";
import { useAccount } from "wagmi";
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

function useUserMintsPerTier() {
  const { address } = useAccount();
  const { data: myMints } = useMyMints();
  
  if (!address || !myMints) {
    return {};
  }

  const mintedTokens = myMints?.contracts?.[0]?.mintedTokens ?? [];
  return mintedTokens.reduce((acc: { [tierId: number]: number }, token) => {
    const tierId = tokenNumberToTierId(token.number);
    acc[tierId] = (acc[tierId] || 0) + 1;
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
    currentPhase,
  } = useGameContext();
  const { data: gameMints } = useGameMints(gameId, undefined, { currentPhase });
  const playersInTiers = usePlayersInTiers(gameMints);
  const userMintsPerTier = useUserMintsPerTier();

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 pt-2">
        {tiersLoading || currentFundingCycleLoading ? (
          <span>...</span>
        ) : (
          tiers?.map((t) => (
            <MintCard
              title={t.teamName}
              price={t.price}
              tierId={t.id}
              key={t.id}
              imageSrc={t.teamImage}
              mintedCount={t.minted}
              playerCount={playersInTiers?.[t.id]?.length ?? 0}
              selectedCount={selectedTiers?.[t.id]?.count ?? 0}
              userMintCount={userMintsPerTier[t.id] ?? 0}
              tierMaxSupply={t.maxSupply}
              tierInitialQuantity={t.initialQuantity}
              onIncrement={() => incrementTierSelection(t.id.toString())}
              onDecrement={() => decrementTierSelection(t.id.toString())}
            />
          ))
        )}
      </div>
    </ActionContainer>
  );
}
