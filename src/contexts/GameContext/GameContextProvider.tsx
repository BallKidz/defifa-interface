import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";

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

  const { data: totalSupply } = useNftRewardsTotalSupply(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: tiersOf } = useNftRewardTiersOf(
    currentFundingCycle?.metadata.dataSource
  );
  const { data: tiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiersOf ?? []
  );

  return (
    <GameContext.Provider
      value={{
        gameId,
        currentPhase,
        currentFundingCycle,
        nfts: {
          tiers,
          totalSupply,
        },
        loading: {
          currentPhaseLoading,
          nfts: {
            tiers: nftRewardTiersLoading,
          },
          currentFundingCycleLoading,
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
