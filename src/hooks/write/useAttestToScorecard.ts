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
      queryClient.invalidateQueries({ queryKey: ["scorecards", gameId] });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          if (key[0] !== "readContract") return false;
          const descriptor = key[1];
          if (!descriptor || typeof descriptor !== "object") return false;
          const fn = (descriptor as { functionName?: string }).functionName;
          return fn === "attestationCountOf" || fn === "getAttestationWeight" || fn === "quorum";
        },
      });
      
      onSuccess?.();
    }
  }, [isSuccess, hash, onSuccess, queryClient, gameId]);

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
