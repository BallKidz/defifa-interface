import { createContext, useContext } from "react";

export type GameContextType = {
  gameId: number;
};

export const GameContext = createContext<GameContextType>({
  gameId: 1,
});

export function useGameContext() {
  const ctx = useContext(GameContext);
  return ctx;
}
