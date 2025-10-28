import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useContractTest(governorAddress: string | undefined) {
  const { chainData } = useChainData();

  // Test with a simple function that should always work
  const { data: controller, isLoading: controllerLoading, error: controllerError } = useReadContract({
    address: (governorAddress ?? "") as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "controller",
    args: [53],
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress,
    },
  });

  console.log("🔥 useContractTest", {
    governorAddress,
    chainId: chainData.chainId,
    controller,
    controllerLoading,
    controllerError,
    abiLength: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.length : 'unknown'
  });

  return {
    controller,
    controllerLoading,
    controllerError
  };
}
