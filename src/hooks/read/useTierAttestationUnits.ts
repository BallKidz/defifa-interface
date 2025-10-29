import { useChainData } from "hooks/useChainData";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { Abi } from "viem";

export function useTierAttestationUnits(
  gameId: number,
  nftAddress: string | undefined,
  tierId: number
) {
  const { address } = useAccount();
  const { chainData } = useChainData();
  const { data: block } = useBlockNumber({
    watch: true, // Enable watching for fresh data
    query: {
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });


  // Get user's attestation units for this tier
  const { data: userAttestationUnits, error: userAttestationError } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "getPastTierAttestationUnitsOf",
    args: block && address ? [address, tierId, block - 1n] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: !!nftAddress,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });

  // Get total attestation units for this tier
  const { data: totalAttestationUnits, error: totalAttestationError } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "getPastTierTotalAttestationUnitsOf",
    args: block ? [tierId, block - 1n] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: !!nftAddress,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });

  // Get current attestation units (not past)
  const { data: currentUserAttestationUnits } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "getTierAttestationUnitsOf",
    args: address ? [address, tierId] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: !!nftAddress,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });

  const { data: currentTotalAttestationUnits } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "getTierTotalAttestationUnitsOf",
    args: [tierId],
    chainId: chainData.chainId,
    query: {
      enabled: !!nftAddress,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });


  return {
    userAttestationUnits,
    totalAttestationUnits,
    currentUserAttestationUnits,
    currentTotalAttestationUnits,
  };
}
