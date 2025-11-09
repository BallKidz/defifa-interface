import { useChainData } from "hooks/useChainData";
import { DefifaTierRedemptionWeightParams } from "types/defifa";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "viem";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useRatifyScorecard(
  gameId: number,
  scorecardId: bigint,
  _tierWeights: DefifaTierRedemptionWeightParams[],
  governor: string | undefined
) {
  const { isConnected } = useAccount();
  const { chainData } = useChainData();
  const queryClient = useQueryClient();
  
  const { data: hash, writeContract, error, isError, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success - refetch pot balance and game phase
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate all queries that show pot balance, game phase, and NFT metadata
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          
          // Invalidate readContract queries for pot/phase data
          if (key[0] === "readContract") {
            const descriptor = key[1];
            if (!descriptor || typeof descriptor !== "object") return false;
            const fn = (descriptor as { functionName?: string }).functionName;
            return fn === "currentGamePotOf" || 
                   fn === "currentGamePhaseOf" ||
                   fn === "currentSurplusOf" ||
                   fn === "currentOverflowOf" ||
                   fn === "accountingContextsOf" ||
                   fn === "stateOf" || // Scorecard state
                   fn === "redemptionWeightIsSet" || // Redemption weights set flag
                   fn === "tokenURI"; // NFT metadata (shows new pot value)
          }
          
          // Invalidate tiers data (which includes NFT metadata)
          if (key[0] === "tiers") return true;
          
          return false;
        },
      });

      // Aggressive refetch with delays to ensure pot balance and NFT metadata update
      const refetchWithDelay = async () => {
        // Immediate refetch - pot and phase
        await queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey;
            if (!Array.isArray(key)) return false;
            if (key[0] !== "readContract") return false;
            const descriptor = key[1];
            if (!descriptor || typeof descriptor !== "object") return false;
            const fn = (descriptor as { functionName?: string }).functionName;
            return fn === "currentGamePotOf" || fn === "currentGamePhaseOf";
          }
        });

        // Retry after 1 second - pot and phase
        setTimeout(() => {
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "currentGamePotOf" || fn === "currentGamePhaseOf";
            }
          });
        }, 1000);

        // After 2 seconds - NFT tokenURIs (depend on pot being updated)
        setTimeout(() => {
          // Invalidate and refetch all tokenURI queries
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] === "readContract" || key[0] === "readContracts") {
                const descriptor = key[1];
                if (!descriptor || typeof descriptor !== "object") return false;
                const fn = (descriptor as { functionName?: string }).functionName;
                // Refetch tokenURI calls
                return fn === "tokenURI";
              }
              // Also refetch the tiers useQuery cache
              if (key[0] === "tiers") return true;
              return false;
            }
          });
        }, 2000);

        // Final retry after 4 seconds - everything
        setTimeout(() => {
          // Refetch pot/phase one more time
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "currentGamePotOf" || fn === "currentGamePhaseOf";
            }
          });
          
          // Refetch NFT metadata one more time
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] === "readContract" || key[0] === "readContracts") {
                const descriptor = key[1];
                if (!descriptor || typeof descriptor !== "object") return false;
                const fn = (descriptor as { functionName?: string }).functionName;
                return fn === "tokenURI";
              }
              if (key[0] === "tiers") return true;
              return false;
            }
          });
        }, 4000);
      };

      void refetchWithDelay();
    }
  }, [isSuccess, hash, queryClient]);


  const handleWrite = () => {
    if (!isConnected) {
      return; // Let the UI handle showing connect modal
    } else if (governor) {
      if (!writeContract) {
        return;
      }
      
      try {
        const validatedTierWeights = _tierWeights.map((tw) => ({
          id: Number(tw.id),
          cashOutWeight: BigInt(tw.redemptionWeight.toString())
        }));

        writeContract({
          address: governor as `0x${string}`,
          abi: chainData.DefifaGovernor.interface as any,
          functionName: "ratifyScorecardFrom",
          args: [gameId, validatedTierWeights] as any,
          chainId: chainData.chainId,
        });
      } catch (err) {
        console.error("Error calling writeContract for ratify:", err);
      }
    }
  };

  return {
    data: hash,
    write: handleWrite,
    isLoading: isPending || isLoading,
    isSuccess,
    error,
    isError,
  };
}
