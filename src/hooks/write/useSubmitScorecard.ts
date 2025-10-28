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
import { useEffect } from "react";
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
  
  // Validate chain for game transactions
  const chainValidation = useGameChainValidation(chainData.chainId);

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success with useEffect
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate scorecards cache to show new scorecard immediately
      queryClient.invalidateQueries({ queryKey: ["scorecards", gameId] });
      
      onSuccess?.();
    }
  }, [isSuccess, hash, onSuccess, queryClient, gameId]);

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
