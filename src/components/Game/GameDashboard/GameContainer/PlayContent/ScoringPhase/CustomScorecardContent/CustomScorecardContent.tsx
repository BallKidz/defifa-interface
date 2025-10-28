import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { Input } from "components/UI/Input";
import { useGameContext } from "contexts/GameContext";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import { useMyMints } from "../../MintPhase/useMyMints";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CustomScorecardActions } from "./CustomScorecardActions";

export interface ScorecardPercentages {
  [key: string]: number | undefined; // tier_id: score_percentage
}

export function CustomScorecardContent() {
  const [scorecardPercentages, setScorecardPercentages] =
    useState<ScorecardPercentages>({});

  const { isConnected } = useAccount();
  const { data: picks, isLoading: picksLoading } = useMyMints();
  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
  } = useGameContext();

  // Calculate which tiers the user owns NFTs for (for display purposes)
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

  // Show ALL tiers for scoring, not just owned ones
  const tiersToScore = tiers;


  function onInput(tierId: number, scorePercentage: number | undefined) {
    const newScorecardMap = {
      ...scorecardPercentages,
      [tierId.toString()]: scorePercentage,
    };
    setScorecardPercentages(newScorecardMap);
  }

  function resetScorecard() {
    setScorecardPercentages({});
  }

  if (!isConnected) {
    return (
      <ActionContainer>
        <div>Connect your wallet to submit scores.</div>
      </ActionContainer>
    );
  }

  if (picksLoading || tiersLoading || currentFundingCycleLoading) {
    return (
      <ActionContainer>
        <span>...</span>
      </ActionContainer>
    );
  }

  // Allow users to submit scorecards even if they don't own NFTs
  // This enables spectators to participate in scoring

  return (
    <ActionContainer
      renderActions={() => (
        <CustomScorecardActions 
          scorecardPercentages={scorecardPercentages} 
          onSuccess={resetScorecard}
        />
      )}
    >
      <p className="mb-5 text-sm text-neutral-300">
        Give points to each team and submit your scores. Points
        determine how much of the pot goes to each team.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {tiersToScore?.map((t) => (
          <div
            key={t.id}
            className="relative border border-neutral-800 rounded-md max-w-[500px] mx-auto"
          >
            <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
              {t.teamImage ? (
                <Image
                  src={t.teamImage}
                  crossOrigin="anonymous"
                  alt={t.teamName || `Team ${t.id}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-[#fea282] text-3xl font-bold mb-1">
                    {(t.teamName || `Team ${t.id}`).substring(0, 3).toUpperCase()}
                  </div>
                  <div className="text-[#c0b3f1] text-xs">TEAM</div>
                </div>
              )}
            </div>
            <div className="p-3">
              <label htmlFor="">{t.teamName || `Team ${t.id}`} - Pot split %</label>
              <Input
                type="text"
                value={scorecardPercentages[t.id] ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    onInput(t.id, undefined);
                  } else {
                    const numValue = parseInt(value);
                    onInput(t.id, !isNaN(numValue) ? numValue : undefined);
                  }
                }}
                step={1}
              />
              <div className="text-xs text-neutral-400 mt-1">
                {pickCounts[t.id.toString()] ? 
                  `You own ${pickCounts[t.id.toString()]} NFT(s) for this team` :
                  `You don't own any NFTs for this team`
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </ActionContainer>
  );
}
