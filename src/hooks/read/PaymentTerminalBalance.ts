import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function usePaymentTerminalBalance() {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;
  const { gameId } = useGameContext();

  return useContractRead({
    addressOrName: JBSingleTokenPaymentTerminalStore.address,
    contractInterface: JBSingleTokenPaymentTerminalStore.interface,
    functionName: "balanceOf",
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : null,
    watch: true,
  });
}
