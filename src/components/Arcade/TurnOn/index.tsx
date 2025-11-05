import { GameRow } from "components/Arcade/GameRow";
import { useAllGames } from "hooks/useAllGames";
import { useMultiNetworkGames, NetworkGame } from "hooks/useMultiNetworkGames";
import { useState, useMemo } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./TurnOn.module.css";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { useReadContracts } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { getChainData } from "config";
import { Abi } from "viem";

type SortField = 'chain' | 'gameId' | 'name';
type SortDirection = 'asc' | 'desc';

const AllGames = ({ chainId }: { chainId?: number }) => {
  const { isInMiniApp } = useFarcasterContext();
  const { triggerSelection } = useMiniAppHaptics();
  const [includeTestnets, setIncludeTestnets] = useState(true);
  const [sortField, setSortField] = useState<SortField>('gameId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Use multi-network hook if no specific chainId is provided
  const { 
    isError: multiNetworkError, 
    isLoading: multiNetworkLoading, 
    data: multiNetworkGames 
  } = useMultiNetworkGames(includeTestnets);
  
  // Use single-chain hook if chainId is provided
  const { 
    isError: singleChainError, 
    isLoading: singleChainLoading, 
    data: singleChainGames 
  } = useAllGames(chainId);

  const isMultiNetwork = !chainId;
  const isError = isMultiNetwork ? multiNetworkError : singleChainError;
  const isLoading = isMultiNetwork ? multiNetworkLoading : singleChainLoading;
  const rawGames = isMultiNetwork ? multiNetworkGames : singleChainGames;
  const { chainData } = useChainData();

  // Batch fetch phases for all games to filter out no-contest games
  const phaseContracts = useMemo(() => {
    if (!rawGames || rawGames.length === 0) return [];
    
    return rawGames.map((game) => {
      const isNetworkGame = 'chainId' in game && 'networkAbbr' in game;
      const targetChainId = isNetworkGame ? (game as NetworkGame).chainId : (chainId || chainData.chainId);
      const chainDataForGame = targetChainId ? getChainData(targetChainId) : chainData;
      
      return {
        address: chainDataForGame.DefifaDeployer.address as `0x${string}`,
        abi: chainDataForGame.DefifaDeployer.interface as Abi,
        functionName: "currentGamePhaseOf" as const,
        args: [BigInt(game.gameId)],
        chainId: targetChainId,
      };
    });
  }, [rawGames, chainId, chainData]);

  const { data: phaseResults, isLoading: phasesLoading } = useReadContracts({
    contracts: phaseContracts,
    query: {
      enabled: phaseContracts.length > 0,
    },
  });
  
  // Also consider phases loading as part of overall loading state
  const isLoadingPhases = phaseContracts.length > 0 && phasesLoading;

  // Filter and sort games (excluding no-contest games)
  const games = useMemo(() => {
    if (!rawGames) return [];
    
    // Filter out no-contest games if we have phase data
    const filteredGames = rawGames.filter((game, index) => {
      if (!phaseResults || phasesLoading) return true; // Include all games while loading phases
      
      const phaseResult = phaseResults[index];
      if (!phaseResult || phaseResult.status !== 'success') return true; // Include if phase fetch failed
      
      const phase = phaseResult.result as unknown as DefifaGamePhase;
      return phase !== DefifaGamePhase.NO_CONTEST && phase !== DefifaGamePhase.NO_CONTEST_INEVITABLE;
    });
    
    return filteredGames.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'chain':
          aValue = isMultiNetwork ? (a as NetworkGame).networkName : 'Current Network';
          bValue = isMultiNetwork ? (b as NetworkGame).networkName : 'Current Network';
          break;
        case 'gameId':
          // Treat gameIds as numbers for proper numeric sorting
          aValue = Number(a.gameId);
          bValue = Number(b.gameId);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = a.gameId;
          bValue = b.gameId;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawGames, sortField, sortDirection, isMultiNetwork, phaseResults, phasesLoading]);

  const handleSort = (field: SortField) => {
    void triggerSelection();
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (!isError && !isLoading && !isLoadingPhases && (!games || games.length === 0)) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-400 mb-4">No games found.</p>
        {isMultiNetwork && (
          <button 
            onClick={() => {
              void triggerSelection();
              setIncludeTestnets(!includeTestnets);
            }}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              includeTestnets 
                ? "bg-pink-500 text-white" 
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {includeTestnets ? "Hide test games" : "Include test games"}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Network Filter Toggle - only show for multi-network view */}
      {isMultiNetwork && (
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-neutral-400">
            Showing {games?.length || 0} games
          </div>
          <button 
            onClick={() => {
              void triggerSelection();
              setIncludeTestnets(!includeTestnets);
            }}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              includeTestnets 
                ? "bg-pink-500 text-white" 
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {includeTestnets ? "Hide test games" : "Include test games"}
          </button>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          Failed to load games. {String(isError)}
        </div>
      )}
      
      {(isLoading || isLoadingPhases) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-neutral-400">
            {isMultiNetwork ? "Loading games from all networks..." : "Loading games..."}
          </p>
        </div>
      )}
      
      {!isLoading && !isLoadingPhases && !isError && games && (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="mx-auto w-full min-w-[640px]">
            <thead>
              <tr className="font-normal">
              <th 
                className="font-normal text-sm py-3 cursor-pointer hover:text-pink-400 transition-colors select-none"
                onClick={() => handleSort('gameId')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortField === 'gameId' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="h-3 w-3" /> : 
                      <ChevronDownIcon className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="font-normal text-sm py-3 cursor-pointer hover:text-pink-400 transition-colors select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="h-3 w-3" /> : 
                      <ChevronDownIcon className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="font-normal text-sm py-3">
                Phase
              </th>
              <th className="font-normal text-sm py-3">
                Pot Size
              </th>
              <th className="font-normal text-sm py-3">
                Actions
              </th>
              <th 
                className="font-normal text-sm py-3 cursor-pointer hover:text-pink-400 transition-colors select-none"
                onClick={() => handleSort('chain')}
              >
                <div className="flex items-center gap-1">
                  Chain
                  {sortField === 'chain' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="h-3 w-3" /> : 
                      <ChevronDownIcon className="h-3 w-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <GameRow 
                game={game} 
                key={isMultiNetwork ? `${(game as NetworkGame).chainId}-${game.gameId}` : game.gameId} 
                chainId={chainId} 
              />
            ))}
          </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AllGames;
