import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useChainData } from "hooks/useChainData";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { simulateTransaction } from "../../lib/tenderly";

export function useQueueNextPhase(simulate = false) {
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { chainData } = useChainData();
  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "queueNextPhaseOf",
    overrides: { gasLimit: 210000 },
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
