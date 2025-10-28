// Base Mainnet config - no deployments exist yet
import { base } from "viem/chains";
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

// Placeholder ABIs - will be updated when contracts are deployed
const placeholderAbi: any[] = [];

export const DEFIFA_CONFIG_BASE: DefifaConfig = {
  chainId: base.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: ((jbContractAddress[5]?.JBProjects as any)?.[base.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: ((jbContractAddress[5]?.JBController as any)?.[base.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: ((jbContractAddress[5]?.JBMultiTerminal as any)?.[base.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbMultiTerminalAbi,
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: ((jbContractAddress[5]?.JB721TiersHookStore as any)?.[base.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // JBRulesets contract for querying current ruleset/funding cycle
  JBRulesets: {
    address: ((jbContractAddress[5]?.JBRulesets as any)?.[base.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbRulesetsAbi,
  },

  // Defifa-specific contracts (v5 Base Mainnet deployments)
  // TODO: Update with actual deployed addresses when contracts are deployed
  DefifaDelegate: {
    address: "0x0000000000000000000000000000000000000000" as EthereumAddress,
    interface: placeholderAbi,
  },
  DefifaGovernor: {
    address: "0x0000000000000000000000000000000000000000" as EthereumAddress,
    interface: placeholderAbi,
  },
  DefifaDeployer: {
    address: "0x0000000000000000000000000000000000000000" as EthereumAddress,
    interface: placeholderAbi,
  },
  DefifaTokenUriResolver: {
    address: "0x0000000000000000000000000000000000000000" as EthereumAddress,
    interface: placeholderAbi,
  },
  subgraph: "", // No subgraph deployed yet for Base Mainnet
};
