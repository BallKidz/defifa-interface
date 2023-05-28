import { createContext } from "react";
import { Games } from "./useAllGames";

export const AllGamesContext = createContext<Games[]| undefined>([]);
