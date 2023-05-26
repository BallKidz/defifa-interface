import { ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { simulateTransaction } from "../../lib/tenderly";
import { toastError } from "../../utils/toast";

export interface PayParams {
  amount: string;
  token: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: PayMetadata;
  simulate?: boolean;
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
  simulate = false,
}: PayParams) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const {
    chainData: { JBETHPaymentTerminal, projectId },
  } = useChainData();

  const { config } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "pay",
    overrides: { value: amount },
    onError: (error) => {
      if (error.message.includes("insufficient funds")) {
        toastError("Insufficient funds");
      }
    },
    args: [
      projectId,
      amount,
      token,
      address,
      minReturnedTokens,
      preferClaimedTokens,
      memo,
      encodePayMetadata(metadata),
    ],
  });

  const simulatePay = () =>
    simulateTransaction({
      chainId: chain?.id,
      populatedTx: config.request,
      userAddress: address,
    });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write: simulate ? simulatePay : write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}

function encodePayMetadata(metadata: PayMetadata) {
  const zeroBytes32 = ethers.constants.HashZero;
  const IJB721Delegate_INTERFACE_ID = "0xace10733";
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32", "bytes4", "address", "uint16[]"],
    [
      zeroBytes32,
      zeroBytes32,
      IJB721Delegate_INTERFACE_ID,
      metadata._votingDelegate,
      metadata.tierIdsToMint,
    ]
  );
}
