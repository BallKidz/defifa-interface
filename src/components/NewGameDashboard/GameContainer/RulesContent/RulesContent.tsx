import { useGameContext } from "contexts/GameContext";

export function RulesContent() {
  const { metadata } = useGameContext();
  return (
    <div>
      <p>{metadata?.description}</p>
    </div>
  );
}
