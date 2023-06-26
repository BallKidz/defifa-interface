import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import { useAmountRedeemed } from "hooks/read/useAmountRedeemed";
import { usePaymentTerminalOverflow } from "hooks/read/usePaymentTerminalOverflow";
import { useAccount } from "wagmi";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { useMintSelection } from "../MintPhase/useMintSelection";
import { useMyMints } from "../MintPhase/useMyMints";
import { RedeemCard } from "./RedeemCard";
import { RedeemPicksActions } from "./RedeemPicksActions";

export function RedeemPicksContent({ disabled }: { disabled?: boolean }) {
  const { isConnected } = useAccount();
  const { nfts, gameId, currentFundingCycle } = useGameContext();

  const { data: picks, isLoading: picksLoading } = useMyMints();
  const { data: overflow } = usePaymentTerminalOverflow(gameId);
  const { data: amountRedeemed } = useAmountRedeemed(
    currentFundingCycle?.metadata.dataSource
  );

  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
  } = useMintSelection();

  const mintedTokens = picks?.contracts?.[0]?.mintedTokens ?? [];
  const pickCounts = mintedTokens.reduce(
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
        .filter((number: string) => !acc.includes(number))
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
        <div>You haven't joined any teams yet.</div>
        <div className="text-xs">(or, your NFTs haven't been indexed yet)</div>
      </Container>
    );
  }

  return (
    <ActionContainer
      renderActions={
        totalSelected && !disabled
          ? () => <RedeemPicksActions tokenIdsToRedeem={tokenIdsToRedeem} />
          : undefined
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {pickedNfts?.map((t) => (
          <RedeemCard
            title={t.teamName}
            key={t.id}
            tokenIds={mintedTokens
              ?.filter((token) => token.number.startsWith(t.id.toString()))
              .map((token) => token.number)}
            overflow={overflow ?? BigNumber.from(0)}
            amountRedeemed={amountRedeemed ?? BigNumber.from(0)}
            imageSrc={t.teamImage}
            selectedCount={selectedTiers?.[t.id]?.count ?? 0}
            onIncrement={() => incrementTierSelection(t.id.toString())}
            onDecrement={() => decrementTierSelection(t.id.toString())}
            disabled={disabled}
          />
        ))}
      </div>
    </ActionContainer>
  );
}
