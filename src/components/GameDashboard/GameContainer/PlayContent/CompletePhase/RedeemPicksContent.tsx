import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/NftRewards";
import { useAmountRedeemed } from "hooks/read/useAmountRedeemed";
import { usePaymentTerminalOverflow } from "hooks/read/usePaymentTerminalOverflow";
import { useAccount } from "wagmi";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { useMintSelection } from "../MintPhase/useMintSelection";
import { useMyPicks } from "../MintPhase/useMyPicks";
import { RedeemPicksActions } from "./RedeemPicksActions";
import { RedeemCard } from "./RedeemCard";

export function RedeemPicksContent({ disabled }: { disabled?: boolean }) {
  const { isConnected } = useAccount();
  const { nfts, gameId, currentFundingCycle } = useGameContext();

  const { data: picks, isLoading: picksLoading } = useMyPicks();
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

  const pickedNfts = nfts.tiers?.filter((nft: any) =>
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

  if (!isConnected) {
    return (
      <Container>
        <div>Connect your wallet to see your picks.</div>
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
        <div>You haven't minted yet.</div>
        <div className="text-xs">(or, your mints haven't been indexed yet)</div>
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
        {pickedNfts?.map((t: any) => (
          <RedeemCard
            key={t.id}
            tokenIds={mintedTokens
              ?.filter((token: any) => token.number.startsWith(t.id))
              .map((token: any) => token.number)}
            overflow={overflow ?? BigNumber.from(0)}
            amountRedeemed={amountRedeemed ?? BigNumber.from(0)}
            imageSrc={t.teamImage}
            selectedCount={selectedTiers?.[t.id]?.count ?? 0}
            onIncrement={() => incrementTierSelection(t.id)}
            onDecrement={() => decrementTierSelection(t.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </ActionContainer>
  );
}
