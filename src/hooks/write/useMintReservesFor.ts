import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";

export function useMintReservesFor(
  simulate = false,
  dataSourceAddress: string
) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();
  const outStanding = useOutstandingNumber();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: dataSourceAddress,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "mintReservesFor((uint256,uint256)[])",
    args: [outStanding],
    chainId: chainData.chainId,
  });

  const filteredOutstanding = outStanding.filter((item) => {
    return item.count > 0;
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write: () => {
      if (!isConnected) {
        openConnectModal!();
      } else {
        write?.();
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: filteredOutstanding.length == 0,
  };
}
