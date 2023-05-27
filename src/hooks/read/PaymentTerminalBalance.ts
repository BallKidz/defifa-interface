import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function usePaymentTerminalBalance() {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;
  const { gameId } = useGameContext();

  // get the eth terminal's store
  const { data: storeAddress } = useContractRead({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "store",
    args: [],
  });

  return useContractRead({
    addressOrName: storeAddress?.toString() ?? "",
    contractInterface: JBSingleTokenPaymentTerminalStore.interface,
    functionName: "balanceOf",
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : null,
    watch: true,
    enabled: !!storeAddress,
  });
}
