import { useChainData } from "hooks/useChainData";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Abi } from "viem";

export function useAttestToScorecard(
  gameId: number,
  scorecardId: bigint,
  governorAddress: string | undefined,
  onSuccess?: () => void
) {
  const { chainData } = useChainData();
  const queryClient = useQueryClient();

  // Removed debug logging to reduce console noise

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success with useEffect
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate all relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["scorecards", chainData.chainId, gameId] });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          if (key[0] !== "readContract") return false;
          const descriptor = key[1];
          if (!descriptor || typeof descriptor !== "object") return false;
          const fn = (descriptor as { functionName?: string }).functionName;
          // Invalidate all vote-related and proposal state queries
          return fn === "attestationCountOf" || 
                 fn === "getAttestationWeight" || 
                 fn === "quorum" ||
                 fn === "stateOf" || // Scorecard state (for Lock in button)
                 fn === "votesOf" ||  // Proposal votes
                 fn === "getVotes";   // User votes
        },
      });
      
      // Aggressive refetch with delays to ensure UI updates
      const refetchWithDelay = async () => {
        // Immediate refetch
        await queryClient.refetchQueries({ 
          predicate: (query) => {
            const key = query.queryKey;
            if (!Array.isArray(key)) return false;
            if (key[0] !== "readContract") return false;
            const descriptor = key[1];
            if (!descriptor || typeof descriptor !== "object") return false;
            const fn = (descriptor as { functionName?: string }).functionName;
            return fn === "stateOf" || fn === "votesOf";
          }
        });
        
        // Retry after 1 second
        setTimeout(() => {
          queryClient.refetchQueries({ 
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "stateOf" || fn === "votesOf";
            }
          });
        }, 1000);
        
        // Final retry after 3 seconds
        setTimeout(() => {
          queryClient.refetchQueries({ 
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "stateOf" || fn === "votesOf";
            }
          });
        }, 3000);
      };
      
      void refetchWithDelay();
      onSuccess?.();
    }
  }, [isSuccess, hash, onSuccess, queryClient, gameId, chainData.chainId]);

  const write = () => {
    
    if (governorAddress && scorecardId && gameId) {
      
      try {
        writeContract({
          address: governorAddress as `0x${string}`,
          abi: chainData.DefifaGovernor.interface as any,
          functionName: "attestToScorecardFrom",
          args: [gameId, scorecardId],
          chainId: chainData.chainId,
        });
      } catch (err) {
        console.error("🔥 Error calling writeContract:", err);
      }
    } else {
      console.error("🔥 Missing required parameters:", {
        governorAddress: !!governorAddress,
        scorecardId: !!scorecardId,
        gameId: !!gameId
      });
    }
  };

  return {
    data: hash,
    write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
