import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";
import { useGameContext } from "contexts/GameContext";
import { Abi } from "viem";

export function useMintReservesFor(
  simulate = false,
  dataSourceAddress: string
) {
  const { isConnected } = useAccount();
  const { chainData } = useChainData();
  const { nfts, currentFundingCycle } = useGameContext();

  const delegateAddress = dataSourceAddress || currentFundingCycle?.metadata.dataSource || "";
  const gameTiers = nfts?.tiers ?? [];
  const tierIds = gameTiers.map((_, index) => index + 1);

  const { data: outstandingReserves } = useOutstandingNumber(delegateAddress, tierIds);

  const filteredOutstanding = outstandingReserves.filter((item) => item.count > 0);

  const { data: hash, writeContract, error, isError } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  return {
    data: hash,
    write: () => {
      if (!isConnected) {
        return; // Let the UI handle showing connect modal
      } else if (!delegateAddress) {
        console.error("useMintReservesFor::write missing delegate address");
        return;
      }

      writeContract({
        address: delegateAddress as `0x${string}`,
        abi: chainData.DefifaDelegate.interface as Abi,
        functionName: "mintReservesFor((uint256,uint256)[])",
        args: [filteredOutstanding],
        chainId: chainData.chainId,
      });
    },
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: filteredOutstanding.length === 0 || !delegateAddress,
  };
}
