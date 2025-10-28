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
import { keccak256, concat, toBytes, Abi } from "viem";

interface PayParams {
  amount: string;
  token: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: PayMetadata;
  onSuccess?: () => void;
}

interface PayMetadata {
  _votingDelegate: string;
  tierIdsToMint: number[];
}

export function usePay({
  amount,
  token,
  minReturnedTokens,
  preferClaimedTokens,
  memo,
  metadata,
  onSuccess,
}: PayParams) {
  const { address } = useAccount();
  const { gameId, currentFundingCycle } = useGameContext();
  const {
    chainData: { JBETHPaymentTerminal, DefifaDelegate },
    chainData,
  } = useChainData();
  
  // Validate chain for game transactions
  const chainValidation = useGameChainValidation(chainData.chainId);
  
  const delegateAddress = currentFundingCycle?.metadata.dataSource;

  // v5 pay function signature:
  // pay(uint256 projectId, address token, uint256 amount, address beneficiary, uint256 minReturnedTokens, string memo, bytes metadata)
  const args = [
    BigInt(gameId),          // projectId
    token,                   // token address (ETH_TOKEN_ADDRESS for native token)
    BigInt(amount),          // amount
    address,                 // beneficiary
    BigInt(minReturnedTokens), // minReturnedTokens
    memo,                    // memo
    encodePayMetadata(metadata, delegateAddress, DefifaDelegate.address), // metadata
  ];

  const hasTokenIds =
    metadata.tierIdsToMint && metadata.tierIdsToMint.length > 0;

  const { data: hash, writeContract, isError, error } = useWriteContract();
  if (isError) {
    console.error("usePay::useWriteContract::error", error);
  }

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle success with useEffect
  useEffect(() => {
    if (isSuccess && hash) {
      // No manual cache invalidation needed - 5-second polling handles updates
      toastSuccess("Mint complete");
      onSuccess?.();
    }
  }, [isSuccess, hash, onSuccess]);

  const write = async () => {
    console.log("🔥 usePay write called", {
      hasTokenIds,
      metadata,
      tierIdsToMint: metadata.tierIdsToMint,
      args,
      amount,
      token
    });
    
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
        abi: JBETHPaymentTerminal.interface as Abi,
        functionName: "pay",
        value: BigInt(amount),
        args: args as any,
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

function encodePayMetadata(metadata: PayMetadata, delegateAddress?: string, codeOrigin?: string) {
  // v5 uses JBMetadataResolver packed format, NOT ABI-encoded arrays
  // First encode the tier mint data: (address attestationDelegate, uint16[] tierIds)
  // Ensure tierIdsToMint are properly sorted and converted to uint16
  const sortedTierIds = [...metadata.tierIdsToMint].sort((a, b) => a - b);
  
  console.log("🔥 encodePayMetadata debug", {
    originalTierIds: metadata.tierIdsToMint,
    sortedTierIds,
    votingDelegate: metadata._votingDelegate
  });
  
  const tierMintData = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint16[]"],
    [metadata._votingDelegate, sortedTierIds]
  );

  // Compute the metadata ID using JBMetadataResolver.getId logic:
  // bytes4(bytes20(target) ^ bytes20(keccak256("pay")))
  const purposeHash = keccak256(toBytes("pay"));
  const targetBytes = toBytes(codeOrigin as `0x${string}` || "0x0000000000000000000000000000000000000000", { size: 20 });
  
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
  // hexZeroPad pads LEFT, so manually pad RIGHT instead
  const paddedLookupTable = lookupTable + "0".repeat(64 - (lookupTable.length - 2));
  
  // Data (tierMintData), already padded to 32B multiples by defaultAbiCoder
  // But ensure it's padded
  const dataLength = tierMintData.length - 2; // Remove 0x prefix
  const paddedLength = Math.ceil(dataLength / 64) * 64; // Round up to nearest 32-byte word
  const paddedData = tierMintData + "0".repeat(paddedLength - dataLength);
  
  // Concatenate all parts
  return ethers.utils.hexConcat([reserved, paddedLookupTable, paddedData]);
}
