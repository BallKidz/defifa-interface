import {
  chain as chainlist,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import { DEFIFA_PROJECT_ID_GOERLI } from "../../constants/constants";

export interface PayParams {
  projectId: number;
  amount: string;
  token: string;
  beneficiary: string;
  minReturnedTokens: string;
  preferClaimedTokens: boolean;
  memo: string;
  metadata: string;
}

export function usePay({
  projectId,
  amount,
  token,
  beneficiary,
  minReturnedTokens,
  preferClaimedTokens,
  memo,
  metadata,
}: PayParams) {
  const { chain, chains } = useNetwork();
  const ethPaymentTerminal =
    chain === chainlist.mainnet
      ? MainnetJBETHPaymentTerminal
      : GoerliJBETHPaymentTerminal;

  const { config } = usePrepareContractWrite({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "pay",
    args: [
      projectId,
      amount,
      token,
      beneficiary,
      minReturnedTokens,
      preferClaimedTokens,
      memo,
      metadata,
    ],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return { data, write, isLoading, isSuccess };
}
