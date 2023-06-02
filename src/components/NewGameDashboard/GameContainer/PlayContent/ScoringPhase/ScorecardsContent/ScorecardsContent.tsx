import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { useScorecards } from "hooks/useScorecards";

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

  return (
    <Container>
      {scorecards?.map((x) => (
        <div key={x.proposalId.toString()}>{x.proposalId.toString()}</div>
      ))}
    </Container>
  );
}
