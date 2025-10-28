import { useChainData } from "hooks/useChainData";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "viem";

export function useInitializeGame(
  gameId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();


  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const write = () => {
    
    if (governorAddress) {
      try {
        writeContract({
          address: governorAddress as `0x${string}`,
          abi: chainData.DefifaGovernor.interface as Abi,
          functionName: "initializeGame",
          args: [
            gameId,
            Math.floor(Date.now() / 1000), // Current timestamp as attestation start time
            0 // No grace period
          ],
          chainId: chainData.chainId,
        });
      } catch (err) {
        console.error("🔥 Error calling writeContract:", err);
      }
    } else {
      console.error("🔥 Governor address not available");
    }
  };


  return {
    data: hash,
    write,
    isLoading,
    isSuccess,
    error: error || receiptError,
    isError: isError || !!receiptError,
  };
}
