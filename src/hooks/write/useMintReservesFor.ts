import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../constants/addresses";
import { simulateTransaction } from "../../lib/tenderly";
import { useChainData } from "../useChainData";

export function useMintReservesFor(simulate = false) {
  const network = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.defifaDelegate.address,
    contractInterface: chainData.defifaDelegate.interface,
    functionName: "mintReservesFor",
    args: [chainData.projectId],
    chainId: chainData.chainId,
    onError: (error) => {
      console.error(error);
    },
  });

  const simulateQueueNextPhase = () => {
    simulateTransaction({
      chainId: chainData.chainId,
      populatedTx: config.request,
      userAddress: address,
    });
  };

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write: () => {
      if (!isConnected) {
        openConnectModal!();
      }
      if (simulate) {
        simulateQueueNextPhase();
      } else {
        write?.();
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
