import { useGameContext } from "contexts/GameContext";
import { ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useGameChainValidation } from "hooks/useChainValidation";
import { toastSuccess } from "utils/toast";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { keccak256, toBytes } from "viem";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";

interface RedeemParams {
  tokenIds: string[];
  onSuccess?: () => void;
}

export function useRedeemTokensOf({ tokenIds, onSuccess }: RedeemParams) {
  const { address } = useAccount();
  const {
    chainData: { JBETHPaymentTerminal, DefifaDelegate },
    chainData,
  } = useChainData();
  const { gameId, currentFundingCycle } = useGameContext();
  const queryClient = useQueryClient();
  
  // Validate chain for game transactions
  const chainValidation = useGameChainValidation(chainData.chainId);

  // v5 cashOutTokensOf function signature:
  // cashOutTokensOf(address holder, uint256 projectId, uint256 cashOutCount, address tokenToReclaim, uint256 minTokensReclaimed, address payable beneficiary, bytes metadata)
  const args = [
    address,                                            // holder
    BigInt(gameId),                                     // projectId
    0n,                                                 // cashOutCount (0 = burn to reclaim based on token IDs in metadata)
    ETH_TOKEN_ADDRESS,                                  // tokenToReclaim (ETH - use proper ETH token address)
    0n,                                                 // minTokensReclaimed
    address,                                            // beneficiary
    encodeRedeemMetadata(tokenIds, DefifaDelegate.address), // metadata - pass DefifaDelegate address
  ];

  const hasTokenIds = tokenIds && tokenIds.length > 0;

  const { data: hash, writeContract, isError, error } = useWriteContract();
  if (isError) {
    console.error("useRedeemTokensOf::useWriteContract::error", error);
  }

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success with useEffect
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate user's NFT holdings cache to show redeemed NFTs immediately
      queryClient.invalidateQueries({ queryKey: ["picks", address, gameId] });
      // Also invalidate game mint counts for immediate UI update
      queryClient.invalidateQueries({ queryKey: ["game-mints", gameId] });
      
      onSuccess?.();
      toastSuccess("Successfully redeemed NFTs for ETH");
    }
  }, [isSuccess, hash, onSuccess, queryClient, address, gameId]);

  const write = async () => {
    
    // Check chain validation first
    if (!chainValidation.isValid) {
      if (chainValidation.needsSwitch) {
        try {
          await chainValidation.switchChain();
          // Wait a moment for chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Failed to switch chain:', error);
          return;
        }
      } else {
        console.error('Chain validation failed:', chainValidation.error);
        return;
      }
    }
    
    if (hasTokenIds) {
      
      writeContract({
        address: JBETHPaymentTerminal.address as `0x${string}`,
        abi: JBETHPaymentTerminal.interface as any,
        functionName: "cashOutTokensOf", // v5 function name
        args: args as any,
        gas: 15000000n, // Set a reasonable gas limit below the cap
      });
    }
  };

  return {
    data: hash,
    write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}

function encodeRedeemMetadata(tokenIds: string[], defifaDelegateAddress?: string) {
  // The contract expects JBMetadataResolver format with "cashOut" purpose
  // We need to use the proper JBMetadataResolver.getId() format
  

  // Convert string tokenIds to numbers for ABI encoding
  const numericTokenIds = tokenIds.map(id => parseInt(id, 10));
  
  // First encode the token IDs array
  const tokenIdsData = ethers.utils.defaultAbiCoder.encode(
    ["uint256[]"],
    [numericTokenIds]
  );

  // Compute the metadata ID using JBMetadataResolver.getId logic:
  // bytes4(bytes20(target) ^ bytes20(keccak256("cashOut")))
  const purposeHash = keccak256(toBytes("cashOut"));
  const targetBytes = toBytes(defifaDelegateAddress as `0x${string}` || "0x0000000000000000000000000000000000000000", { size: 20 });
  
  // XOR the first 20 bytes of purposeHash with targetBytes
  const xorResult = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    xorResult[i] = parseInt(purposeHash.slice(2 + i * 2, 4 + i * 2), 16) ^ targetBytes[i];
  }
  
  // Take first 4 bytes as bytes4
  const metadataId = `0x${Array.from(xorResult.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('')}`;


  // Build JBMetadataResolver format manually (packed format, not ABI encoding):
  // 32B reserved | lookup table (id:offset pairs, padded to 32B) | data (padded to 32B each)
  
  // Reserved 32 bytes
  const reserved = ethers.utils.hexZeroPad("0x00", 32);
  
  // Lookup table: metadataId (4 bytes) + offset (1 byte)
  // Offset is 2 (32B reserved + 32B lookup table = 64B = 2 words)
  const lookupTable = ethers.utils.hexConcat([
    metadataId,
    "0x02" // offset in 32-byte words
  ]);
  // Pad lookup table to 32 bytes (RIGHT padding, not left!)
  const paddedLookupTable = lookupTable + "0".repeat(64 - (lookupTable.length - 2));
  
  // Data (tokenIdsData), already padded to 32B multiples by defaultAbiCoder
  const dataLength = tokenIdsData.length - 2; // Remove 0x prefix
  const paddedLength = Math.ceil(dataLength / 64) * 64; // Round up to nearest 32-byte word
  const paddedData = tokenIdsData + "0".repeat(paddedLength - dataLength);
  
  // Concatenate all parts
  const metadata = ethers.utils.hexConcat([reserved, paddedLookupTable, paddedData]);


  return metadata;
}
