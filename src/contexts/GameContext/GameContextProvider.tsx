import { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import { useCurrentGamePhase } from "hooks/read/useCurrentGamePhase";
import { useProjectCurrentFundingCycle } from "hooks/read/useProjectCurrentFundingCycle";
import { useDefifaTiers as useDefifaTiersHook } from "hooks/read/useDefifaTiers";
import { useDefifaTiers } from "hooks/useDefifaTiers";
import { useTotalSupply } from "hooks/read/JB721Delegate/useTotalSupply";
import { useGameMetadata } from "hooks/read/useGameMetadata";
import { useGovernorForDelegate } from "hooks/read/useGovernorForDelegate";
import { useChainData } from "hooks/useChainData";

export default function GameContextProvider({
  gameId,
  chainId,
  children,
}: PropsWithChildren<{
  gameId: number;
  chainId?: number;
}>) {
  // Use the provided chainId to fetch data from the correct network
  if (chainId) {
    console.log(`GameContextProvider: Viewing game ${gameId} on chain ${chainId}`);
  }
  
  const { data: currentPhase, isLoading: currentPhaseLoading } =
    useCurrentGamePhase(gameId, chainId);
  const { data: currentFundingCycle, isLoading: currentFundingCycleLoading } =
    useProjectCurrentFundingCycle(gameId, chainId);
  const { data: metadata, isLoading: metadataLoading } =
    useGameMetadata(gameId, chainId);
  const dataSource = currentFundingCycle?.metadata.dataSource;


  const { data: totalSupply } = useTotalSupply(dataSource, chainId);
  
  // Fetch tiers using Defifa v5 approach (query individual tiers from store)
  const { data: tiersOf, isLoading: tiersOfLoading, error: tiersOfError } = useDefifaTiersHook(dataSource, chainId);
  
  
  // Transform tier data for UI consumption by calling tokenURI on the NFT contract
  // dataSource is the NFT delegate address
  const { data: tiers, isLoading: tiersLoading, error: tiersError } = useDefifaTiers(
    tiersOf ?? [],
    dataSource // Pass the NFT address to call tokenURI
  );

  const { chainData } = useChainData();

  // Get the actual governor address for this specific game from the delegate contract
  const { data: governorFromDelegate } = useGovernorForDelegate(dataSource);
  
  // Fallback to hardcoded governor address if delegate lookup fails
  const governor = governorFromDelegate || chainData.DefifaGovernor.address;

  // Removed debug logs to prevent rate limiting

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
