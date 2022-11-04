import { useContractRead, useNetwork } from "wagmi";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";

export function usePaymentTerminalBalance() {
  const { chain } = useNetwork();
  const { ethPaymentTerminal, projectId } =
    chain?.name === "mainnet"
      ? {
          ethPaymentTerminal: MainnetJBETHPaymentTerminal,
          projectId: DEFIFA_PROJECT_ID_MAINNET,
        }
      : {
          ethPaymentTerminal: GoerliJBETHPaymentTerminal,
          projectId: DEFIFA_PROJECT_ID_GOERLI,
        };
  return useContractRead({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "balanceOf",
    args: projectId ? [ethPaymentTerminal.address, projectId] : null,
  });
}
