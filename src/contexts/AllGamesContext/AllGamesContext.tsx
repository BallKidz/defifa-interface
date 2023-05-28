import { createContext, useContext } from "react";

export type AllGamesContextType = {
  gameId: number;
};

export const AllGamesContext = createContext<AllGamesContextType>({
  gameId: 1,
});

export function useAllGamesContext() {
  const ctx = useContext(AllGamesContext);
  return ctx;
}