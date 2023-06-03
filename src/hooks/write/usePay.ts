import { IDefifaDelegate_INTERFACE_ID } from "constants/addresses";
import { useGameContext } from "contexts/GameContext";
import { ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import { toastSuccess } from "utils/toast";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

interface PayParams {
  amount: string;
  token: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: PayMetadata;
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
}: PayParams) {
  const { address } = useAccount();
  const {
    gameId,
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();
  const {
    chainData: { JBETHPaymentTerminal },
  } = useChainData();

  const args = [
    gameId,
    amount,
    token,
    address,
    minReturnedTokens,
    preferClaimedTokens,
    memo,
    encodePayMetadata(metadata),
  ];

  const hasTokenIds =
    metadata.tierIdsToMint && metadata.tierIdsToMint.length > 0;

  const { config } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "pay",
    overrides: { value: amount },
    args,
    enabled: hasTokenIds,
  });

  const { data, write, isError, error } = useContractWrite(config);
  if (isError) {
    console.error("usePay::usePrepareContractWrite::error", error);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toastSuccess("Mint complete");
    },
  });

  return {
    data,
    write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}

function encodePayMetadata(metadata: PayMetadata) {
  const zeroBytes32 = ethers.constants.HashZero;
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32", "bytes4", "address", "uint16[]"],
    [
      zeroBytes32,
      zeroBytes32,
      IDefifaDelegate_INTERFACE_ID,
      metadata._votingDelegate,
      metadata.tierIdsToMint,
    ]
  );
}
