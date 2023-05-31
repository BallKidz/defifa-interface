import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";

export function RulesContent() {
  const { metadata } = useGameContext();
  return (
    <Container>
      <p>{metadata?.description}</p>
    </Container>
  );
}
