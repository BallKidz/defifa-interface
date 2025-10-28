import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useContractOwner(contractAddress: string | undefined) {
  const { chainData } = useChainData();

  // Use the full ABI from the deployment artifacts
  const { data: owner, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "owner",
    chainId: chainData.chainId,
    query: {
      enabled: !!contractAddress,
    },
  });

  console.log("🔥 useContractOwner", {
    contractAddress,
    owner,
    isLoading,
    error,
    chainId: chainData.chainId,
    abiLength: Array.isArray(chainData.DefifaGovernor.interface) ? chainData.DefifaGovernor.interface.length : 'unknown'
  });

  return { owner, isLoading, error };
}
