import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import { useAccount } from "wagmi";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintCard } from "./MintCard";
import { RefundActions } from "./RefundActions";
import { useMintSelection } from "./useMintSelection";
import { useMyMints } from "./useMyMints";

export function RefundPicksContent({ disabled }: { disabled?: boolean }) {
  const { isConnected } = useAccount();
  const { data: picks, isLoading: picksLoading } = useMyMints();
  const { nfts } = useGameContext();

  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
    clearSelection,
  } = useMintSelection();

  const mintedTokens = picks?.contracts?.[0]?.mintedTokens ?? [];
  const pickCounts: { [k: string]: number } = mintedTokens.reduce(
    (acc: { [k: string]: number }, token) => {
      const tierId = Math.floor(
        parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY
      );
      const count = (acc[tierId] ?? 0) + 1;
      return {
        ...acc,
        [tierId]: count,
      };
    },
    {}
  );

  const pickedNfts = nfts.tiers?.filter((nft) =>
    Object.keys(pickCounts).includes(nft.id.toString())
  );

  const tokenIdsToRedeem = Object.keys(selectedTiers ?? {}).reduce(
    (acc: string[], curr) => {
      const tokenIds = mintedTokens
        .filter((token) => token.number.startsWith(curr))
        .map((token) => token.number)
        .filter((number) => !acc.includes(number))
        .slice(0, selectedTiers?.[curr]?.count ?? 0);

      return [...acc, ...tokenIds];
    },
    []
  );

  if (!isConnected) {
    return (
      <Container>
        <div>Connect your wallet to see your NFTs.</div>
      </Container>
    );
  }

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
        <div>You haven't minted any positions.</div>
      </Container>
    );
  }

  return (
    <ActionContainer
      renderActions={
        totalSelected && !disabled
          ? () => <RefundActions tokenIdsToRedeem={tokenIdsToRedeem} onSuccess={clearSelection} />
          : undefined
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {pickedNfts?.map((defifaTier) => (
          <MintCard
            title={defifaTier.teamName}
            tierId={defifaTier.id}
            key={defifaTier.id}
            imageSrc={defifaTier.teamImage}
            price={defifaTier.price}
            mintedCount={pickCounts?.[defifaTier.id] ?? 0}
            selectedCount={selectedTiers?.[defifaTier.id]?.count ?? 0}
            selectionLimit={pickCounts?.[defifaTier.id.toString()] ?? 0} // limit selection to the number of mints
            onIncrement={() => incrementTierSelection(defifaTier.id.toString())}
            onDecrement={() => decrementTierSelection(defifaTier.id.toString())}
            disabled={disabled}
          />
        ))}
      </div>
    </ActionContainer>
  );
}
