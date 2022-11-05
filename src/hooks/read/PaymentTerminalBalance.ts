import { useContractRead, useNetwork } from "wagmi";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";
import MainnetJBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json";
import GoerliJJBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";

export function usePaymentTerminalBalance() {
  const { chain } = useNetwork();
  const { JBSingleTokenPaymentTerminalStore, projectId } =
    chain?.name === "mainnet"
      ? {
          JBSingleTokenPaymentTerminalStore:
            MainnetJBSingleTokenPaymentTerminalStore,
          projectId: DEFIFA_PROJECT_ID_MAINNET,
        }
      : {
          JBSingleTokenPaymentTerminalStore:
            GoerliJJBSingleTokenPaymentTerminalStore,
          projectId: DEFIFA_PROJECT_ID_GOERLI,
        };
  const ethPaymentTerminal =
    chain?.name === "mainnet"
      ? MainnetJBETHPaymentTerminal
      : GoerliJBETHPaymentTerminal;

  return useContractRead({
    addressOrName: JBSingleTokenPaymentTerminalStore.address,
    contractInterface: JBSingleTokenPaymentTerminalStore.abi,
    functionName: "balanceOf",
    args: projectId ? [ethPaymentTerminal.address, projectId] : null,
  });
}
