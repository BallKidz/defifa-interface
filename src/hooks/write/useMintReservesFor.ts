import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";
import { Abi } from "viem";

export function useMintReservesFor(
  simulate = false,
  dataSourceAddress: string
) {
  const { isConnected } = useAccount();
  const { chainData } = useChainData();
  const outStanding = useOutstandingNumber();

  const filteredOutstanding = outStanding.filter((item) => {
    return item.count > 0;
  });

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  return {
    data: hash,
    write: () => {
      if (!isConnected) {
        return; // Let the UI handle showing connect modal
      } else {
        writeContract({
          address: dataSourceAddress as `0x${string}`,
          abi: chainData.DefifaDelegate.interface as Abi,
          functionName: "mintReservesFor((uint256,uint256)[])",
          args: [outStanding],
          chainId: chainData.chainId,
        });
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: filteredOutstanding.length == 0,
  };
}
