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
  governor: string | undefined;
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
      tiersLoading: boolean;
    };
  };
};

export const GameContext = createContext<GameContextType>({
  gameId: 1,
  metadata: undefined,
  currentPhase: DefifaGamePhase.COUNTDOWN,
  currentFundingCycle: undefined,
  governor: undefined,
  nfts: {
    tiers: undefined,
    totalSupply: undefined,
  },
  loading: {
    metadataLoading: true,
    currentPhaseLoading: true,
    currentFundingCycleLoading: true,
    nfts: {
      tiersLoading: true,
    },
  },
});

export function useGameContext() {
  const ctx = useContext(GameContext);
  return ctx;
}
