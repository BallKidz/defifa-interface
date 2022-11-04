import {
  chain as chainlist,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import { Contract, ethers } from "ethers";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";
import { simulateTransaction } from "../../lib/tenderly";

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
  simulate,
}: PayParams) {
  const { chain, chains } = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const { ethPaymentTerminal, projectId } =
    chain === chainlist.mainnet
      ? {
          ethPaymentTerminal: MainnetJBETHPaymentTerminal,
          projectId: DEFIFA_PROJECT_ID_MAINNET,
        }
      : {
          ethPaymentTerminal: GoerliJBETHPaymentTerminal,
          projectId: DEFIFA_PROJECT_ID_GOERLI,
        };

  const { config } = usePrepareContractWrite({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "pay",
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
      contract: new Contract(
        ethPaymentTerminal.address,
        ethPaymentTerminal.abi
      ),
      functionName: "pay",
      args: [config.args],
      userAddress: address,
    });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return { data, write: simulate ? simulatePay : write, isLoading, isSuccess };
}

function encodePayMetadata(metadata: PayMetadata) {
  const zeroBytes32 = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);
  const zeroBytes4 = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 4);
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32", "bytes4", "bool", "bool", "bool", "uint16[]"],
    [
      zeroBytes32,
      zeroBytes32,
      zeroBytes4,
      metadata.dontMint,
      metadata.expectMintFromExtraFunds,
      metadata.dontOvespend,
      metadata.tierIdsToMint,
    ]
  );
}
