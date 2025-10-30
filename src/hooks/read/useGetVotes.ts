import { useChainData } from "hooks/useChainData";
import { useAccount, useBlockNumber, useReadContract, useBlock } from "wagmi";
import { Abi } from "viem";

export function useAccountVotes(gameId: number, governor: string | undefined) {
  const { address } = useAccount();
  const { chainData } = useChainData();
  const { data: blockNumber } = useBlockNumber({
    watch: true, // Enable watching for fresh data
    query: {
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });

  // Get the actual block to access its timestamp
  const { data: block } = useBlock({
    blockNumber: blockNumber,
    query: {
      enabled: !!blockNumber,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
    },
  });

  // Extract timestamp from the block (this is the actual unix timestamp)
  const timestamp = block?.timestamp;

  const result = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "getAttestationWeight",
    args: timestamp ? [gameId, address, timestamp] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: !!governor && !!timestamp && !!address,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
      keepPreviousData: true,
    },
  });

  // Also check if the game is initialized
  const { data: attestationStartTime, error: attestationError, isLoading: attestationLoading } = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "attestationStartTimeOf",
    args: [gameId],
    chainId: chainData.chainId,
    query: {
      enabled: !!governor,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
      keepPreviousData: true,
    },
  });

  // Check the owner of the governor contract
  const { data: governorOwner, error: ownerError, isLoading: ownerLoading } = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "owner",
    args: [],
    chainId: chainData.chainId,
    query: {
      enabled: !!governor,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
      keepPreviousData: true,
    },
  });

  // Check if the game is already initialized by looking at attestationGracePeriodOf
  const { data: attestationGracePeriod } = useReadContract({
    address: governor as `0x${string}`,
    abi: chainData.DefifaGovernor.interface as Abi,
    functionName: "attestationGracePeriodOf",
    args: [gameId],
    chainId: chainData.chainId,
    query: {
      enabled: !!governor,
      refetchInterval: 30 * 1000, // 30 seconds to reduce RPC load
      staleTime: 0, // Always consider data stale
      keepPreviousData: true,
    },
  });


  return result;
}
