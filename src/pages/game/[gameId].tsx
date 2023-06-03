import { GameDashboard } from "components/GameDashboard/GameDashboard";
import GameContextProvider from "contexts/GameContext/GameContextProvider";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();

  const { gameId } = router.query;
  if (!gameId) return null;

  return (
    <GameContextProvider gameId={parseInt(gameId as string, 10)}>
      <GameDashboard />
    </GameContextProvider>
  );
}
