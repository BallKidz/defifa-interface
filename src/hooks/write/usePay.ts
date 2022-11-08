import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import {
  chain as chainlist,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../constants/addresses";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";
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
  dontMint: boolean;
  expectMintFromExtraFunds: boolean;
  dontOvespend: boolean;
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
  const { ethPaymentTerminal, projectId } = getChainData(chain?.id);

  const { config } = usePrepareContractWrite({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
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
  const zeroBytes32 = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);
  const IJB721Delegate_INTERFACE_ID = "0xb3bcbb79";
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32", "bytes4", "bool", "bool", "bool", "uint16[]"],
    [
      zeroBytes32,
      zeroBytes32,
      IJB721Delegate_INTERFACE_ID,
      metadata.dontMint,
      metadata.expectMintFromExtraFunds,
      metadata.dontOvespend,
      metadata.tierIdsToMint,
    ]
  );
}
