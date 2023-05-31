import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { BigNumber } from "ethers";
import { createContext, useContext } from "react";
import { JBFundingCycle, JBFundingCycleMetadata } from "types/interfaces";

type GameContextType = {
  gameId: number;
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
    currentPhaseLoading: boolean;
    currentFundingCycleLoading: boolean;
    nfts: {
      tiers: boolean;
    };
  };
};

export const GameContext = createContext<GameContextType>({
  gameId: 1,
  currentPhase: DefifaGamePhase.COUNTDOWN,
  currentFundingCycle: undefined,
  nfts: {
    tiers: undefined,
    totalSupply: undefined,
  },
  loading: {
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
