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
import { useMemo, useState } from "react";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useGameQuorum } from "hooks/read/useGameQuorum";
import { ScorecardRow } from "../ScoringPhase/ScorecardsContent/ScorecardsContent";
import { useGameMints } from "../MintPhase/useGameMints";
import { TOTAL_REDEMPTION_WEIGHT } from "constants/constants";
import { tokenNumberToTierId } from "utils/defifa";
import { EthAddress } from "components/UI/EthAddress";
import { EthAmount } from "components/UI/EthAmount";

type RedeemTab = "winners" | "claim" | "scorecard";

type WinnerEntry = {
  address: string;
  totalValue: BigNumber;
  tokenCount: number;
};

function TabNav({
  activeTab,
  onSelect,
  hasClaimable,
}: {
  activeTab: RedeemTab;
  onSelect: (tab: RedeemTab) => void;
  hasClaimable: boolean;
}) {
  const baseClass = "px-4 py-2";
  const activeClass = "bg-neutral-800 text-neutral-50 rounded-md";
  const inactiveClass = "text-neutral-400 hover:text-neutral-300";
  const disabledClass = "text-neutral-600 opacity-50 cursor-not-allowed";

  const winnersClasses = [
    baseClass,
    activeTab === "winners" ? activeClass : inactiveClass,
  ].join(" ");

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
          className={winnersClasses}
          onClick={() => onSelect("winners")}
        >
          Winners
        </button>
      </li>
      <li>
        <button
          type="button"
          className={claimClasses}
          onClick={() => hasClaimable && onSelect("claim")}
          disabled={!hasClaimable}
        >
          Cashout
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

function WinnersTable({ winners }: { winners: WinnerEntry[] }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-900 border-b border-neutral-800">
          <tr className="text-left text-neutral-300">
            <th className="px-4 py-2 w-16">Rank</th>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2 w-20">NFTs</th>
            <th className="px-4 py-2 text-right">Redeemable value</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner, index) => (
            <tr
              key={winner.address}
              className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-900/40"
            >
              <td className="px-4 py-2 text-neutral-400">#{index + 1}</td>
              <td className="px-4 py-2">
                <EthAddress address={winner.address} withEnsAvatar />
              </td>
              <td className="px-4 py-2 text-neutral-300">{winner.tokenCount}</td>
              <td className="px-4 py-2 text-right">
                <EthAmount amountWei={winner.totalValue} className="justify-end" iconClassName="h-4 w-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RedeemPicksContent({ disabled }: { disabled?: boolean }) {
  const { isConnected } = useAccount();
  const { nfts, gameId, currentFundingCycle, currentPhase, governor } = useGameContext();

  const { data: picks, isLoading: picksLoading } = useMyMints();
  const { data: overflow } = usePaymentTerminalBalance(gameId);
  const { data: amountRedeemed } = useAmountRedeemed(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: scorecards } = useScorecards(gameId);
  const { data: quorum } = useGameQuorum(gameId, governor);
  const { data: allGameMints } = useGameMints(gameId, undefined, { currentPhase });

  const mintedTokens = picks?.contracts?.[0]?.mintedTokens ?? [];
  const hasClaimable = mintedTokens.length > 0;

  const [activeTab, setActiveTab] = useState<RedeemTab>("winners");

  const finalScorecard = scorecards?.[0];

  const totalPot = useMemo(() => {
    const overflowValue = BigNumber.from(overflow ?? 0);
    const redeemedValue = BigNumber.from(amountRedeemed ?? 0);
    return overflowValue.add(redeemedValue);
  }, [overflow, amountRedeemed]);

  const tierMintCounts = useMemo(() => {
    const map = new Map<number, number>();
    (allGameMints ?? []).forEach((token: any) => {
      const tierId = tokenNumberToTierId(token.number);
      if (Number.isNaN(tierId)) return;

      const currentCount = map.get(tierId) ?? 0;
      map.set(tierId, currentCount + 1);
    });

    return map;
  }, [allGameMints]);

  const tierValueMap = useMemo(() => {
    const map = new Map<number, BigNumber>();
    if (!finalScorecard || !finalScorecard.tierWeights?.length) {
      return map;
    }

    finalScorecard.tierWeights.forEach((tierWeight) => {
      const tierId = Number(tierWeight.tierId);
      if (Number.isNaN(tierId)) return;
      const weightValue = BigNumber.from(tierWeight.redemptionWeight ?? 0);
      const mintedCount = tierMintCounts.get(tierId) ?? 0;

      if (weightValue.isZero() || totalPot.isZero() || mintedCount === 0) {
        map.set(tierId, BigNumber.from(0));
        return;
      }

      const tierTotalValue = totalPot.mul(weightValue).div(TOTAL_REDEMPTION_WEIGHT);
      const valuePerToken = tierTotalValue.div(BigNumber.from(mintedCount));
      map.set(tierId, valuePerToken);
    });

    return map;
  }, [finalScorecard, tierMintCounts, totalPot]);

  const winners = useMemo(() => {
    const tokens = allGameMints ?? [];
    if (!finalScorecard || tokens.length === 0) {
      return [] as WinnerEntry[];
    }

    const aggregates = new Map<string, WinnerEntry>();

    tokens.forEach((token: any) => {
      const ownerAddress = token?.owner?.id;
      if (!ownerAddress) return;

      const tierId = tokenNumberToTierId(token.number);
      const valuePerToken = tierValueMap.get(tierId);
      if (!valuePerToken) return;

      const normalizedAddress = ownerAddress.toLowerCase();
      const existing = aggregates.get(normalizedAddress);

      if (existing) {
        aggregates.set(normalizedAddress, {
          address: normalizedAddress,
          totalValue: existing.totalValue.add(valuePerToken),
          tokenCount: existing.tokenCount + 1,
        });
      } else {
        aggregates.set(normalizedAddress, {
          address: normalizedAddress,
          totalValue: valuePerToken,
          tokenCount: 1,
        });
      }
    });

    return Array.from(aggregates.values()).sort((a, b) => {
      if (a.totalValue.eq(b.totalValue)) {
        return b.tokenCount - a.tokenCount;
      }
      return b.totalValue.gt(a.totalValue) ? 1 : -1;
    });
  }, [allGameMints, finalScorecard, tierValueMap]);

  const topWinners = useMemo(() => winners.slice(0, 10), [winners]);

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

      {activeTab === "winners" ? (
        finalScorecard ? (
          topWinners.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-neutral-400">
                Top 10 winners by cashout value.
              </div>
              <WinnersTable winners={topWinners} />
            </div>
          ) : (
            <div className="text-neutral-300 text-sm">
              No winners to display yet.
            </div>
          )
        ) : (
          <div className="text-neutral-300 text-sm">
            No scorecard has been locked in yet.
          </div>
        )
      ) : activeTab === "claim" ? (
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
            You don’t have any NFTs to cashout.
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
          No scorecard has been locked in yet.
        </div>
      )}
    </ActionContainer>
  );
}
