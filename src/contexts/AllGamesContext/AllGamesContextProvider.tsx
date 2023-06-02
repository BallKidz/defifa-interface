import { PropsWithChildren } from "react";
import { AllGamesContext } from "./AllGamesContext";

export default function AllGamesContextProvider({
  gameId,
  children,
}: PropsWithChildren<{
  gameId: number;
}>) {
  return (
    <AllGamesContext.Provider value={{ gameId }}>{children}</AllGamesContext.Provider>
  );
}
