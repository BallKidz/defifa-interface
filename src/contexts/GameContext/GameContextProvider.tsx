import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "components/GameDashboard/QueueNextPhaseButton/useCurrentGamePhase";
import { useProjectCurrentFundingCycle } from "hooks/read/useProjectCurrentFundingCycle";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { useGameMetadata } from "hooks/read/useGameMetadata";
import { useGovernorForDelegate } from "hooks/read/useGovernorForDelegate";

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
  const dataSource = currentFundingCycle?.metadata.dataSource;
  const { data: totalSupply } = useNftRewardsTotalSupply(dataSource);
  const { data: tiersOf, isLoading: tiersOfLoading } =
    useNftRewardTiersOf(dataSource);
  const { data: tiers, isLoading: tiersLoading } = useNftRewards(tiersOf ?? []);
  const { data: governor } = useGovernorForDelegate(dataSource);

  const context = {
    gameId,
    metadata,
    currentPhase,
    currentFundingCycle,
    governor,
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
  };

  console.log("game context", context);

  return (
    <GameContext.Provider value={context}>{children}</GameContext.Provider>
  );
}
