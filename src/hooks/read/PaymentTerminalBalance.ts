import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "config";

export function usePaymentTerminalBalance() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const { JBETHPaymentTerminal, projectId, JBSingleTokenPaymentTerminalStore } =
    chainData;
  return useContractRead({
    addressOrName: JBSingleTokenPaymentTerminalStore.address,
    contractInterface: JBSingleTokenPaymentTerminalStore.interface,
    functionName: "balanceOf",
    args: projectId ? [JBETHPaymentTerminal.address, projectId] : null,
    watch: true,
  });
}
