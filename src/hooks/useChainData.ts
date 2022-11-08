import { useNetwork } from "wagmi";
import { getChainData } from "../constants/addresses";

export function useChainData() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  return { chainData, network };
}
