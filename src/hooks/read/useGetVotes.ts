import { useChainData } from "hooks/useChainData";
import { useAccount, useBlockNumber, useReadContract, useBlock } from "wagmi";
import { Abi } from "viem";

export function useAccountVotes(gameId: number, governor: string | undefined) {
  const { address } = useAccount();
  const { chainData } = useChainData();
  const { data: blockNumber } = useBlockNumber({
    watch: true, // Enable watching for fresh data
    query: {
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0, // Always consider data stale
    },
  });

  // Get the actual block to access its timestamp
  const { data: block } = useBlock({
    blockNumber: blockNumber,
    query: {
      enabled: !!blockNumber,
      refetchInterval: 5 * 1000, // 5 seconds
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
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0, // Always consider data stale
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
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0, // Always consider data stale
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
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0, // Always consider data stale
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
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0, // Always consider data stale
    },
  });

  // Essential debug info only
  console.log("🔍 Voting Debug:", {
    gameId,
    governor: governor ? governor.slice(0, 8) + "..." : "undefined",
    timestamp: timestamp ? Number(timestamp) : null,
    blockNumber: blockNumber ? Number(blockNumber) : null,
    attestationStartTime: attestationStartTime ? Number(attestationStartTime) : null,
    votingPower: result.data ? Number(result.data) : 0,
    error: result.error?.message || null
  });

  return result;
}
