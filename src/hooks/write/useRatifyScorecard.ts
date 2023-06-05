import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useChainData } from "hooks/useChainData";
import { DefifaTierRedemptionWeight } from "types/interfaces";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useRatifyScorecard(
  _tierWeights: DefifaTierRedemptionWeight[],
  governor: string | undefined
) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "ratifyScorecard",
    args: [_tierWeights],
    chainId: chainData.chainId,
    enabled: !!governor,
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  const handleWrite = () => {
    if (!isConnected) {
      openConnectModal!();
    } else {
      write?.();
    }
  };

  return {
    data,
    write: handleWrite,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
