import { getChainData } from "config";
import { useChainId, useChains } from "wagmi";

export function useChainData() {
  const chainId = useChainId();
  const chains = useChains();
  const chain = chains.find(c => c.id === chainId);
  const chainData = getChainData(chainId);

  return { chainData, network: { chain } };
}
