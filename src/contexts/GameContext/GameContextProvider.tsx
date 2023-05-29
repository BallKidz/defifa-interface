import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";

export default function GameContextProvider({
  gameId,
  children,
}: PropsWithChildren<{
  gameId: number;
}>) {
  const { data: currentPhase } = useCurrentGamePhase(gameId);

  return (
    <GameContext.Provider value={{ gameId, currentPhase }}>
      {children}
    </GameContext.Provider>
  );
}
