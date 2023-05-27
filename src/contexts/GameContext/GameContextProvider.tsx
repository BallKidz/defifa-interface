import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";

export default function GameContextProvider({
  gameId,
  children,
}: PropsWithChildren<{
  gameId: number;
}>) {
  return (
    <GameContext.Provider value={{ gameId }}>{children}</GameContext.Provider>
  );
}
