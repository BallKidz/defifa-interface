import { GameRow } from "components/Arcade/GameRow";
import { useAllGames } from "hooks/useAllGames";
import { useOmnichainGames, OmnichainGame } from "hooks/useOmnichainGames";
import { useState, useMemo } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./TurnOn.module.css";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

type SortField = 'chain' | 'gameId' | 'name';
type SortDirection = 'asc' | 'desc';

const AllGames = ({ chainId }: { chainId?: number }) => {
  const { isInMiniApp } = useFarcasterContext();
  const { triggerSelection } = useMiniAppHaptics();
  const [includeTestnets, setIncludeTestnets] = useState(true);
  const [sortField, setSortField] = useState<SortField>('gameId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Use omnichain hook if no specific chainId is provided
  const { 
    isError: omnichainError, 
    isLoading: omnichainLoading, 
    data: omnichainGames 
  } = useOmnichainGames(includeTestnets);
  
  // Use single-chain hook if chainId is provided
  const { 
    isError: singleChainError, 
    isLoading: singleChainLoading, 
    data: singleChainGames 
  } = useAllGames(chainId);

  const isOmnichain = !chainId;
  const isError = isOmnichain ? omnichainError : singleChainError;
  const isLoading = isOmnichain ? omnichainLoading : singleChainLoading;
  const rawGames = isOmnichain ? omnichainGames : singleChainGames;

  // Sorting logic
  const games = useMemo(() => {
    if (!rawGames) return [];
    
    return [...rawGames].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'chain':
          aValue = isOmnichain ? (a as OmnichainGame).networkName : 'Current Network';
          bValue = isOmnichain ? (b as OmnichainGame).networkName : 'Current Network';
          break;
        case 'gameId':
          aValue = a.gameId;
          bValue = b.gameId;
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
  }, [rawGames, sortField, sortDirection, isOmnichain]);

  const handleSort = (field: SortField) => {
    void triggerSelection();
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (!isError && !isLoading && (!games || games.length === 0)) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-400 mb-4">No games found.</p>
        {isOmnichain && (
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
      {/* Network Filter Toggle - only show for omnichain */}
      {isOmnichain && (
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
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-neutral-400">
            {isOmnichain ? "Loading games from all networks..." : "Loading games..."}
          </p>
        </div>
      )}
      
      {!isLoading && !isError && games && (
        <div className={isInMiniApp ? "overflow-x-auto -mx-4 px-4" : ""}>
          <table className={`mx-auto ${isInMiniApp ? "w-full min-w-[640px]" : ""}`}>
            <thead>
              <tr className="font-normal">
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
              <th
                className={
                  isInMiniApp
                    ? "font-normal text-sm py-3"
                    : "font-normal text-sm py-3 hidden md:table-cell"
                }
              >
                Phase
              </th>
              <th
                className={
                  isInMiniApp
                    ? "font-normal text-sm py-3"
                    : "font-normal text-sm py-3 hidden md:table-cell"
                }
              >
                Pot Size
              </th>
              <th
                className={
                  isInMiniApp
                    ? "font-normal text-sm py-3"
                    : "font-normal text-sm py-3 hidden md:table-cell"
                }
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <GameRow 
                game={game} 
                key={isOmnichain ? `${(game as OmnichainGame).chainId}-${game.gameId}` : game.gameId} 
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
