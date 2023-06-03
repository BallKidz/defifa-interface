import { useChainData } from "hooks/useChainData";
import { DefifaTierRedemptionWeight } from "types/interfaces";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useSubmitScorecard(
  _tierWeights: DefifaTierRedemptionWeight[],
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const { config } = usePrepareContractWrite({
    addressOrName: governorAddress ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "submitScorecard",
    args: [_tierWeights],
    chainId: chainData.chainId,
    enabled: Boolean(
      _tierWeights && _tierWeights.length > 0 && governorAddress
    ),
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
