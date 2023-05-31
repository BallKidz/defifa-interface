import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { BigNumber } from "ethers";
import { createContext, useContext } from "react";
import {
  JBFundingCycle,
  JBFundingCycleMetadata,
  JBProjectMetadata,
} from "types/interfaces";

type GameContextType = {
  gameId: number;
  metadata: JBProjectMetadata | undefined;
  currentPhase: DefifaGamePhase;
  currentFundingCycle:
    | {
        fundingCycle: JBFundingCycle;
        metadata: JBFundingCycleMetadata;
      }
    | undefined;
  nfts: {
    tiers: any;
    totalSupply: BigNumber | undefined;
  };
  loading: {
    metadataLoading: boolean;
    currentPhaseLoading: boolean;
    currentFundingCycleLoading: boolean;
    nfts: {
      tiers: boolean;
    };
  };
};

export const GameContext = createContext<GameContextType>({
  gameId: 1,
  metadata: undefined,
  currentPhase: DefifaGamePhase.COUNTDOWN,
  currentFundingCycle: undefined,
  nfts: {
    tiers: undefined,
    totalSupply: undefined,
  },
  loading: {
    metadataLoading: true,
    currentPhaseLoading: true,
    currentFundingCycleLoading: true,
    nfts: {
      tiers: true,
    },
  },
});

export function useGameContext() {
  const ctx = useContext(GameContext);
  return ctx;
}
