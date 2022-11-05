import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function usePaymentTerminalBalance() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const { ethPaymentTerminal, projectId } = chainData;
  return useContractRead({
    addressOrName: ethPaymentTerminal.address,
    contractInterface: ethPaymentTerminal.abi,
    functionName: "balanceOf",
    args: projectId ? [ethPaymentTerminal.address, projectId] : null,
  });
}
