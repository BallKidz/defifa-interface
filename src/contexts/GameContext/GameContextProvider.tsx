import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { useGameMetadata } from "hooks/read/GameMetadata";

export default function GameContextProvider({
  gameId,
  children,
}: PropsWithChildren<{
  gameId: number;
}>) {
  const { data: currentPhase, isLoading: currentPhaseLoading } =
    useCurrentGamePhase(gameId);
  const { data: currentFundingCycle, isLoading: currentFundingCycleLoading } =
    useProjectCurrentFundingCycle(gameId);
  const { data: metadata, isLoading: metadataLoading } =
    useGameMetadata(gameId);
  const { data: totalSupply } = useNftRewardsTotalSupply(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: tiersOf, isLoading: tiersOfLoading } = useNftRewardTiersOf(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: tiers, isLoading: tiersLoading } = useNftRewards(tiersOf ?? []);

  return (
    <GameContext.Provider
      value={{
        gameId,
        metadata,
        currentPhase,
        currentFundingCycle,
        nfts: {
          tiers,
          totalSupply,
        },
        loading: {
          metadataLoading,
          currentPhaseLoading,
          nfts: {
            tiersLoading: tiersLoading || tiersOfLoading,
          },
          currentFundingCycleLoading,
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
