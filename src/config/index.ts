import { mainnet, sepolia, arbitrumSepolia, baseSepolia, optimismSepolia, arbitrum, base, optimism } from "wagmi/chains";
import { DEFIFA_CONFIG_SEPOLIA } from "./sepolia";
import { DEFIFA_CONFIG_MAINNET } from "./mainnet";
import { DEFIFA_CONFIG_ARBITRUM_SEPOLIA } from "./arbitrum_sepolia";
import { DEFIFA_CONFIG_BASE_SEPOLIA } from "./base_sepolia";
import { DEFIFA_CONFIG_OPTIMISM_SEPOLIA } from "./optimism_sepolia";
import { DEFIFA_CONFIG_ARBITRUM } from "./arbitrum";
import { DEFIFA_CONFIG_BASE } from "./base";
import { DEFIFA_CONFIG_OPTIMISM } from "./optimism";

export function getChainData(chainId?: number) {
  if (chainId === mainnet.id) {
    return DEFIFA_CONFIG_MAINNET; 
  }
  if (chainId === sepolia.id) {
    return DEFIFA_CONFIG_SEPOLIA;
  }
  if (chainId === arbitrumSepolia.id) {
    return DEFIFA_CONFIG_ARBITRUM_SEPOLIA;
  }
  if (chainId === baseSepolia.id) {
    return DEFIFA_CONFIG_BASE_SEPOLIA;
  }
  if (chainId === optimismSepolia.id) {
    return DEFIFA_CONFIG_OPTIMISM_SEPOLIA;
  }
  if (chainId === arbitrum.id) {
    return DEFIFA_CONFIG_ARBITRUM;
  }
  if (chainId === base.id) {
    return DEFIFA_CONFIG_BASE;
  }
  if (chainId === optimism.id) {
    return DEFIFA_CONFIG_OPTIMISM;
  }
  // Default to Sepolia if chain not found
  return DEFIFA_CONFIG_SEPOLIA;
}