import { ethers } from "ethers";
import {
  chain as chainlist,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ETH_TOKEN_ADDRESS, getChainData } from "../../constants/addresses";
import { simulateTransaction } from "../../lib/tenderly";
import { toastError } from "../../utils/toast";

export interface RedeemParams {
  tokenIds: string[];
  simulate?: boolean;
}

export function useRedeemTokensOf({
  tokenIds,
  simulate = false,
}: RedeemParams) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { ethPaymentTerminal, projectId } = getChainData(chain?.id);

  const { config } = usePrepareContractWrite({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "redeemTokensOf",
    onError: (error) => {
      if (error.message.includes("insufficient funds")) {
        toastError("Insufficient funds");
      }
    },
    overrides: { gasLimit: 2100000 },
    args: [
      address, //user address
      projectId,
      "0",
      ETH_TOKEN_ADDRESS,
      "0",
      address,
      "",
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

function encodeRedeemMetadata(tokenIds: string[]) {
  const zeroBytes32 = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);
  const IJB721Delegate_INTERFACE_ID = "0xb3bcbb79";
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes4", "uint256[]"],
    [zeroBytes32, IJB721Delegate_INTERFACE_ID, tokenIds]
  );
}

export default useRedeemTokensOf;
