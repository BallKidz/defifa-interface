import { chain } from "wagmi";
import { DEFIFA_CONFIG_GOERLI } from "./goerli";
import { DEFIFA_CONFIG_MAINNET } from "./mainnet";

const mainnet = true;

export function getChainData(chainId?: number) {
  if (chainId === chain.mainnet.id) {
    return DEFIFA_CONFIG_MAINNET;
  }
  if (chainId === chain.goerli.id) {
    return DEFIFA_CONFIG_GOERLI;
  }
  return mainnet ? DEFIFA_CONFIG_MAINNET : DEFIFA_CONFIG_GOERLI;
}
