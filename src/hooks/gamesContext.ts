import { createContext } from "react";
import { Game } from "./useAllGames";

export const AllGamesContext = createContext<Game[] | undefined>([]);
