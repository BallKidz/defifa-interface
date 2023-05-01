import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { simulateTransaction } from "../../lib/tenderly";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";

export function useMintReservesFor(
  simulate = false,
  dataSourceAddress: string
) {
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();
  const outStanding = useOutstandingNumber();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: dataSourceAddress,
    contractInterface: dataSourceAddress,
    functionName: "mintReservesFor((uint256,uint256)[])",
    args: [outStanding],
    overrides: chainData?.chainId == 5 ? { gasLimit: 21000000 } : {},
    chainId: chainData.chainId,
  });

  const simulateOutStanding = () => {
    simulateTransaction({
      chainId: chainData.chainId,
      populatedTx: config.request,
      userAddress: address,
    });
  };

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
        if (simulate) {
          simulateOutStanding();
        } else {
          write?.();
        }
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: filteredOutstanding.length == 0,
  };
}
