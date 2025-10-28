import DefifaDelegate from "../../../defifa-collection-deployer-v5/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "../../../defifa-collection-deployer-v5/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "../../../defifa-collection-deployer-v5/out/DefifaGovernor.sol/DefifaGovernor.json";
import DefifaTokenUriResolver from "../../../defifa-collection-deployer-v5/out/DefifaTokenUriResolver.sol/DefifaTokenUriResolver.json";
import { mainnet } from "viem/chains";
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

/**
 * !!! WARNING this file is completely out of date for NBA defifa edition !!!
 */
export const DEFIFA_CONFIG_MAINNET: DefifaConfig = {
  chainId: mainnet.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: (jbContractAddress[5].JBProjects as any)[mainnet.id] as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: (jbContractAddress[5].JBController as any)[mainnet.id] as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: (jbContractAddress[5].JBMultiTerminal as any)[mainnet.id] as EthereumAddress,
    interface: jbMultiTerminalAbi,
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: (jbContractAddress[5].JB721TiersHookStore as any)[mainnet.id] as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // JBRulesets contract for querying current ruleset/funding cycle
  JBRulesets: {
    address: (jbContractAddress[5].JBRulesets as any)[mainnet.id] as EthereumAddress,
    interface: jbRulesetsAbi,
  },

  // Defifa-specific contracts (hardcoded mainnet addresses)
  DefifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    interface: DefifaGovernor.abi,
    address: "0x00", // TODO
  },
  DefifaDeployer: {
    address: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
    interface: DefifaDeployer.abi,
  },
  DefifaTokenUriResolver: {
    address: "0x00", // TODO
    interface: DefifaTokenUriResolver.abi,
  },

  subgraph: "", // No subgraph deployed yet for mainnet
};
