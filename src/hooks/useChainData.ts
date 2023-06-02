import { getChainData } from "config";
import { useNetwork } from "wagmi";

export function useChainData() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  return { chainData, network };
}
