import { useChainData } from "hooks/useChainData";
import { useGameChainValidation } from "hooks/useChainValidation";
import {
  DefifaTierRedemptionWeight,
  DefifaTierRedemptionWeightParams,
} from "types/defifa";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Abi } from "viem";

export function useSubmitScorecard(
  gameId: number,
  _tierWeights: DefifaTierRedemptionWeightParams[],
  governorAddress: string | undefined,
  onSuccess?: () => void
) {
  const { chainData } = useChainData();
  const queryClient = useQueryClient();
  
  // Store onSuccess in a ref to avoid infinite loops when it changes
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  
  // Validate chain for game transactions
  const chainValidation = useGameChainValidation(chainData.chainId);

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success with useEffect - use ref to avoid dependency on onSuccess
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate and refetch scorecards immediately
      queryClient.invalidateQueries({ queryKey: ["scorecards", chainData.chainId, gameId] });
      
      // Invalidate all stateOf queries to ensure fresh scorecard state (Pending → Active)
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          if (key[0] !== "readContract") return false;
          const descriptor = key[1];
          if (!descriptor || typeof descriptor !== "object") return false;
          const fn = (descriptor as { functionName?: string }).functionName;
          return fn === "stateOf"; // Invalidate scorecard state queries
        },
      });
      
      // Do aggressive refetching with delay to account for subgraph indexing and state transition
      const refetchWithDelay = async () => {
        // Immediate refetch - scorecards and state
        await queryClient.refetchQueries({ queryKey: ["scorecards", chainData.chainId, gameId] });
        await queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey;
            if (!Array.isArray(key)) return false;
            if (key[0] !== "readContract") return false;
            const descriptor = key[1];
            if (!descriptor || typeof descriptor !== "object") return false;
            const fn = (descriptor as { functionName?: string }).functionName;
            return fn === "stateOf";
          }
        });
        
        // Retry after 2 seconds (subgraph indexing delay + state transition)
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ["scorecards", chainData.chainId, gameId] });
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "stateOf";
            }
          });
        }, 2000);
        
        // Final retry after 5 seconds
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ["scorecards", chainData.chainId, gameId] });
          queryClient.refetchQueries({
            predicate: (query) => {
              const key = query.queryKey;
              if (!Array.isArray(key)) return false;
              if (key[0] !== "readContract") return false;
              const descriptor = key[1];
              if (!descriptor || typeof descriptor !== "object") return false;
              const fn = (descriptor as { functionName?: string }).functionName;
              return fn === "stateOf";
            }
          });
        }, 5000);
      };
      
      void refetchWithDelay();
      onSuccessRef.current?.();
    }
  }, [isSuccess, hash, queryClient, gameId, chainData.chainId]);

  const write = async () => {

    // Check chain validation first
    if (!chainValidation.isValid) {
      if (chainValidation.needsSwitch) {
        try {
          await chainValidation.switchChain();
          // Wait a moment for chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Failed to switch chain:', error);
          return;
        }
      } else {
        console.error('Chain validation failed:', chainValidation.error);
        return;
      }
    }

    if (_tierWeights && _tierWeights.length > 0 && governorAddress) {
      // Convert BigNumber to string for contract call
      const validatedTierWeights = _tierWeights.map((weight) => {
        return {
          id: weight.id,
          cashOutWeight: weight.redemptionWeight.toString()
        };
      });
      
      
      writeContract({
        address: governorAddress as `0x${string}`,
        abi: chainData.DefifaGovernor.interface as any,
        functionName: "submitScorecardFor",
        args: [gameId, validatedTierWeights],
        chainId: chainData.chainId,
      });
    } else {
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
