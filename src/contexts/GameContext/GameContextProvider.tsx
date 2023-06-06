import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "hooks/read/useCurrentGamePhase";
import { useProjectCurrentFundingCycle } from "hooks/read/useProjectCurrentFundingCycle";
import { useTiersOf } from "hooks/read/JB721Delegate/useTiersOf";
import { useDefifaTiers } from "hooks/useDefifaTiers";
import { useTotalSupply } from "hooks/read/JB721Delegate/useTotalSupply";
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

  const { data: totalSupply } = useTotalSupply(dataSource);
  const { data: tiersOf, isLoading: tiersOfLoading } = useTiersOf(dataSource);
  const { data: tiers, isLoading: tiersLoading } = useDefifaTiers(
    tiersOf ?? []
  );

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
