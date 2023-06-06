import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { toastError, toastSuccess } from "utils/toast";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useQueueNextPhase(simulate = false) {
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { gameId } = useGameContext();
  const { chainData } = useChainData();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "queueNextPhaseOf",
    args: [gameId],
    chainId: chainData.chainId,
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toastSuccess("Next phase queued");
    },
    onError: (error) => {
      toastError("Failed to queue next phase");
      console.error(error);
    },
  });

  return {
    data,
    write: () => {
      if (!isConnected) {
        openConnectModal!();
      }
      write?.();
    },
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
