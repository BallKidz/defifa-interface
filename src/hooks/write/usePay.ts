import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { IDefifaDelegate_INTERFACE_ID } from "constants/addresses";
import { useGameContext } from "contexts/GameContext";
import { ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export interface PayParams {
  amount: string;
  token: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: PayMetadata;
}

export interface PayMetadata {
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

  const { config, isError, error } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "pay",
    overrides: { value: amount },
    args: [
      gameId,
      amount,
      token,
      address,
      minReturnedTokens,
      preferClaimedTokens,
      memo,
      encodePayMetadata(metadata),
    ],
    enabled: !currentPhaseLoading && currentPhase === DefifaGamePhase.MINT,
  });
  if (isError && error) {
    console.error("usePay::usePrepareContractWrite::error", error);
  }

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

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
