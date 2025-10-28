import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function usePaymentTerminalBalanceOverflow(gameId: number) {
  const { chainData } = useChainData();
  const { JBETHPaymentTerminal, JBSingleTokenPaymentTerminalStore } = chainData;

  // get the eth terminal's store
  const { data: storeAddress, isLoading: storeLoading, error: storeError } = useReadContract({
    address: JBETHPaymentTerminal.address as `0x${string}`,
    abi: JBETHPaymentTerminal.interface as Abi,
    functionName: "store",
    args: [],
  });

  console.log("🔥 usePaymentTerminalBalanceOverflow store", {
    gameId,
    terminalAddress: JBETHPaymentTerminal.address,
    storeAddress,
    storeLoading,
    storeError
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

  console.log("🔥 usePaymentTerminalBalanceOverflow overflow", {
    gameId,
    storeAddress,
    result: res.data,
    error: res.error,
    isLoading: res.isLoading,
    args: gameId ? [JBETHPaymentTerminal.address, gameId] : undefined
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
