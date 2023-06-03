import { ActionContainer } from "components/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { Input } from "components/UI/Input";
import { useGameContext } from "contexts/GameContext";
import { ONE_BILLION } from "hooks/NftRewards";
import Image from "next/image";
import { useState } from "react";
import { DefifaTierRedemptionWeight } from "types/interfaces";
import { CustomScorecardActions } from "./CustomScorecardActions";

interface ScorecardMap {
  [key: string]: number; // score
}

export function CustomScorecardContent() {
  const [scorecardMap, setScorecardMap] = useState<ScorecardMap>({});

  const {
    nfts: { tiers },
    loading: {
      currentFundingCycleLoading,
      nfts: { tiersLoading },
    },
  } = useGameContext();

  function onInput(tierId: number, scorePercentage: number) {
    const newScorecardMap = { ...scorecardMap, [tierId]: scorePercentage };
    setScorecardMap(newScorecardMap);
  }

  const scorecard: DefifaTierRedemptionWeight[] =
    tiers?.map((t: any) => {
      const scorePercentage = scorecardMap[t.id];
      return {
        id: t.id,
        redemptionWeight: scorePercentage
          ? (scorePercentage / 100) * ONE_BILLION
          : 0,
      };
    }) ?? [];

  return (
    <ActionContainer
      renderActions={() => <CustomScorecardActions scorecard={scorecard} />}
    >
      {tiersLoading || currentFundingCycleLoading ? (
        <span>...</span>
      ) : (
        <>
          <p className="mb-2">
            Give points to each Pick and submit your own scorecard.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {tiers?.map((t: any) => (
              <div
                key={t.id}
                className="relative border border-gray-800 rounded-md max-w-[500px] mx-auto"
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
                    type="number"
                    onChange={(e) => {
                      onInput(t.id, parseInt(e.target.value || "0"));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>{" "}
        </>
      )}
    </ActionContainer>
  );
}