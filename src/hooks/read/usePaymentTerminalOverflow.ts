import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function usePaymentTerminalOverflow(gameId: number) {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;

  // get the eth terminal's store
  const { data: storeAddress } = useReadContract({
    address: JBETHPaymentTerminal.address as `0x${string}`,
    abi: JBETHPaymentTerminal.interface as Abi,
    functionName: "store",
    args: [],
  });

  const res = useReadContract({
    address: (storeAddress?.toString() ?? "") as `0x${string}`,
    abi: JBSingleTokenPaymentTerminalStore.interface as Abi,
    functionName: "currentOverflowOf",
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : undefined,
    query: {
      enabled: !!storeAddress,
    },
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
