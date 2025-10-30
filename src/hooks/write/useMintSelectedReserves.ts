import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useChainData } from "../useChainData";
import { useGameContext } from "contexts/GameContext";
import { Abi } from "viem";
import { useEffect } from "react";
import { toastSuccess } from "utils/toast";


export function useMintSelectedReserves(
  selectedTiers: { [tierId: string]: number },
  dataSourceAddress: string
) {
  const { isConnected, address } = useAccount();
  const { chainData } = useChainData();
  const { gameId } = useGameContext();
  const queryClient = useQueryClient();

  const { data: hash, writeContract, error, isError } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Log errors
  useEffect(() => {
    if (isError && error) {
      console.error('[useMintSelectedReserves] Error:', error);
    }
  }, [isError, error]);

  // Convert selected tiers to the format expected by the contract
  // The ABI expects JB721TiersMintReservesConfig[] with tierId (uint32) and count (uint16)
  const selectedReserves = Object.entries(selectedTiers)
    .filter(([_, count]) => count > 0)
    .map(([tierId, count]) => ({
      tierId: parseInt(tierId), // Will be converted to uint32 by viem
      count: count, // Will be converted to uint16 by viem
    }));

  // Handle success with useEffect
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate user's NFT holdings cache to show minted NFTs immediately
      queryClient.invalidateQueries({ queryKey: ["picks", address, gameId] });
      // Also invalidate game mint counts for immediate UI update
      queryClient.invalidateQueries({ queryKey: ["game-mints", gameId] });
      // Invalidate tier data cache to update mintedCount after mint
      queryClient.invalidateQueries({ queryKey: ["nft-rewards"] });
      // Invalidate outstanding reserves
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "readContracts" &&
          typeof (query.queryKey[1] as any)?.scopeKey === "string" &&
          ((query.queryKey[1] as any).scopeKey as string).startsWith(
            "outstanding-reserves"
          ),
      });
      
      toastSuccess("Reserved tokens minted successfully");
    }
  }, [isSuccess, hash, queryClient, address, gameId]);

  const write = () => {
    console.log('[useMintSelectedReserves] write called');
    console.log('[useMintSelectedReserves] isConnected:', isConnected);
    console.log('[useMintSelectedReserves] selectedReserves:', selectedReserves);
    console.log('[useMintSelectedReserves] dataSourceAddress:', dataSourceAddress);
    console.log('[useMintSelectedReserves] chainData.chainId:', chainData.chainId);
    
    if (!isConnected) {
      console.log('[useMintSelectedReserves] Not connected, returning');
      return; // Let the UI handle showing connect modal
    }
    
    if (!dataSourceAddress) {
      console.error('[useMintSelectedReserves] No dataSourceAddress provided');
      return;
    }
    
    if (selectedReserves.length === 0) {
      console.log('[useMintSelectedReserves] No selected reserves, returning');
      return;
    }

    console.log('[useMintSelectedReserves] Calling writeContract...');
    writeContract({
      address: dataSourceAddress as `0x${string}`,
      abi: chainData.DefifaDelegate.interface as Abi,
      functionName: "mintReservesFor",
      args: [selectedReserves],
      chainId: chainData.chainId,
    });
  };

  return {
    data: hash,
    write,
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: selectedReserves.length === 0 || !dataSourceAddress,
  };
}
