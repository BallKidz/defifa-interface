import React, { useState } from "react";
import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { Input } from "components/UI/Input";
import { useGameContext } from "contexts/GameContext";
import Image from "next/image";
import { CustomScorecardActions } from "./CustomScorecardActions";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "antd";

export interface ScorecardPercentages {
  [key: string]: number | undefined; // tier_id: score_percentage
}

export function CustomScorecardContent() {
  const [scorecardPercentages, setScorecardPercentages] =
    useState<ScorecardPercentages>({});
  const [submitted, setSubmitted] = useState(false);

  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
  } = useGameContext();

  function resetScorecardPercentages() {
    setScorecardPercentages({});
  }

  function onInput(tierId: number, scorePercentage: number | undefined) {
    const newScorecardMap = {
      ...scorecardPercentages,
      [tierId.toString()]: scorePercentage,
    };
    setScorecardPercentages(newScorecardMap);
  }

  function handleScorecardSubmit() {
    // Process the scorecard submission
    // ...

    // Reset the scorecard percentages and set submitted to true
    setScorecardPercentages({});
    setSubmitted(true);
  }

  return (
    <ActionContainer
      renderActions={() => (
        <CustomScorecardActions
          scorecardPercentages={scorecardPercentages}
          resetScorecardPercentages={resetScorecardPercentages} // Make sure this prop is passed correctly
          onSubmit={handleScorecardSubmit}

        />
      )}
    >
      {tiersLoading || currentFundingCycleLoading ? (
        <span>...</span>
      ) : (
        <>
          <Tooltip title=" Allocate a percentage to each team and submit the score.
            The percentages determine how much of the pot goes to each team.
            Only one scorecard needs to be proposed per game.">
            <QuestionMarkCircleIcon className="h-4 w-4 inline" />
          </Tooltip>

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
                  <label htmlFor="">Pot split %</label>
                  <Input
                    type="text"
                    value={submitted ? "" : scorecardPercentages[t.id]}
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
