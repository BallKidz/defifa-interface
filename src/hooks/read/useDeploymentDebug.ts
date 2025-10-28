import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useDeploymentDebug(governorAddress: string | undefined) {
  const { chainData } = useChainData();

  // Check who the owner is
  const { data: owner, isLoading: ownerLoading, error: ownerError } = useReadContract({
    address: (governorAddress ?? "") as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "owner",
    args: [53],
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress,
    },
  });


  return {
    owner,
    ownerLoading,
    ownerError,
    isOwnerDeployer: owner === "0x4502dda1f33dc5703008e9a1c86b9752c3cd6024"
  };
}
