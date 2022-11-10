import { createContext } from "react";
import { TeamTier } from "./useMyTeams";

export const TeamsContext = createContext<TeamTier[]| undefined>([]);
