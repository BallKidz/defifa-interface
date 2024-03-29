import { IDefifaDelegate_INTERFACE_ID } from "constants/constants";
import { useGameContext } from "contexts/GameContext";
import { constants, ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import { toastSuccess } from "utils/toast";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

interface RedeemParams {
  tokenIds: string[];
  onSuccess?: () => void;
}

export function useRedeemTokensOf({ tokenIds, onSuccess }: RedeemParams) {
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

  const hasTokenIds = tokenIds && tokenIds.length > 0;

  const { config } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "redeemTokensOf",
    args,
    enabled: hasTokenIds,
  });

  const { data, write, isError, error } = useContractWrite(config);
  if (isError) {
    console.error("useRedeemTokensOf::useContractWrite::error", error);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      onSuccess?.();
      toastSuccess("Successfully redeemed NFTs for ETH");
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
    [constants.HashZero, IDefifaDelegate_INTERFACE_ID, tokenIds]
  );
}
