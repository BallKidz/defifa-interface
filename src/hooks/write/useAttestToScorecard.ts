import { useChainData } from "hooks/useChainData";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useAttestToScorecard(
  gameId: number,
  scorecardId: number,
  governorAddress: string | undefined
) {
  const { chainData } = useChainData();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: governorAddress ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "attestToScorecardFrom",
    args: [gameId, scorecardId],
    chainId: chainData.chainId,
    enabled: Boolean(governorAddress && scorecardId),
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
