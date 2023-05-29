import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { createContext, useContext } from "react";

type GameContextType = {
  gameId: number;
  currentPhase: DefifaGamePhase;
};

export const GameContext = createContext<GameContextType>({
  gameId: 1,
  currentPhase: DefifaGamePhase.COUNTDOWN,
});

export function useGameContext() {
  const ctx = useContext(GameContext);
  return ctx;
}
