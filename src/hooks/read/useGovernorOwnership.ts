import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useGovernorOwnership(governorAddress: string | undefined) {
  const { chainData } = useChainData();

  const { data: owner, isLoading, error } = useReadContract({
    address: (governorAddress ?? "") as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "owner",
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress,
    },
  });


  return { owner, isLoading, error };
}
