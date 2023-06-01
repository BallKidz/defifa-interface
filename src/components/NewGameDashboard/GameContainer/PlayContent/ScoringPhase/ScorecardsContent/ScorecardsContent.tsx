import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { useScorecards } from "hooks/useScorecards";

export function ScorecardsContent() {
  const { governor } = useGameContext();
  const { data: scorecards } = useScorecards(governor);

  return (
    <Container>
      {scorecards?.map((x) => (
        <div key={x.proposalId.toString()}>{x.proposalId.toString()}</div>
      ))}
    </Container>
  );
}
