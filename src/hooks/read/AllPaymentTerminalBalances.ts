import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useAllPaymentTerminalBalances(gameId: number) {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;

  // get the eth terminal's store
  const { data: storeAddress } = useContractRead({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "store",
    args: [],
  });
  console.log("storeAddress", storeAddress, JBETHPaymentTerminal);
  return useContractRead({
    addressOrName: storeAddress?.toString() ?? "",
    contractInterface: JBSingleTokenPaymentTerminalStore.interface,
    functionName: "balanceOf",
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : null,
    watch: true,
    enabled: !!storeAddress,
  });
}
