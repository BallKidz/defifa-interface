import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function usePaymentTerminalBalance() {
  const { chainData } = useChainData();
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
