import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../config";

export function useCastVote(proposalId: number, governor: string) {
  const network = useNetwork();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const chainData = getChainData(network?.chain?.id);

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: governor,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "attestToScorecard",
    args: [proposalId],
    chainId: chainData.chainId,
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
