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

  console.log("🔥 useInitializeGame called", {
    gameId,
    governorAddress,
    chainData: !!chainData
  });

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const write = () => {
    console.log("🔥 Initializing game", {
      gameId,
      governorAddress,
      attestationStartTime: Math.floor(Date.now() / 1000), // Current timestamp
      attestationGracePeriod: 0, // No grace period for fast attestation
      chainId: chainData.chainId,
      abiLength: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.length : 'unknown',
      hasInitializeGameFunction: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.some((item: any) => item.name === "initializeGame") : false
    });
    
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

  console.log("🔥 useInitializeGame result", {
    hash,
    isLoading,
    isSuccess,
    error,
    isError,
    receiptError
  });

  return {
    data: hash,
    write,
    isLoading,
    isSuccess,
    error: error || receiptError,
    isError: isError || !!receiptError,
  };
}
