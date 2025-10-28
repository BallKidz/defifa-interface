import { BigNumber } from "ethers";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { createContext, useContext } from "react";
import { DefifaProjectMetadata, DefifaTier } from "types/defifa";
import { JBFundingCycle, JBFundingCycleMetadata } from "types/juicebox";

type GameContextType = {
  gameId: number;
  metadata: DefifaProjectMetadata | undefined;
  currentPhase: DefifaGamePhase;
  governor: string | undefined;
  currentFundingCycle:
    | {
        fundingCycle: JBFundingCycle;
        metadata: JBFundingCycleMetadata;
      }
    | undefined;
  nfts: {
    tiers: DefifaTier[] | undefined | null;
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

const defaultContextValue: GameContextType = {
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
};


export const GameContext = createContext<GameContextType>(defaultContextValue);

export function useGameContext() {
  const ctx = useContext(GameContext);
  return ctx;
}
