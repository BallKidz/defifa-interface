import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/read/useDefifaTiers";
import { useAmountRedeemed } from "hooks/read/useAmountRedeemed";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";
import { useAccount } from "wagmi";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { useMintSelection } from "../MintPhase/useMintSelection";
import { useMyMints } from "../MintPhase/useMyMints";
import { RedeemCard } from "./RedeemCard";
import { RedeemPicksActions } from "./RedeemPicksActions";
import { useEffect, useMemo, useRef, useState } from "react";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useGameQuorum } from "hooks/read/useGameQuorum";
import { ScorecardRow } from "../ScoringPhase/ScorecardsContent/ScorecardsContent";

function TabNav({
  activeTab,
  onSelect,
  hasClaimable,
}: {
  activeTab: "claim" | "scorecard";
  onSelect: (tab: "claim" | "scorecard") => void;
  hasClaimable: boolean;
}) {
  const baseClass = "px-4 py-2";
  const activeClass = "bg-neutral-800 text-neutral-50 rounded-md";
  const inactiveClass = "text-neutral-400 hover:text-neutral-300";
  const disabledClass = "text-neutral-600 opacity-50 cursor-not-allowed";

  const claimClasses = [
    baseClass,
    hasClaimable
      ? activeTab === "claim"
        ? activeClass
        : inactiveClass
      : disabledClass,
  ].join(" ");

  const scorecardClasses = [
    baseClass,
    activeTab === "scorecard" ? activeClass : inactiveClass,
  ].join(" ");

  return (
    <ul className="flex text-sm gap-2 items-center mb-4">
      <li>
        <button
          type="button"
          className={claimClasses}
          onClick={() => hasClaimable && onSelect("claim")}
          disabled={!hasClaimable}
        >
          Claim winnings
        </button>
      </li>
      <li>
        <button
          type="button"
          className={scorecardClasses}
          onClick={() => onSelect("scorecard")}
        >
          Final scorecard
        </button>
      </li>
    </ul>
  );
}

export function RedeemPicksContent({ disabled }: { disabled?: boolean }) {
  const { isConnected } = useAccount();
  const { nfts, gameId, currentFundingCycle, governor } = useGameContext();

  const { data: picks, isLoading: picksLoading } = useMyMints();
  const { data: overflow } = usePaymentTerminalBalance(gameId);
  const { data: amountRedeemed } = useAmountRedeemed(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: scorecards } = useScorecards(gameId);
  const { data: quorum } = useGameQuorum(gameId, governor);

  const mintedTokens = picks?.contracts?.[0]?.mintedTokens ?? [];
  const hasClaimable = mintedTokens.length > 0;

  const userSelectedTab = useRef(false);

  const [activeTab, setActiveTabState] = useState<"claim" | "scorecard">(
    hasClaimable ? "claim" : "scorecard"
  );

  const setActiveTab = (tab: "claim" | "scorecard") => {
    userSelectedTab.current = true;
    setActiveTabState(tab);
  };

  useEffect(() => {
    if (hasClaimable && !userSelectedTab.current) {
      setActiveTabState("claim");
    }
  }, [hasClaimable]);

  const finalScorecard = scorecards?.[0];

  const {
    incrementTierSelection,
    decrementTierSelection,
    selectedTiers,
    totalSelected,
  } = useMintSelection();

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

  const gameQuorum = quorum ? BigInt(quorum.toString()) : BigInt(0);

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

  return (
    <ActionContainer
      renderActions={
        activeTab === "claim" && totalSelected && !disabled
          ? () => <RedeemPicksActions tokenIdsToRedeem={tokenIdsToRedeem} />
          : undefined
      }
    >
      <TabNav
        activeTab={activeTab}
        onSelect={setActiveTab}
        hasClaimable={hasClaimable}
      />

      {activeTab === "claim" ? (
        hasClaimable ? (
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
        ) : (
          <div className="text-neutral-300 text-sm">
            You don’t have any NFTs to redeem.
          </div>
        )
      ) : finalScorecard ? (
        <ScorecardRow
          scorecard={finalScorecard}
          gameQuroum={gameQuorum}
          showActions={false}
        />
      ) : (
        <div className="text-neutral-300 text-sm">
          No scorecard has been ratified yet.
        </div>
      )}
    </ActionContainer>
  );
}
