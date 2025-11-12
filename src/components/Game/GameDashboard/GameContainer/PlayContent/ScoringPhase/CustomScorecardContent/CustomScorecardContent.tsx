import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { Input } from "components/UI/Input";
import { useGameContext } from "contexts/GameContext";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/read/useDefifaTiers";
import { useMyMints } from "../../MintPhase/useMyMints";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CustomScorecardActions } from "./CustomScorecardActions";
import { NFTModal } from "components/Game/GameHome/NFTModal";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

export interface ScorecardPercentages {
  [key: string]: number | undefined; // tier_id: score_percentage
}

export function CustomScorecardContent() {
  const [scorecardPercentages, setScorecardPercentages] =
    useState<ScorecardPercentages>({});
  const [modalOpen, setModalOpen] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { triggerSelection } = useMiniAppHaptics();

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
          onSuccess={() => {
            resetScorecard();
            setIsProcessing(false);
          }}
          onBegin={() => setIsProcessing(true)}
          processingOverride={isProcessing}
        />
      )}
    >

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 justify-items-center">
        {tiersToScore?.map((t) => (
           <div
             key={t.id}
            className={`relative border-2 bg-[#181424] shadow-lg rounded-xl overflow-hidden transition-all w-full max-w-[260px] ${
              t.minted === 0 ? 'border-red-800 opacity-60' : 'border-neutral-800'
            }`}
           >
            <div className="px-4 pt-4 pb-3">
              <div className="text-base text-left font-medium mb-2 truncate" title={t.teamName || `Team ${t.id}`}>
                {t.teamName || `Team ${t.id}`}
              </div>
              <div 
                className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16] cursor-pointer hover:border-pink-500 transition-colors active:scale-95"
                onClick={() => {
                  void triggerSelection();
                  setModalOpen(t.id);
                }}
              >
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
                      {(t.teamName || `Team ${t.id}`).substring(0, 9).toUpperCase()}
                    </div>
                    <div className="text-[#c0b3f1] text-xs">Outcome</div>
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-2">
                <label className="block text-sm" htmlFor={`score-input-${t.id}`}>
                  Pot split %
                </label>
                <Input
                  id={`score-input-${t.id}`}
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
                  disabled={t.minted === 0}
                />
                <div className="text-xs mt-1">
                  {t.minted === 0 ? (
                    <span className="text-red-400">⚠️ No mints - cannot score</span>
                  ) : pickCounts[t.id.toString()] ? (
                    <span className="text-neutral-400">You own {pickCounts[t.id.toString()]} NFT(s)</span>
                  ) : (
                    <span className="text-neutral-400">You don't own this outcome</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Modal */}
      {modalOpen !== null && tiersToScore && (
        <NFTModal
          isOpen={true}
          onClose={() => setModalOpen(null)}
          title={tiersToScore.find(t => t.id === modalOpen)?.teamName || `Team ${modalOpen}`}
          imageSrc={tiersToScore.find(t => t.id === modalOpen)?.teamImage || ''}
        />
      )}
    </ActionContainer>
  );
}
