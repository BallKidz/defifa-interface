import { useRefundsOpen } from "components/GameDashboard/MyTeams/MyTeam/useRefundsOpen";
import { IDefifaDelegate_INTERFACE_ID } from "constants/addresses";
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
  const canRedeem = useRefundsOpen();

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
    enabled: hasTokenIds && canRedeem,
  });

  const { data, write, isError, error } = useContractWrite(config);
  if (isError) {
    console.error("useRedeemTokensOf::useContractWrite::error", error);
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
    [constants.HashZero, IDefifaDelegate_INTERFACE_ID, tokenIds]
  );
}

export default useRedeemTokensOf;
