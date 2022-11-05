import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function usePaymentTerminalBalance() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const { ethPaymentTerminal, projectId, JBSingleTokenPaymentTerminalStore } =
    chainData;
  return useContractRead({
    addressOrName: JBSingleTokenPaymentTerminalStore.address,
    contractInterface: JBSingleTokenPaymentTerminalStore.abi,
    functionName: "balanceOf",
    args: projectId ? [ethPaymentTerminal.address, projectId] : null,
    watch: true,
  });
}
