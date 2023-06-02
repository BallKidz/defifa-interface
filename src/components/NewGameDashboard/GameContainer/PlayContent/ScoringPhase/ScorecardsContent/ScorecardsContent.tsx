import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { ONE_BILLION } from "hooks/NftRewards";
import { Scorecard, useScorecards } from "hooks/useScorecards";

const redemptionRateToPercentage = (redemptionRate: number) => {
  return redemptionRate === 0 ? 0 : (redemptionRate / ONE_BILLION) * 100;
};

export function ScorecardRow({ scorecard }: { scorecard: Scorecard }) {
  return (
    <div>
      {scorecard.proposalId.toString()}

      <div>
        {scorecard.redemptionTierWeights.map((weight) => (
          <div key={weight.id.toString()}>
            Tier {weight.id.toString()}:{" "}
            {redemptionRateToPercentage(weight.redemptionWeight).toString()}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScorecardsContent() {
  const { governor } = useGameContext();
  const { data: scorecards, isLoading } = useScorecards(governor);

  if (isLoading) {
    return <Container>...</Container>;
  }

  if (!scorecards || scorecards.length === 0) {
    return (
      <Container>
        No scorecards submitted yet.{" "}
        <div className="text-xs">
          (or, some scorecards haven&apos;t been indexed yet)
        </div>
      </Container>
    );
  }

  console.log(scorecards);

  return (
    <Container>
      {scorecards?.map((scorecard) => (
        <ScorecardRow
          key={scorecard.proposalId.toString()}
          scorecard={scorecard}
        />
      ))}
    </Container>
  );
}
