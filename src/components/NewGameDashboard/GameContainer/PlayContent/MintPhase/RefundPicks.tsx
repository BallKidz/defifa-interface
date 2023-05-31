import { useGameContext } from "contexts/GameContext";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/NftRewards";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintCard } from "./MintCard";
import { RefundActions } from "./RefundActions";
import { useMintSelection } from "./useMintSelection";
import { useMyPicks } from "./useMyPicks";
import Container from "components/UI/Container";
import Button from "components/UI/Button";

export function RefundPicksContent() {
  const { data: picks, isLoading: picksLoading } = useMyPicks();
  const { nfts } = useGameContext();

  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
  } = useMintSelection();

  const mintedTokens = picks?.contracts?.[0]?.mintedTokens ?? [];
  const pickCounts = mintedTokens.reduce(
    (acc: { [k: string]: number }, token: any) => {
      const tierId = Math.floor(token.number / DEFAULT_NFT_MAX_SUPPLY);
      const count = acc[tierId] ? acc[tierId] + 1 : 1;
      return {
        ...acc,
        [tierId]: count,
      };
    },
    {}
  );

  const pickedNfts = nfts.tiers.filter((nft: any) =>
    Object.keys(pickCounts).includes(nft.id.toString())
  );

  const tokenIdsToRedeem = Object.keys(selectedTiers ?? {}).reduce(
    (acc: string[], curr) => {
      const tokenIds = mintedTokens
        .filter((token: any) => token.number.startsWith(curr))
        .map((token: any) => token.number)
        .filter((number: string) => !acc.includes(number))
        .slice(0, selectedTiers?.[curr]?.count ?? 0);

      return [...acc, ...tokenIds];
    },
    []
  );

  if (picksLoading) {
    return (
      <Container>
        <div>...</div>
      </Container>
    );
  }

  if (mintedTokens.length === 0) {
    return (
      <Container>
        <div>You haven&apos;t minted yet.</div>
      </Container>
    );
  }

  return (
    <ActionContainer
      renderActions={
        totalSelected
          ? () => <RefundActions tokenIdsToRedeem={tokenIdsToRedeem} />
          : undefined
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {pickedNfts?.map((t: any) => (
          <MintCard
            key={t.id}
            imageSrc={t.teamImage}
            mintedCount={pickCounts?.[t.id] ?? 0}
            selectedCount={selectedTiers?.[t.id]?.count ?? 0}
            onIncrement={() => incrementTierSelection(t.id)}
            onDecrement={() => decrementTierSelection(t.id)}
          />
        ))}
      </div>
    </ActionContainer>
  );
}
