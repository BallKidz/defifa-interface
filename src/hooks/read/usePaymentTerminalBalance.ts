import { BigNumber } from "ethers";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function usePaymentTerminalBalance(gameId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;
  const { JBETHPaymentTerminal } = chainData;
  // v5: Use currentOverflowOf() on JBMultiTerminal
  // currentOverflowOf(projectId, accountingContexts[], decimals, currency)
  const accountingContext = {
    token: ETH_TOKEN_ADDRESS,
    decimals: 18,
    currency: 1, // ETH
  };

  // First get the accounting contexts for this project
  const { data: accountingContexts } = useReadContract({
    address: JBETHPaymentTerminal.address as `0x${string}`,
    abi: JBETHPaymentTerminal.interface as Abi,
    functionName: "accountingContextsOf",
    args: gameId ? [BigInt(gameId)] : undefined,
    chainId: targetChainId,
    query: {
      enabled: !!gameId,
    },
  });

  // Use the correct currentSurplusOf function from JBMultiTerminal
  // currentSurplusOf(uint256 projectId, JBAccountingContext[] memory accountingContexts, uint256 decimals, uint256 currency)
  const res = useReadContract({
    address: JBETHPaymentTerminal.address as `0x${string}`,
    abi: JBETHPaymentTerminal.interface as Abi,
    functionName: "currentSurplusOf",
    args: gameId && accountingContexts ? [
      BigInt(gameId),
      accountingContexts, // Use the actual accounting contexts for this project
      18n, // decimals
      1n,  // currency (ETH)
    ] : undefined,
    chainId: targetChainId,
    query: {
      enabled: !!gameId && !!accountingContexts,
    },
  });


  return {
    ...res,
    data: res.data as unknown as BigNumber | undefined,
  };
}
