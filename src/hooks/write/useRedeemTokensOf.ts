import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { useGameContext } from "contexts/GameContext";
import { ethers } from "ethers";
import { useChainData } from "hooks/useChainData";
import { simulateTransaction } from "lib/tenderly";
import { toastError, toastSuccess } from "utils/toast";
import {
  useAccount,
  useContractWrite,
  useNetwork,
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
  const { chain } = useNetwork();
  const { address } = useAccount();
  const {
    chainData: { JBETHPaymentTerminal },
  } = useChainData();
  const { gameId } = useGameContext();

  const { config } = usePrepareContractWrite({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "redeemTokensOf",
    onError: (error) => {
      if (error.message.includes("insufficient funds")) {
        toastError("Insufficient funds");
      }
    },
    args: [
      address, //user _holder address
      gameId,
      "0", //_tokenCount
      ETH_TOKEN_ADDRESS,
      "0", //_minReturnedTokens
      address, //_beneficiary
      "", //_memo
      encodeRedeemMetadata(tokenIds),
    ],
  });

  const simulatePay = () => {
    simulateTransaction({
      chainId: chain?.id,
      populatedTx: config.request,
      userAddress: address,
    });
  };

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      onSuccess && onSuccess();
      toastSuccess("Transaction successful");
    },
  });

  return {
    data,
    write: simulate ? simulatePay : write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}

function encodeRedeemMetadata(tokenIds: string[]) {
  const zeroBytes32 = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);
  const IJB721Delegate_INTERFACE_ID = "0xb3bcbb79";
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes4", "uint256[]"],
    [zeroBytes32, IJB721Delegate_INTERFACE_ID, tokenIds]
  );
}

export default useRedeemTokensOf;
