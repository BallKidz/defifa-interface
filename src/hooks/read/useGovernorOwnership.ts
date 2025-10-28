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

  console.log("🔥 useGovernorOwnership contract call details", {
    governorAddress,
    chainId: chainData.chainId,
    enabled: !!governorAddress,
    abiLength: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.length : 'unknown',
    hasOwnerFunction: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.some((item: any) => item.name === "owner") : false
  });

  console.log("🔥 useGovernorOwnership", {
    governorAddress,
    owner,
    isLoading,
    error,
    deployerAddress: "0x4502dda1f33dc5703008e9a1c86b9752c3cd6024"
  });

  return { owner, isLoading, error };
}
