"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAccount } from "wagmi";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { usePay } from "hooks/write/usePay";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { constants } from "ethers";
import { toastSuccess } from "utils/toast";
import { OutcomeCell, GridState, ChainAndId } from "types/scoresquare";
import { buildOutcomes, toIdx } from "utils/scoresquare";
import { buildAdapter } from "utils/outcomesAdapter";
import { useTiersApi } from "hooks/scoresquare/useTiersApi";
import { mockLiveFeed } from "utils/scoresquare";
import { useFarcasterProfiles } from "hooks/useFarcasterProfiles";
import { useGameMints } from "components/Game/GameDashboard/GameContainer/PlayContent/MintPhase/useGameMints";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/read/useDefifaTiers";
import { useGamePotBalance } from "hooks/read/useGamePotBalance";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useCountdown } from "hooks/useCountdown";
import { EthAmount } from "components/UI/EthAmount";
import Wallet from "components/layout/Navbar/Wallet";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useReadContract } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { Abi } from "viem";
import { GridCell } from "./GridCell";
import { LiveBanner } from "./LiveBanner";

interface ScoreSquarePageProps {
  gameId: ChainAndId;
}

export function ScoreSquarePage({ gameId }: ScoreSquarePageProps) {
  const { address } = useAccount();
  const { gameId: numericGameId, currentPhase, nfts, loading, metadata, currentFundingCycle } = useGameContext();
  const { isInMiniApp } = useFarcasterContext();
  const { chainData } = useChainData();
  const api = useTiersApi();
  
  // Get the delegate address (NFT contract)
  const delegateAddress = currentFundingCycle?.metadata.dataSource;
  
  // Fetch defaultAttestationDelegate from the contract
  const { data: defaultAttestationDelegate } = useReadContract({
    address: delegateAddress as `0x${string}` | undefined,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "defaultAttestationDelegate",
    chainId: chainData.chainId,
    query: {
      enabled: Boolean(delegateAddress && delegateAddress !== constants.AddressZero),
    },
  });
  
  // Fetch pot balance
  const { data: treasuryAmount } = useGamePotBalance(numericGameId);
  
  // Fetch game times for phase timer
  const { data: gameTimes, isLoading: gameTimesLoading } = useGameTimes(numericGameId);
  
  // Calculate phase end time
  let phaseEndTime: Date | undefined;
  let mintStartTime: Date | undefined;
  if (gameTimes && !gameTimesLoading) {
    const { start, refundPeriodDuration, mintPeriodDuration } = gameTimes;
    if (currentPhase === DefifaGamePhase.MINT) {
      // Mint phase ends when refund period starts
      const mintEnd = start - refundPeriodDuration;
      phaseEndTime = new Date(mintEnd * 1000);
    } else if (currentPhase === DefifaGamePhase.REFUND) {
      // Refund phase ends when game starts
      phaseEndTime = new Date(start * 1000);
    } else if (currentPhase === DefifaGamePhase.COUNTDOWN) {
      // Minting opens when countdown ends
      mintStartTime = new Date(
        (start - mintPeriodDuration - refundPeriodDuration) * 1000
      );
    }
  }
  
  const { timeRemaining: timeRemainingText } = useCountdown(phaseEndTime);
  const { timeRemaining: mintOpensInText } = useCountdown(mintStartTime);
  
  // Get price per mint from first tier (all tiers cost the same in Score Square games)
  const pricePerMint = nfts?.tiers?.[0]?.price;
  
  // Fetch all game mints to verify tier mapping
  const { data: allGameMints } = useGameMints(numericGameId);
  
  // Use a ref to store the API to avoid it being a dependency
  const apiRef = useRef(api);
  apiRef.current = api;

  const [gs, setGs] = useState<GridState>({
    gameId,
    cells: [],
    phase: "minting",
  });

  const [adapter, setAdapter] = useState<Awaited<
    ReturnType<typeof buildAdapter>
  > | null>(null);

  const [mintCell, setMintCell] = useState<OutcomeCell | null>(null);
  const [mintCost, setMintCost] = useState<bigint | null>(null);
  const [mintTierIds, setMintTierIds] = useState<number[] | null>(null);
  const [hasInitiatedMint, setHasInitiatedMint] = useState(false);

  // Build adapter when tiers are available
  useEffect(() => {
    if (!nfts?.tiers || nfts.tiers.length === 0) return;

    (async () => {
      try {
        const adpt = await buildAdapter(gameId, apiRef.current);
        setAdapter(adpt);
        
        // Debug: Log tier mapping
        if (nfts?.tiers) {
          console.log(`[ScoreSquare] Built adapter with ${nfts.tiers.length} tiers`);
          const testOutcomes = buildOutcomes();
          testOutcomes.slice(0, 5).forEach(outcome => {
            const tierId = adpt.outcomeToTierId(outcome);
            const tier = nfts.tiers?.find(t => String(t.id) === tierId);
            // Try multiple name properties: name, teamName, description
            const tierName = (tier as any)?.name || (tier as any)?.teamName || (tier as any)?.description || 'N/A';
            console.log(`[ScoreSquare] Outcome ${outcome.home}-${outcome.away} -> Tier ${tierId} (name: ${tierName})`);
          });
          
          // Debug: Log all mints grouped by tier
          if (allGameMints && allGameMints.length > 0) {
            const mintsByTier = allGameMints.reduce((acc: Record<number, any[]>, token) => {
              const tierId = Math.floor(parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY);
              if (!acc[tierId]) acc[tierId] = [];
              acc[tierId].push(token);
              return acc;
            }, {});
            
            console.log(`[ScoreSquare] All game mints (${allGameMints.length} total) by tier:`, mintsByTier);
            Object.entries(mintsByTier).forEach(([tierId, mints]) => {
              const tier = nfts.tiers?.find(t => t.id === Number(tierId));
              const tierName = (tier as any)?.name || (tier as any)?.teamName || (tier as any)?.description || 'N/A';
              console.log(`[ScoreSquare] Tier ${tierId} (${tierName}) has ${mints.length} mints:`, 
                mints.map((m: any) => ({ tokenId: m.id, owner: m.owner.id })));
            });
          }
        }
      } catch (error) {
        console.error("Failed to build adapter:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts?.tiers, gameId, allGameMints]);

  const cellsInitializedRef = useRef(false);

  // Build cells with owners
  useEffect(() => {
    if (!adapter) return;

    const outcomes = buildOutcomes();
    const cells: OutcomeCell[] = outcomes.map((id) => {
      const tierId = adapter.outcomeToTierId(id);
      return {
        id,
        tierId,
        owners: [],
      };
    });

    console.log(`[ScoreSquare] Initializing ${cells.length} cells`);
    setGs((s) => ({ ...s, cells }));
    cellsInitializedRef.current = true;
  }, [adapter]);

  // Fetch owners for all cells using a different approach
  useEffect(() => {
    if (!adapter || !cellsInitializedRef.current || !gs.cells || gs.cells.length === 0) {
      console.log(`[ScoreSquare] fetchAllOwners useEffect: adapter=${!!adapter}, cellsInitialized=${cellsInitializedRef.current}, cells.length=${gs.cells?.length || 0}`);
      return;
    }

    console.log(`[ScoreSquare] fetchAllOwners useEffect: Starting to fetch owners for ${gs.cells.length} cells...`);

    let cancelled = false;

    const fetchAllOwners = async () => {
      if (cancelled) return;

      console.log(`[ScoreSquare] fetchAllOwners: Beginning fetch...`);

      // Use cells from state directly - React guarantees this effect runs after cells are set
      const currentCells = gs.cells;
      
      console.log(`[ScoreSquare] fetchAllOwners: Found ${currentCells.length} cells to query`);
      
      if (currentCells.length === 0) {
        console.log(`[ScoreSquare] fetchAllOwners: No cells to query, returning early`);
        return;
      }
      
      // Collect all owner addresses first
      const allOwnerAddresses: `0x${string}`[] = [];
      const cellsWithOwners = await Promise.all(
        currentCells.map(async (cell) => {
          if (cancelled) return { cell, owners: [] as `0x${string}`[] };
          try {
            const owners = await apiRef.current.fetchOwnersByTier(
              String(numericGameId),
              cell.tierId
            );
            
            console.log(`[ScoreSquare] Tier ${cell.tierId} (score ${cell.id.home}-${cell.id.away}) has ${owners.length} owners:`, owners);
            
            if (owners.length > 0) {
              allOwnerAddresses.push(...owners);
            }
            return { cell, owners };
          } catch (error) {
            console.error(`Failed to fetch owners for tier ${cell.tierId}:`, error);
            return { cell, owners: [] as `0x${string}`[] };
          }
        })
      );
      
      console.log(`[ScoreSquare] Total unique owner addresses collected: ${allOwnerAddresses.length}`);
      if (allOwnerAddresses.length > 0) {
        console.log(`[ScoreSquare] Owner addresses:`, allOwnerAddresses.slice(0, 10));
      }

      if (cancelled) return;

      // Fetch all Farcaster profiles at once using the hook's logic
      const uniqueAddresses = Array.from(
        new Set(allOwnerAddresses.map((addr) => addr.toLowerCase()))
      );

      let farcasterData: Record<string, Array<{ pfp_url?: string; fid?: number }>> = {};
      
      if (uniqueAddresses.length > 0) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
          if (apiKey) {
            const query = encodeURIComponent(uniqueAddresses.join(","));
            const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${query}`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "x-neynar-experimental": "false",
              },
            });

            if (response.ok && !cancelled) {
              const rawData = await response.json();
              console.log(`[ScoreSquare] Raw Neynar response:`, rawData);
              
              // The Neynar API returns Record<string, NeynarUser[]>
              // where the key is the lowercase address
              farcasterData = rawData;
              
              console.log(`[ScoreSquare] Fetched Farcaster profiles for ${uniqueAddresses.length} addresses, got ${Object.keys(farcasterData).length} profiles`);
              
              // Debug: Log sample of what we got
              const sampleKey = Object.keys(farcasterData)[0];
              if (sampleKey) {
                console.log(`[ScoreSquare] Sample data for ${sampleKey}:`, farcasterData[sampleKey]);
              }
            } else {
              const errorText = await response.text().catch(() => 'Unknown error');
              console.warn(`[ScoreSquare] Neynar API response not OK: ${response.status}`, errorText);
            }
          }
        } catch (error) {
          console.warn("Failed to fetch Farcaster profiles:", error);
        }
      }

      // Map owners to cells with resolved profiles
      const updatedCells = cellsWithOwners.map(({ cell, owners }) => {
        if (cancelled) return cell;
        
        return {
          ...cell,
          owners: owners.map((addr) => {
            const addrLower = addr.toLowerCase();
            const profiles = farcasterData[addrLower];
            
            // Debug logging
            if (profiles && profiles.length > 0) {
              console.log(`[ScoreSquare] Found profiles for ${addr}:`, profiles);
            } else {
              console.log(`[ScoreSquare] No profiles found for ${addr} (looking for key: ${addrLower})`);
              console.log(`[ScoreSquare] Available keys:`, Object.keys(farcasterData).slice(0, 5));
            }
            
            const profile = profiles?.[0];
            
            return {
              address: addr,
              fid: profile?.fid,
              pfpUrl: profile?.pfp_url,
            };
          }),
        };
      });
      
      if (!cancelled) {
        setGs((s) => {
          // Only update if cells structure hasn't changed (same tierIds)
          const tierIdsMatch = s.cells.length === updatedCells.length &&
            s.cells.every((sc, i) => sc.tierId === updatedCells[i]?.tierId);
          
            if (tierIdsMatch) {
              console.log(`[ScoreSquare] Updating ${updatedCells.length} cells with owner data`);
              
              // Log all cells with owners
              const cellsWithOwnersList = updatedCells.filter(c => c.owners.length > 0);
              console.log(`[ScoreSquare] Cells with owners (${cellsWithOwnersList.length}):`, 
                cellsWithOwnersList.map(c => ({
                  cell: `${c.id.home}-${c.id.away}`,
                  tierId: c.tierId,
                  owners: c.owners.map(o => ({
                    address: o.address,
                    hasPfp: !!o.pfpUrl,
                    pfpUrl: o.pfpUrl || 'NONE'
                  }))
                }))
              );
              
              return { ...s, cells: updatedCells };
            }
          return s; // Don't update if structure changed
        });
      }
    };

    fetchAllOwners();
    // Refresh every 10 seconds to check for new mints
    const interval = setInterval(fetchAllOwners, 10 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // Re-run when adapter or numericGameId changes, or when cells are first initialized
    // We use gs.cells.length > 0 to detect when cells are ready, but only trigger once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adapter, numericGameId, gs.cells.length > 0 ? gs.cells.length : 0]);

  // Mock live scoring phase
  useEffect(() => {
    if (currentPhase === DefifaGamePhase.SCORING) {
      setGs((s) => ({ ...s, phase: "scoring" }));
      const stop = mockLiveFeed((live) =>
        setGs((s) => ({ ...s, liveScore: live }))
      );
      return stop;
    } else if (currentPhase === DefifaGamePhase.COMPLETE) {
      setGs((s) => ({ ...s, phase: "final" }));
    } else {
      setGs((s) => ({ ...s, phase: "minting" }));
    }
  }, [currentPhase]);

  const onMint = (cell: OutcomeCell) => {
    if (!nfts?.tiers || !adapter || !address || isMinting) return;

    const tier = nfts.tiers.find((t) => String(t.id) === cell.tierId);
    if (!tier) return;

    // Build metadata with the tier ID
    const tierIdsToMint = [Number(cell.tierId)];
    const costWei = tier.price;

    // Set state to trigger mint via useEffect
    setMintCell(cell);
    setMintCost(costWei);
    setMintTierIds(tierIdsToMint);
  };

  // Memoize onSuccess to prevent it from changing on every render
  const handleMintSuccess = useCallback(() => {
    setMintCell(null);
    setMintCost(null);
    setMintTierIds(null);
    setHasInitiatedMint(false);
    // Owners will refresh automatically via the interval in the useEffect
    // Note: toastSuccess is already called in usePay hook, so we don't need to call it here
  }, []);

  const { write, isLoading: isMinting } = usePay({
    amount: mintCost?.toString() || "0",
    token: ETH_TOKEN_ADDRESS,
    minReturnedTokens: "0",
    preferClaimedTokens: true,
    memo: `Minted on defifa.net`,
    metadata: {
      // Use the game's defaultAttestationDelegate (game deployer) so votes go to deployer, not minter
      _votingDelegate: (defaultAttestationDelegate as `0x${string}`) || constants.AddressZero,
      tierIdsToMint: mintTierIds || [],
    },
    onSuccess: handleMintSuccess,
  });

  // Trigger mint when cell is selected
  useEffect(() => {
    if (
      mintCell &&
      mintCost &&
      mintTierIds &&
      mintTierIds.length > 0 &&
      write &&
      !isMinting &&
      !hasInitiatedMint
    ) {
      setHasInitiatedMint(true);
      write();
    }
  }, [mintCell, mintCost, mintTierIds, write, isMinting, hasInitiatedMint]);

  const canMint =
    currentPhase === DefifaGamePhase.MINT && !!address && !isMinting;

  if (!adapter) {
    return (
      <div className="p-3 text-center text-neutral-400">Loading grid...</div>
    );
  }

  return (
    <div className="p-3">
      {/* Game Header: Name, Rules, and Wallet */}
      <div className="mb-4 space-y-3">
        {/* Game Name */}
        {metadata?.name && (
          <h1 className="text-2xl font-medium [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)]">
            {metadata.name}
          </h1>
        )}
        
        {/* Rules */}
        {metadata?.description && (
          <p className="text-sm text-neutral-300">
            <span className="text-neutral-400">Rules: </span>
            {metadata.description}
          </p>
        )}
        
        {/* Wallet Connection - only show outside miniapp */}
        <div className="flex items-center justify-between gap-4">
          {!isInMiniApp && <Wallet />}
          {/* Pot Balance - compact */}
          {treasuryAmount && currentPhase !== DefifaGamePhase.COUNTDOWN && (
            <div className="border-4 border-lime-600 border-dotted rounded-2xl px-3 py-2">
              <div className="font-medium flex items-baseline gap-2 text-lime-400">
                <EthAmount
                  amountWei={treasuryAmount}
                  className="text-2xl leading-none"
                  iconClassName="h-5 w-5"
                />
                <span className="uppercase text-xs leading-none">in pot</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Countdown to Minting Opens */}
      {currentPhase === DefifaGamePhase.COUNTDOWN &&
      !loading.currentPhaseLoading &&
      !gameTimesLoading &&
      mintOpensInText &&
      mintStartTime ? (
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="text-center">
            <div className="text-sm text-neutral-400 mb-1">Minting opens in</div>
            <div className="text-3xl font-bold" style={{ color: "#EB007B" }}>
              {mintOpensInText}
            </div>
          </div>
          {pricePerMint && (
            <div className="text-sm text-neutral-300">
              <span className="text-neutral-400">Price per mint: </span>
              <EthAmount
                amountWei={pricePerMint}
                className="text-sm font-medium text-lime-400"
              />
            </div>
          )}
        </div>
      ) : null}
      
      {/* Phase Timer (for MINT and REFUND phases) */}
      {(currentPhase === DefifaGamePhase.MINT || currentPhase === DefifaGamePhase.REFUND) &&
      !loading.currentPhaseLoading &&
      !gameTimesLoading &&
      timeRemainingText &&
      phaseEndTime ? (
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="bg-rose-700 shadow-glowPink rounded-md px-2.5 py-1.5">
            <span className="text-sm font-medium text-white">⏱ {timeRemainingText}</span>
          </div>
          {pricePerMint && (
            <div className="text-sm text-neutral-300">
              <span className="text-neutral-400">Price per mint: </span>
              <EthAmount
                amountWei={pricePerMint}
                className="text-sm font-medium text-lime-400"
              />
            </div>
          )}
        </div>
      ) : null}
      
      <LiveBanner score={gs.liveScore} />
      <div className="grid grid-cols-6 gap-2">
        {/* Empty corner */}
        <div className="flex items-center justify-center"></div>
        
        {/* Column headers (Away: 0-3, +4) */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={`away-${i}`}
            className="flex items-center justify-center text-xs font-mono text-neutral-400"
          >
            {i === 4 ? `+${i}` : i}
          </div>
        ))}

        {/* Grid rows */}
        {Array.from({ length: 5 }, (_, rowIdx) => {
          const homeScore = rowIdx;
          return (
            <div key={`row-${rowIdx}`} className="contents">
              {/* Row label (Home: 0-3, +4) */}
              <div className="flex items-center justify-center text-xs font-mono text-neutral-400">
                {rowIdx === 4 ? `+${rowIdx}` : rowIdx}
              </div>
              
              {/* Cells for this row */}
              {Array.from({ length: 5 }, (_, colIdx) => {
                const awayScore = colIdx;
                const cellIdx = toIdx(homeScore, awayScore);
                const cell = gs.cells.find((c) => c.id.idx === cellIdx);
                
                if (!cell) return null;
                
                // Get mint count from tier data (contract-based)
                const tier = nfts?.tiers?.find((t) => String(t.id) === cell.tierId);
                const mintCount = tier 
                  ? (tier.initialQuantity - tier.remainingQuantity)
                  : 0;
                
                return (
                  <GridCell
                    key={cell.id.idx}
                    cell={cell}
                    gs={gs}
                    onMint={onMint}
                    me={address}
                    canMint={canMint}
                    mintCount={mintCount}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

