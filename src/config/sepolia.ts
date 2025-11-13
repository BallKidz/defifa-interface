 // Import ABIs from shared ABI files (same across all chains)
import DefifaDelegate from "../abis/DefifaDelegate.json";
import DefifaDeployer from "../abis/DefifaDeployer.json";
import DefifaGovernor from "../abis/DefifaGovernor.json";
import DefifaTokenUriResolver from "../abis/DefifaTokenUriResolver.json";
import { sepolia } from "viem/chains";
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
console.log("JBMultiTerminal for sepolia:", (jbContractAddress[5]?.JBMultiTerminal as any)?.[sepolia.id]);
console.log("JB721TiersHookStore for sepolia:", (jbContractAddress[5]?.JB721TiersHookStore as any)?.[sepolia.id]);
console.log("Sepolia chain ID:", sepolia.id);
console.log("JBMultiTerminal object:", jbContractAddress[5]?.JBMultiTerminal);

export const DEFIFA_CONFIG_SEPOLIA: DefifaConfig = {
  chainId: sepolia.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: ((jbContractAddress[5]?.JBProjects as any)?.[sepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: ((jbContractAddress[5]?.JBController as any)?.[sepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: ((jbContractAddress[5]?.JBMultiTerminal as any)?.[sepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbMultiTerminalAbi,
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: ((jbContractAddress[5]?.JB721TiersHookStore as any)?.[sepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // JBRulesets contract for querying current ruleset/funding cycle
  JBRulesets: {
    address: ((jbContractAddress[5]?.JBRulesets as any)?.[sepolia.id] || "0x0000000000000000000000000000000000000000") as EthereumAddress,
    interface: jbRulesetsAbi,
  },

  // Defifa-specific contracts (v5 Sepolia deployments)
  // ABIs from @ballkidz/defifa-collection-deployer npm package
  // Addresses from Sepolia deployments
  DefifaDelegate: {
    address: "0xb57d30ed3cba3ce0934336db86f22797a9fa8359" as EthereumAddress,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0xe2f954b35c29b7e3bad27aaa31a3ac443626877d" as EthereumAddress,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0x90aa7ca5cbc4cf918e3a338b964b8868c3693adc" as EthereumAddress,
    interface: DefifaDeployer.abi,
  },
  DefifaTokenUriResolver: {
    // address: "0x30db989EECf38cc83a63D28311E9571A31c1430C" as EthereumAddress,
    //address: "0xc962Bd9B1EE6F40073201fE217428AEaa8Aa65f2" as EthereumAddress, // svg
    address: "0xa624531f27b6d29f90653aecc530b257e01699e3" as EthereumAddress, // DefifaTokenUriResolver 300 400
    interface: DefifaTokenUriResolver.abi,
  },
  subgraph:
    "https://gateway.thegraph.com/api/subgraphs/id/C4SaVG3qyHp188ZaQxKirzA4S3Rc1nFhyQ38hdUtGMHC",
    // "https://api.studio.thegraph.com/query/107226/defifa-sepolia/v1.0.3",
};

console.info("sepolia chain data::", DEFIFA_CONFIG_SEPOLIA);