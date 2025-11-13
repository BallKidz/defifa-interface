// Import ABIs from shared ABI files (same across all chains)
import DefifaDelegate from "../abis/DefifaDelegate.json";
import DefifaDeployer from "../abis/DefifaDeployer.json";
import DefifaGovernor from "../abis/DefifaGovernor.json";
import DefifaTokenUriResolver from "../abis/DefifaTokenUriResolver.json";
import { optimismSepolia } from "viem/chains";
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

export const DEFIFA_CONFIG_OPTIMISM_SEPOLIA: DefifaConfig = {
  chainId: optimismSepolia.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: ((jbContractAddress[5]?.JBProjects as any)?.[optimismSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: ((jbContractAddress[5]?.JBController as any)?.[optimismSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: ((jbContractAddress[5]?.JBMultiTerminal as any)?.[optimismSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbMultiTerminalAbi,
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: ((jbContractAddress[5]?.JB721TiersHookStore as any)?.[optimismSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // JBRulesets contract for querying current ruleset/funding cycle
  JBRulesets: {
    address: ((jbContractAddress[5]?.JBRulesets as any)?.[optimismSepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbRulesetsAbi,
  },

  // Defifa-specific contracts (v5 Optimism Sepolia deployments)
  // ABIs from @ballkidz/defifa-collection-deployer npm package
  // Addresses from Optimism Sepolia deployments
  DefifaDelegate: {
    address: "0xb57d30ed3cba3ce0934336db86f22797a9fa8359" as EthereumAddress,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0xe2f954b35c29b7e3bad27aaa31a3ac443626877d" as EthereumAddress,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0xb2105b457e2fb020679b0f02e328de4b9aea7414" as EthereumAddress,
    interface: DefifaDeployer.abi,
  },
  DefifaTokenUriResolver: {
    address: "0xd0997d962519082a342742e3191a1b9745d5f37a" as EthereumAddress,
    interface: DefifaTokenUriResolver.abi,
  },
  subgraph: "https://gateway.thegraph.com/api/subgraphs/id/UJ2bB9YFcR8JgpjSBRAhPFXCr5b4XvixwS9PnX9cWF9",
};