import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function usePaymentTerminalOverflow(gameId: number) {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;

  // get the eth terminal's store
  const { data: storeAddress } = useContractRead({
    addressOrName: JBETHPaymentTerminal.address,
    contractInterface: JBETHPaymentTerminal.interface,
    functionName: "store",
    args: [],
  });

  const res = useContractRead({
    addressOrName: storeAddress?.toString() ?? "",
    contractInterface: JBSingleTokenPaymentTerminalStore.interface,
    functionName: "currentOverflowOf",
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : null,
    enabled: !!storeAddress,
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
