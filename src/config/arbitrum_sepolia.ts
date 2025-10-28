// Import ABIs from shared ABI files (same across all chains)
import DefifaDelegate from "../abis/DefifaDelegate.json";
import DefifaDeployer from "../abis/DefifaDeployer.json";
import DefifaGovernor from "../abis/DefifaGovernor.json";
import DefifaTokenUriResolver from "../abis/DefifaTokenUriResolver.json";
import { arbitrumSepolia } from "viem/chains";
import { DefifaConfig } from "./types";
import { EthereumAddress } from "types/defifa";
import { 
  jbContractAddress, 
  jbControllerAbi,
  jbProjectsAbi,
  jb721TiersHookAbi,
  jb721TiersHookStoreAbi,
  jbMultiTerminalAbi,
  jbRulesetsAbi,
  JBVersion 
} from "juice-sdk-core";

// Log to debug v5 addresses
console.log("jbContractAddress[5]:", jbContractAddress[5]);
console.log("JBMultiTerminal for arbitrum_sepolia:", (jbContractAddress[5]?.JBMultiTerminal as any)?.[arbitrumSepolia.id]);
console.log("JB721TiersHookStore for arbitrum_sepolia:", (jbContractAddress[5]?.JB721TiersHookStore as any)?.[arbitrumSepolia.id]);
console.log("Arbitrum Sepolia chain ID:", arbitrumSepolia.id);
console.log("JBMultiTerminal object:", jbContractAddress[5]?.JBMultiTerminal);

export const DEFIFA_CONFIG_ARBITRUM_SEPOLIA: DefifaConfig = {
  chainId: arbitrumSepolia.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: ((jbContractAddress[5]?.JBProjects as any)?.[arbitrumSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: ((jbContractAddress[5]?.JBController as any)?.[arbitrumSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: ((jbContractAddress[5]?.JBMultiTerminal as any)?.[arbitrumSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbMultiTerminalAbi,
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: ((jbContractAddress[5]?.JB721TiersHookStore as any)?.[arbitrumSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // JBRulesets contract for querying current ruleset/funding cycle
  JBRulesets: {
    address: ((jbContractAddress[5]?.JBRulesets as any)?.[arbitrumSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbRulesetsAbi,
  },

  // Defifa-specific contracts (v5 Arbitrum Sepolia deployments)
  // ABIs from @ballkidz/defifa-collection-deployer npm package
  // Addresses from Arbitrum Sepolia deployments
  DefifaDelegate: {
    address: "0x9f8e41fdb2447fcebfffdc97387ac72b523e9fc3" as EthereumAddress,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0xf6ae3f8bb41b55ae23412c64fdb135c0f6cb86ae" as EthereumAddress,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0xaa1c5d7bee4cc88523286774dffeab26687ec0ff" as EthereumAddress,
    interface: DefifaDeployer.abi,
  },
  DefifaTokenUriResolver: {
    address: "0x57c110647675bb935f8e0b417fe7f64475718e94" as EthereumAddress,
    interface: DefifaTokenUriResolver.abi,
  },
  subgraph:
    "https://api.studio.thegraph.com/query/107226/defifa-arbitrum-sepolia/version/latest",
};

console.info("arbitrum_sepolia chain data::", DEFIFA_CONFIG_ARBITRUM_SEPOLIA);
