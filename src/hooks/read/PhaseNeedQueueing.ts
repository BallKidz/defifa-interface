import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useNextPhaseNeedsQueueing() {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "nextPhaseNeedsQueueing",
    args: chainData.projectId,
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}
