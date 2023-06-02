import { useChainData } from "hooks/useChainData";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useAttestToScorecard(
  proposalId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: governorAddress ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "attestToScorecard",
    args: [proposalId],
    chainId: chainData.chainId,
    enabled: Boolean(governorAddress && proposalId),
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
