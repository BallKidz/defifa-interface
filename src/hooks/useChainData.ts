import { useNetwork } from "wagmi";
import { getChainData } from "config";

export function useChainData() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  return { chainData, network };
}
