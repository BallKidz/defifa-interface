import { chain } from "wagmi";
import { DEFIFA_CONFIG_GOERLI } from "./goerli";
import { DEFIFA_CONFIG_MAINNET } from "./mainnet";

export function getChainData(chainId?: number) {
  if (chainId === chain.mainnet.id) {
    return DEFIFA_CONFIG_MAINNET;
  }
  return DEFIFA_CONFIG_GOERLI;
}
