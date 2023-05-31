import { GameDashboard } from "components/GameDashboard";
import { NewGameDashboard } from "components/NewGameDashboard/NewGameDashboard";
import { NEW_GAME_DASHBOARD } from "constants/constants";
import GameContextProvider from "contexts/GameContext/GameContextProvider";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();

  const { gameId } = router.query;
  if (!gameId) return null;

  return (
    <GameContextProvider gameId={parseInt(gameId as string, 10)}>
      {NEW_GAME_DASHBOARD ? <NewGameDashboard /> : <GameDashboard />}
    </GameContextProvider>
  );
}
