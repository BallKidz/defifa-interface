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
import { ethers } from "ethers";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";

export interface PayParams {
  amount: string;
  token: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: PayMetadata;
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

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return { data, write, isLoading, isSuccess };
}

function encodePayMetadata(metadata: PayMetadata) {
  return ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32", "bytes4", "bool", "bool", "bool", "uint16[]"],
    [
      0,
      0,
      0,
      metadata.dontMint,
      metadata.expectMintFromExtraFunds,
      metadata.dontOvespend,
      metadata.tierIdsToMint,
    ]
  );
}
