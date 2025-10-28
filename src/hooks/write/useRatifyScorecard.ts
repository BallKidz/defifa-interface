import { useChainData } from "hooks/useChainData";
import { DefifaTierRedemptionWeightParams } from "types/defifa";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "viem";

export function useRatifyScorecard(
  gameId: number,
  scorecardId: bigint,
  _tierWeights: DefifaTierRedemptionWeightParams[],
  governor: string | undefined
) {
  const { isConnected } = useAccount();
  const { chainData } = useChainData();
  
  const { data: hash, writeContract, error, isError, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });


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
