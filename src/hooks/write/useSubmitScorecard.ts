import { useChainData } from "hooks/useChainData";
import { DefifaTierRedemptionWeight } from "types/interfaces";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useSubmitScorecard(_tierWeights: DefifaTierRedemptionWeight[]) {
  const { chainData } = useChainData();
  const { config } = usePrepareContractWrite({
    addressOrName: chainData.DefifaGovernor.address,
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "submitScorecard",
    args: [_tierWeights],
    chainId: chainData.chainId,
    enabled: _tierWeights && _tierWeights.length > 0,
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
