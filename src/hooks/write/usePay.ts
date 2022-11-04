import { chain as chainlist, useNetwork, usePrepareContractWrite } from "wagmi";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";

export function usePay() {
  const { chain, chains } = useNetwork();
  const ethPaymentTerminal =
    chain === chainlist.mainnet
      ? MainnetJBETHPaymentTerminal
      : GoerliJBETHPaymentTerminal;
  const { config } = usePrepareContractWrite({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "pay",
  });
}
