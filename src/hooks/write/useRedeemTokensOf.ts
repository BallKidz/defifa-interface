import { IJB721Delegate_INTERFACE_ID } from "constants/addresses";
import { useGameContext } from "contexts/GameContext";
import { constants, ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import { toastError, toastSuccess } from "utils/toast";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export interface RedeemParams {
  tokenIds: string[];
  simulate?: boolean;
  onSuccess?: () => void;
}

export function useRedeemTokensOf({
  tokenIds,
  simulate = false,
  onSuccess,
}: RedeemParams) {
  const { address } = useAccount();
  const {
    chainData: { JBETHPaymentTerminal },
  } = useChainData();
  const { gameId } = useGameContext();

  const args = [
    address, //user _holder address
    gameId,
    0, //_tokenCount
    constants.AddressZero, //_tokenAddress
    0, //_minReturnedTokens
    address, //_beneficiary
    "", //_memo
    encodeRedeemMetadata(tokenIds),
  ];

  const { config } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "redeemTokensOf",
    onError: (error) => {
      console.error("redeemTokensOf::prepare error", error, args);
      if (error.message.includes("insufficient funds")) {
        toastError("Insufficient funds");
      }
    },
    args,
  });

  const { data, write, error, isError } = useContractWrite(config);
  if (isError) {
    console.log("useRedeemTokensOf error", error);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      onSuccess && onSuccess();
      toastSuccess("Transaction successful");
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

function encodeRedeemMetadata(tokenIds: string[]) {
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes4", "uint256[]"],
    [constants.HashZero, IJB721Delegate_INTERFACE_ID, tokenIds]
  );
}

export default useRedeemTokensOf;
