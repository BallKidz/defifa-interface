import { ActionContainer } from "components/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { Input } from "components/UI/Input";
import { useGameContext } from "contexts/GameContext";
import Image from "next/image";
import { useState } from "react";
import { CustomScorecardActions } from "./CustomScorecardActions";

export interface ScorecardPercentages {
  [key: string]: number | undefined; // tier_id: score_percentage
}

export function CustomScorecardContent() {
  const [scorecardPercentages, setScorecardPercentages] =
    useState<ScorecardPercentages>({});

  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
  } = useGameContext();

  function onInput(tierId: number, scorePercentage: number | undefined) {
    const newScorecardMap = {
      ...scorecardPercentages,
      [tierId.toString()]: scorePercentage,
    };
    setScorecardPercentages(newScorecardMap);
  }

  return (
    <ActionContainer
      renderActions={() => (
        <CustomScorecardActions scorecardPercentages={scorecardPercentages} />
      )}
    >
      {tiersLoading || currentFundingCycleLoading ? (
        <span>...</span>
      ) : (
        <>
          <p className="mb-5 text-sm text-neutral-300">
            Give points to each NFT and submit your own scorecard. Points
            determine each NFT's final redemption value.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {tiers?.map((t) => (
              <div
                key={t.id}
                className="relative border border-neutral-800 rounded-md max-w-[500px] mx-auto"
              >
                <Image
                  src={t.teamImage}
                  crossOrigin="anonymous"
                  alt="Team"
                  width={500}
                  height={500}
                  className="rounded-md"
                />
                <div className="p-3">
                  <label htmlFor="">Score %</label>
                  <Input
                    type="text"
                    value={scorecardPercentages[t.id]}
                    onChange={(e) => {
                      const value = e.target.value;
                      onInput(t.id, value ? parseInt(value) : undefined);
                    }}
                    step={1}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ActionContainer>
  );
}
